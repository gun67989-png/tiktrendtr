"use client";

import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Video,
  TrendingUp,
  Percent,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  Flame,
  Target,
  Calendar,
  BookOpen,
  Zap,
  // Heart,
  // Star,
  Rocket,
  Eye,
  Hash,
  Volume2,
  Music,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrendOverview } from "@/lib/data";
import VideoCard, { type VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import OnboardingTour from "@/components/OnboardingTour";
import { overviewTourSteps } from "@/lib/onboarding";

// --- Animation Variants ---
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const pulseHover = {
  scale: 1.04,
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};

// --- Animated Counter ---
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = Math.max(1, Math.floor(end / 60));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, (duration * 1000) / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString("tr-TR")}</span>;
}

// --- Floating Particles ---
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          initial={{
            x: Math.random() * 300,
            y: Math.random() * 150,
            opacity: 0,
          }}
          animate={{
            y: [Math.random() * 150, Math.random() * 50, Math.random() * 150],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface Props {
  user: {
    userId: string;
    username: string;
    email: string;
    role: "admin" | "user";
    subscriptionType: "free" | "lite" | "standard" | "enterprise";
    subscriptionNiche: string | null;
    subscriptionRole: "brand" | "individual" | null;
  } | null;
}

const emptyOverview: TrendOverview = {
  totalVideosAnalyzed: 0,
  activeTrends: 0,
  avgEngagement: 0,
  bestPostingTime: "—",
  trendingNiches: [],
  trendingCities: [],
  viralFormats: [],
  dailyStats: [],
};

export default function IndividualDashboard({ user }: Props) {
  const [overview, setOverview] = useState(emptyOverview);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [emergingTrends, setEmergingTrends] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<"loading" | "live" | "no_data">("loading");
  const [topVideos, setTopVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [contentPlan, setContentPlan] = useState<{
    dailyTasks: Array<{ time: string; format: string; hashtags: string[]; hook: string; viewTarget: number; likeTarget: number; type: string }>;
    weeklyInsights: { bestDays: string[]; topFormats: string[]; trendingSounds: string[]; avgViewTarget: number; avgLikeTarget: number };
    tacticSuggestions: string[];
    nicheStats: { avgViews: number; avgEngagement: number; totalVideos: number };
  } | null>(null);
  const [trendingSounds, setTrendingSounds] = useState<Array<{ id: string; name: string; creator: string; usageCount: number; totalViews: number; growth: number; viralScore: number; soundType: string; genre: string }>>([]);
  const router = useRouter();

  useEffect(() => {
    setLastUpdate(new Date().toLocaleString("tr-TR"));
  }, []);

  useEffect(() => {
    fetch("/api/trends/overview")
      .then((r) => r.json())
      .then((data) => {
        if (data.overview) setOverview(data.overview);
        if (data.emergingTrends) {
          // Normalize API format (tag/growth) to component format (name/growthRate)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalized = data.emergingTrends.map((t: any, i: number) => ({
            id: t.id || `et-${i}`,
            type: t.type || "hashtag",
            name: t.name || t.tag || "",
            signal: t.signal || `${t.videoCount || 0} video · ${((t.totalViews || 0) / 1000000).toFixed(1)}M görüntülenme`,
            growthRate: t.growthRate ?? t.growth ?? 0,
            confidence: t.confidence ?? 80,
            category: t.category || "Genel",
          }));
          setEmergingTrends(normalized);
        }
        setDataSource(data.source || "generated");
      })
      .catch(() => setDataSource("no_data"));
  }, []);

  useEffect(() => {
    fetch("/api/trends/videos?limit=5&sortBy=viralScore&order=desc")
      .then((r) => r.json())
      .then((data) => setTopVideos(data.videos || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const niche = user?.subscriptionNiche || "";
    fetch(`/api/trends/content-plan${niche ? `?niche=${encodeURIComponent(niche)}` : ""}`)
      .then((r) => r.json())
      .then((data) => { if (data.plan) setContentPlan(data.plan); })
      .catch(() => {});
  }, [user?.subscriptionNiche]);

  useEffect(() => {
    fetch("/api/trends/sounds?type=all")
      .then((r) => r.json())
      .then((data) => {
        if (data.sounds && data.sounds.length > 0) {
          setTrendingSounds(data.sounds.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  const isPremium = user?.subscriptionType && user.subscriptionType !== "free";

  const stats = [
    { label: "Analiz Edilen Video", value: overview.totalVideosAnalyzed, icon: Video, color: "text-primary", bg: "bg-primary/10" },
    { label: "Aktif Trend", value: overview.activeTrends, icon: TrendingUp, color: "text-teal", bg: "bg-teal/10" },
    { label: "Ortalama Etkileşim", value: overview.avgEngagement, icon: Percent, color: "text-purple-400", bg: "bg-purple-400/10", suffix: "%" },
    { label: "En İyi Paylaşım Saati", value: 0, displayValue: overview.bestPostingTime, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const viralOpportunities = overview.viralFormats.length > 0
    ? overview.viralFormats.slice(0, 4).map((f, i) => ({
        format: f.name,
        potential: Math.max(60, 95 - i * 8),
        trend: `+${Math.round(overview.trendingNiches[i]?.growth || 20)}%`,
        desc: f.description,
      }))
    : [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dailySuggestions = overview.bestPostingTime !== "—"
    ? [
        { time: "09:00", content: "Trend ses ile POV videosu paylaş", type: "Video", icon: Play, color: "text-primary" },
        { time: "13:00", content: "Nişine uygun hashtag araştırması yap", type: "Araştırma", icon: Eye, color: "text-purple-400" },
        { time: overview.bestPostingTime.split(" - ")[0] || "18:00", content: "Hook kütüphanesinden ilham al", type: "İçerik", icon: BookOpen, color: "text-teal" },
        { time: overview.bestPostingTime.split(" - ")[1] || "20:00", content: "En yüksek etkileşim saati - ana videoyu paylaş", type: "Paylaşım", icon: Rocket, color: "text-amber-400" },
      ]
    : [];

  const nicheColors = ["#FF3B5C", "#2dd4bf", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

  // Real data stats
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const growthTarget = { current: overview.totalVideosAnalyzed, goal: Math.max(overview.totalVideosAnalyzed * 2, 1000), label: "Analiz Edilen Video" };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const growthPercent = growthTarget.goal > 0 ? Math.round((growthTarget.current / growthTarget.goal) * 100) : 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <OnboardingTour tourKey="dashboard-overview" steps={overviewTourSteps} tourTitle="Genel Bakis" />

      {/* ===== HERO SECTION ===== */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-teal/5 p-6 sm:p-8"
      >
        <FloatingParticles />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {user?.subscriptionType === "standard" ? "Standart Plan" : user?.subscriptionType === "lite" ? "Lite Plan" : "Free Plan"}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              Merhaba, <span className="text-primary">{user?.username || "Kullanıcı"}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm mt-1"
            >
              {user?.subscriptionNiche && `${user.subscriptionNiche} · `}Bugün trendleri keşfetmeye hazır mısın?
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2"
          >
            {[
              { label: "Trend Videolar", href: "/dashboard/trending-videos", icon: Play },
              { label: "İçerik Fikirleri", href: "/dashboard/ideas", icon: Zap },
              { label: "Hook Kütüphanesi", href: "/dashboard/hook-library", icon: BookOpen },
            ].map((btn) => (
              <button
                key={btn.href}
                onClick={() => router.push(btn.href)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-all hover:scale-105"
              >
                <btn.icon className="w-3.5 h-3.5" />
                {btn.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Data source */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground mt-4"
        >
          <div className={`w-2 h-2 rounded-full ${dataSource === "live" ? "bg-teal" : "bg-amber-400"} animate-pulse`} />
          {dataSource === "live" ? "Canlı veri" : "Son güncelleme"}: {lastUpdate || "—"}
        </motion.div>
      </motion.div>

      {/* ===== STAT CARDS ===== */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={pulseHover}
            className="bg-card rounded-xl border border-border p-3 sm:p-5 transition-all cursor-default group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-foreground mt-1 sm:mt-2 truncate">
                  {stat.displayValue ? (
                    stat.displayValue
                  ) : stat.suffix ? (
                    <>%<AnimatedCounter value={stat.value} /></>
                  ) : (
                    <AnimatedCounter value={stat.value} />
                  )}
                </p>
              </div>
              <div className={`${stat.bg} p-2 sm:p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== BUGÜNÜN İÇERİK PLANI + HAFTALIK HEDEFLER ===== */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bugünün İçerik Planı */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-semibold text-foreground">Bug&#252;n&#252;n &#304;&#231;erik Plan&#305;</h3>
          </div>
          {contentPlan && contentPlan.dailyTasks.length > 0 ? (
            <div className="space-y-3">
              {contentPlan.dailyTasks.map((task, i) => (
                <motion.div
                  key={`task-${task.time}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-semibold text-foreground">{task.time}</span>
                    {i < contentPlan.dailyTasks.length - 1 && (
                      <div className="w-px h-8 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 bg-muted/50 rounded-lg p-2.5 border border-border/50 group-hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      {task.type === "video" && <Play className="w-3.5 h-3.5 text-primary" />}
                      {task.type === "research" && <Eye className="w-3.5 h-3.5 text-purple-400" />}
                      {task.type === "engage" && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">{task.format}</span>
                      {task.viewTarget > 0 && (
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {task.viewTarget.toLocaleString("tr-TR")} g&#246;r&#252;nt&#252;lenme hedefi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground mb-1.5">{task.hook}</p>
                    {task.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.hashtags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">
                            <Hash className="w-2.5 h-2.5" />
                            {tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              Veri y&#252;kleniyor...
            </div>
          )}
        </div>

        {/* Haftalık Hedefler */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Haftal&#305;k Hedefler</h3>
          </div>
          {contentPlan ? (
            <div className="space-y-4">
              {/* Best days */}
              {contentPlan.weeklyInsights.bestDays.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">En &#304;yi G&#252;nler</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contentPlan.weeklyInsights.bestDays.map((day) => (
                      <span key={day} className="text-xs bg-teal/10 text-teal px-2 py-1 rounded-md font-medium">{day}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Top formats */}
              {contentPlan.weeklyInsights.topFormats.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">&#214;nerilen Formatlar</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contentPlan.weeklyInsights.topFormats.map((fmt) => (
                      <span key={fmt} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">{fmt}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* View/Like targets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase">Haftal&#305;k G&#246;r&#252;nt&#252;lenme</p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {contentPlan.weeklyInsights.avgViewTarget.toLocaleString("tr-TR")}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase">Haftal&#305;k Be&#287;eni</p>
                  <p className="text-lg font-bold text-foreground mt-1">
                    {contentPlan.weeklyInsights.avgLikeTarget.toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>

              {/* Trending sounds */}
              {contentPlan.weeklyInsights.trendingSounds.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Trend Sesler</p>
                  <div className="space-y-1">
                    {contentPlan.weeklyInsights.trendingSounds.map((sound) => (
                      <div key={sound} className="flex items-center gap-2 text-xs text-foreground">
                        <Play className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{sound}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tactic suggestions */}
              {contentPlan.tacticSuggestions.length > 0 && (
                <div className="border-t border-border/50 pt-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Taktik &#214;nerileri</p>
                  <div className="space-y-1.5">
                    {contentPlan.tacticSuggestions.slice(0, 2).map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              Veri y&#252;kleniyor...
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== VİRAL FIRSATLAR ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Viral Fırsatlar</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Bu Hafta</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {viralOpportunities.map((opp, i) => (
            <motion.div
              key={opp.format}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.04, y: -3 }}
              className="bg-card rounded-xl border border-border p-4 cursor-default group relative overflow-hidden"
            >
              {/* Pulse glow on hover */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{opp.format}</span>
                  <span className="text-xs text-teal font-medium">{opp.trend}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{opp.desc}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${opp.potential}%` }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-teal"
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground">%{opp.potential}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== PERFORMANS GRAFİĞİ + TREND NİŞLER ===== */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-3 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Etkileşim Trendi - Son 30 Gün
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.dailyStats}>
                <defs>
                  <linearGradient id="colorVideosI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B5C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF3B5C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEngagementI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" />
                <XAxis dataKey="date" stroke="#606080" fontSize={10} tickFormatter={(v) => v.split("-").slice(1).join("/")} />
                <YAxis stroke="#606080" fontSize={10} yAxisId="left" />
                <YAxis stroke="#606080" fontSize={10} yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#13131e",
                    border: "1px solid #2e2e44",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#f0f0f8",
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="videos" stroke="#FF3B5C" strokeWidth={2} fill="url(#colorVideosI)" name="Videolar" />
                <Area yAxisId="right" type="monotone" dataKey="engagement" stroke="#2dd4bf" strokeWidth={2} fill="url(#colorEngagementI)" name="Etkileşim %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Nişler */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Trend Nişler</h3>
          <div className="space-y-3">
            {overview.trendingNiches.map((niche, i) => (
              <div key={niche.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{niche.name}</span>
                  <span className="text-teal">+{niche.growth}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(niche.count / overview.trendingNiches[0].count) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: nicheColors[i % nicheColors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== TOP VİRAL VİDEOLAR ===== */}
      {topVideos.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">İlham Videoları</h3>
            </div>
            <button
              onClick={() => router.push("/dashboard/trending-videos")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Tümünü Gör <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {topVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} onSelect={setSelectedVideo} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== TREND SESLER & MÜZİKLER ===== */}
      {trendingSounds.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-teal" />
              <h3 className="text-sm font-semibold text-foreground">Trend Sesler & Müzikler</h3>
              <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Canlı</span>
            </div>
            <button
              onClick={() => router.push("/dashboard/sounds")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-teal transition-colors"
            >
              Tümünü Gör <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trendingSounds.map((sound, i) => (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(`/dashboard/sounds/${encodeURIComponent(sound.name)}`)}
                className="bg-card rounded-xl border border-border p-4 hover:border-teal/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${sound.soundType === "music" ? "bg-purple-500/10" : "bg-teal/10"}`}>
                      {sound.soundType === "music" ? <Music className="w-3.5 h-3.5 text-purple-400" /> : <Volume2 className="w-3.5 h-3.5 text-teal" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{sound.name}</p>
                      <p className="text-[10px] text-muted-foreground">@{sound.creator}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-teal/10 text-teal px-2 py-1 rounded-md ml-2 shrink-0">
                    {sound.viralScore.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{sound.usageCount} kullanım</span>
                    <span>{sound.totalViews > 1000000 ? `${(sound.totalViews / 1000000).toFixed(1)}M` : `${Math.round(sound.totalViews / 1000)}K`} izlenme</span>
                  </div>
                  <span className={`text-[10px] font-medium ${sound.growth >= 0 ? "text-teal" : "text-primary"}`}>
                    {sound.growth >= 0 ? "+" : ""}{sound.growth}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== YÜKSELEN TRENDLER ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔥</span>
          <h3 className="text-sm font-semibold text-foreground">Yükselen Trendler</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Gerçek Zamanlı</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergingTrends.map((trend, i) => (
            <motion.div
              key={`${trend.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-4 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md capitalize">{trend.type}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">🔥 +{trend.growthRate}%</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-2">{trend.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{trend.signal}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">{trend.category}</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden" style={{ width: "60px" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.confidence}%` }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">%{trend.confidence}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== PLAN YÜKSELTME (sadece free/lite için) ===== */}
      {(!isPremium || user?.subscriptionType === "lite") && (
        <motion.div
          variants={item}
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-teal/5 p-6 cursor-pointer group"
          onClick={() => router.push("/pricing")}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Planını Yükselt</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.subscriptionType === "free"
                  ? "Lite plana geçerek sınırsız video analizi ve içerik üretici takibi kazan"
                  : "Standart plana geçerek AI destekli içerik fikirleri ve duygu analizi kullan"}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </motion.div>
      )}

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </motion.div>
  );
}
