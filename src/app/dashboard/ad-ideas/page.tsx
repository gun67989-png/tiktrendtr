"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, ShoppingBag, TrendingUp, Heart, Eye } from "lucide-react";
import VideoCard, { type VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import OnboardingTour from "@/components/OnboardingTour";
import { adIdeasTourSteps } from "@/lib/onboarding";

const AD_FORMATS = ["Tümü", "UGC Reklam", "Ürün Deneyimi", "Ürün İnceleme", "Haul", "Unboxing", "Önce/Sonra", "Tavsiye", "Sponsorlu", "Kampanya"];

const SORT_OPTIONS = [
  { value: "viralScore", label: "Viral Skor" },
  { value: "likeRatio", label: "Beğeni Oranı" },
  { value: "views", label: "Görüntülenme" },
  { value: "engagementRate", label: "Etkileşim" },
];

export default function AdIdeasPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [adFormat, setAdFormat] = useState("Tümü");
  const [sortBy, setSortBy] = useState("viralScore");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: "60",
      sortBy,
      order: "desc",
      adOnly: "true",
    });

    fetch(`/api/trends/videos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        let filtered = data.videos || [];
        // Client-side filter by ad format
        if (adFormat !== "Tümü") {
          filtered = filtered.filter((v: VideoData) => v.adFormat === adFormat);
        }
        setVideos(filtered);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [sortBy, adFormat]);

  // Calculate stats from loaded videos
  const avgLikeRatio = videos.length > 0
    ? (videos.reduce((sum, v) => sum + (v.likeRatio || 0), 0) / videos.length).toFixed(1)
    : "0";
  const avgViralScore = videos.length > 0
    ? (videos.reduce((sum, v) => sum + v.viralScore, 0) / videos.length).toFixed(1)
    : "0";
  const topFormat = videos.length > 0
    ? Object.entries(
        videos.reduce((acc, v) => {
          const fmt = v.adFormat || "Diğer";
          acc[fmt] = (acc[fmt] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
    : "-";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <OnboardingTour tourKey="ad-ideas" steps={adIdeasTourSteps} tourTitle="Reklam Fikirleri" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="text-orange-400" />
            Reklam Fikirleri
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Viral olan reklam ve ürün tanıtım videoları - reklam verenler için ilham kaynağı
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Eye className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-xl font-bold text-foreground">{total}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Reklam Video</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Heart className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xl font-bold text-primary">%{avgLikeRatio}</p>
          <p className="text-[10px] text-muted-foreground">Ort. Beğeni Oranı</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <TrendingUp className="w-5 h-5 text-teal mx-auto mb-2" />
          <p className="text-xl font-bold text-teal">{avgViralScore}</p>
          <p className="text-[10px] text-muted-foreground">Ort. Viral Skor</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <ShoppingBag className="w-5 h-5 text-orange-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-orange-400 text-sm">{topFormat}</p>
          <p className="text-[10px] text-muted-foreground">En Popüler Format</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-400/5 border border-orange-400/20 rounded-xl p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bu sayfada ürün tanıtımı, inceleme, haul ve sponsorlu içerik gibi reklam niteliğindeki viral TikTok videoları listelenir.
          <strong className="text-orange-400"> Beğeni Oranı</strong> (Beğeni/İzlenme) en önemli kalite göstergesidir.
          %10+ beğeni oranına sahip videolar olağanüstü performans gösterir. Yüksek beğeni oranlı reklam videolarından ilham alarak kendi kampanyalarınızı oluşturabilirsiniz.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Ad Format Filter */}
        <div className="flex flex-wrap gap-2">
          {AD_FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setAdFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                adFormat === fmt
                  ? "bg-orange-400 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Sırala:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                sortBy === opt.value
                  ? "bg-orange-400/10 text-orange-400"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="aspect-[9/16] max-h-[280px] shimmer" />
              <div className="p-3 space-y-2">
                <div className="h-3 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Reklam videosu bulunamadı</p>
          <p className="text-muted-foreground text-sm">
            Henüz reklam niteliğinde viral video tespit edilmedi. Bir sonraki veri toplama döngüsünde güncellenecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              onSelect={setSelectedVideo}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </motion.div>
  );
}
