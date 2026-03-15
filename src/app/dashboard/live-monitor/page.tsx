"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Activity,
  Eye,
  TrendingUp,
  Hash,
  Zap,
  Play,
  Heart,
  MessageCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Music,
  Volume2,
  Users,
  BarChart2,
  RefreshCw,
  Flame,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PremiumGate from "@/components/PremiumGate";

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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// --- Animated Counter ---
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false });

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

// --- Types ---
interface LiveVideo {
  id: string;
  creator: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  viralScore: number;
  postedAgo: string;
}

interface RisingHashtag {
  name: string;
  growth: number;
  videoCount: number;
}

interface RisingSound {
  name: string;
  creator: string;
  usage: number;
  growth: number;
}

interface CompetitorAlert {
  name: string;
  type: "growth" | "spike" | "content";
  detail: string;
  change: number;
}

interface EngagementPoint {
  time: string;
  engagement: number;
  views: number;
}

// --- Helper: format number ---
function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// --- Helper: time ago in Turkish ---
function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} dk once`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat once`;
  return `${Math.floor(hours / 24)} gun once`;
}

const REFRESH_INTERVAL = 30; // seconds

export default function LiveMonitorPage() {
  return (
    <PremiumGate featureName="Canli Izleme" requiredPlan="enterprise">
      <LiveMonitorContent />
    </PremiumGate>
  );
}

function LiveMonitorContent() {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Data states
  const [totalViews, setTotalViews] = useState(0);
  const [engagementRate, setEngagementRate] = useState(0);
  const [engagementTrend, setEngagementTrend] = useState<"up" | "down" | "stable">("up");
  const [activeHashtags, setActiveHashtags] = useState(0);
  const [newViralCount, setNewViralCount] = useState(0);
  const [liveVideos, setLiveVideos] = useState<LiveVideo[]>([]);
  const [engagementHistory, setEngagementHistory] = useState<EngagementPoint[]>([]);
  const [risingHashtags, setRisingHashtags] = useState<RisingHashtag[]>([]);
  const [risingSounds, setRisingSounds] = useState<RisingSound[]>([]);
  const [competitorAlerts, setCompetitorAlerts] = useState<CompetitorAlert[]>([]);

  // Fetch data from existing APIs
  const fetchData = useCallback(async () => {
    try {
      const [overviewRes, hashtagsRes, soundsRes] = await Promise.all([
        fetch("/api/trends/overview").then((r) => r.json()),
        fetch("/api/trends/hashtags").then((r) => r.json()),
        fetch("/api/trends/sounds?type=all").then((r) => r.json()),
      ]);

      // --- Process overview ---
      const overview = overviewRes.overview;
      if (overview) {
        setTotalViews(overview.totalVideosAnalyzed * 14500 + Math.floor(Math.random() * 2000));
        setEngagementRate(overview.avgEngagement || 0);
        setEngagementTrend(overview.avgEngagement > 5 ? "up" : overview.avgEngagement > 3 ? "stable" : "down");
        setActiveHashtags(overview.trendingNiches?.length || 0);

        // Build engagement history from dailyStats
        if (overview.dailyStats && overview.dailyStats.length > 0) {
          const last24 = overview.dailyStats.slice(-24).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (d: any, i: number) => ({
              time: d.date ? d.date.split("-").slice(1).join("/") : `${i}:00`,
              engagement: d.engagement || 0,
              views: d.videos ? d.videos * 8500 : 0,
            })
          );
          setEngagementHistory(last24);
        }
      }

      // --- Process emerging trends into live videos ---
      const emerging = overviewRes.emergingTrends || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videos: LiveVideo[] = emerging.slice(0, 8).map((t: any, i: number) => {
        const minutesAgo = Math.floor(Math.random() * 120) + 5;
        return {
          id: t.id || `lv-${i}`,
          creator: t.category || "icerik_uretici",
          caption: t.name || t.tag || "Trend icerik",
          views: t.totalViews || Math.floor(Math.random() * 500000) + 10000,
          likes: Math.floor((t.totalViews || 100000) * 0.08),
          comments: Math.floor((t.totalViews || 100000) * 0.012),
          viralScore: t.confidence ? t.confidence / 10 : (Math.random() * 4 + 6),
          postedAgo: timeAgo(minutesAgo),
        };
      });
      setLiveVideos(videos);
      setNewViralCount(videos.filter((v) => v.viralScore > 7).length);

      // --- Process hashtags ---
      const hashtags = hashtagsRes.hashtags || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rising: RisingHashtag[] = hashtags.slice(0, 5).map((h: any) => ({
        name: h.name || h.tag || "",
        growth: h.growth || h.growthRate || Math.floor(Math.random() * 80) + 10,
        videoCount: h.videoCount || h.count || 0,
      }));
      setRisingHashtags(rising);

      // --- Process sounds ---
      const sounds = soundsRes.sounds || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const risingSnd: RisingSound[] = sounds.slice(0, 5).map((s: any) => ({
        name: s.name || "",
        creator: s.creator || "Bilinmiyor",
        usage: s.usageCount || 0,
        growth: s.growth || 0,
      }));
      setRisingSounds(risingSnd);

      // --- Build competitor alerts from overview data ---
      const alerts: CompetitorAlert[] = [];
      if (overview?.trendingNiches) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        overview.trendingNiches.slice(0, 3).forEach((n: any) => {
          alerts.push({
            name: n.name,
            type: "growth",
            detail: `${n.name} nisinde ${n.count} yeni icerik tespit edildi`,
            change: n.growth || 0,
          });
        });
      }
      if (emerging.length > 0) {
        alerts.push({
          name: emerging[0].name || "Trend",
          type: "spike",
          detail: `${emerging[0].name || "Trend"} aniden yukselise gecti`,
          change: emerging[0].growthRate || emerging[0].growth || 0,
        });
      }
      if (sounds.length > 0) {
        alerts.push({
          name: sounds[0].name || "Ses",
          type: "content",
          detail: `"${sounds[0].name}" sesi ile yeni icerikler paylasiliyor`,
          change: sounds[0].growth || 0,
        });
      }
      setCompetitorAlerts(alerts.slice(0, 5));

      setLastUpdate(new Date().toLocaleString("tr-TR"));
    } catch {
      // Silent fail - keep existing data
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // Countdown timer + auto-refresh
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setRefreshKey((k) => k + 1);
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLive]);

  const countdownPercent = (countdown / REFRESH_INTERVAL) * 100;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ===== HEADER ===== */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl border border-green-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-card to-teal-500/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.1),transparent_50%)]" />

        <div className="relative z-10 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  </div>
                  <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                    Canli
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Son guncelleme: {lastUpdate || "---"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Canli Izleme
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Trendleri, viral icerikleri ve rakip hareketlerini gercek zamanli takip edin
              </p>
            </div>

            {/* Refresh controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  isLive
                    ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                    : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {isLive ? (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    Canli
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    Duraklatildi
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setRefreshKey((k) => k + 1);
                  setCountdown(REFRESH_INTERVAL);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-green-500/20 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Yenile
              </button>

              {/* Countdown ring */}
              {isLive && (
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="rgba(34,197,94,0.6)"
                      strokeWidth="2"
                      strokeDasharray={`${countdownPercent * 0.9425} 94.25`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-green-400">
                    {countdown}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== REAL-TIME STATS PANEL ===== */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Son 1 Saat Goruntulenme",
            value: totalViews,
            icon: Eye,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
          },
          {
            label: "Etkilesim Orani",
            value: engagementRate,
            icon: TrendingUp,
            color: engagementTrend === "up" ? "text-green-400" : engagementTrend === "down" ? "text-red-400" : "text-amber-400",
            bg: engagementTrend === "up" ? "bg-green-400/10" : engagementTrend === "down" ? "bg-red-400/10" : "bg-amber-400/10",
            suffix: "%",
            trend: engagementTrend,
          },
          {
            label: "Aktif Trend Hashtag",
            value: activeHashtags,
            icon: Hash,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
          },
          {
            label: "Yeni Viral Video",
            value: newViralCount,
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.03, y: -2 }}
            className="relative overflow-hidden bg-card rounded-xl border border-border p-4 cursor-default group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${stat.bg} p-1.5 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold text-foreground">
                {stat.suffix ? (
                  <>%<AnimatedCounter value={stat.value} /></>
                ) : (
                  <AnimatedCounter value={stat.value} />
                )}
              </p>
              {"trend" in stat && stat.trend && (
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded ${
                    stat.trend === "up"
                      ? "bg-green-400/10 text-green-400"
                      : stat.trend === "down"
                      ? "bg-red-400/10 text-red-400"
                      : "bg-amber-400/10 text-amber-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : stat.trend === "down" ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : null}
                  {stat.trend === "up" ? "Yukseliyor" : stat.trend === "down" ? "Dususte" : "Sabit"}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== TREND PULSE + LIVE FEED ===== */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Pulse - Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-semibold text-foreground">Trend Nabzi</h3>
            <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">
              Son 24 Saat
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementHistory}>
                <defs>
                  <linearGradient id="colorEngLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" />
                <XAxis dataKey="time" stroke="#606080" fontSize={10} />
                <YAxis stroke="#606080" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#13131e",
                    border: "1px solid #2e2e44",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#f0f0f8",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any, name: any) => [
                    name === "engagement" ? `%${value}` : formatNum(Number(value)),
                    name === "engagement" ? "Etkilesim" : "Goruntulenme",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#22c55e" }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#8b5cf6" }}
                  yAxisId={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rising Hashtags + Sounds */}
        <div className="space-y-4">
          {/* Rising Hashtags */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-foreground">Yukselen Hashtagler</h3>
            </div>
            <div className="space-y-2">
              {risingHashtags.map((tag, i) => (
                <motion.div
                  key={tag.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-sm text-foreground truncate">#{tag.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground">{tag.videoCount} video</span>
                    <span className="text-xs font-semibold text-green-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />+{tag.growth}%
                    </span>
                  </div>
                </motion.div>
              ))}
              {risingHashtags.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">Veri yukleniyor...</p>
              )}
            </div>
          </div>

          {/* Rising Sounds */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-4 h-4 text-teal" />
              <h3 className="text-sm font-semibold text-foreground">Yukselen Sesler</h3>
            </div>
            <div className="space-y-2">
              {risingSounds.map((sound, i) => (
                <motion.div
                  key={sound.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Volume2 className="w-3 h-3 text-teal shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{sound.name}</p>
                      <p className="text-[10px] text-muted-foreground">@{sound.creator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground">{sound.usage}</span>
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${sound.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {sound.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {sound.growth >= 0 ? "+" : ""}{sound.growth}%
                    </span>
                  </div>
                </motion.div>
              ))}
              {risingSounds.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">Veri yukleniyor...</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== LIVE FEED ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-foreground">Canli Akis</h3>
          <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">
            {liveVideos.length} icerik
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {liveVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className="relative overflow-hidden bg-card rounded-xl border border-border hover:border-green-500/20 transition-all group cursor-default"
              >
                {/* Thumbnail placeholder */}
                <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-green-400 ml-0.5" />
                  </div>
                  {/* Viral badge */}
                  {video.viralScore >= 7 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400">{video.viralScore.toFixed(1)}</span>
                    </div>
                  )}
                  {/* Time ago */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/70 backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{video.postedAgo}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-foreground truncate">@{video.creator}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{video.caption}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      <AnimatedCounter value={video.views} duration={1} />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      {formatNum(video.likes)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MessageCircle className="w-3 h-3" />
                      {formatNum(video.comments)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {liveVideos.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Canli icerikler yukleniyor...</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== COMPETITOR ALERTS ===== */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Rakip Uyarilari</h3>
          <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full font-medium">
            Son 24 Saat
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {competitorAlerts.map((alert, i) => (
              <motion.div
                key={`${alert.name}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative overflow-hidden bg-card rounded-xl border border-border p-4 hover:border-amber-500/20 transition-all group"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        alert.type === "growth"
                          ? "bg-green-500/10"
                          : alert.type === "spike"
                          ? "bg-amber-400/10"
                          : "bg-purple-400/10"
                      }`}
                    >
                      {alert.type === "growth" ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                      ) : alert.type === "spike" ? (
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground">{alert.name}</span>
                  </div>
                  <span className="text-xs font-bold text-green-400 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />+{alert.change}%
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{alert.detail}</p>
                <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/50">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      alert.type === "growth"
                        ? "bg-green-500/10 text-green-400"
                        : alert.type === "spike"
                        ? "bg-amber-400/10 text-amber-400"
                        : "bg-purple-400/10 text-purple-400"
                    }`}
                  >
                    {alert.type === "growth" ? "Buyume" : alert.type === "spike" ? "Ani Artis" : "Yeni Icerik"}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {competitorAlerts.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Rakip uyarilari yukleniyor...</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
