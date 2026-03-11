"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  FiZap,
  FiEye,
  FiTrendingUp,
  FiBarChart2,
  FiFilter,
  FiExternalLink,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

const CATEGORIES = ["Tümü", "Komedi", "Vlog", "Yemek", "Moda", "Güzellik", "Eğitim", "Teknoloji", "Spor", "Müzik", "Dans", "Seyahat", "Oyun"];

interface HookData {
  hook: string;
  hookScore: number;
  patterns: string[];
  videoId: string;
  creator: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  format: string;
  category: string;
  thumbnailUrl: string;
  tiktokUrl: string;
}

interface PatternData {
  pattern: string;
  label: string;
  description: string;
  count: number;
  avgScore: number;
  avgViews: number;
}

interface HooksResponse {
  hooks: HookData[];
  patternAnalysis: PatternData[];
  stats: {
    totalAnalyzed: number;
    avgHookScore: number;
    topPattern: string;
  };
  patterns: Record<string, { label: string; description: string }>;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-teal";
  if (score >= 60) return "text-blue-400";
  if (score >= 40) return "text-yellow-400";
  if (score >= 20) return "text-orange-400";
  return "text-neon-red";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-teal/10 border-teal/20";
  if (score >= 60) return "bg-blue-400/10 border-blue-400/20";
  if (score >= 40) return "bg-yellow-400/10 border-yellow-400/20";
  if (score >= 20) return "bg-orange-400/10 border-orange-400/20";
  return "bg-neon-red/10 border-neon-red/20";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Mukemmel";
  if (score >= 60) return "Iyi";
  if (score >= 40) return "Orta";
  if (score >= 20) return "Zayif";
  return "Cok Zayif";
}

const PATTERN_COLORS: Record<string, string> = {
  question: "bg-blue-500/10 text-blue-400",
  shock: "bg-neon-red/10 text-neon-red",
  story: "bg-purple-500/10 text-purple-400",
  tutorial: "bg-teal/10 text-teal",
  list: "bg-yellow-500/10 text-yellow-400",
  challenge: "bg-orange-500/10 text-orange-400",
  urgency: "bg-red-500/10 text-red-400",
  emotional: "bg-pink-500/10 text-pink-400",
};

function HooksContent() {
  const [data, setData] = useState<HooksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Tümü");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "Tümü") params.set("category", category);

    fetch(`/api/hooks?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d);
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border p-4 h-24 shimmer" />
          ))}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <FiZap className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary">Hook verisi bulunamadi</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Viral Hook Analizi</h1>
        <p className="text-sm text-text-secondary mt-1">
          En viral videolarin acilis cumle ve hook stratejilerini analiz edin
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiBarChart2 className="w-4 h-4 text-teal" />
            <span className="text-[10px] text-text-muted uppercase">Analiz Edilen</span>
          </div>
          <p className="text-xl font-bold text-teal">{data.stats.totalAnalyzed}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiZap className="w-4 h-4 text-neon-red" />
            <span className="text-[10px] text-text-muted uppercase">Ort. Hook Skoru</span>
          </div>
          <p className="text-xl font-bold text-neon-red">{data.stats.avgHookScore}/100</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-text-muted uppercase">En Basarili Kalip</span>
          </div>
          <p className="text-xl font-bold text-purple-400">{data.stats.topPattern}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter className="w-4 h-4 text-text-muted" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              category === cat
                ? "bg-neon-red/10 text-neon-red border border-neon-red/20"
                : "bg-surface text-text-secondary border border-border hover:border-neon-red/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pattern Analysis Chart */}
      {data.patternAnalysis.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Hook Kalip Performansi</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.patternAnalysis} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis type="number" tick={{ fill: "#555570", fontSize: 10 }} domain={[0, 100]} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fill: "#8888a0", fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#8888a0" }}
                  formatter={(v, name) => {
                    if (name === "avgScore") return [`${v}/100`, "Ort. Skor"];
                    return [v, name];
                  }}
                />
                <Bar dataKey="avgScore" fill="#ff3b5c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pattern Cards */}
      {data.patternAnalysis.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {data.patternAnalysis.map((p) => (
            <div
              key={p.pattern}
              className={`rounded-xl border p-3 ${PATTERN_COLORS[p.pattern]?.replace("text-", "border-").replace("/10", "/20") || "border-border"} bg-surface`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${PATTERN_COLORS[p.pattern] || "bg-surface-light text-text-secondary"}`}>
                  {p.label}
                </span>
                <span className="text-[10px] text-text-muted ml-auto">{p.count} video</span>
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed mt-1">{p.description}</p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50">
                <span className="text-[10px] text-text-muted">Ort. Skor: <span className="text-text-primary font-medium">{p.avgScore}</span></span>
                <span className="text-[10px] text-text-muted">Ort. <FiEye className="w-2.5 h-2.5 inline" /> {formatNumber(p.avgViews)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hook List */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">En Etkili Hook&apos;lar</h3>
        <div className="space-y-3">
          {data.hooks.slice(0, 30).map((h, i) => (
            <motion.div
              key={h.videoId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-surface rounded-xl border p-4 hover:border-neon-red/20 transition-colors ${getScoreBg(h.hookScore)}`}
            >
              <div className="flex items-start gap-4">
                {/* Score */}
                <div className="flex-shrink-0 text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(h.hookScore)}`}>
                    {h.hookScore}
                  </div>
                  <div className={`text-[9px] font-medium ${getScoreColor(h.hookScore)}`}>
                    {getScoreLabel(h.hookScore)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium leading-relaxed">
                    &ldquo;{h.hook}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-text-muted">@{h.creator}</span>
                    <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                      <FiEye className="w-2.5 h-2.5" />{formatNumber(h.views)}
                    </span>
                    <span className="text-[10px] text-text-muted">%{h.engagementRate} etkilesim</span>
                    <span className="text-[10px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">{h.format}</span>
                    {h.tiktokUrl && (
                      <a
                        href={h.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-text-muted hover:text-neon-red flex items-center gap-0.5 ml-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiExternalLink className="w-2.5 h-2.5" /> TikTok
                      </a>
                    )}
                  </div>
                  {/* Pattern tags */}
                  {h.patterns.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {h.patterns.map((p) => (
                        <span
                          key={p}
                          className={`text-[9px] px-1.5 py-0.5 rounded ${PATTERN_COLORS[p] || "bg-surface-light text-text-secondary"}`}
                        >
                          {data.patterns[p]?.label || p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HooksPage() {
  return (
    <PremiumGate featureName="Hook Analizi">
      <HooksContent />
    </PremiumGate>
  );
}
