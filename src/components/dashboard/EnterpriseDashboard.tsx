"use client";

import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Video,
  TrendingUp,
  Percent,
  Users,
  Target,
  BarChart2,
  FileText,
  Zap,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  Crown,
  Swords,
  Brain,
  Activity,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Award,
  Gauge,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  // PieChart,
  // Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  generateOverview,
  generateEmergingTrends,
} from "@/lib/data";
import VideoCard, { type VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import OnboardingTour from "@/components/OnboardingTour";
import { overviewTourSteps } from "@/lib/onboarding";

// --- Animation Variants ---
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const glowPulse = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
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

// --- Floating Orbs Background ---
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 10 + Math.random() * 20,
            height: 10 + Math.random() * 20,
            background: `radial-gradient(circle, ${
              ["rgba(245,158,11,0.15)", "rgba(139,92,246,0.12)", "rgba(45,212,191,0.1)"][i % 3]
            }, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// --- Mock data for enterprise ---
const campaignData = [
  { name: "Ocak", performans: 78, hedef: 85 },
  { name: "Şubat", performans: 82, hedef: 85 },
  { name: "Mart", performans: 91, hedef: 90 },
  { name: "Nisan", performans: 88, hedef: 90 },
  { name: "Mayıs", performans: 95, hedef: 92 },
  { name: "Haziran", performans: 102, hedef: 95 },
];

const competitors = [
  { name: "Rakip A", followers: "245K", engagement: 4.2, growth: +12, color: "#FF3B5C", avatar: "A" },
  { name: "Rakip B", followers: "180K", engagement: 3.8, growth: +8, color: "#2dd4bf", avatar: "B" },
  { name: "Rakip C", followers: "310K", engagement: 5.1, growth: +15, color: "#8b5cf6", avatar: "C" },
];

const strategies = [
  {
    title: "Duet Formatını Kullan",
    desc: "Rakipleriniz duet formatında %40 daha fazla etkileşim alıyor",
    icon: Swords,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    gradient: "from-primary/5 to-transparent",
  },
  {
    title: "Akşam 20:00 Paylaş",
    desc: "Hedef kitleniz bu saatte en aktif. Etkileşim %25 artabilir",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    gradient: "from-purple-400/5 to-transparent",
  },
  {
    title: "Hook İlk 3 Saniye",
    desc: "Viral videolarda ilk 3 saniyede soru sorma tekniği öne çıkıyor",
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    gradient: "from-amber-400/5 to-transparent",
  },
];

const quickLinks = [
  { href: "/dashboard/competitor", label: "Rakip Analizi", icon: Target, color: "text-primary", bg: "bg-primary/10", desc: "Rakipleri karşılaştır" },
  { href: "/dashboard/sentiment", label: "Yorum Analizi", icon: MessageCircle, color: "text-purple-400", bg: "bg-purple-400/10", desc: "Yorum tonlaması" },
  { href: "/dashboard/ideas", label: "İçerik Fikirleri", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", desc: "AI destekli fikirler" },
  { href: "/dashboard/predictions", label: "Trend Tahminleri", icon: TrendingUp, color: "text-teal", bg: "bg-teal/10", desc: "Erken uyarı sistemi" },
  { href: "/dashboard/hooks", label: "Hook Analizi", icon: Play, color: "text-blue-400", bg: "bg-blue-400/10", desc: "Hook performansı" },
  { href: "/dashboard/daily-report", label: "Detaylı Rapor", icon: FileText, color: "text-rose-400", bg: "bg-rose-400/10", desc: "PDF dışa aktar" },
];

const brandMetrics = [
  { label: "Görüntülenme", value: "2.4M", change: "+18%", icon: Eye, color: "text-blue-400" },
  { label: "Beğeni", value: "156K", change: "+24%", icon: Heart, color: "text-rose-400" },
  { label: "Yorum", value: "23K", change: "+12%", icon: MessageCircle, color: "text-purple-400" },
  { label: "Paylaşım", value: "8.7K", change: "+31%", icon: Share2, color: "text-teal" },
];

interface Props {
  user: {
    userId: string;
    username: string;
    email: string;
    role: "admin" | "user";
    subscriptionType: "free" | "lite" | "standard" | "enterprise";
    subscriptionNiche: string | null;
    subscriptionRole: "brand" | "individual" | null;
  };
}

const fallbackOverview = generateOverview();
const fallbackTrends = generateEmergingTrends();

export default function EnterpriseDashboard({ user }: Props) {
  const [overview, setOverview] = useState(fallbackOverview);
  const [emergingTrends, setEmergingTrends] = useState(fallbackTrends);
  const [dataSource, setDataSource] = useState<"loading" | "live" | "generated">("loading");
  const [topVideos, setTopVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const router = useRouter();

  const isEnterprise = user.subscriptionType === "enterprise";
  const planLabel = isEnterprise
    ? "Kurumsal Plan"
    : `${user.subscriptionType === "standard" ? "Standart" : user.subscriptionType === "lite" ? "Lite" : "Free"} · Marka`;

  // Brand Health Score
  const brandHealthScore = 78;
  const brandHealthData = [{ name: "score", value: brandHealthScore, fill: "#f59e0b" }];

  useEffect(() => {
    setLastUpdate(new Date().toLocaleString("tr-TR"));
  }, []);

  useEffect(() => {
    fetch("/api/trends/overview")
      .then((r) => r.json())
      .then((data) => {
        if (data.overview) setOverview(data.overview);
        if (data.emergingTrends) {
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
      .catch(() => setDataSource("generated"));
  }, []);

  useEffect(() => {
    fetch("/api/trends/videos?limit=5&sortBy=viralScore&order=desc")
      .then((r) => r.json())
      .then((data) => setTopVideos(data.videos || []))
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Analiz Edilen Video", value: overview.totalVideosAnalyzed, icon: Video, color: "text-amber-400", bg: "bg-amber-400/10", gradient: "from-amber-500/10 to-amber-500/0" },
    { label: "Rakip Takip", value: 3, icon: Users, color: "text-teal", bg: "bg-teal/10", gradient: "from-teal/10 to-teal/0" },
    { label: "Marka Etkileşim", value: overview.avgEngagement, icon: Percent, color: "text-purple-400", bg: "bg-purple-400/10", suffix: "%", gradient: "from-purple-400/10 to-purple-400/0" },
    { label: "ROI Skoru", value: 87, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", gradient: "from-primary/10 to-primary/0" },
  ];

  const nicheColors = ["#FF3B5C", "#2dd4bf", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <OnboardingTour tourKey="dashboard-overview" steps={overviewTourSteps} tourTitle="Genel Bakis" />

      {/* ===== PREMIUM HERO SECTION ===== */}
      <motion.div
        variants={glowPulse}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20"
      >
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-card to-purple-500/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.08),transparent_50%)]" />

        {/* Animated mesh gradient */}
        <FloatingOrbs />

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-4 right-4 w-20 h-20 border border-amber-500/10 rounded-full" />
          <div className="absolute top-8 right-8 w-12 h-12 border border-amber-500/15 rounded-full" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{planLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20">
                  <Activity className="w-3 h-3 text-teal" />
                  <span className="text-[10px] font-medium text-teal">Aktif</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight"
              >
                Hoş geldin, <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">{user.username}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-sm mt-2 max-w-md"
              >
                {user.subscriptionNiche && <span className="text-amber-400/80">{user.subscriptionNiche}</span>}
                {user.subscriptionNiche && " · "}Marka kontrol paneliniz hazır
              </motion.p>

              {/* Quick action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {[
                  { label: "Rakip Analizi", href: "/dashboard/competitor", icon: Target },
                  { label: "Rapor", href: "/dashboard/daily-report", icon: FileText },
                  { label: "Strateji", href: "/dashboard/growth", icon: TrendingUp },
                ].map((btn) => (
                  <button
                    key={btn.href}
                    onClick={() => router.push(btn.href)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/20 hover:border-amber-500/30 transition-all hover:scale-105 backdrop-blur-sm"
                  >
                    <btn.icon className="w-3.5 h-3.5" />
                    {btn.label}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Brand Health Score - Radial Gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="75%"
                    outerRadius="100%"
                    barSize={10}
                    data={brandHealthData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={5}
                      background={{ fill: "rgba(245,158,11,0.1)" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-4">
                  <Gauge className="w-4 h-4 text-amber-400/60 mb-1" />
                  <span className="text-3xl font-bold text-foreground">
                    <AnimatedCounter value={brandHealthScore} duration={1.5} />
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Marka Skoru</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Data source + last update */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30"
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${dataSource === "live" ? "bg-teal" : "bg-amber-400"} animate-pulse`} />
              {dataSource === "live" ? "Canlı veri" : "Son güncelleme"}: {lastUpdate || "—"}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ===== BRAND ENGAGEMENT METRICS ===== */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {brandMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="relative overflow-hidden bg-card rounded-xl border border-border p-4 cursor-default group"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
              <span className="text-xs font-medium text-teal bg-teal/10 px-1.5 py-0.5 rounded">{metric.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== STAT CARDS ===== */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={scaleIn}
            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(245,158,11,0.08)" }}
            className="relative overflow-hidden bg-card rounded-xl border border-border p-3 sm:p-5 transition-all cursor-default group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-foreground mt-1 sm:mt-2 truncate">
                  {stat.suffix ? (
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

      {/* ===== MARKA PERFORMANS GRAFİĞİ + TREND NİŞLER ===== */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-3 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            Marka Performansı - Son 30 Gün
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.dailyStats}>
                <defs>
                  <linearGradient id="colorVideosE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEngagementE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
                <Area yAxisId="left" type="monotone" dataKey="videos" stroke="#f59e0b" strokeWidth={2} fill="url(#colorVideosE)" name="Videolar" />
                <Area yAxisId="right" type="monotone" dataKey="engagement" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorEngagementE)" name="Etkileşim %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Nişler */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Trend Nişler
          </h3>
          <div className="space-y-3">
            {overview.trendingNiches.map((niche, i) => (
              <motion.div
                key={niche.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="space-y-1.5"
              >
                <div className="flex justify-between text-xs">
                  <span className="text-foreground font-medium">{niche.name}</span>
                  <span className="text-teal font-semibold">+{niche.growth}%</span>
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== RAKİP KARŞILAŞTIRMA ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Swords className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Rakip Savaş Odası</h3>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">CANLI</span>
          <button
            onClick={() => router.push("/dashboard/competitor")}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Detaylı Analiz <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {competitors.map((comp, i) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.12 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="relative overflow-hidden bg-card rounded-xl border border-border p-4 transition-all cursor-default group"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: comp.color }} />

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg"
                  style={{ backgroundColor: comp.color }}
                >
                  {comp.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{comp.name}</p>
                  <p className="text-xs text-muted-foreground">{comp.followers} takipçi</p>
                </div>
                <div className={`ml-auto text-xs font-semibold px-2 py-1 rounded-lg ${comp.growth > 10 ? "bg-teal/10 text-teal" : "bg-blue-400/10 text-blue-400"}`}>
                  +{comp.growth}%
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Etkileşim</p>
                  <p className="text-sm font-bold text-foreground">%{comp.engagement}</p>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${comp.engagement * 18}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: comp.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== KAMPANYA PERFORMANSI ===== */}
      <motion.div variants={item} className="bg-card rounded-xl border border-border p-3 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            Kampanya Performansı
          </h3>
          <span className="text-xs text-teal font-medium bg-teal/10 px-2 py-0.5 rounded-full">Hedef Aşıldı</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" />
              <XAxis dataKey="name" stroke="#606080" fontSize={11} />
              <YAxis stroke="#606080" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#13131e",
                  border: "1px solid #2e2e44",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#f0f0f8",
                }}
              />
              <Bar dataKey="performans" name="Performans" radius={[6, 6, 0, 0]}>
                {campaignData.map((_, i) => (
                  <Cell key={i} fill={i === campaignData.length - 1 ? "#f59e0b" : "#f59e0b50"} />
                ))}
              </Bar>
              <Bar dataKey="hedef" name="Hedef" fill="#8b5cf620" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ===== AI STRATEJİ ÖNERİLERİ ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-foreground">AI Strateji Önerileri</h3>
          <span className="text-[10px] bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded-full font-medium">AI Destekli</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {strategies.map((strat, i) => (
            <motion.div
              key={strat.title}
              initial={{ opacity: 0, rotateY: 15, x: 30 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`relative overflow-hidden bg-card rounded-xl border ${strat.border} p-5 transition-all cursor-default group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${strat.gradient} opacity-50`} />
              <div className="relative z-10">
                <div className={`${strat.bg} w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <strat.icon className={`w-5 h-5 ${strat.color}`} />
                </div>
                <p className="text-sm font-semibold text-foreground">{strat.title}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{strat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== TOP VİRAL VİDEOLAR ===== */}
      {topVideos.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Top Viral Videolar</h3>
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

      {/* ===== HIZLI ERİŞİM KARTLARI ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Hızlı Erişim</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link, i) => (
            <motion.button
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.06 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(link.href)}
              className="relative overflow-hidden bg-card rounded-xl border border-border p-3 sm:p-4 text-left hover:border-amber-500/30 transition-all group"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`${link.bg} w-9 h-9 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <link.icon className={`w-4 h-4 ${link.color}`} />
              </div>
              <p className="text-xs font-semibold text-foreground">{link.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{link.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ===== YÜKSELEN TRENDLER ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Yükselen Trendler</h3>
          <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">Gerçek Zamanlı</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergingTrends.map((trend, i) => (
            <motion.div
              key={`${trend.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden bg-card rounded-xl border border-border p-4 hover:border-amber-500/20 transition-all group"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md capitalize font-medium">{trend.type}</span>
                <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-1 rounded-md font-semibold">+{trend.growthRate}%</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-2">{trend.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{trend.signal}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">{trend.category}</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden" style={{ width: "60px" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.confidence}%` }}
                      transition={{ delay: 1.2 + i * 0.08, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">%{trend.confidence}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </motion.div>
  );
}
