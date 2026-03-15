"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  Search,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Hash,
  BarChart2,
  TrendingUp,
  Play,
  GitCompareArrows,
  Trophy,
  Lightbulb,
  Loader2,
  ArrowRight,
  Crown,
  Swords,
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
  return `${Math.floor(days / 7)} hafta önce`;
}

const PIE_COLORS = ["#ff3b5c", "#00d4aa", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6", "#34d399", "#fb923c"];

interface CompetitorData {
  username: string;
  isExactMatch: boolean;
  videoCount: number;
  error?: string;
  stats: {
    totalViews: number;
    avgViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    avgEngagementRate: number;
    avgDuration: number;
  };
  topVideos: Array<{
    id: string;
    description: string;
    creator: string;
    thumbnailUrl: string;
    tiktokUrl: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    duration: number;
    format: string;
    hashtags: string[];
    publishedAt: string;
  }>;
  topHashtags: Array<{ tag: string; count: number }>;
  formatDistribution: Array<{ format: string; count: number; percentage: number }>;
  postingHours: Array<{ hour: number; count: number }>;
  bestHours: number[];
}

interface ComparisonCommentary {
  winner: string;
  summary: string;
  categories: Array<{
    name: string;
    winner: string;
    comment: string;
  }>;
  tips: string[];
}

// ─── Tab: Tek Kullanıcı Analizi ───
function SingleAnalysis() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/competitor?username=${encodeURIComponent(username.trim())}`);
      const result = await res.json();
      if (result.error && !result.stats) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch {
      setError("Bir hata olustu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="@kullaniciadi girin..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !username.trim()}
          className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analiz ediliyor..." : "Analiz Et"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 h-24 shimmer" />
            ))}
          </div>
          <div className="h-64 shimmer rounded-xl" />
        </div>
      )}

      {error && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <p className="text-sm text-primary">{error}</p>
        </div>
      )}

      {data && data.stats && <AnalysisResults data={data} />}

      {!data && !loading && !error && (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Bir TikTok kullanici adi girerek analiz baslatin</p>
          <p className="text-muted-foreground text-xs mt-1">Ornek: @kullaniciadi</p>
        </div>
      )}
    </div>
  );
}

// ─── Reusable Analysis Results ───
function AnalysisResults({ data }: { data: CompetitorData }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Username banner */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
          {data.username[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">@{data.username}</h2>
          <p className="text-xs text-muted-foreground">
            {data.videoCount} video analiz edildi
            {!data.isExactMatch && " (arama sonuclari)"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Toplam Goruntulenme", value: formatNumber(data.stats.totalViews), icon: Eye, color: "text-blue-400" },
          { label: "Ort. Goruntulenme", value: formatNumber(data.stats.avgViews), icon: TrendingUp, color: "text-teal" },
          { label: "Ort. Etkilesim", value: `%${data.stats.avgEngagementRate}`, icon: BarChart2, color: "text-purple-400" },
          { label: "Ort. Sure", value: formatDuration(data.stats.avgDuration), icon: Clock, color: "text-orange-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase">{stat.label}</span>
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Additional stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Heart className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{formatNumber(data.stats.totalLikes)}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Begeni</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <MessageCircle className="w-5 h-5 text-teal mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{formatNumber(data.stats.totalComments)}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Yorum</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{formatNumber(data.stats.totalShares)}</p>
          <p className="text-[10px] text-muted-foreground">Toplam Paylasim</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posting Hours */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Paylasim Saatleri</h3>
          <p className="text-[10px] text-muted-foreground mb-4">
            En iyi saatler: {data.bestHours.map((h) => `${h}:00`).join(", ")}
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.postingHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="hour" tick={{ fill: "#555570", fontSize: 10 }} tickFormatter={(h) => `${h}:00`} />
                <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                  labelFormatter={(h) => `${h}:00`}
                  formatter={(v) => [v, "Video"]}
                />
                <Bar dataKey="count" fill="#00d4aa" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Format Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Icerik Formati Dagilimi</h3>
          <div className="h-48 flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.formatDistribution}
                    dataKey="count"
                    nameKey="format"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    strokeWidth={0}
                  >
                    {data.formatDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                    formatter={(v, name) => [`${v} video`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5">
              {data.formatDistribution.slice(0, 6).map((f, i) => (
                <div key={f.format} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-[11px] text-muted-foreground truncate">{f.format}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">%{f.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Hashtags */}
      {data.topHashtags.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            <Hash className="w-4 h-4 inline mr-1" />
            En Cok Kullanilan Hashtag&apos;ler
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.topHashtags.map((ht) => (
              <span key={ht.tag} className="text-xs bg-teal/10 text-teal px-3 py-1.5 rounded-lg">
                {ht.tag} <span className="text-muted-foreground ml-1">({ht.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Videos */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          <Play className="w-4 h-4 inline mr-1" />
          En Iyi Performans Gosteren Videolar
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {data.topVideos.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-border/80 transition-all group"
            >
              <div className="relative aspect-[9/16] max-h-[220px] overflow-hidden bg-muted">
                <img
                  src={getThumbnailUrl(video.thumbnailUrl)}
                  alt={video.description}
                  className="w-full h-full object-cover transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (!t.dataset.retried) { t.dataset.retried = "1"; t.src = `https://picsum.photos/seed/${video.id?.slice(-6) || "def"}/400/700`; }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 bg-teal/80 text-white text-[9px] px-1.5 py-0.5 rounded">
                  {video.format}
                </div>
                {video.duration > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDuration(video.duration)}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1">
                  <span className="text-white/90 text-[9px] flex items-center gap-0.5">
                    <Eye className="w-2.5 h-2.5" />{formatNumber(video.views)}
                  </span>
                </div>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{video.description || "—"}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] text-muted-foreground">{timeAgo(video.publishedAt)}</span>
                  <span className="text-[9px] text-primary flex items-center gap-0.5">
                    <Heart className="w-2.5 h-2.5" />{formatNumber(video.likes)}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tab: Karşılaştırma ───
function CompareAnalysis() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [data1, setData1] = useState<CompetitorData | null>(null);
  const [data2, setData2] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentary, setCommentary] = useState<ComparisonCommentary | null>(null);
  const [commentaryLoading, setCommentaryLoading] = useState(false);

  // Fallback: generate local comparison when AI is unavailable
  function generateLocalCommentary(r1: CompetitorData, r2: CompetitorData): ComparisonCommentary {
    const s1 = r1.stats;
    const s2 = r2.stats;
    const u1 = `@${r1.username}`;
    const u2 = `@${r2.username}`;

    // Determine category winners
    const viewsWinner = s1.totalViews > s2.totalViews ? u1 : u2;
    const viewsLoser = viewsWinner === u1 ? u2 : u1;
    const viewsDiff = Math.abs(s1.totalViews - s2.totalViews);
    const viewsRatio = Math.max(s1.totalViews, s2.totalViews) / Math.max(Math.min(s1.totalViews, s2.totalViews), 1);

    const engWinner = s1.avgEngagementRate > s2.avgEngagementRate ? u1 : u2;
    const engLoser = engWinner === u1 ? u2 : u1;
    const engHigh = Math.max(s1.avgEngagementRate, s2.avgEngagementRate);
    const engLow = Math.min(s1.avgEngagementRate, s2.avgEngagementRate);

    const likesWinner = s1.totalLikes > s2.totalLikes ? u1 : u2;
    const commentsWinner = s1.totalComments > s2.totalComments ? u1 : u2;
    const sharesWinner = s1.totalShares > s2.totalShares ? u1 : u2;

    const format1 = r1.formatDistribution[0]?.format || "Kısa Video";
    const format2 = r2.formatDistribution[0]?.format || "Kısa Video";

    const hours1 = r1.bestHours.map(h => `${h}:00`).join(", ");
    const hours2 = r2.bestHours.map(h => `${h}:00`).join(", ");

    // Score: who wins more categories
    let score1 = 0, score2 = 0;
    if (s1.totalViews > s2.totalViews) score1++; else score2++;
    if (s1.avgEngagementRate > s2.avgEngagementRate) score1++; else score2++;
    if (s1.totalLikes > s2.totalLikes) score1++; else score2++;
    if (s1.totalComments > s2.totalComments) score1++; else score2++;
    if (s1.totalShares > s2.totalShares) score1++; else score2++;
    const overallWinner = score1 >= score2 ? u1 : u2;
    const overallLoser = overallWinner === u1 ? u2 : u1;

    return {
      winner: overallWinner,
      summary: `${overallWinner} genel performansta ${overallLoser}'e gore daha basarili gorunuyor (${Math.max(score1, score2)}/5 kategoride onde). ${viewsWinner} toplam goruntulenme acisindan ${formatNumber(viewsDiff)} farkla lider durumda (${viewsRatio.toFixed(1)}x). Etkilesim oraninda ise ${engWinner} %${engHigh} ile ${engLoser}'in %${engLow}'lik oraninin ustunde. Bu farklar icerik stratejisi, hedef kitle uyumu ve paylasim zamanlama farkliliklarindan kaynaklanabilir.`,
      categories: [
        {
          name: "Erisim Gucu",
          winner: viewsWinner,
          comment: `${viewsWinner} toplam ${formatNumber(Math.max(s1.totalViews, s2.totalViews))} goruntulenmeyle ${viewsLoser}'in ${formatNumber(Math.min(s1.totalViews, s2.totalViews))} goruntulenme rakaminin ${viewsRatio.toFixed(1)} kati erisime sahip. Bu daha genis bir kitleye ulastigini gosteriyor.`,
        },
        {
          name: "Etkilesim Kalitesi",
          winner: engWinner,
          comment: `${engWinner} %${engHigh} etkilesim oraniyla ${engLoser}'in %${engLow}'lik oraninin ustunde. Bu, kitlesinin icerikle daha fazla etkilesime girdigini gosteriyor. ${likesWinner} begenilerde, ${commentsWinner} yorumlarda, ${sharesWinner} paylasimlarda onde.`,
        },
        {
          name: "Icerik Stratejisi",
          winner: overallWinner,
          comment: `${u1} agirlikli olarak "${format1}" formati kullanirken, ${u2} "${format2}" formatina yoneliyor. ${overallWinner}'in icerik formati secimi hedef kitlesiyle daha uyumlu gorunuyor.`,
        },
        {
          name: "Paylasim Zamanlama",
          winner: overallWinner,
          comment: `${u1} en cok ${hours1} saatlerinde, ${u2} ise ${hours2} saatlerinde paylasiyor. Dogru zamanlama, icerik erisimini dogrudan etkileyen onemli bir faktor.`,
        },
      ],
      tips: [
        `${overallLoser} etkilesimi artirmak icin ${overallWinner}'in icerik formatindan ilham alabilir.`,
        `Her iki hesap da hashtag stratejisini cakisan trendlere gore optimize etmeli.`,
        `Paylasim saatlerini hedef kitlenin en aktif oldugu saatlere kaydirmak erisimi artirabilir.`,
      ],
    };
  }

  const handleCompare = async () => {
    if (!username1.trim() || !username2.trim()) return;
    setLoading(true);
    setError("");
    setData1(null);
    setData2(null);
    setCommentary(null);

    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/competitor?username=${encodeURIComponent(username1.trim())}`),
        fetch(`/api/competitor?username=${encodeURIComponent(username2.trim())}`),
      ]);

      const [result1, result2] = await Promise.all([res1.json(), res2.json()]);

      if (result1.error && !result1.stats) {
        setError(`@${username1.trim()}: ${result1.error}`);
        setLoading(false);
        return;
      }
      if (result2.error && !result2.stats) {
        setError(`@${username2.trim()}: ${result2.error}`);
        setLoading(false);
        return;
      }

      setData1(result1);
      setData2(result2);
      setLoading(false);

      // Fetch AI commentary, fallback to local analysis
      setCommentaryLoading(true);
      try {
        const compareRes = await fetch("/api/competitor/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user1: {
              username: result1.username,
              videoCount: result1.videoCount,
              totalViews: result1.stats.totalViews,
              avgViews: result1.stats.avgViews,
              totalLikes: result1.stats.totalLikes,
              totalComments: result1.stats.totalComments,
              totalShares: result1.stats.totalShares,
              avgEngagementRate: result1.stats.avgEngagementRate,
              avgDuration: result1.stats.avgDuration,
              topHashtags: result1.topHashtags.slice(0, 5).map((h: { tag: string }) => h.tag),
              bestHours: result1.bestHours,
              topFormat: result1.formatDistribution[0]?.format || "Kısa Video",
            },
            user2: {
              username: result2.username,
              videoCount: result2.videoCount,
              totalViews: result2.stats.totalViews,
              avgViews: result2.stats.avgViews,
              totalLikes: result2.stats.totalLikes,
              totalComments: result2.stats.totalComments,
              totalShares: result2.stats.totalShares,
              avgEngagementRate: result2.stats.avgEngagementRate,
              avgDuration: result2.stats.avgDuration,
              topHashtags: result2.topHashtags.slice(0, 5).map((h: { tag: string }) => h.tag),
              bestHours: result2.bestHours,
              topFormat: result2.formatDistribution[0]?.format || "Kısa Video",
            },
          }),
        });
        const compareResult = await compareRes.json();
        if (compareResult.commentary) {
          setCommentary(compareResult.commentary);
        } else {
          // AI returned no commentary, use local fallback
          setCommentary(generateLocalCommentary(result1, result2));
        }
      } catch {
        // AI unavailable, generate local comparison
        setCommentary(generateLocalCommentary(result1, result2));
      } finally {
        setCommentaryLoading(false);
      }
    } catch {
      setError("Bir hata olustu. Tekrar deneyin.");
      setLoading(false);
    }
  };

  const getWinnerColor = (val1: number, val2: number) => {
    if (val1 > val2) return { c1: "text-teal", c2: "text-muted-foreground" };
    if (val2 > val1) return { c1: "text-muted-foreground", c2: "text-teal" };
    return { c1: "text-foreground", c2: "text-foreground" };
  };

  const getBarWidth = (val1: number, val2: number) => {
    const total = val1 + val2;
    if (total === 0) return { w1: 50, w2: 50 };
    return { w1: Math.round((val1 / total) * 100), w2: Math.round((val2 / total) * 100) };
  };

  return (
    <div className="space-y-6">
      {/* Two username inputs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Swords className="w-4 h-4 text-primary" />
          Iki Hesabi Karsilastir
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username1}
              onChange={(e) => setUsername1(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              placeholder="@kullanici1"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
            <GitCompareArrows className="w-5 h-5 text-primary" />
          </div>

          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username2}
              onChange={(e) => setUsername2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              placeholder="@kullanici2"
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || !username1.trim() || !username2.trim()}
            className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Analiz ediliyor...
              </span>
            ) : (
              "Karsilastir"
            )}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-6 h-40 shimmer" />
            <div className="bg-card rounded-xl border border-border p-6 h-40 shimmer" />
          </div>
          <div className="bg-card rounded-xl border border-border p-6 h-64 shimmer" />
        </div>
      )}

      {error && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <p className="text-sm text-primary">{error}</p>
        </div>
      )}

      {/* Comparison Results */}
      {data1 && data2 && data1.stats && data2.stats && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* User Banners Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {data1.username[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">@{data1.username}</h2>
                  <p className="text-xs text-muted-foreground">{data1.videoCount} video</p>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {data2.username[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">@{data2.username}</h2>
                  <p className="text-xs text-muted-foreground">{data2.videoCount} video</p>
                </div>
              </div>
            </div>

            {/* Stat-by-Stat Comparison */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Istatistik Karsilastirmasi
              </h3>

              {[
                { label: "Toplam Goruntulenme", v1: data1.stats.totalViews, v2: data2.stats.totalViews, icon: Eye },
                { label: "Ort. Goruntulenme", v1: data1.stats.avgViews, v2: data2.stats.avgViews, icon: TrendingUp },
                { label: "Toplam Begeni", v1: data1.stats.totalLikes, v2: data2.stats.totalLikes, icon: Heart },
                { label: "Toplam Yorum", v1: data1.stats.totalComments, v2: data2.stats.totalComments, icon: MessageCircle },
                { label: "Toplam Paylasim", v1: data1.stats.totalShares, v2: data2.stats.totalShares, icon: Share2 },
                { label: "Ort. Etkilesim (%)", v1: data1.stats.avgEngagementRate, v2: data2.stats.avgEngagementRate, icon: BarChart2 },
                { label: "Ort. Sure (sn)", v1: data1.stats.avgDuration, v2: data2.stats.avgDuration, icon: Clock },
              ].map((row) => {
                const colors = getWinnerColor(row.v1, row.v2);
                const bars = getBarWidth(row.v1, row.v2);
                return (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <row.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{row.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-20 text-right ${colors.c1}`}>
                        {row.label.includes("%") ? `%${row.v1}` : formatNumber(row.v1)}
                      </span>
                      <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-border/30">
                        <div
                          className="h-full rounded-l-full transition-all duration-700"
                          style={{
                            width: `${bars.w1}%`,
                            backgroundColor: row.v1 >= row.v2 ? "#00d4aa" : "#3b82f6",
                            opacity: row.v1 >= row.v2 ? 1 : 0.4,
                          }}
                        />
                        <div
                          className="h-full rounded-r-full transition-all duration-700"
                          style={{
                            width: `${bars.w2}%`,
                            backgroundColor: row.v2 >= row.v1 ? "#ff3b5c" : "#6366f1",
                            opacity: row.v2 >= row.v1 ? 1 : 0.4,
                          }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-20 ${colors.c2}`}>
                        {row.label.includes("%") ? `%${row.v2}` : formatNumber(row.v2)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-xs text-blue-400 font-medium">@{data1.username}</span>
                <span className="text-xs text-primary font-medium">@{data2.username}</span>
              </div>
            </div>

            {/* Hashtag Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  <Hash className="w-4 h-4 inline mr-1" />
                  @{data1.username} Hashtag&apos;leri
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data1.topHashtags.slice(0, 8).map((ht) => (
                    <span key={ht.tag} className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg">
                      {ht.tag} ({ht.count})
                    </span>
                  ))}
                  {data1.topHashtags.length === 0 && <span className="text-xs text-muted-foreground">Hashtag bulunamadi</span>}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  <Hash className="w-4 h-4 inline mr-1" />
                  @{data2.username} Hashtag&apos;leri
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data2.topHashtags.slice(0, 8).map((ht) => (
                    <span key={ht.tag} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                      {ht.tag} ({ht.count})
                    </span>
                  ))}
                  {data2.topHashtags.length === 0 && <span className="text-xs text-muted-foreground">Hashtag bulunamadi</span>}
                </div>
              </div>
            </div>

            {/* AI Commentary */}
            {commentaryLoading && (
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-foreground">AI Yorum Hazirlaniyor...</p>
                    <p className="text-xs text-muted-foreground">Veriler analiz ediliyor</p>
                  </div>
                </div>
              </div>
            )}

            {commentary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Winner Banner */}
                <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl border border-yellow-500/20 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-yellow-500/80 uppercase font-medium">Genel Kazanan</p>
                      <p className="text-lg font-bold text-foreground">{commentary.winner}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{commentary.summary}</p>
                </div>

                {/* Category Winners */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commentary.categories.map((cat) => (
                    <div key={cat.name} className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-foreground">{cat.name}</span>
                        <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {cat.winner}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{cat.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                {commentary.tips && commentary.tips.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Strateji Onerileri
                    </h3>
                    <div className="space-y-2">
                      {commentary.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-teal mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Empty State */}
      {!data1 && !data2 && !loading && !error && (
        <div className="text-center py-20">
          <GitCompareArrows className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Iki TikTok hesabini karsilastirmak icin kullanici adlarini girin</p>
          <p className="text-muted-foreground text-xs mt-1">Ornek: @hesap1 vs @hesap2</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───
function CompetitorContent() {
  const [tab, setTab] = useState<"single" | "compare">("compare");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Rakip Analizi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          TikTok hesaplarini analiz edin ve karsilastirin
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-card rounded-xl border border-border p-1 max-w-md">
        <button
          onClick={() => setTab("compare")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "compare"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GitCompareArrows className="w-4 h-4" />
          Karsilastir
        </button>
        <button
          onClick={() => setTab("single")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "single"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="w-4 h-4" />
          Tek Analiz
        </button>
      </div>

      {/* Tab Content */}
      {tab === "single" ? <SingleAnalysis /> : <CompareAnalysis />}
    </motion.div>
  );
}

export default function CompetitorPage() {
  return (
    <PremiumGate featureName="Rakip Analizi" requiredPlan="enterprise">
      <CompetitorContent />
    </PremiumGate>
  );
}
