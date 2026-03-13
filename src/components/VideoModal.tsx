"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Heart, MessageCircle, Share2, ExternalLink, Music, BarChart2, Info } from "lucide-react";
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
          className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {video.creator[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">@{video.creator}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(video.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-card-light transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
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
                  className="bg-primary text-white text-xs font-bold px-2 py-1 rounded cursor-help hover:bg-red-500 transition-colors flex items-center gap-1"
                >
                  Viral Skor: {video.viralScore.toFixed(1)} <Info className="w-3 h-3 opacity-70" />
                </div>
                {showViralInfo && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg p-3 shadow-xl z-10">
                    <p className="text-[11px] text-foreground font-semibold mb-1">
                      Viral Skor: {video.viralScore.toFixed(1)}/10 ({getViralLabel(video.viralScore)})
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
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
                    {video.format} <Info className="w-3 h-3 opacity-70" />
                  </div>
                  {showFormatInfo && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-card border border-border rounded-lg p-3 shadow-xl z-10">
                      <p className="text-[11px] text-foreground font-semibold mb-1">
                        Video Formatı: {video.format}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Videonun içerik türünü belirtir (Tutorial, POV, Challenge, GRWM vb.). Format, videonun yapısını ve sunum tarzını gösterir.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-4 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{video.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card-light rounded-lg p-3 text-center">
                  <Eye className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{formatNumber(video.views)}</p>
                  <p className="text-[10px] text-muted-foreground">Görüntülenme</p>
                </div>
                <div className="bg-card-light rounded-lg p-3 text-center">
                  <Heart className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{formatNumber(video.likes)}</p>
                  <p className="text-[10px] text-muted-foreground">Beğeni</p>
                </div>
                <div className="bg-card-light rounded-lg p-3 text-center">
                  <MessageCircle className="w-4 h-4 text-teal mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{formatNumber(video.comments)}</p>
                  <p className="text-[10px] text-muted-foreground">Yorum</p>
                </div>
                <div className="bg-card-light rounded-lg p-3 text-center">
                  <Share2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{formatNumber(video.shares)}</p>
                  <p className="text-[10px] text-muted-foreground">Paylaşım</p>
                </div>
              </div>

              {/* Engagement, Duration & Creator Presence */}
              <div className="flex gap-3">
                <div
                  className="flex-1 bg-primary/10 rounded-lg p-2 text-center cursor-help relative"
                  onClick={() => setShowEngagementInfo(!showEngagementInfo)}
                >
                  <p className="text-sm font-bold text-primary flex items-center justify-center gap-1">
                    %{video.engagementRate.toFixed(2)} <Info className="w-3 h-3 opacity-50" />
                  </p>
                  <p className="text-[10px] text-muted-foreground">Etkileşim Oranı</p>
                  {showEngagementInfo && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-card border border-border rounded-lg p-3 shadow-xl z-10 text-left">
                      <p className="text-[11px] text-foreground font-semibold mb-1">
                        Etkileşim Oranı: %{video.engagementRate.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        (Beğeni + Yorum + Paylaşım) / Görüntülenme oranıdır. Yüksek oran, izleyicilerin videoyla daha fazla etkileşime girdiğini gösterir.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-card-light rounded-lg p-2 text-center">
                  <p className="text-sm font-bold text-foreground">{formatDuration(video.duration)}</p>
                  <p className="text-[10px] text-muted-foreground">Süre</p>
                </div>
                {video.creatorPresenceScore != null && (
                  <div
                    className={`flex-1 rounded-lg p-2 text-center cursor-help relative ${
                      video.creatorPresenceScore >= 70 ? "bg-teal/10" : "bg-card-light"
                    }`}
                    onClick={() => setShowPresenceInfo(!showPresenceInfo)}
                  >
                    <p className={`text-sm font-bold flex items-center justify-center gap-1 ${
                      video.creatorPresenceScore >= 70 ? "text-teal" : "text-muted-foreground"
                    }`}>
                      {video.creatorPresenceScore} <Info className="w-3 h-3 opacity-50" />
                    </p>
                    <p className="text-[10px] text-muted-foreground">Oluşturucu Skoru</p>
                    {showPresenceInfo && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-card border border-border rounded-lg p-3 shadow-xl z-10 text-left">
                        <p className="text-[11px] text-foreground font-semibold mb-1">
                          İçerik Üretici Skoru: {video.creatorPresenceScore}/100 ({getPresenceLabel(video.creatorPresenceScore)})
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
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
                    video.likeRatio >= 8 ? "bg-teal/10" : "bg-card-light"
                  }`}>
                    <p className={`text-sm font-bold ${
                      video.likeRatio >= 8 ? "text-teal" : video.likeRatio >= 4 ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      %{video.likeRatio.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Beğeni Oranı</p>
                  </div>
                )}
                {video.adFormat && (
                  <div className="flex-1 bg-orange-400/10 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-orange-400">{video.adFormat}</p>
                    <p className="text-[10px] text-muted-foreground">Reklam Formatı</p>
                  </div>
                )}
              </div>

              {/* Sound */}
              {video.soundName && (
                <div className="flex items-center gap-2 bg-card-light rounded-lg p-2">
                  <Music className="w-4 h-4 text-teal shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground truncate">{video.soundName}</p>
                    <p className="text-[10px] text-muted-foreground">{video.soundCreator}</p>
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
                  <BarChart2 className="w-4 h-4" />
                  Video Analitikleri
                </button>
                <a
                  href={video.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
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
