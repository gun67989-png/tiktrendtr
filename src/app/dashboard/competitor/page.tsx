"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  FiSearch,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiClock,
  FiHash,
  FiBarChart2,
  FiTrendingUp,
  FiPlay,
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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Bugün";
  if (days === 1) return "Dün";
  if (days < 7) return `${days} gün önce`;
  return `${Math.floor(days / 7)} hafta önce`;
}

const PIE_COLORS = ["#ff3b5c", "#00d4aa", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6", "#34d399", "#fb923c"];

interface CompetitorData {
  username: string;
  isExactMatch: boolean;
  videoCount: number;
  error?: string;
  stats: {
    totalViews: number;
    avgViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    avgEngagementRate: number;
    avgDuration: number;
  };
  topVideos: Array<{
    id: string;
    description: string;
    creator: string;
    thumbnailUrl: string;
    tiktokUrl: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    duration: number;
    format: string;
    hashtags: string[];
    publishedAt: string;
  }>;
  topHashtags: Array<{ tag: string; count: number }>;
  formatDistribution: Array<{ format: string; count: number; percentage: number }>;
  postingHours: Array<{ hour: number; count: number }>;
  bestHours: number[];
}

function CompetitorContent() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/competitor?username=${encodeURIComponent(username.trim())}`);
      const result = await res.json();

      if (result.error && !result.stats) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch {
      setError("Bir hata olustu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Rakip Analizi</h1>
        <p className="text-sm text-text-secondary mt-1">
          TikTok kullanici adini girerek videolarini, istatistiklerini ve stratejilerini analiz edin
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="@kullaniciadi girin..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-red/50 transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !username.trim()}
          className="px-6 py-2.5 bg-neon-red text-white text-sm font-medium rounded-xl hover:bg-neon-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analiz ediliyor..." : "Analiz Et"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-xl border border-border p-4 h-24 shimmer" />
            ))}
          </div>
          <div className="h-64 shimmer rounded-xl" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-neon-red/10 border border-neon-red/20 rounded-xl p-4 text-center">
          <p className="text-sm text-neon-red">{error}</p>
        </div>
      )}

      {/* Results */}
      {data && data.stats && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Username banner */}
          <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-red flex items-center justify-center text-white font-bold text-lg">
              {data.username[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">@{data.username}</h2>
              <p className="text-xs text-text-secondary">
                {data.videoCount} video analiz edildi
                {!data.isExactMatch && " (arama sonuclari)"}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Toplam Goruntulenme", value: formatNumber(data.stats.totalViews), icon: FiEye, color: "text-blue-400" },
              { label: "Ort. Goruntulenme", value: formatNumber(data.stats.avgViews), icon: FiTrendingUp, color: "text-teal" },
              { label: "Ort. Etkilesim", value: `%${data.stats.avgEngagementRate}`, icon: FiBarChart2, color: "text-purple-400" },
              { label: "Ort. Sure", value: formatDuration(data.stats.avgDuration), icon: FiClock, color: "text-orange-400" },
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

          {/* Additional stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <FiHeart className="w-5 h-5 text-neon-red mx-auto mb-1" />
              <p className="text-lg font-bold text-text-primary">{formatNumber(data.stats.totalLikes)}</p>
              <p className="text-[10px] text-text-muted">Toplam Begeni</p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <FiMessageCircle className="w-5 h-5 text-teal mx-auto mb-1" />
              <p className="text-lg font-bold text-text-primary">{formatNumber(data.stats.totalComments)}</p>
              <p className="text-[10px] text-text-muted">Toplam Yorum</p>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 text-center">
              <FiShare2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-text-primary">{formatNumber(data.stats.totalShares)}</p>
              <p className="text-[10px] text-text-muted">Toplam Paylasim</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Posting Hours */}
            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Paylasim Saatleri</h3>
              <p className="text-[10px] text-text-muted mb-4">
                En iyi saatler: {data.bestHours.map((h) => `${h}:00`).join(", ")}
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.postingHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: "#555570", fontSize: 10 }}
                      tickFormatter={(h) => `${h}:00`}
                    />
                    <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#8888a0" }}
                      labelFormatter={(h) => `${h}:00`}
                      formatter={(v) => [v, "Video"]}
                    />
                    <Bar dataKey="count" fill="#00d4aa" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Format Distribution */}
            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Icerik Formati Dagilimi</h3>
              <div className="h-48 flex items-center">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.formatDistribution}
                        dataKey="count"
                        nameKey="format"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        strokeWidth={0}
                      >
                        {data.formatDistribution.map((_, i) => (
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
                  {data.formatDistribution.slice(0, 6).map((f, i) => (
                    <div key={f.format} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[11px] text-text-secondary truncate">{f.format}</span>
                      <span className="text-[10px] text-text-muted ml-auto">%{f.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Hashtags */}
          {data.topHashtags.length > 0 && (
            <div className="bg-surface rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                <FiHash className="w-4 h-4 inline mr-1" />
                En Cok Kullanilan Hashtag&apos;ler
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.topHashtags.map((ht) => (
                  <span
                    key={ht.tag}
                    className="text-xs bg-teal/10 text-teal px-3 py-1.5 rounded-lg"
                  >
                    {ht.tag} <span className="text-text-muted ml-1">({ht.count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top Videos */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              <FiPlay className="w-4 h-4 inline mr-1" />
              En Iyi Performans Gosteren Videolar
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data.topVideos.map((video, i) => (
                <motion.a
                  key={video.id}
                  href={video.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="bg-surface rounded-xl border border-border overflow-hidden hover:border-neon-red/30 transition-all group"
                >
                  <div className="relative aspect-[9/16] max-h-[220px] overflow-hidden bg-surface-light">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.description}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 bg-teal/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                      {video.format}
                    </div>
                    {video.duration > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <FiClock className="w-2.5 h-2.5" />
                        {formatDuration(video.duration)}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1">
                      <span className="text-white/90 text-[9px] flex items-center gap-0.5">
                        <FiEye className="w-2.5 h-2.5" />{formatNumber(video.views)}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">{video.description || "—"}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[9px] text-text-muted">{timeAgo(video.publishedAt)}</span>
                      <span className="text-[9px] text-neon-red flex items-center gap-0.5">
                        <FiHeart className="w-2.5 h-2.5" />{formatNumber(video.likes)}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="text-center py-20">
          <FiSearch className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary text-sm">Bir TikTok kullanici adi girerek analiz baslatin</p>
          <p className="text-text-muted text-xs mt-1">Ornek: @kullaniciadi</p>
        </div>
      )}
    </motion.div>
  );
}

export default function CompetitorPage() {
  return (
    <PremiumGate featureName="Rakip Analizi">
      <CompetitorContent />
    </PremiumGate>
  );
}
