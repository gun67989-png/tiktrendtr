"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiTrendingUp, FiLoader } from "react-icons/fi";
import VideoCard, { type VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import OnboardingTour from "@/components/OnboardingTour";
import { trendingVideosTourSteps } from "@/lib/onboarding";

const CATEGORIES = ["Tümü", "Yemek", "Komedi", "Seyahat", "Moda", "Teknoloji", "Vlog", "Eğitim", "Spor", "Müzik", "Dans", "Güzellik", "Oyun"];
const SORT_OPTIONS = [
  { value: "viralScore", label: "Viral Skor" },
  { value: "likeRatio", label: "Beğeni Oranı" },
  { value: "views", label: "Görüntülenme" },
  { value: "engagementRate", label: "Etkileşim" },
  { value: "publishedAt", label: "En Yeni" },
];

const PAGE_SIZE = 40;

export default function TrendingVideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [category, setCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState("viralScore");
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Initial load & filter/sort change
  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(true);

    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: "0",
      sortBy,
      order: "desc",
    });
    if (category !== "Tümü") params.set("category", category);

    fetch(`/api/trends/videos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setVideos(data.videos || []);
        setTotal(data.total || 0);
        setOffset(data.videos?.length || 0);
        setHasMore((data.videos?.length || 0) < (data.total || 0));
      })
      .finally(() => setLoading(false));
  }, [category, sortBy]);

  // Load more videos
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(offset),
      sortBy,
      order: "desc",
    });
    if (category !== "Tümü") params.set("category", category);

    fetch(`/api/trends/videos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const newVideos = data.videos || [];
        setVideos((prev) => [...prev, ...newVideos]);
        setOffset((prev) => prev + newVideos.length);
        setHasMore(newVideos.length >= PAGE_SIZE && offset + newVideos.length < (data.total || 0));
      })
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, offset, sortBy, category]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <OnboardingTour tourKey="trending-videos" steps={trendingVideosTourSteps} tourTitle="Trend Videolar" />

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
        <>
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

          {/* Infinite scroll sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              {loadingMore && (
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Daha fazla video yükleniyor...
                </div>
              )}
            </div>
          )}

          {/* End message */}
          {!hasMore && videos.length > 0 && (
            <p className="text-center text-text-muted text-xs py-4">
              Tüm videolar yüklendi ({videos.length}/{total})
            </p>
          )}
        </>
      )}

      {/* Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </motion.div>
  );
}
