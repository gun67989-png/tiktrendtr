"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiHeart, FiMessageCircle, FiClock, FiUser, FiX } from "react-icons/fi";

export interface VideoData {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  likeRatio?: number;
  viralScore: number;
  duration: number;
  format: string | null;
  adFormat?: string | null;
  category: string | null;
  contentType?: string;
  creatorPresenceScore?: number;
  publishedAt: string;
  soundName: string | null;
  soundCreator: string | null;
  hashtags: string[];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
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
  if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
  return `${Math.floor(days / 30)} ay önce`;
}

function getViralScoreLabel(score: number): string {
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

// Tooltip component that shows on click
function BadgeTooltip({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-surface border border-border rounded-lg p-2.5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-1 right-1 text-text-muted hover:text-text-primary"
        >
          <FiX className="w-3 h-3" />
        </button>
        <p className="text-[11px] text-text-secondary leading-relaxed pr-3">{text}</p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-surface border-r border-b border-border" />
      </motion.div>
    </AnimatePresence>
  );
}

export default function VideoCard({
  video,
  onSelect,
  index = 0,
}: {
  video: VideoData;
  onSelect?: (video: VideoData) => void;
  index?: number;
}) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => { setActiveTooltip(null); onSelect?.(video); }}
      className="bg-surface rounded-xl border border-border overflow-hidden cursor-pointer hover:border-neon-red/30 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] max-h-[280px] overflow-hidden bg-surface-light">
        <img
          src={video.thumbnailUrl}
          alt={video.description}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
          <FiClock className="w-2.5 h-2.5" />
          {formatDuration(video.duration)}
        </div>

        {/* Viral score badge - clickable with tooltip */}
        <div className="absolute top-2 left-2 relative">
          <div
            onClick={(e) => toggleTooltip("viral", e)}
            className="bg-neon-red/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded cursor-help hover:bg-neon-red transition-colors"
          >
            {video.viralScore.toFixed(0)}
          </div>
          {activeTooltip === "viral" && (
            <BadgeTooltip
              text={`Viral Skor: ${video.viralScore.toFixed(1)}/10 (${getViralScoreLabel(video.viralScore)}). Etkileşim oranı, görüntülenme sayısı ve içerik üretici puanına göre hesaplanır.`}
              onClose={() => setActiveTooltip(null)}
            />
          )}
        </div>

        {/* Format badge - clickable with tooltip */}
        {video.format && (
          <div className="absolute bottom-12 left-2 relative">
            <div
              onClick={(e) => toggleTooltip("format", e)}
              className="bg-teal/80 text-white text-[10px] px-1.5 py-0.5 rounded cursor-help hover:bg-teal transition-colors"
            >
              {video.format}
            </div>
            {activeTooltip === "format" && (
              <BadgeTooltip
                text={`Video Formatı: ${video.format}. Videonun içerik türünü belirtir (Tutorial, POV, Challenge vb.)`}
                onClose={() => setActiveTooltip(null)}
              />
            )}
          </div>
        )}

        {/* Creator Presence badge - clickable with tooltip */}
        {video.creatorPresenceScore != null && (
          <div className="absolute bottom-12 right-2 relative">
            <div
              onClick={(e) => toggleTooltip("presence", e)}
              className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 cursor-help transition-colors ${
                video.creatorPresenceScore >= 70
                  ? "bg-teal/80 text-white hover:bg-teal"
                  : video.creatorPresenceScore >= 40
                  ? "bg-surface-lighter/80 text-text-secondary hover:bg-surface-lighter"
                  : "bg-black/50 text-text-muted hover:bg-black/70"
              }`}
            >
              <FiUser className="w-2.5 h-2.5" />
              {video.creatorPresenceScore}
            </div>
            {activeTooltip === "presence" && (
              <BadgeTooltip
                text={`İçerik Üretici Skoru: ${video.creatorPresenceScore}/100 (${getPresenceLabel(video.creatorPresenceScore)}). Videoda gerçek bir kişinin kamera karşısında görünme olasılığını tahmin eder.`}
                onClose={() => setActiveTooltip(null)}
              />
            )}
          </div>
        )}

        {/* Bottom stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
          <div className="flex items-center gap-2 text-white/90 text-[10px]">
            <span className="flex items-center gap-0.5"><FiEye className="w-2.5 h-2.5" />{formatNumber(video.views)}</span>
            <span className="flex items-center gap-0.5"><FiHeart className="w-2.5 h-2.5" />{formatNumber(video.likes)}</span>
            <span className="flex items-center gap-0.5"><FiMessageCircle className="w-2.5 h-2.5" />{formatNumber(video.comments)}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full gradient-red flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {video.creator[0].toUpperCase()}
          </div>
          <span className="text-xs text-text-primary font-medium truncate">@{video.creator}</span>
        </div>
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{video.description}</p>

        {/* Hashtags */}
        {video.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.hashtags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ad format badge */}
        {video.adFormat && (
          <div className="flex items-center">
            <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded font-medium">
              {video.adFormat}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[10px] text-text-muted">{timeAgo(video.publishedAt)}</span>
          <div className="flex items-center gap-2">
            {video.likeRatio != null && (
              <span className={`text-[10px] font-medium ${
                video.likeRatio >= 8 ? "text-teal" : video.likeRatio >= 4 ? "text-text-secondary" : "text-text-muted"
              }`}>
                <FiHeart className="w-2.5 h-2.5 inline mr-0.5" />%{video.likeRatio.toFixed(1)}
              </span>
            )}
            <span className="text-[10px] text-neon-red font-medium">%{video.engagementRate.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
