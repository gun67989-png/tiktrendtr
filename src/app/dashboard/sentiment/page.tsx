"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart2, MessageCircle, Smile, Frown, Meh } from "lucide-react";
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
import OnboardingTour from "@/components/OnboardingTour";
import { sentimentTourSteps } from "@/lib/onboarding";

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  trend: { date: string; positive: number; negative: number; neutral: number }[];
  categories: { name: string; positive: number; negative: number; neutral: number }[];
  topPositive: string[];
  topNegative: string[];
}

function generateMockSentiment(): SentimentData {
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

  const categories = [
    { name: "Kozmetik", positive: 72, negative: 8, neutral: 20 },
    { name: "Teknoloji", positive: 55, negative: 20, neutral: 25 },
    { name: "Moda", positive: 68, negative: 12, neutral: 20 },
    { name: "Yemek", positive: 78, negative: 5, neutral: 17 },
    { name: "Fitness", positive: 65, negative: 15, neutral: 20 },
    { name: "Eğitim", positive: 70, negative: 10, neutral: 20 },
  ];

  return {
    positive,
    negative,
    neutral,
    total: 4280 + Math.floor(Math.random() * 2000),
    trend,
    categories,
    topPositive: [
      "Harika içerik, çok faydalı!",
      "Bunu hemen deniyorum 🔥",
      "En iyi video bugün bu",
      "Süper anlatmışsın!",
      "Keşke daha önce görsem",
    ],
    topNegative: [
      "Bu işe yaramıyor bence",
      "Çok uzun, sıkıcı",
      "Reklamdan ibaret",
      "Kalite düşmüş",
    ],
  };
}

const COLORS = {
  positive: "#00d4aa",
  negative: "#ef4444",
  neutral: "#6b7280",
};

export default function SentimentPage() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [period, setPeriod] = useState<"7" | "14" | "30">("30");

  useEffect(() => {
    setData(generateMockSentiment());
  }, [period]);

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const pieData = [
    { name: "Pozitif", value: data.positive, color: COLORS.positive },
    { name: "Negatif", value: data.negative, color: COLORS.negative },
    { name: "Nötr", value: data.neutral, color: COLORS.neutral },
  ];

  const trendData = period === "7" ? data.trend.slice(-7) : period === "14" ? data.trend.slice(-14) : data.trend;

  return (
    <div className="space-y-6">
      <OnboardingTour steps={sentimentTourSteps} tourKey="sentiment" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Duygu Analizi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Video yorumlarının duygusal tonunu analiz edin
          </p>
        </div>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Smile className="w-5 h-5 text-teal" />
            <span className="text-xs text-muted-foreground uppercase">Pozitif</span>
          </div>
          <p className="text-3xl font-bold text-teal">%{data.positive}</p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round(data.total * data.positive / 100)} yorum</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Frown className="w-5 h-5 text-red-400" />
            <span className="text-xs text-muted-foreground uppercase">Negatif</span>
          </div>
          <p className="text-3xl font-bold text-red-400">%{data.negative}</p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round(data.total * data.negative / 100)} yorum</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Meh className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase">Nötr</span>
          </div>
          <p className="text-3xl font-bold text-foreground">%{data.neutral}</p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round(data.total * data.neutral / 100)} yorum</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
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
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                />
                <Area type="monotone" dataKey="positive" stroke="#00d4aa" fill="url(#posGrad)" strokeWidth={2} name="Pozitif" />
                <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="url(#negGrad)" strokeWidth={2} name="Negatif" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-teal" />
            Dağılım
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Sentiment */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-teal" />
          Kategori Bazlı Duygu Dağılımı
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categories} layout="vertical">
              <XAxis type="number" tick={{ fill: "#555570", fontSize: 10 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#999", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="positive" stackId="a" fill={COLORS.positive} name="Pozitif" radius={[0, 0, 0, 0]} />
              <Bar dataKey="neutral" stackId="a" fill={COLORS.neutral} name="Nötr" />
              <Bar dataKey="negative" stackId="a" fill={COLORS.negative} name="Negatif" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sample Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-teal mb-3 flex items-center gap-2">
            <Smile className="w-4 h-4" />
            En Pozitif Yorumlar
          </h3>
          <div className="space-y-2">
            {data.topPositive.map((comment, i) => (
              <div key={i} className="bg-teal/5 rounded-lg p-3 text-sm text-foreground border border-teal/10">
                &ldquo;{comment}&rdquo;
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <Frown className="w-4 h-4" />
            En Negatif Yorumlar
          </h3>
          <div className="space-y-2">
            {data.topNegative.map((comment, i) => (
              <div key={i} className="bg-red-500/5 rounded-lg p-3 text-sm text-foreground border border-red-500/10">
                &ldquo;{comment}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
