"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMusic,
  FiArrowLeft,
  FiTrendingUp,
  FiEye,
  FiBarChart2,
  FiClock,
  FiDisc,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { SoundDetail } from "@/lib/data";

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

export default function SoundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const soundId = params.soundId as string;
  const [data, setData] = useState<SoundDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trends/sounds/${soundId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, [soundId]);

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
        <FiMusic className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary">Ses bulunamadi</p>
        <button
          onClick={() => router.push("/dashboard/sounds")}
          className="mt-4 text-sm text-teal hover:underline"
        >
          Seslere don
        </button>
      </div>
    );
  }

  const infoItems = [
    { label: "Kullanim", value: formatNumber(data.usageCount), icon: FiBarChart2, color: "text-teal" },
    { label: "Buyume", value: `${data.growthRate >= 0 ? "+" : ""}${data.growthRate}%`, icon: FiTrendingUp, color: data.growthRate >= 0 ? "text-teal" : "text-neon-red" },
    { label: "BPM", value: data.bpm || "N/A", icon: FiDisc, color: "text-purple-400" },
    { label: "Sure", value: data.duration, icon: FiClock, color: "text-blue-400" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => router.push("/dashboard/sounds")}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Seslere Don
        </button>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-purple-500/20 border border-teal/30 flex items-center justify-center shrink-0">
            <FiMusic className="w-7 h-7 text-teal" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text-primary truncate">{data.name}</h1>
            <p className="text-sm text-text-secondary mt-0.5">@{data.creator}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-surface-light text-text-secondary px-2 py-0.5 rounded-md">
                {data.genre}
              </span>
              <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-md font-mono">
                Viral: {data.viralScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {infoItems.map((item) => (
          <div key={item.label} className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-[10px] text-text-muted uppercase">{item.label}</span>
            </div>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Usage Growth Chart */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Kullanim Buyumesi (30 Gun)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.usageHistory}>
              <defs>
                <linearGradient id="soundGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="count" stroke="#00d4aa" fill="url(#soundGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Viral Videos */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Bu Sesi Kullanan En Viral Videolar
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
              className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer hover:border-teal/30 transition-all group"
            >
              <div className="relative aspect-[9/16] max-h-[220px] overflow-hidden bg-surface-light">
                <img
                  src={video.thumbnailUrl}
                  alt={video.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-neon-red/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {video.viralScore.toFixed(0)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="flex items-center gap-2 text-white/90 text-[10px]">
                    <span className="flex items-center gap-0.5">
                      <FiEye className="w-2.5 h-2.5" />{formatNumber(video.views)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <p className="text-[11px] text-text-primary font-medium truncate">@{video.creator}</p>
                <div className="flex items-center justify-between">
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
