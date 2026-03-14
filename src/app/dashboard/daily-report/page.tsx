"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  BarChart2,
  Eye,
  TrendingUp,
  Hash,
  Music,
  Play,
  Calendar,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Heart,
  Clock,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function getThumbnailUrl(url: string): string {
  if (!url) return "/images/placeholder-video.jpg";
  if (url.includes("tiktokcdn") || url.includes("tikwm") || url.includes("muscdn")) {
    return `/api/thumbnail?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

const PIE_COLORS = ["#FF3B5C", "#2dd4bf", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6", "#34d399", "#fb923c"];

interface DailyReport {
  date: string;
  stats: {
    totalVideos: number;
    recentVideos: number;
    totalViews: number;
    avgViews: number;
    avgEngagement: number;
    topCategory: string;
  };
  topVideos: Array<{
    id: string;
    creator: string;
    description: string;
    thumbnailUrl: string;
    tiktokUrl: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    format: string;
    category: string;
  }>;
  trendingHashtags: Array<{
    tag: string;
    count: number;
    oldCount: number;
    growth: number;
  }>;
  trendingSounds: Array<{
    name: string;
    creator: string;
    videoCount: number;
    totalViews: number;
  }>;
  emergingFormats: Array<{
    format: string;
    count: number;
    oldCount: number;
    growth: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

interface CommentStats {
  stats: {
    totalComments: number;
    totalViews: number;
    avgCommentRate: number;
    videoCount: number;
  };
  categoryStats: Array<{
    category: string;
    videoCount: number;
    totalComments: number;
    avgCommentRate: number;
  }>;
}

function DailyReportContent() {
  const [data, setData] = useState<DailyReport | null>(null);
  const [commentStats, setCommentStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    Promise.all([
      fetch("/api/trends/daily-report").then((r) => r.json()),
      fetch("/api/trends/comments").then((r) => r.json()).catch(() => null),
    ])
      .then(([reportData, commentData]) => {
        if (!reportData.error || reportData.stats) setData(reportData);
        if (commentData?.stats) setCommentStats(commentData);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 shimmer rounded-xl" />
          ))}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <BarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Rapor verisi bulunamadı</p>
      </div>
    );
  }

  const reportDate = new Date(data.date).toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Insights generation
  const insights: string[] = [];
  if (data.stats.avgEngagement > 5) {
    insights.push("Ortalama etkileşim oranı yüksek — kaliteli içerikler trend oluyor.");
  }
  if (data.trendingHashtags.length > 0 && data.trendingHashtags[0].growth > 50) {
    insights.push(`"${data.trendingHashtags[0].tag}" hashtag'i hızla büyüyor (+${data.trendingHashtags[0].growth}%).`);
  }
  if (data.emergingFormats.length > 0 && data.emergingFormats[0].growth > 30) {
    insights.push(`"${data.emergingFormats[0].format}" formatı popülerleşiyor — bu formatta içerik üretmeyi deneyin.`);
  }
  if (data.stats.recentVideos > 0) {
    insights.push(`Son 24 saatte ${data.stats.recentVideos} yeni trend video tespit edildi.`);
  }
  if (commentStats && commentStats.stats.avgCommentRate > 0.5) {
    insights.push(`Ortalama yorum oranı %${commentStats.stats.avgCommentRate} — izleyiciler aktif olarak tartışıyor.`);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="text-primary" />
            Günlük Trend Raporu
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {reportDate}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Günün Öne Çıkan Bulguları
          </h3>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                {insight}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={<Play />} label="Toplam Video" value={data.stats.totalVideos.toString()} color="text-primary" />
        <StatCard icon={<Clock />} label="Son 24 Saat" value={data.stats.recentVideos.toString()} color="text-teal" />
        <StatCard icon={<Eye />} label="Toplam İzlenme" value={formatNumber(data.stats.totalViews)} color="text-blue-400" />
        <StatCard icon={<TrendingUp />} label="Ort. İzlenme" value={formatNumber(data.stats.avgViews)} color="text-purple-400" />
        <StatCard icon={<Heart />} label="Ort. Etkileşim" value={`%${data.stats.avgEngagement}`} color="text-primary" />
        <StatCard icon={<BarChart2 />} label="Top Kategori" value={data.stats.topCategory} color="text-teal" />
      </div>

      {/* Comment Stats */}
      {commentStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-teal" />
              <span className="text-[10px] text-muted-foreground uppercase">Toplam Yorum</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatNumber(commentStats.stats.totalComments)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] text-muted-foreground uppercase">Ort. Yorum Oranı</span>
            </div>
            <p className="text-lg font-bold text-foreground">%{commentStats.stats.avgCommentRate}</p>
          </div>
          {commentStats.categoryStats.slice(0, 2).map((cat) => (
            <div key={cat.category} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] text-muted-foreground uppercase truncate">{cat.category}</span>
              </div>
              <p className="text-lg font-bold text-foreground">%{cat.avgCommentRate}</p>
              <p className="text-[10px] text-muted-foreground">{cat.totalComments} yorum</p>
            </div>
          ))}
        </div>
      )}

      {/* Top Videos */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          En Viral 10 Video
        </h3>
        <div className="space-y-1">
          {data.topVideos.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <span className="text-lg font-bold text-muted-foreground w-6 text-right shrink-0">{i + 1}</span>
              <div className="w-10 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                <img src={getThumbnailUrl(video.thumbnailUrl)} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground font-medium truncate">@{video.creator}</p>
                <p className="text-[10px] text-muted-foreground truncate">{video.description}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal/10 text-teal">{video.format}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{video.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Eye className="w-3 h-3" /> {formatNumber(video.views)}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Heart className="w-3 h-3" /> {formatNumber(video.likes)}
                </span>
                <span className="text-xs text-primary font-medium">%{video.engagementRate}</span>
              </div>
              <div className="flex sm:hidden flex-col items-end gap-0.5 shrink-0">
                <span className="text-[10px] text-muted-foreground">{formatNumber(video.views)}</span>
                <span className="text-[10px] text-primary font-medium">%{video.engagementRate}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Hashtags + Sounds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4 text-teal" />
            En Hızlı Büyüyen Hashtag&apos;ler
          </h3>
          <div className="space-y-1">
            {data.trendingHashtags.map((ht, i) => (
              <div key={ht.tag} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <span className="text-xs text-teal flex-1 truncate">{ht.tag}</span>
                <span className="text-[10px] text-muted-foreground">{ht.count} video</span>
                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${ht.growth > 0 ? "text-teal" : ht.growth < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {ht.growth > 0 ? <ArrowUp className="w-2.5 h-2.5" /> : ht.growth < 0 ? <ArrowDown className="w-2.5 h-2.5" /> : null}
                  {ht.growth > 0 ? "+" : ""}{ht.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            Trend Sesler
          </h3>
          <div className="space-y-1">
            {data.trendingSounds.map((sound, i) => (
              <div key={sound.name + i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{sound.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{sound.creator}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{sound.videoCount} video</span>
                <span className="text-[10px] text-muted-foreground">
                  <Eye className="w-2.5 h-2.5 inline mr-0.5" />{formatNumber(sound.totalViews)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formats + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            Yükselen İçerik Formatları
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.emergingFormats} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="format" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={30} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                  formatter={(v, name) => {
                    if (name === "count") return [v, "Bu hafta"];
                    if (name === "oldCount") return [v, "Geçen hafta"];
                    return [v, String(name)];
                  }}
                />
                <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="count" />
                <Bar dataKey="oldCount" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="oldCount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {data.categoryDistribution && data.categoryDistribution.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              Kategori Dağılımı
            </h3>
            <div className="h-52 flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryDistribution.slice(0, 8)}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={35}
                      strokeWidth={0}
                    >
                      {data.categoryDistribution.slice(0, 8).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                      formatter={(v, name) => [`${v} video`, String(name)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-1.5">
                {data.categoryDistribution.slice(0, 8).map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-[11px] text-muted-foreground truncate">{cat.category}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">%{cat.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comment Category Stats */}
      {commentStats && commentStats.categoryStats.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-teal" />
            Kategorilere Göre Yorum Analizi
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commentStats.categoryStats.slice(0, 8)} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={35} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                  formatter={(v, name) => {
                    if (name === "avgCommentRate") return [`%${v}`, "Yorum Oranı"];
                    return [v, String(name)];
                  }}
                />
                <Bar dataKey="avgCommentRate" fill="#FF3B5C" radius={[4, 4, 0, 0]} name="avgCommentRate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <div className={`flex items-center gap-1.5 mb-1 ${color}`}>
        <span className="w-3.5 h-3.5">{icon}</span>
        <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
      </div>
      <p className={`text-lg font-bold ${color} truncate`}>{value}</p>
    </div>
  );
}

export default function DailyReportPage() {
  return (
    <PremiumGate featureName="Günlük Trend Raporu">
      <DailyReportContent />
    </PremiumGate>
  );
}
