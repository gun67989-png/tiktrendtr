"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiHash,
  FiArrowLeft,
  FiTrendingUp,
  FiEye,
  FiBarChart2,
  FiZap,
  FiPlay,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HashtagDetail } from "@/lib/data";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Bugun";
  if (days === 1) return "Dun";
  if (days < 7) return `${days} gun once`;
  return `${Math.floor(days / 7)} hafta once`;
}

export default function HashtagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tag = decodeURIComponent(params.tag as string);
  const [data, setData] = useState<HashtagDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trends/hashtags/${encodeURIComponent(tag)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, [tag]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
        <FiHash className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary">Hashtag bulunamadi</p>
        <button
          onClick={() => router.push("/dashboard/hashtags")}
          className="mt-4 text-sm text-neon-red hover:underline"
        >
          Hashtag&apos;lere don
        </button>
      </div>
    );
  }

  const stats = [
    { label: "Toplam Video", value: formatNumber(data.totalUses), icon: FiPlay, color: "text-teal" },
    { label: "Toplam Goruntulenme", value: formatNumber(data.totalViews), icon: FiEye, color: "text-blue-400" },
    { label: "Haftalik Buyume", value: `${data.weeklyGrowth >= 0 ? "+" : ""}${data.weeklyGrowth}%`, icon: FiTrendingUp, color: data.weeklyGrowth >= 0 ? "text-teal" : "text-neon-red" },
    { label: "Etkilesim Orani", value: `%${data.engagementRate}`, icon: FiBarChart2, color: "text-purple-400" },
    { label: "Viral Skor", value: data.viralScore.toFixed(2), icon: FiZap, color: "text-neon-red" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => router.push("/dashboard/hashtags")}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Hashtag&apos;lere Don
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-red flex items-center justify-center">
            <FiHash className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{data.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-surface-light text-text-secondary px-2 py-0.5 rounded-md">
                {data.category}
              </span>
              {data.isEmerging && (
                <span className="text-xs bg-neon-red/10 text-neon-red px-2 py-0.5 rounded-md">
                  Yukselen Trend
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] text-text-muted uppercase">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Kullanim Buyumesi (30 Gun)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyGrowth}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#555570", fontSize: 10 }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis tick={{ fill: "#555570", fontSize: 10 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                  formatter={(v) => [formatNumber(Number(v)), "Kullanim"]}
                />
                <Area type="monotone" dataKey="uses" stroke="#00d4aa" fill="url(#growthGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Etkilesim Orani (30 Gun)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.engagementHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#555570", fontSize: 10 }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis tick={{ fill: "#555570", fontSize: 10 }} tickFormatter={(v) => `%${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                  formatter={(v) => [`%${v}`, "Etkilesim"]}
                />
                <Line type="monotone" dataKey="rate" stroke="#ff3b5c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Usage Chart (Bar) */}
        <div className="bg-surface rounded-xl border border-border p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Gunluk Video Kullanimi (14 Gun)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trendUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#555570", fontSize: 10 }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                  formatter={(v) => [v, "Video"]}
                />
                <Bar dataKey="videos" fill="#00d4aa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Viral Videos */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          En Viral Videolar
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {data.topVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => router.push(`/dashboard/trending-videos/${video.id}`)}
              className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer hover:border-neon-red/30 transition-all group"
            >
              <div className="relative aspect-[9/16] max-h-[220px] overflow-hidden bg-surface-light">
                <img
                  src={video.thumbnailUrl}
                  alt={video.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-neon-red/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {video.viralScore.toFixed(0)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1">
                  <span className="text-white/90 text-[9px] flex items-center gap-0.5">
                    <FiEye className="w-2.5 h-2.5" />{formatNumber(video.views)}
                  </span>
                </div>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[10px] text-text-primary font-medium truncate">@{video.creator}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] text-text-muted">{timeAgo(video.publishedAt)}</span>
                  <span className="text-[9px] text-neon-red font-medium">%{video.engagementRate.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
