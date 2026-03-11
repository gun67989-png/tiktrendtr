"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEye, FiHeart, FiMessageCircle, FiShare2, FiExternalLink, FiMusic, FiBarChart2, FiInfo } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { VideoData } from "./VideoCard";

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

function getViralLabel(score: number): string {
  if (score >= 8) return "Çok Yüksek";
  if (score >= 6) return "Yüksek";
  if (score >= 4) return "Orta";
  if (score >= 2) return "Düşük";
  return "Çok Düşük";
}

function getPresenceLabel(score: number): string {
  if (score >= 80) return "Çok Yüksek";
  if (score >= 60) return "Yüksek";
  if (score >= 40) return "Orta";
  if (score >= 20) return "Düşük";
  return "Çok Düşük";
}

export default function VideoModal({
  video,
  onClose,
}: {
  video: VideoData | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [showViralInfo, setShowViralInfo] = useState(false);
  const [showPresenceInfo, setShowPresenceInfo] = useState(false);
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const [showEngagementInfo, setShowEngagementInfo] = useState(false);

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-red flex items-center justify-center text-white font-bold">
                {video.creator[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">@{video.creator}</p>
                <p className="text-xs text-text-muted">
                  {new Date(video.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-light transition-colors">
              <FiX className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="md:w-1/2 relative">
              <img
                src={video.thumbnailUrl}
                alt={video.description}
                className="w-full aspect-[9/16] max-h-[400px] object-cover"
              />
              <div className="absolute top-3 left-3">
                <div
                  onClick={() => setShowViralInfo(!showViralInfo)}
                  className="bg-neon-red text-white text-xs font-bold px-2 py-1 rounded cursor-help hover:bg-red-500 transition-colors flex items-center gap-1"
                >
                  Viral Skor: {video.viralScore.toFixed(1)} <FiInfo className="w-3 h-3 opacity-70" />
                </div>
                {showViralInfo && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-lg p-3 shadow-xl z-10">
                    <p className="text-[11px] text-text-primary font-semibold mb-1">
                      Viral Skor: {video.viralScore.toFixed(1)}/10 ({getViralLabel(video.viralScore)})
                    </p>
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      Etkileşim oranı, görüntülenme sayısı ve içerik üretici puanına göre 0-10 arasında hesaplanır. Yüksek skor = daha viral potansiyel.
                    </p>
                  </div>
                )}
              </div>
              {video.format && (
                <div className="absolute top-3 right-3">
                  <div
                    onClick={() => setShowFormatInfo(!showFormatInfo)}
                    className="bg-teal text-white text-xs px-2 py-1 rounded cursor-help hover:bg-teal/80 transition-colors flex items-center gap-1"
                  >
                    {video.format} <FiInfo className="w-3 h-3 opacity-70" />
                  </div>
                  {showFormatInfo && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-surface border border-border rounded-lg p-3 shadow-xl z-10">
                      <p className="text-[11px] text-text-primary font-semibold mb-1">
                        Video Formatı: {video.format}
                      </p>
                      <p className="text-[10px] text-text-secondary leading-relaxed">
                        Videonun içerik türünü belirtir (Tutorial, POV, Challenge, GRWM vb.). Format, videonun yapısını ve sunum tarzını gösterir.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-4 space-y-4">
              <p className="text-sm text-text-primary leading-relaxed">{video.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-light rounded-lg p-3 text-center">
                  <FiEye className="w-4 h-4 text-text-muted mx-auto mb-1" />
                  <p className="text-lg font-bold text-text-primary">{formatNumber(video.views)}</p>
                  <p className="text-[10px] text-text-muted">Görüntülenme</p>
                </div>
                <div className="bg-surface-light rounded-lg p-3 text-center">
                  <FiHeart className="w-4 h-4 text-neon-red mx-auto mb-1" />
                  <p className="text-lg font-bold text-text-primary">{formatNumber(video.likes)}</p>
                  <p className="text-[10px] text-text-muted">Beğeni</p>
                </div>
                <div className="bg-surface-light rounded-lg p-3 text-center">
                  <FiMessageCircle className="w-4 h-4 text-teal mx-auto mb-1" />
                  <p className="text-lg font-bold text-text-primary">{formatNumber(video.comments)}</p>
                  <p className="text-[10px] text-text-muted">Yorum</p>
                </div>
                <div className="bg-surface-light rounded-lg p-3 text-center">
                  <FiShare2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-text-primary">{formatNumber(video.shares)}</p>
                  <p className="text-[10px] text-text-muted">Paylaşım</p>
                </div>
              </div>

              {/* Engagement, Duration & Creator Presence */}
              <div className="flex gap-3">
                <div
                  className="flex-1 bg-neon-red/10 rounded-lg p-2 text-center cursor-help relative"
                  onClick={() => setShowEngagementInfo(!showEngagementInfo)}
                >
                  <p className="text-sm font-bold text-neon-red flex items-center justify-center gap-1">
                    %{video.engagementRate.toFixed(2)} <FiInfo className="w-3 h-3 opacity-50" />
                  </p>
                  <p className="text-[10px] text-text-muted">Etkileşim Oranı</p>
                  {showEngagementInfo && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-surface border border-border rounded-lg p-3 shadow-xl z-10 text-left">
                      <p className="text-[11px] text-text-primary font-semibold mb-1">
                        Etkileşim Oranı: %{video.engagementRate.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-text-secondary leading-relaxed">
                        (Beğeni + Yorum + Paylaşım) / Görüntülenme oranıdır. Yüksek oran, izleyicilerin videoyla daha fazla etkileşime girdiğini gösterir.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-surface-light rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-text-primary">{formatDuration(video.duration)}</p>
                  <p className="text-[10px] text-text-muted">Süre</p>
                </div>
                {video.creatorPresenceScore != null && (
                  <div
                    className={`flex-1 rounded-lg p-2 text-center cursor-help relative ${
                      video.creatorPresenceScore >= 70 ? "bg-teal/10" : "bg-surface-light"
                    }`}
                    onClick={() => setShowPresenceInfo(!showPresenceInfo)}
                  >
                    <p className={`text-sm font-bold flex items-center justify-center gap-1 ${
                      video.creatorPresenceScore >= 70 ? "text-teal" : "text-text-secondary"
                    }`}>
                      {video.creatorPresenceScore} <FiInfo className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-[10px] text-text-muted">Oluşturucu Skoru</p>
                    {showPresenceInfo && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-surface border border-border rounded-lg p-3 shadow-xl z-10 text-left">
                        <p className="text-[11px] text-text-primary font-semibold mb-1">
                          İçerik Üretici Skoru: {video.creatorPresenceScore}/100 ({getPresenceLabel(video.creatorPresenceScore)})
                        </p>
                        <p className="text-[10px] text-text-secondary leading-relaxed">
                          Videoda gerçek bir kişinin kamera karşısında görünme olasılığını tahmin eder. Yüksek skor = içerik üretici büyük ihtimalle videoda görünüyor.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Like Ratio & Ad Format */}
              <div className="flex gap-3">
                {video.likeRatio != null && (
                  <div className={`flex-1 rounded-lg p-2 text-center ${
                    video.likeRatio >= 8 ? "bg-teal/10" : "bg-surface-light"
                  }`}>
                    <p className={`text-sm font-bold ${
                      video.likeRatio >= 8 ? "text-teal" : video.likeRatio >= 4 ? "text-text-primary" : "text-text-secondary"
                    }`}>
                      %{video.likeRatio.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-text-muted">Beğeni Oranı</p>
                  </div>
                )}
                {video.adFormat && (
                  <div className="flex-1 bg-orange-400/10 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-orange-400">{video.adFormat}</p>
                    <p className="text-[10px] text-text-muted">Reklam Formatı</p>
                  </div>
                )}
              </div>

              {/* Sound */}
              {video.soundName && (
                <div className="flex items-center gap-2 bg-surface-light rounded-lg p-2">
                  <FiMusic className="w-4 h-4 text-teal shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-primary truncate">{video.soundName}</p>
                    <p className="text-[10px] text-text-muted">{video.soundCreator}</p>
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {video.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {video.hashtags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onClose();
                        router.push(`/dashboard/hashtags/${encodeURIComponent(tag)}`);
                      }}
                      className="text-xs text-teal bg-teal/10 px-2 py-1 rounded hover:bg-teal/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/dashboard/trending-videos/${video.id}`);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-teal/10 text-teal text-sm font-medium hover:bg-teal/20 transition-colors border border-teal/20"
                >
                  <FiBarChart2 className="w-4 h-4" />
                  Video Analitikleri
                </button>
                <a
                  href={video.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg gradient-red text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <FiExternalLink className="w-4 h-4" />
                  TikTok&apos;ta Ac
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
