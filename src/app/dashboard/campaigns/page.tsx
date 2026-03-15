"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  Megaphone,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Zap,
  Hash,
  Clock,
  BarChart2,
  Download,
  Loader2,
  Target,
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
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

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

const BAR_COLORS = ["#f59e0b", "#2dd4bf", "#8b5cf6", "#3b82f6", "#ec4899", "#f97316", "#14b8a6", "#6366f1"];
const PIE_COLORS = ["#FF3B5C", "#2dd4bf", "#a78bfa", "#60a5fa", "#f59e0b", "#f472b6", "#34d399", "#fb923c"];

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-teal" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

async function generateCampaignPDF(data: AdPerformanceData) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(88, 28, 135);
  doc.text("Valyze TR", 15, y);
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 140);
  doc.text("Kampanya Performans Raporu", 15, y + 7);
  doc.text(new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }), pageWidth - 15, y + 7, { align: "right" });
  y += 18;

  doc.setDrawColor(200, 200, 220);
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  // Summary
  doc.setFontSize(12);
  doc.setTextColor(88, 28, 135);
  doc.text("Kampanya Ozeti", 15, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Metrik", "Deger"]],
    body: [
      ["Analiz Edilen Video", data.summary.totalVideosAnalyzed.toLocaleString("tr-TR")],
      ["Ort. Etkilesim Orani", `%${data.summary.avgEngagementRate}`],
      ["En Iyi Format", data.summary.bestFormat],
      ["En Iyi Zaman", data.summary.bestTime],
      ["En Etkili Hashtag", `#${data.summary.topHashtag}`],
      ["Genel ROI Skoru", `${data.summary.overallROI}/100`],
    ],
    theme: "striped",
    headStyles: { fillColor: [88, 28, 135], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 70] },
    alternateRowStyles: { fillColor: [245, 245, 252] },
    margin: { left: 15, right: 15 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Content Format ROI
  doc.setFontSize(12);
  doc.setTextColor(88, 28, 135);
  doc.text("Icerik Format ROI", 15, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Format", "Video", "Ort. Izlenme", "Etkilesim", "Paylasim", "ROI Puani", "Trend"]],
    body: data.contentROI.map((r) => [
      r.format,
      r.videoCount.toString(),
      formatNumber(r.avgViews),
      `%${r.avgEngagement}`,
      formatNumber(r.avgShares),
      r.roi.toString(),
      r.trend === "up" ? "Yukseliyor" : r.trend === "down" ? "Dusuyor" : "Stabil",
    ]),
    theme: "striped",
    headStyles: { fillColor: [249, 158, 11], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 70] },
    alternateRowStyles: { fillColor: [255, 251, 235] },
    margin: { left: 15, right: 15 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Best Time Slots
  if (y > 220) { doc.addPage(); y = 15; }
  doc.setFontSize(12);
  doc.setTextColor(88, 28, 135);
  doc.text("En Iyi Zamanlama", 15, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Gun", "Saat", "Ort. Etkilesim", "Video Sayisi"]],
    body: data.bestTimeSlots.slice(0, 10).map((s) => [
      s.dayOfWeek,
      `${String(s.hour).padStart(2, "0")}:00`,
      `%${s.avgEngagement}`,
      s.videoCount.toString(),
    ]),
    theme: "striped",
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 70] },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 15, right: 15 },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Hashtag ROI
  if (y > 220) { doc.addPage(); y = 15; }
  doc.setFontSize(12);
  doc.setTextColor(88, 28, 135);
  doc.text("Hashtag ROI Analizi", 15, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Hashtag", "Video", "Toplam Izlenme", "Etkilesim", "ROI"]],
    body: data.hashtagROI.map((h) => [
      `#${h.hashtag}`,
      h.videoCount.toString(),
      formatNumber(h.totalViews),
      `%${h.avgEngagement}`,
      h.roi.toString(),
    ]),
    theme: "striped",
    headStyles: { fillColor: [45, 212, 191], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 70] },
    alternateRowStyles: { fillColor: [240, 253, 250] },
    margin: { left: 15, right: 15 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 170);
    doc.text(`Valyze TR - Kampanya Performans Raporu | Sayfa ${i}/${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
  }

  doc.save(`valyze-kampanya-${new Date().toISOString().split("T")[0]}.pdf`);
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function CampaignsContent() {
  const [data, setData] = useState<AdPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    fetch("/api/trends/ad-performance")
      .then((r) => r.json())
      .then((res) => setData(res.performance))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePDF = async () => {
    if (!data) return;
    setPdfLoading(true);
    try { await generateCampaignPDF(data); } catch (e) { console.error(e); }
    finally { setPdfLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <Megaphone className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Henuz yeterli kampanya verisi yok. Veriler otomatik olarak toplanir.</p>
      </div>
    );
  }

  // Compute campaign-specific metrics
  const campaignFormats = data.contentROI.filter(f =>
    ["Kampanya", "Sponsorlu", "Haul", "Unboxing", "Ürün İnceleme", "Tavsiye"].some(k =>
      f.format.toLowerCase().includes(k.toLowerCase())
    )
  );
  const organicFormats = data.contentROI.filter(f => !campaignFormats.includes(f));

  const campaignAvgROI = campaignFormats.length > 0
    ? Math.round(campaignFormats.reduce((s, f) => s + f.roi, 0) / campaignFormats.length)
    : 0;
  const organicAvgROI = organicFormats.length > 0
    ? Math.round(organicFormats.reduce((s, f) => s + f.roi, 0) / organicFormats.length)
    : 0;

  const campaignAvgEng = campaignFormats.length > 0
    ? Math.round(campaignFormats.reduce((s, f) => s + f.avgEngagement, 0) / campaignFormats.length * 100) / 100
    : 0;
  const organicAvgEng = organicFormats.length > 0
    ? Math.round(organicFormats.reduce((s, f) => s + f.avgEngagement, 0) / organicFormats.length * 100) / 100
    : 0;

  const radarData = data.contentROI.slice(0, 6).map((f) => ({
    format: f.format,
    roi: f.roi,
    engagement: Math.round(f.avgEngagement * 10),
    reach: Math.round(Math.log10(Math.max(f.avgViews, 1)) * 15),
  }));

  const comparisonData = [
    { name: "Kampanya", roi: campaignAvgROI, engagement: campaignAvgEng },
    { name: "Organik", roi: organicAvgROI, engagement: organicAvgEng },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kampanya Performans Analizi</h1>
            <p className="text-sm text-muted-foreground">
              Icerik formatlari, zamanlama ve hashtag ROI karsilastirmasi
            </p>
          </div>
        </div>
        <button
          onClick={handlePDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF Rapor Indir
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Analiz Edilen Video", value: data.summary.totalVideosAnalyzed.toLocaleString("tr-TR"), icon: Eye, color: "text-blue-400" },
          { label: "Ort. Etkilesim", value: `%${data.summary.avgEngagementRate}`, icon: TrendingUp, color: "text-teal" },
          { label: "En Iyi Format", value: data.summary.bestFormat, icon: Award, color: "text-amber-400" },
          { label: "Genel ROI", value: `${data.summary.overallROI}/100`, icon: Target, color: "text-purple-400" },
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

      {/* Campaign vs Organic Comparison */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-500/5 via-card to-purple-500/5 rounded-xl border border-amber-500/20 p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Kampanya vs Organik Karsilastirma
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" />
                <XAxis dataKey="name" stroke="#606080" fontSize={11} />
                <YAxis stroke="#606080" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#13131e", border: "1px solid #2e2e44", borderRadius: "8px", fontSize: "12px", color: "#f0f0f8" }}
                />
                <Bar dataKey="roi" name="ROI Puani" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" name="Etkilesim %" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-400" /> ROI Puani</span>
            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-teal" /> Etkilesim %</span>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            Format Performans Haritasi
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#2e2e44" />
                <PolarAngleAxis dataKey="format" tick={{ fill: "#9090a0", fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="ROI" dataKey="roi" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Radar name="Etkilesim" dataKey="engagement" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.15} />
                <Radar name="Erisim" dataKey="reach" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Tooltip contentStyle={{ backgroundColor: "#13131e", border: "1px solid #2e2e44", borderRadius: "8px", fontSize: "11px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Content Format ROI Table */}
      <motion.div variants={item} className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          Icerik Format ROI Detaylari
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Format</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Video</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Ort. Izlenme</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Etkilesim</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Paylasim</th>
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
                  <td className="text-right py-2.5 text-muted-foreground">{formatNumber(row.avgViews)}</td>
                  <td className="text-right py-2.5 text-teal">%{row.avgEngagement}</td>
                  <td className="text-right py-2.5 text-muted-foreground">{formatNumber(row.avgShares)}</td>
                  <td className="text-right py-2.5 font-semibold text-foreground">{row.roi}</td>
                  <td className="text-center py-2.5"><TrendIcon trend={row.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Best Time Slots */}
      <motion.div variants={item} className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          En Yuksek ROI Zaman Dilimleri
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {data.bestTimeSlots.slice(0, 5).map((slot, i) => (
            <div
              key={`${slot.dayOfWeek}-${slot.hour}`}
              className={`rounded-xl border p-3 text-center transition-all ${
                i === 0 ? "bg-amber-400/5 border-amber-400/20" : "bg-card border-border"
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
                <span className="text-sm font-semibold text-foreground">#{tag.hashtag}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  i < 3 ? "bg-teal/10 text-teal" : "bg-muted text-muted-foreground"
                }`}>ROI: {tag.roi}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(tag.totalViews)}</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> %{tag.avgEngagement}</span>
                <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {tag.videoCount} video</span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal to-teal/60"
                  style={{ width: `${Math.min(100, (tag.roi / (data.hashtagROI[0]?.roi || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={item} className="bg-gradient-to-r from-primary/5 via-card to-purple-500/5 rounded-xl border border-primary/20 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Kampanya Stratejik Onerileri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.summary.bestFormat !== "—" && (
            <div className="bg-card/50 rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-amber-400 mb-1">En Yuksek ROI Format</p>
              <p className="text-sm text-foreground">
                <strong>{data.summary.bestFormat}</strong> formatinda kampanyalar en yuksek geri donus sagliyor. Reklam butcenizin buyuk kismini bu formata yonlendirin.
              </p>
            </div>
          )}
          {data.summary.bestTime !== "—" && (
            <div className="bg-card/50 rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-purple-400 mb-1">Optimal Yayinlama Zamani</p>
              <p className="text-sm text-foreground">
                <strong>{data.summary.bestTime}</strong> kampanya icerikleri icin en etkili zaman dilimi. Bu saatte yayinlanan icerikler %{data.bestTimeSlots[0]?.avgEngagement || 0} etkilesim aliyor.
              </p>
            </div>
          )}
          {campaignFormats.length > 0 && organicFormats.length > 0 && (
            <div className="bg-card/50 rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-teal mb-1">Kampanya vs Organik</p>
              <p className="text-sm text-foreground">
                {campaignAvgROI > organicAvgROI
                  ? `Kampanya icerikleri organikten %${Math.round(((campaignAvgROI - organicAvgROI) / organicAvgROI) * 100)} daha yuksek ROI sagliyor.`
                  : `Organik icerikler kampanyalardan daha iyi performans gosteriyor. Icerik stratejinizi gozden gecirin.`
                }
              </p>
            </div>
          )}
          {data.summary.topHashtag !== "—" && (
            <div className="bg-card/50 rounded-lg border border-border p-3">
              <p className="text-xs font-medium text-pink-400 mb-1">Hashtag Stratejisi</p>
              <p className="text-sm text-foreground">
                <strong>#{data.summary.topHashtag}</strong> en yuksek ROI hashtag&apos;i. Kampanya iceriklerinizde bu hashtag&apos;i mutlaka kullanin.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Data source */}
      <motion.div variants={item} className="text-center">
        <p className="text-xs text-muted-foreground">
          Veriler gercek TikTok trend verilerinden hesaplanmaktadir. Son guncelleme: {new Date().toLocaleString("tr-TR")}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function CampaignsPage() {
  return (
    <PremiumGate featureName="Kampanya Performans Analizi">
      <CampaignsContent />
    </PremiumGate>
  );
}
