"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  MessageCircle,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  BarChart2,
  Search,
  Users,
  Brain,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Heart,
  Share2,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

// --- Animation Variants ---
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// --- Animated Counter ---
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = Math.max(1, Math.floor(end / 50));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString("tr-TR")}{suffix}</span>;
}

// --- Types ---
interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  trend: { date: string; positive: number; negative: number; neutral: number }[];
  categories: { name: string; positive: number; negative: number; neutral: number }[];
  topPositive: string[];
  topNegative: string[];
  aiSummary: string;
  topTopics: { topic: string; count: number; sentiment: "positive" | "negative" | "neutral" }[];
}

interface CompetitorData {
  username: string;
  stats: {
    totalViews: number;
    avgViews: number;
    avgEngagementRate: number;
    avgDuration: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
  };
  commentAnalysis: {
    avgCommentRate: number;
    sentimentEstimate: string;
    engagementDepth: string;
    topCategories: { category: string; commentRate: number }[];
  };
  topVideos: {
    description: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    thumbnail: string;
    duration: number;
  }[];
}

// --- Mock Data Generators ---
function generateSentimentData(): SentimentData {
  const positive = 58 + Math.floor(Math.random() * 15);
  const negative = 12 + Math.floor(Math.random() * 10);
  const neutral = 100 - positive - negative;

  const trend = [];
  for (let d = 29; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    trend.push({
      date: date.toISOString().slice(5, 10),
      positive: 50 + Math.floor(Math.random() * 25),
      negative: 8 + Math.floor(Math.random() * 15),
      neutral: 20 + Math.floor(Math.random() * 15),
    });
  }

  return {
    positive,
    negative,
    neutral,
    total: 4280 + Math.floor(Math.random() * 2000),
    trend,
    categories: [
      { name: "Kozmetik", positive: 72, negative: 8, neutral: 20 },
      { name: "Teknoloji", positive: 55, negative: 20, neutral: 25 },
      { name: "Moda", positive: 68, negative: 12, neutral: 20 },
      { name: "Yemek", positive: 78, negative: 5, neutral: 17 },
      { name: "Fitness", positive: 65, negative: 15, neutral: 20 },
      { name: "Eğitim", positive: 70, negative: 10, neutral: 20 },
    ],
    topPositive: [
      "Harika içerik, çok faydalı! 🔥",
      "Bunu hemen deniyorum, süper anlatmışsın",
      "En iyi video bugün bu, devamını bekliyorum",
      "Keşke daha önce görsem, çok bilgilendirici",
      "Bayıldım, takip ettim hemen 💯",
    ],
    topNegative: [
      "Bu işe yaramıyor bence, denedim olmadı",
      "Çok uzun ve sıkıcı, kısaltsan iyi olur",
      "Reklamdan ibaret, samimiyetsiz",
      "Kalite çok düşmüş son zamanlarda",
    ],
    aiSummary:
      "Genel olarak izleyiciler içerik kalitesinden memnun. En çok olumlu yorum alan konular ürün incelemeleri ve eğitim içerikleri. Olumsuz yorumların çoğu video uzunluğu ve reklam algısıyla ilgili. Yorum etkileşimi son 7 günde %12 artış gösterdi.",
    topTopics: [
      { topic: "Ürün İnceleme", count: 342, sentiment: "positive" },
      { topic: "Eğitim/Tutorial", count: 287, sentiment: "positive" },
      { topic: "Video Kalitesi", count: 198, sentiment: "positive" },
      { topic: "Reklam Şikayeti", count: 156, sentiment: "negative" },
      { topic: "Video Uzunluğu", count: 134, sentiment: "negative" },
      { topic: "Fiyat Sorgusu", count: 112, sentiment: "neutral" },
      { topic: "Takip/Destek", count: 98, sentiment: "positive" },
      { topic: "Teknik Sorun", count: 67, sentiment: "negative" },
    ],
  };
}

const COLORS = {
  positive: "#00d4aa",
  negative: "#ef4444",
  neutral: "#6b7280",
};

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

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function SentimentPage() {
  return (
    <PremiumGate featureName="Yorum Analizi" requiredPlan="standard">
      <SentimentContent />
    </PremiumGate>
  );
}

function SentimentContent() {
  const [activeTab, setActiveTab] = useState<"analysis" | "competitor">("analysis");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header + Tabs */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-teal" />
            Yorum Analizi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI destekli yorum ve duygu analizi
          </p>
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === "analysis" ? "bg-teal text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Yorum Analizi
          </button>
          <button
            onClick={() => setActiveTab("competitor")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeTab === "competitor" ? "bg-teal text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Rakip Yorumları
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "analysis" ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisTab />
          </motion.div>
        ) : (
          <motion.div
            key="competitor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CompetitorTab />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// YORUM ANALİZİ TAB
// ==========================================
function AnalysisTab() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [period, setPeriod] = useState<"7" | "14" | "30">("30");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setData(generateSentimentData());
  }, [period]);

  if (!data) return <LoadingSkeleton />;

  const pieData = [
    { name: "Pozitif", value: data.positive, color: COLORS.positive },
    { name: "Negatif", value: data.negative, color: COLORS.negative },
    { name: "Nötr", value: data.neutral, color: COLORS.neutral },
  ];

  const trendData = period === "7" ? data.trend.slice(-7) : period === "14" ? data.trend.slice(-14) : data.trend;

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-teal/5 via-card to-purple-500/5 rounded-xl border border-teal/20 p-5"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-teal" />
            <span className="text-xs font-semibold text-teal uppercase tracking-wider">AI Yorum Özeti</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{data.aiSummary}</p>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Pozitif", value: data.positive, icon: Smile, color: "text-teal", bg: "bg-teal/10", count: Math.round(data.total * data.positive / 100) },
          { label: "Negatif", value: data.negative, icon: Frown, color: "text-red-400", bg: "bg-red-400/10", count: Math.round(data.total * data.negative / 100) },
          { label: "Nötr", value: data.neutral, icon: Meh, color: "text-muted-foreground", bg: "bg-muted", count: Math.round(data.total * data.neutral / 100) },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="bg-card rounded-xl border border-border p-5 cursor-default group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`${card.bg} p-1.5 rounded-lg group-hover:scale-110 transition-transform`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <span className="text-xs text-muted-foreground uppercase font-medium">{card.label}</span>
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>
              %<AnimatedCounter value={card.value} />
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.count.toLocaleString("tr-TR")} yorum</p>
            {/* Mini progress bar */}
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.value}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                className={`h-full rounded-full ${card.label === "Pozitif" ? "bg-teal" : card.label === "Negatif" ? "bg-red-400" : "bg-muted-foreground/50"}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Period Filter + Charts */}
      <div className="flex justify-end">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {(["7", "14", "30"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                period === p ? "bg-teal text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p} Gün
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal" />
            Duygu Trendi ({period} Gün)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="date" tick={{ fill: "#555570", fontSize: 10 }} />
                <YAxis tick={{ fill: "#555570", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="positive" stroke="#00d4aa" fill="url(#posGrad)" strokeWidth={2} name="Pozitif" />
                <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="url(#negGrad)" strokeWidth={2} name="Negatif" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-teal" />
            Dağılım
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[11px] text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          En Sık Yorum Konuları
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.topTopics.map((topic, i) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className={`rounded-lg p-3 border transition-all hover:scale-[1.03] cursor-default ${
                topic.sentiment === "positive"
                  ? "bg-teal/5 border-teal/15"
                  : topic.sentiment === "negative"
                  ? "bg-red-400/5 border-red-400/15"
                  : "bg-muted/50 border-border"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {topic.sentiment === "positive" ? (
                  <ThumbsUp className="w-3 h-3 text-teal" />
                ) : topic.sentiment === "negative" ? (
                  <ThumbsDown className="w-3 h-3 text-red-400" />
                ) : (
                  <Meh className="w-3 h-3 text-muted-foreground" />
                )}
                <span className="text-xs font-semibold text-foreground">{topic.topic}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{topic.count}</p>
              <p className="text-[10px] text-muted-foreground">yorum</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Category Sentiment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl border border-border p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-teal" />
          Kategori Bazlı Duygu Haritası
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categories} layout="vertical">
              <XAxis type="number" tick={{ fill: "#555570", fontSize: 10 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#999", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="positive" stackId="a" fill={COLORS.positive} name="Pozitif" />
              <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} name="Nötr" />
              <Bar dataKey="negative" stackId="a" fill={COLORS.negative} name="Negatif" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Sample Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-teal mb-3 flex items-center gap-2">
            <Smile className="w-4 h-4" />
            En Pozitif Yorumlar
          </h3>
          <div className="space-y-2">
            {data.topPositive.map((comment, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="bg-teal/5 rounded-lg p-3 text-sm text-foreground border border-teal/10 hover:border-teal/25 transition-colors"
              >
                &ldquo;{comment}&rdquo;
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <Frown className="w-4 h-4" />
            En Negatif Yorumlar
          </h3>
          <div className="space-y-2">
            {data.topNegative.map((comment, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                className="bg-red-500/5 rounded-lg p-3 text-sm text-foreground border border-red-500/10 hover:border-red-500/25 transition-colors"
              >
                &ldquo;{comment}&rdquo;
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// RAKİP YORUMLARI TAB
// ==========================================
function CompetitorTab() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [competitor, setCompetitor] = useState<CompetitorData | null>(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setCompetitor(null);

    try {
      const cleanName = username.replace("@", "").trim();
      const res = await fetch(`/api/competitor?username=${encodeURIComponent(cleanName)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Rakip bulunamadı");
        setLoading(false);
        return;
      }

      // Also fetch comment analysis
      const commentRes = await fetch(`/api/trends/comments?username=${encodeURIComponent(cleanName)}`);
      const commentData = commentRes.ok ? await commentRes.json() : null;

      setCompetitor({
        username: cleanName,
        stats: data.stats || {
          totalViews: 0,
          avgViews: 0,
          avgEngagementRate: 0,
          avgDuration: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
        },
        commentAnalysis: {
          avgCommentRate: commentData?.patterns?.averageCommentRate || data.stats?.avgEngagementRate || 3.2,
          sentimentEstimate: commentData?.patterns?.overallSentiment || "karma",
          engagementDepth: commentData?.patterns?.overallEngagementDepth || "orta",
          topCategories: commentData?.patterns?.categoryPerformance?.slice(0, 4) || [],
        },
        topVideos: (data.videos || []).slice(0, 6).map((v: any) => ({
          description: v.description || v.title || "",
          views: v.views || v.play || 0,
          likes: v.likes || v.digg || 0,
          comments: v.comments || v.comment || 0,
          shares: v.shares || v.share || 0,
          thumbnail: v.thumbnail || v.cover || "",
          duration: v.duration || 0,
        })),
      });
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-teal" />
          Rakip Yorum Analizi
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Rakibinizin TikTok kullanıcı adını girerek yorumlarını ve etkileşimlerini AI ile analiz edin
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="kullanici_adi"
              className="w-full h-10 pl-8 pr-4 rounded-lg border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/50"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !username.trim()}
            className="h-10 px-5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analiz Et
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-sm text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="h-32 bg-card rounded-xl border border-border animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {competitor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/5 via-card to-teal/5 rounded-xl border border-border p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-teal flex items-center justify-center text-white text-xl font-bold">
                {competitor.username[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">@{competitor.username}</h3>
                <p className="text-xs text-muted-foreground">
                  Yorum duygusu: <span className={
                    competitor.commentAnalysis.sentimentEstimate === "pozitif" ? "text-teal" :
                    competitor.commentAnalysis.sentimentEstimate === "negatif" ? "text-red-400" : "text-amber-400"
                  }>{competitor.commentAnalysis.sentimentEstimate}</span>
                  {" · "}
                  Etkileşim derinliği: <span className="text-foreground">{competitor.commentAnalysis.engagementDepth}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Toplam Görüntülenme", value: formatNumber(competitor.stats.totalViews), icon: Eye, color: "text-primary" },
              { label: "Toplam Beğeni", value: formatNumber(competitor.stats.totalLikes), icon: Heart, color: "text-red-400" },
              { label: "Toplam Yorum", value: formatNumber(competitor.stats.totalComments), icon: MessageCircle, color: "text-teal" },
              { label: "Toplam Paylaşım", value: formatNumber(competitor.stats.totalShares), icon: Share2, color: "text-purple-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="bg-card rounded-xl border border-border p-4 cursor-default group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[10px] text-muted-foreground uppercase">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* AI Comment Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-teal/20 p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal" />
              AI Yorum Analizi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Ort. Yorum Oranı</p>
                <p className="text-2xl font-bold text-foreground">%{competitor.commentAnalysis.avgCommentRate.toFixed(1)}</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(competitor.commentAnalysis.avgCommentRate * 15, 100)}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full rounded-full bg-teal"
                  />
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Genel Duygu</p>
                <p className={`text-2xl font-bold capitalize ${
                  competitor.commentAnalysis.sentimentEstimate === "pozitif" ? "text-teal" :
                  competitor.commentAnalysis.sentimentEstimate === "negatif" ? "text-red-400" : "text-amber-400"
                }`}>
                  {competitor.commentAnalysis.sentimentEstimate}
                </p>
                <p className="text-xs text-muted-foreground mt-1">AI tahmini</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Etkileşim Derinliği</p>
                <p className="text-2xl font-bold text-foreground capitalize">{competitor.commentAnalysis.engagementDepth}</p>
                <p className="text-xs text-muted-foreground mt-1">Tartışma kalitesi</p>
              </div>
            </div>
          </motion.div>

          {/* Engagement Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              Etkileşim Metrikleri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ort. Etkileşim Oranı</p>
                <p className="text-lg font-bold text-foreground">%{competitor.stats.avgEngagementRate.toFixed(1)}</p>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(competitor.stats.avgEngagementRate * 10, 100)}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full rounded-full bg-purple-400"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ort. Video Süresi</p>
                <p className="text-lg font-bold text-foreground">
                  {Math.floor(competitor.stats.avgDuration / 60)}:{String(Math.round(competitor.stats.avgDuration % 60)).padStart(2, "0")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">dakika</p>
              </div>
            </div>
          </motion.div>

          {/* Top Videos */}
          {competitor.topVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                En Çok Yorum Alan Videolar
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {competitor.topVideos.map((video, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-card rounded-xl border border-border overflow-hidden cursor-default group"
                  >
                    <div className="aspect-[9/12] relative bg-muted">
                      {video.thumbnail && (
                        <img
                          src={getThumbnailUrl(video.thumbnail)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-foreground line-clamp-2 leading-snug mb-2">
                        {video.description || "Video"}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {formatNumber(video.views)}</span>
                        <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {formatNumber(video.likes)}</span>
                        <span className="flex items-center gap-0.5 text-teal"><MessageCircle className="w-3 h-3" /> {formatNumber(video.comments)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!competitor && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">
            Rakibinizin kullanıcı adını girerek yorum analizini başlatın
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// LOADING SKELETON
// ==========================================
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-24 bg-card rounded-xl border border-border" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-card rounded-xl border border-border" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-card rounded-xl border border-border" />
        <div className="h-72 bg-card rounded-xl border border-border" />
      </div>
    </div>
  );
}
