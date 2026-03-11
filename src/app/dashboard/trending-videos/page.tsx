"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiTrendingUp } from "react-icons/fi";
import VideoCard, { type VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";

const CATEGORIES = ["Tümü", "Yemek", "Komedi", "Seyahat", "Moda", "Teknoloji", "Vlog", "Eğitim", "Spor", "Müzik", "Dans", "Güzellik", "Oyun"];
const SORT_OPTIONS = [
  { value: "viralScore", label: "Viral Skor" },
  { value: "likeRatio", label: "Beğeni Oranı" },
  { value: "views", label: "Görüntülenme" },
  { value: "engagementRate", label: "Etkileşim" },
  { value: "publishedAt", label: "En Yeni" },
];

export default function TrendingVideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [category, setCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("viralScore");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: "60",
      sortBy,
      order: "desc",
    });
    if (category !== "Tümü") params.set("category", category);

    fetch(`/api/trends/videos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setVideos(data.videos);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [category, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <FiTrendingUp className="text-neon-red" />
            Trend Videolar
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Türkiye&apos;de trend olan TikTok videoları ({total} video)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? "bg-neon-red text-white"
                  : "bg-surface-light text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <FiFilter className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">Sırala:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                sortBy === opt.value
                  ? "bg-teal/10 text-teal"
                  : "text-text-muted hover:text-text-secondary"
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
            <div key={i} className="bg-surface rounded-xl border border-border overflow-hidden">
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
          <p className="text-text-muted">Bu kategoride video bulunamadı.</p>
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
