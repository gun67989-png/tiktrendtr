"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Music,
  Hash,
  ExternalLink,
  Zap,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { VideoAnalytics } from "@/lib/data";

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

export default function VideoAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const [data, setData] = useState<VideoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trends/videos/${videoId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, [videoId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-48" />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80 aspect-[9/16] shimmer rounded-xl" />
          <div className="flex-1 space-y-4">
            <div className="h-24 shimmer rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 shimmer rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Video bulunamadi</p>
        <button
          onClick={() => router.push("/dashboard/trending-videos")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Videolara don
        </button>
      </div>
    );
  }

  const speedColors: Record<string, string> = {
    "Cok Hizli": "text-primary",
    "Hizli": "text-orange-400",
    "Normal": "text-teal",
    "Yavas": "text-muted-foreground",
  };

  // Build comparison data for engagement chart
  const engagementComparison = data.engagementOverTime.map((d) => ({
    ...d,
    nicheAvg: data.nicheAvgEngagement,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/trending-videos")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Videolara Don
      </button>

      {/* Hero: Thumbnail + Core Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="relative w-full md:w-72 shrink-0">
          <img
            src={data.thumbnailUrl}
            alt={data.description}
            className="w-full aspect-[9/16] max-h-[420px] object-cover rounded-xl"
          />
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            Viral: {data.viralScore.toFixed(0)}
          </div>
          {data.format && (
            <div className="absolute top-3 right-3 bg-teal text-white text-xs px-2.5 py-1 rounded-lg">
              {data.format}
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(data.duration)}
            </span>
            {data.category && (
              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                {data.category}
              </span>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="flex-1 space-y-5">
          {/* Creator */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {data.creator[0].toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">@{data.creator}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(data.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Eye className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{formatNumber(data.views)}</p>
              <p className="text-[10px] text-muted-foreground">Goruntulenme</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Heart className="w-5 h-5 text-primary mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{formatNumber(data.likes)}</p>
              <p className="text-[10px] text-muted-foreground">Begeni</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <MessageCircle className="w-5 h-5 text-teal mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{formatNumber(data.comments)}</p>
              <p className="text-[10px] text-muted-foreground">Yorum</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <p className="text-xl font-bold text-foreground">{formatNumber(data.shares)}</p>
              <p className="text-[10px] text-muted-foreground">Paylasim</p>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">%{data.engagementRate.toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground">Etkilesim Orani</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-3 text-center">
              <p className={`text-lg font-bold ${speedColors[data.growthSpeed] || "text-foreground"}`}>
                {data.growthSpeed}
              </p>
              <p className="text-[10px] text-muted-foreground">Buyume Hizi</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-3 text-center">
              <p className="text-lg font-bold text-teal">{data.bestPostingHour}:00</p>
              <p className="text-[10px] text-muted-foreground">Paylasim Saati</p>
            </div>
          </div>

          {/* Sound */}
          {data.soundName && (
            <button
              onClick={() => data.soundId && router.push(`/dashboard/sounds/${data.soundId}`)}
              className="flex items-center gap-3 w-full bg-card rounded-xl border border-border p-3 hover:border-teal/40 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-teal" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{data.soundName}</p>
                <p className="text-xs text-muted-foreground">{data.soundCreator}</p>
              </div>
              <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 shrink-0" />
            </button>
          )}

          {/* Hashtags */}
          {data.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.hashtags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/dashboard/hashtags/${encodeURIComponent(tag)}`)}
                  className="flex items-center gap-1 text-xs text-teal bg-teal/10 px-2.5 py-1.5 rounded-lg hover:bg-teal/20 transition-colors"
                >
                  <Hash className="w-3 h-3" />
                  {tag.replace("#", "")}
                </button>
              ))}
            </div>
          )}

          {/* TikTok Link */}
          <a
            href={data.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
            TikTok&apos;ta Ac
          </a>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-semibold text-foreground">Goruntulenme Grafigi</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.viewsOverTime}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(v) => [formatNumber(Number(v)), "Goruntulenme"]}
                />
                <Area type="monotone" dataKey="views" stroke="#00d4aa" fill="url(#viewsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement vs Niche Average */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Etkilesim vs Nis Ortalamasi</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementComparison}>
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
                  formatter={(v, name) => [
                    `%${typeof v === "number" ? v.toFixed(2) : v}`,
                    name === "rate" ? "Video" : "Nis Ort.",
                  ]}
                />
                <Line type="monotone" dataKey="rate" stroke="#ff3b5c" strokeWidth={2} dot={false} name="rate" />
                <Line type="monotone" dataKey="nicheAvg" stroke="#555570" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="nicheAvg" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-primary rounded" />
              <span className="text-muted-foreground">Bu Video</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-text-muted rounded border-dashed" />
              <span className="text-muted-foreground">Nis Ortalamasi (%{data.nicheAvgEngagement})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Performance vs Niche Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Performans Karsilastirmasi
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Goruntulenme</p>
            <p className="text-lg font-bold text-foreground">{formatNumber(data.views)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Nis Ort: {formatNumber(data.nicheAvgViews)}</p>
            <div className={`text-xs font-medium mt-1 ${data.views > data.nicheAvgViews ? "text-teal" : "text-primary"}`}>
              {data.views > data.nicheAvgViews
                ? `+${Math.round(((data.views - data.nicheAvgViews) / data.nicheAvgViews) * 100)}% yukarida`
                : `${Math.round(((data.views - data.nicheAvgViews) / data.nicheAvgViews) * 100)}% asagida`}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Etkilesim</p>
            <p className="text-lg font-bold text-foreground">%{data.engagementRate.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Nis Ort: %{data.nicheAvgEngagement}</p>
            <div className={`text-xs font-medium mt-1 ${data.engagementRate > data.nicheAvgEngagement ? "text-teal" : "text-primary"}`}>
              {data.engagementRate > data.nicheAvgEngagement
                ? `+${(data.engagementRate - data.nicheAvgEngagement).toFixed(1)}pp yukarida`
                : `${(data.engagementRate - data.nicheAvgEngagement).toFixed(1)}pp asagida`}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Buyume Hizi</p>
            <p className={`text-lg font-bold ${speedColors[data.growthSpeed] || "text-foreground"}`}>
              {data.growthSpeed}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.duration}sn video
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Paylasim Zamani</p>
            <p className="text-lg font-bold text-teal">{data.bestPostingHour}:00</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.bestPostingHour >= 19 && data.bestPostingHour <= 22 ? "Prime time" : "Normal saat"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
