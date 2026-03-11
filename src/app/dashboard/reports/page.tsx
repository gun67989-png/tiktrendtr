"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  FiBarChart2,
  FiEye,
  FiTrendingUp,
  FiHash,
  FiMusic,
  FiPlay,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

const PIE_COLORS = ["#ff3b5c", "#00d4aa", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6", "#34d399", "#fb923c"];

interface DailyReport {
  date: string;
  error?: string;
  stats: {
    totalVideos: number;
    recentVideos: number;
    totalViews: number;
    avgViews: number;
    avgEngagement: number;
    topCategory: string;
  };
  topVideos: Array<{
    id: string;
    creator: string;
    description: string;
    thumbnailUrl: string;
    tiktokUrl: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    format: string;
    category: string;
  }>;
  trendingHashtags: Array<{
    tag: string;
    count: number;
    oldCount: number;
    growth: number;
  }>;
  trendingSounds: Array<{
    name: string;
    creator: string;
    videoCount: number;
    totalViews: number;
  }>;
  emergingFormats: Array<{
    format: string;
    count: number;
    oldCount: number;
    growth: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

function ReportsContent() {
  const [data, setData] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trends/daily-report")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error || d.stats) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border p-4 h-24 shimmer" />
          ))}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <FiBarChart2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary">Rapor verisi bulunamadi</p>
      </div>
    );
  }

  const reportDate = new Date(data.date).toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Gunluk Trend Raporu</h1>
          <p className="text-sm text-text-secondary mt-1 flex items-center gap-1">
            <FiCalendar className="w-3.5 h-3.5" /> {reportDate}
          </p>
        </div>
        <div className="bg-surface-light px-3 py-1.5 rounded-lg">
          <span className="text-xs text-text-secondary">{data.stats.totalVideos} video analiz edildi</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Goruntulenme", value: formatNumber(data.stats.totalViews), icon: FiEye, color: "text-blue-400" },
          { label: "Ort. Goruntulenme", value: formatNumber(data.stats.avgViews), icon: FiTrendingUp, color: "text-teal" },
          { label: "Ort. Etkilesim", value: `%${data.stats.avgEngagement}`, icon: FiBarChart2, color: "text-purple-400" },
          { label: "En Populer Kategori", value: data.stats.topCategory, icon: FiPlay, color: "text-neon-red" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] text-text-muted uppercase">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Top 10 Viral Videos */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FiPlay className="w-4 h-4 text-neon-red" />
          En Viral 10 Video
        </h3>
        <div className="space-y-2">
          {data.topVideos.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light transition-colors group"
            >
              <span className="text-lg font-bold text-text-muted w-6 text-right">
                {i + 1}
              </span>
              <div className="w-10 h-14 rounded-lg overflow-hidden bg-surface-light shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-primary font-medium truncate">
                  @{video.creator}
                </p>
                <p className="text-[10px] text-text-secondary truncate">{video.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">{video.format}</span>
                <span className="text-xs text-text-secondary flex items-center gap-0.5">
                  <FiEye className="w-3 h-3" /> {formatNumber(video.views)}
                </span>
                <span className="text-xs text-neon-red font-medium">%{video.engagementRate}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Two Column: Hashtags + Sounds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Hashtags */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FiHash className="w-4 h-4 text-teal" />
            En Hizli Buyuyen Hashtag&apos;ler
          </h3>
          <div className="space-y-2">
            {data.trendingHashtags.map((ht, i) => (
              <div key={ht.tag} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-light transition-colors">
                <span className="text-xs font-bold text-text-muted w-5">{i + 1}</span>
                <span className="text-xs text-teal flex-1">{ht.tag}</span>
                <span className="text-[10px] text-text-muted">{ht.count} video</span>
                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${ht.growth > 0 ? "text-teal" : ht.growth < 0 ? "text-neon-red" : "text-text-muted"}`}>
                  {ht.growth > 0 ? <FiArrowUp className="w-2.5 h-2.5" /> : ht.growth < 0 ? <FiArrowDown className="w-2.5 h-2.5" /> : null}
                  {ht.growth > 0 ? "+" : ""}{ht.growth}%
                </span>
              </div>
            ))}
            {data.trendingHashtags.length === 0 && (
              <p className="text-xs text-text-muted text-center py-4">Yeterli hashtag verisi yok</p>
            )}
          </div>
        </div>

        {/* Trending Sounds */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FiMusic className="w-4 h-4 text-purple-400" />
            Trend Sesler
          </h3>
          <div className="space-y-2">
            {data.trendingSounds.map((sound, i) => (
              <div key={sound.name + i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-light transition-colors">
                <span className="text-xs font-bold text-text-muted w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary truncate">{sound.name}</p>
                  <p className="text-[10px] text-text-muted truncate">{sound.creator}</p>
                </div>
                <span className="text-[10px] text-text-muted">{sound.videoCount} video</span>
                <span className="text-[10px] text-text-secondary">
                  <FiEye className="w-2.5 h-2.5 inline mr-0.5" />{formatNumber(sound.totalViews)}
                </span>
              </div>
            ))}
            {data.trendingSounds.length === 0 && (
              <p className="text-xs text-text-muted text-center py-4">Yeterli ses verisi yok</p>
            )}
          </div>
        </div>
      </div>

      {/* Two Column: Emerging Formats + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emerging Formats */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-orange-400" />
            Yukselen Icerik Formatlari
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.emergingFormats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="format" tick={{ fill: "#555570", fontSize: 10 }} angle={-15} />
                <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                  formatter={(v, name) => {
                    if (name === "count") return [v, "Bu hafta"];
                    if (name === "oldCount") return [v, "Gecen hafta"];
                    return [v, name];
                  }}
                />
                <Bar dataKey="count" fill="#00d4aa" radius={[4, 4, 0, 0]} name="count" />
                <Bar dataKey="oldCount" fill="#2a2a3a" radius={[4, 4, 0, 0]} name="oldCount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        {data.categoryDistribution && data.categoryDistribution.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-4 h-4 text-blue-400" />
              Kategori Dagilimi
            </h3>
            <div className="h-48 flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryDistribution.slice(0, 8)}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      strokeWidth={0}
                    >
                      {data.categoryDistribution.slice(0, 8).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                      formatter={(v, name) => [`${v} video`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-1.5">
                {data.categoryDistribution.slice(0, 8).map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-[11px] text-text-secondary truncate">{cat.category}</span>
                    <span className="text-[10px] text-text-muted ml-auto">%{cat.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ReportsPage() {
  return (
    <PremiumGate featureName="Günlük Rapor">
      <ReportsContent />
    </PremiumGate>
  );
}
