"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  TrendingUp,
  Clock,
  Hash,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  Award,
  Eye,
  Share2,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PremiumGate from "@/components/PremiumGate";

interface ContentROI {
  format: string;
  videoCount: number;
  avgViews: number;
  avgEngagement: number;
  avgShares: number;
  roi: number;
  trend: "up" | "down" | "stable";
}

interface TimeSlotROI {
  hour: number;
  dayOfWeek: string;
  avgEngagement: number;
  videoCount: number;
}

interface HashtagROI {
  hashtag: string;
  videoCount: number;
  totalViews: number;
  avgEngagement: number;
  roi: number;
}

interface AdPerformanceData {
  contentROI: ContentROI[];
  bestTimeSlots: TimeSlotROI[];
  hashtagROI: HashtagROI[];
  summary: {
    totalVideosAnalyzed: number;
    avgEngagementRate: number;
    bestFormat: string;
    bestTime: string;
    topHashtag: string;
    overallROI: number;
  };
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUp className="w-3.5 h-3.5 text-teal" />;
  if (trend === "down") return <ArrowDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

function ROIGauge({ score }: { score: number }) {
  const color = score >= 70 ? "text-teal" : score >= 40 ? "text-amber-400" : "text-red-400";
  const bgColor = score >= 70 ? "bg-teal" : score >= 40 ? "bg-amber-400" : "bg-red-400";
  const label = score >= 70 ? "Yüksek" : score >= 40 ? "Orta" : "Düşük";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
          <circle
            cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8"
            className={color}
            strokeDasharray={`${(score / 100) * 314} 314`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <div className={`w-2 h-2 rounded-full ${bgColor}`} />
        <span className={`text-xs font-medium ${color}`}>{label} ROI</span>
      </div>
    </div>
  );
}

const BAR_COLORS = ["#f59e0b", "#2dd4bf", "#8b5cf6", "#3b82f6", "#ec4899", "#f97316", "#14b8a6", "#6366f1", "#ef4444", "#84cc16"];

export default function AdAnalysisPage() {
  const [data, setData] = useState<AdPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("loading");

  useEffect(() => {
    fetch("/api/trends/ad-performance")
      .then((r) => r.json())
      .then((res) => {
        setData(res.performance);
        setSource(res.source);
      })
      .catch(() => setSource("no_data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PremiumGate>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Reklam Analizi & ROI</h1>
              <p className="text-sm text-muted-foreground">
                İçerik formatları, zamanlamalar ve hashtag&apos;lerin performans karşılaştırması
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : !data ? (
          <div className="text-center py-20">
            <BarChart2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Henüz yeterli veri yok. Veriler 6 saatte bir güncellenir.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="col-span-2 lg:col-span-1 bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center">
                <ROIGauge score={data.summary.overallROI} />
                <p className="text-[10px] text-muted-foreground mt-2 text-center">Genel Performans Skoru</p>
              </div>
              {[
                { label: "Analiz Edilen Video", value: data.summary.totalVideosAnalyzed.toLocaleString("tr-TR"), icon: Eye, color: "text-blue-400" },
                { label: "Ort. Etkileşim", value: `%${data.summary.avgEngagementRate}`, icon: TrendingUp, color: "text-teal" },
                { label: "En İyi Format", value: data.summary.bestFormat, icon: Award, color: "text-amber-400" },
                { label: "En İyi Zaman", value: data.summary.bestTime, icon: Clock, color: "text-purple-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                  </div>
                  <p className="text-lg font-bold text-foreground truncate">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Content Format ROI Chart + Table */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Chart */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Format ROI Karşılaştırması
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.contentROI.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" />
                      <XAxis type="number" stroke="#606080" fontSize={10} />
                      <YAxis type="category" dataKey="format" stroke="#606080" fontSize={10} width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#13131e",
                          border: "1px solid #2e2e44",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#f0f0f8",
                        }}
                        formatter={(value) => [`${value} ROI Puanı`, "ROI"]}
                      />
                      <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                        {data.contentROI.slice(0, 8).map((_, i) => (
                          <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Format Detayları
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Format</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Video</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Ort. İzlenme</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Etkileşim</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">ROI</th>
                        <th className="text-center py-2 text-muted-foreground font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.contentROI.map((row, i) => (
                        <tr key={row.format} className={`border-b border-border/50 ${i === 0 ? "bg-amber-400/5" : ""}`}>
                          <td className="py-2.5 font-medium text-foreground">
                            {i === 0 && <Award className="w-3 h-3 text-amber-400 inline mr-1" />}
                            {row.format}
                          </td>
                          <td className="text-right py-2.5 text-muted-foreground">{row.videoCount}</td>
                          <td className="text-right py-2.5 text-muted-foreground">{formatViews(row.avgViews)}</td>
                          <td className="text-right py-2.5 text-teal">%{row.avgEngagement}</td>
                          <td className="text-right py-2.5 font-semibold text-foreground">{row.roi}</td>
                          <td className="text-center py-2.5"><TrendIcon trend={row.trend} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Best Time Slots */}
            <motion.div variants={item} className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                En Yüksek ROI Zaman Dilimleri
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {data.bestTimeSlots.slice(0, 5).map((slot, i) => (
                  <div
                    key={`${slot.dayOfWeek}-${slot.hour}`}
                    className={`rounded-xl border p-3 text-center transition-all ${
                      i === 0
                        ? "bg-amber-400/5 border-amber-400/20"
                        : "bg-card border-border"
                    }`}
                  >
                    {i === 0 && <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />}
                    <p className="text-lg font-bold text-foreground">{String(slot.hour).padStart(2, "0")}:00</p>
                    <p className="text-xs text-muted-foreground">{slot.dayOfWeek}</p>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-teal" />
                      <span className="text-xs font-semibold text-teal">%{slot.avgEngagement}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{slot.videoCount} video</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hashtag ROI */}
            <motion.div variants={item} className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4 text-teal" />
                Hashtag ROI Analizi
                <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full font-medium ml-1">Top {data.hashtagROI.length}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.hashtagROI.map((tag, i) => (
                  <div
                    key={tag.hashtag}
                    className={`rounded-xl border p-3 transition-all hover:border-teal/30 ${
                      i < 3 ? "bg-teal/5 border-teal/15" : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        #{tag.hashtag}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        i < 3 ? "bg-teal/10 text-teal" : "bg-muted text-muted-foreground"
                      }`}>
                        ROI: {tag.roi}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViews(tag.totalViews)}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        %{tag.avgEngagement}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        {tag.videoCount} video
                      </span>
                    </div>
                    {/* Mini ROI bar */}
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal to-teal/60 transition-all"
                        style={{ width: `${Math.min(100, (tag.roi / (data.hashtagROI[0]?.roi || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div variants={item} className="bg-gradient-to-r from-primary/5 via-card to-purple-500/5 rounded-xl border border-primary/20 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                AI Performans Tavsiyeleri
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.summary.bestFormat !== "—" && (
                  <div className="bg-card/50 rounded-lg border border-border p-3">
                    <p className="text-xs font-medium text-amber-400 mb-1">En Yüksek ROI Format</p>
                    <p className="text-sm text-foreground">
                      <strong>{data.summary.bestFormat}</strong> formatı en yüksek geri dönüş oranına sahip. Bu formatta içerik üretmeye öncelik verin.
                    </p>
                  </div>
                )}
                {data.summary.bestTime !== "—" && (
                  <div className="bg-card/50 rounded-lg border border-border p-3">
                    <p className="text-xs font-medium text-purple-400 mb-1">Optimal Paylaşım Zamanı</p>
                    <p className="text-sm text-foreground">
                      <strong>{data.summary.bestTime}</strong> en yüksek etkileşim zamanı. Bu saatte paylaşım yaparak erişiminizi maksimize edin.
                    </p>
                  </div>
                )}
                {data.summary.topHashtag !== "—" && (
                  <div className="bg-card/50 rounded-lg border border-border p-3">
                    <p className="text-xs font-medium text-teal mb-1">En Etkili Hashtag</p>
                    <p className="text-sm text-foreground">
                      <strong>#{data.summary.topHashtag}</strong> en yüksek ROI&apos;ye sahip hashtag. İçeriklerinizde bu hashtag&apos;i kullanın.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Data source info */}
            {source === "live" && (
              <motion.div variants={item} className="text-center">
                <p className="text-xs text-muted-foreground">
                  Veriler gerçek TikTok trend verilerinden hesaplanmaktadır. Son güncelleme: {new Date().toLocaleString("tr-TR")}
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </PremiumGate>
  );
}
