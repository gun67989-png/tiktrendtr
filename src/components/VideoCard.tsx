"use client";

import { motion } from "framer-motion";
import { FiEye, FiHeart, FiMessageCircle, FiClock, FiUser } from "react-icons/fi";

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
  viralScore: number;
  duration: number;
  format: string | null;
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

export default function VideoCard({
  video,
  onSelect,
  index = 0,
}: {
  video: VideoData;
  onSelect?: (video: VideoData) => void;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => onSelect?.(video)}
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

        {/* Viral score badge */}
        <div className="absolute top-2 left-2 bg-neon-red/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {video.viralScore.toFixed(0)}
        </div>

        {/* Format badge */}
        {video.format && (
          <div className="absolute bottom-12 left-2 bg-teal/80 text-white text-[10px] px-1.5 py-0.5 rounded">
            {video.format}
          </div>
        )}

        {/* Creator Presence badge */}
        {video.creatorPresenceScore != null && (
          <div className={`absolute bottom-12 right-2 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
            video.creatorPresenceScore >= 70
              ? "bg-teal/80 text-white"
              : video.creatorPresenceScore >= 40
              ? "bg-surface-lighter/80 text-text-secondary"
              : "bg-black/50 text-text-muted"
          }`}>
            <FiUser className="w-2.5 h-2.5" />
            {video.creatorPresenceScore}
          </div>
        )}

        {/* Bottom stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-3 text-white/90 text-[11px]">
            <span className="flex items-center gap-1"><FiEye className="w-3 h-3" />{formatNumber(video.views)}</span>
            <span className="flex items-center gap-1"><FiHeart className="w-3 h-3" />{formatNumber(video.likes)}</span>
            <span className="flex items-center gap-1"><FiMessageCircle className="w-3 h-3" />{formatNumber(video.comments)}</span>
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[10px] text-text-muted">{timeAgo(video.publishedAt)}</span>
          <span className="text-[10px] text-neon-red font-medium">%{video.engagementRate.toFixed(1)} etkileşim</span>
        </div>
      </div>
    </motion.div>
  );
}
