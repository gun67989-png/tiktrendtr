"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Video,
  TrendingUp,
  Percent,
  Clock,
  MapPin,
  Play,
  ArrowRight,
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
import {
  generateOverview,
  generateEmergingTrends,
} from "@/lib/data";
import VideoCard, { type VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import OnboardingTour from "@/components/OnboardingTour";
import { overviewTourSteps } from "@/lib/onboarding";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Fallback overview so the page renders while API loads
const fallbackOverview = generateOverview();
const fallbackTrends = generateEmergingTrends();

export default function DashboardPage() {
  const [overview, setOverview] = useState(fallbackOverview);
  const [emergingTrends, setEmergingTrends] = useState(fallbackTrends);
  const [dataSource, setDataSource] = useState<"loading" | "live" | "generated">("loading");
  const router = useRouter();
  const [topVideos, setTopVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    setLastUpdate(new Date().toLocaleString("tr-TR"));
  }, []);

  // Fetch overview from API (uses live data if available)
  useEffect(() => {
    fetch("/api/trends/overview")
      .then((r) => r.json())
      .then((data) => {
        if (data.overview) setOverview(data.overview);
        if (data.emergingTrends) setEmergingTrends(data.emergingTrends);
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
    {
      label: "Analiz Edilen Video",
      value: overview.totalVideosAnalyzed.toLocaleString("tr-TR"),
      icon: Video,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Aktif Trend",
      value: overview.activeTrends.toString(),
      icon: TrendingUp,
      color: "text-teal",
      bg: "bg-teal/10",
    },
    {
      label: "Ortalama Etkileşim",
      value: `%${overview.avgEngagement}`,
      icon: Percent,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "En İyi Paylaşım Saati",
      value: overview.bestPostingTime,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
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

      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Genel Bakış</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Türkiye TikTok trend analizi
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card rounded-lg px-3 py-2">
          <div className={`w-2 h-2 rounded-full ${dataSource === "live" ? "bg-teal" : "bg-amber-400"} animate-pulse`} />
          {dataSource === "live" ? "Canli veri" : "Son guncelleme"}: {lastUpdate || "—"}
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="bg-card rounded-xl border border-border p-3 sm:p-5 hover:border-border/80 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-foreground mt-1 sm:mt-2 truncate">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bg} p-2 sm:p-2.5 rounded-lg shrink-0`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily Stats Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-3 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Son 30 Gün - Video & Etkileşim
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.dailyStats}>
                <defs>
                  <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B5C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF3B5C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" />
                <XAxis
                  dataKey="date"
                  stroke="#606080"
                  fontSize={10}
                  tickFormatter={(v) => v.split("-").slice(1).join("/")}
                />
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
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="videos"
                  stroke="#FF3B5C"
                  strokeWidth={2}
                  fill="url(#colorVideos)"
                  name="Videolar"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#2dd4bf"
                  strokeWidth={2}
                  fill="url(#colorEngagement)"
                  name="Etkileşim %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Niches */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Trend Nişler
          </h3>
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
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: nicheColors[i % nicheColors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cities & Formats Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Trending Cities */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Trend Şehirler
            </h3>
          </div>
          <div className="space-y-3">
            {overview.trendingCities.map((city, i) => (
              <div key={city.name} className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-muted-foreground w-5 sm:w-6 text-right shrink-0">{i + 1}</span>
                <span className="text-xs sm:text-sm text-foreground w-16 sm:w-24 shrink-0 truncate">{city.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-0">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${city.percentage}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  %{city.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Viral Formats */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-semibold text-foreground">
              Viral Formatlar
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overview.viralFormats.map((format, i) => (
              <motion.div
                key={format.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="bg-muted rounded-lg p-3 border border-border/50 hover:border-teal/30 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{format.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
                <p className="text-xs text-teal mt-2">
                  {format.count.toLocaleString("tr-TR")} video
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Viral Videos */}
      {topVideos.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Top Viral Videolar
              </h3>
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

      {/* Emerging Trends */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔥</span>
          <h3 className="text-sm font-semibold text-foreground">
            Yükselen Trendler
          </h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Gerçek Zamanlı
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergingTrends.map((trend, i) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-card rounded-xl border border-border p-4 hover:border-border/80 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md capitalize">
                  {trend.type}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                  🔥 +{trend.growthRate}%
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-2">{trend.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{trend.signal}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">{trend.category}</span>
                <div className="flex items-center gap-1">
                  <div
                    className="h-1.5 rounded-full bg-muted overflow-hidden"
                    style={{ width: "60px" }}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${trend.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">%{trend.confidence}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Video Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </motion.div>
  );
}
