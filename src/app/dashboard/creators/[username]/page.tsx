"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  User,
  Eye,
  Heart,
  MessageCircle,
  Play,
  Clock,
  Hash,
  Music,
  ArrowLeft,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import VideoCard, { VideoData } from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const PIE_COLORS = ["#FF3B5C", "#2dd4bf", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6", "#34d399", "#fb923c"];

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

interface CreatorProfile {
  username: string;
  nickname: string;
  followerCount: number;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  avgPresenceScore: number;
  avgDuration: number;
  topCategory: string;
}

interface CategoryDist {
  category: string;
  count: number;
  percentage: number;
}

interface SoundInfo {
  name: string;
  creator: string;
  count: number;
}

interface HashtagInfo {
  tag: string;
  count: number;
}

interface CommentPatterns {
  avgCommentRate: number;
  bestCommentVideo: number;
  worstCommentVideo: number;
  commentTrend: string;
  overallDepth: string;
  insights: string[];
}

export default function CreatorDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [categories, setCategories] = useState<CategoryDist[]>([]);
  const [sounds, setSounds] = useState<SoundInfo[]>([]);
  const [topHashtags, setTopHashtags] = useState<HashtagInfo[]>([]);
  const [commentPatterns, setCommentPatterns] = useState<CommentPatterns | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch(`/api/trends/creators/${username}`).then((r) => r.json()),
      fetch(`/api/trends/comments?username=${username}`).then((r) => r.json()).catch(() => null),
    ])
      .then(([creatorData, commentData]) => {
        if (creatorData.profile) {
          setProfile(creatorData.profile);
          setVideos(creatorData.videos || []);
          setCategories(creatorData.categories || []);
          setSounds(creatorData.sounds || []);
          setTopHashtags(creatorData.topHashtags || []);
        }
        if (commentData?.patterns) {
          setCommentPatterns(commentData.patterns);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="h-48 shimmer rounded-xl" />
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">İçerik üretici bulunamadı</p>
        <button
          onClick={() => router.push("/dashboard/creators")}
          className="mt-4 text-primary text-sm hover:underline"
        >
          Geri dön
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/creators")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Tüm Üreticiler
      </button>

      {/* Profile header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {profile.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">@{profile.username}</h1>
            <p className="text-sm text-muted-foreground">{profile.nickname}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                {profile.topCategory}
              </span>
              {profile.followerCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {formatNumber(profile.followerCount)} takipçi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          <StatCard icon={<Play className="w-4 h-4" />} label="Video" value={profile.videoCount.toString()} />
          <StatCard icon={<Eye className="w-4 h-4" />} label="Görüntülenme" value={formatNumber(profile.totalViews)} />
          <StatCard icon={<Heart className="w-4 h-4" />} label="Beğeni" value={formatNumber(profile.totalLikes)} />
          <StatCard icon={<MessageCircle className="w-4 h-4" />} label="Yorum" value={formatNumber(profile.totalComments)} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Etkileşim" value={`%${profile.engagementRate.toFixed(1)}`} highlight />
          <StatCard icon={<Clock className="w-4 h-4" />} label="Ort. Süre" value={formatDuration(profile.avgDuration)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        {categories.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Kategori Dağılımı
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="count"
                    nameKey="category"
                    label={({ name, payload }) => `${name} %${payload?.percentage ?? ""}`}
                    labelLine={false}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Comment Analysis */}
        {commentPatterns && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-teal" />
              Yorum Analizi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ort. Yorum Oranı</span>
                <span className="text-sm font-semibold text-foreground">%{commentPatterns.avgCommentRate.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Yorum Trendi</span>
                <span className={`text-sm font-semibold ${
                  commentPatterns.commentTrend === "artıyor" ? "text-teal" : commentPatterns.commentTrend === "azalıyor" ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {commentPatterns.commentTrend === "artıyor" ? "Artıyor" : commentPatterns.commentTrend === "azalıyor" ? "Azalıyor" : "Sabit"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Etkileşim Derinliği</span>
                <span className="text-sm font-semibold text-foreground capitalize">{commentPatterns.overallDepth}</span>
              </div>
              {commentPatterns.insights.length > 0 && (
                <div className="pt-2 border-t border-border/50 space-y-1.5">
                  {commentPatterns.insights.map((insight, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">
                      • {insight}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Hashtags */}
        {topHashtags.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-teal" />
              En Çok Kullanılan Hashtag&apos;ler
            </h3>
            <div className="space-y-2">
              {topHashtags.slice(0, 8).map((h) => (
                <div key={h.tag} className="flex items-center justify-between">
                  <span className="text-xs text-teal">{h.tag}</span>
                  <span className="text-xs text-muted-foreground">{h.count} video</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sounds used */}
        {sounds.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              Kullanılan Sesler
            </h3>
            <div className="space-y-2">
              {sounds.slice(0, 8).map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-foreground truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{s.creator}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">{s.count}x</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Videos */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Videolar ({videos.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={(v) => setSelectedVideo(v)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      <div className={`flex items-center justify-center gap-1 mb-1 ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
        <span className="text-[10px]">{label}</span>
      </div>
      <p className={`text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
