"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Power,
  Zap,
  MessageCircle,
  Clock,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface AnalysisMetrics {
  hate_watching: {
    score: number;
    comment_to_view_ratio: number;
    negativity_estimate: number;
    label: string;
  };
  anchor_points: {
    score: number;
    triggers: string[];
    top_hashtags: string[];
    caption_keywords: string[];
    engagement_spike_indicators: string[];
  };
  drop_off: {
    score: number;
    estimated_avg_watch_percent: number;
    duration_engagement_ratio: number;
    label: string;
  };
  demographics: {
    score: number;
    estimated_age_range: string;
    socioeconomic_tier: string;
    language_complexity: string;
    peak_activity_hours: string[];
    category_affinity: string[];
  };
  sentiment_drift: {
    score: number;
    like_dislike_ratio: number;
    comment_velocity: number;
    drift_direction: "positive" | "negative" | "neutral";
    label: string;
  };
}

interface ViralDraft {
  id: number;
  text: string;
  hook_type: string;
  estimated_engagement: string;
  target_emotion: string;
}

interface Analysis {
  id: string;
  profile_username: string;
  platform: string;
  analysis_data: {
    video_count: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    avg_engagement_rate: number;
    analyzed_video_ids: string[];
    summary: string;
  };
  metrics: AnalysisMetrics;
  viral_post_drafts: ViralDraft[];
  analyzed_at: string;
  created_at: string;
}

interface AnalysisTarget {
  id: string;
  username: string;
  platform: string;
  priority: number;
  last_analyzed_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 70) return "text-red-500";
  if (score >= 40) return "text-yellow-500";
  return "text-green-500";
}

function getScoreBg(score: number): string {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-green-500";
}

function getScoreBgLight(score: number): string {
  if (score >= 70) return "bg-red-500/20";
  if (score >= 40) return "bg-yellow-500/20";
  return "bg-green-500/20";
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ────────────────────────────────────────────────────────────
// Component: MetricBar
// ────────────────────────────────────────────────────────────

function MetricBar({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        <span className={`font-semibold ${getScoreColor(score)}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getScoreBg(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Component: ViralDraftsModal
// ────────────────────────────────────────────────────────────

function ViralDraftsModal({
  drafts,
  username,
  onClose,
}: {
  drafts: ViralDraft[];
  username: string;
  onClose: () => void;
}) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard API may fail
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-foreground">Viral Post Taslakları</h3>
            <p className="text-sm text-muted-foreground mt-0.5">@{username} analiz sonuçlarına göre</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="bg-background border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {draft.hook_type}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  Hedef: {draft.target_emotion}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                  Tahmini: {draft.estimated_engagement}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{draft.text}</p>
              <button
                onClick={() => handleCopy(draft.text, draft.id)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedId === draft.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-500">Kopyalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Kopyala
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────

export default function PsychologicalAnalysisPage() {
  // State
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [targets, setTargets] = useState<AnalysisTarget[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [targetsLoading, setTargetsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPlatform, setNewPlatform] = useState("tiktok");
  const [addingTarget, setAddingTarget] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<{ drafts: ViralDraft[]; username: string } | null>(null);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // ── Fetch analyses ─────────────────────────────────────────
  const fetchAnalyses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analyses?page=${page}&limit=20`);
      const data = await res.json();
      if (data.analyses) {
        setAnalyses(data.analyses);
        setPagination(data.pagination);
      }
    } catch {
      showMsg("error", "Analizler yuklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch targets ──────────────────────────────────────────
  const fetchTargets = useCallback(async () => {
    setTargetsLoading(true);
    try {
      const res = await fetch("/api/admin/targets");
      const data = await res.json();
      if (data.targets) setTargets(data.targets);
    } catch {
      showMsg("error", "Hedefler yuklenemedi");
    } finally {
      setTargetsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyses();
    fetchTargets();
  }, [fetchAnalyses, fetchTargets]);

  // ── Add target ─────────────────────────────────────────────
  const handleAddTarget = async () => {
    if (!newUsername.trim()) return;
    setAddingTarget(true);
    try {
      const res = await fetch("/api/admin/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim(), platform: newPlatform }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("success", `@${newUsername.trim()} hedef listesine eklendi`);
        setNewUsername("");
        fetchTargets();
      } else {
        showMsg("error", data.error || "Hedef eklenemedi");
      }
    } catch {
      showMsg("error", "Sunucu hatasi");
    } finally {
      setAddingTarget(false);
    }
  };

  // ── Toggle target active ───────────────────────────────────
  const handleToggleTarget = async (target: AnalysisTarget) => {
    try {
      const res = await fetch(`/api/admin/targets/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !target.is_active }),
      });
      if (res.ok) {
        showMsg("success", `@${target.username} ${!target.is_active ? "aktif" : "pasif"} yapildi`);
        fetchTargets();
      }
    } catch {
      showMsg("error", "Guncelleme basarisiz");
    }
  };

  // ── Delete target ──────────────────────────────────────────
  const handleDeleteTarget = async (target: AnalysisTarget) => {
    if (!confirm(`@${target.username} hedefini silmek istediginize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/targets/${target.id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("success", `@${target.username} silindi`);
        fetchTargets();
      }
    } catch {
      showMsg("error", "Silme basarisiz");
    }
  };

  // ── Delete analysis ────────────────────────────────────────
  const handleDeleteAnalysis = async (analysis: Analysis) => {
    if (!confirm(`@${analysis.profile_username} analizini silmek istediginize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/analyses/${analysis.id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("success", "Analiz silindi");
        fetchAnalyses(pagination.page);
      }
    } catch {
      showMsg("error", "Silme basarisiz");
    }
  };

  // ── Filtered analyses ──────────────────────────────────────
  const filteredAnalyses = analyses.filter(
    (a) => a.profile_username.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats ──────────────────────────────────────────────────
  const stats = {
    totalAnalyses: pagination.total,
    activeTargets: targets.filter((t) => t.is_active).length,
    avgHateWatching: analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + (a.metrics?.hate_watching?.score || 0), 0) / analyses.length)
      : 0,
    topSentimentDrift: analyses.length > 0
      ? Math.max(...analyses.map((a) => a.metrics?.sentiment_drift?.score || 0))
      : 0,
  };

  // ── Radar chart data ──────────────────────────────────────
  const getRadarData = (metrics: AnalysisMetrics) => [
    { metric: "Nefret-Izleme", value: metrics.hate_watching.score, fullMark: 100 },
    { metric: "Capa Noktasi", value: metrics.anchor_points.score, fullMark: 100 },
    { metric: "Tutma", value: metrics.drop_off.score, fullMark: 100 },
    { metric: "Demografik", value: metrics.demographics.score, fullMark: 100 },
    { metric: "Duygu Kaymasi", value: metrics.sentiment_drift.score, fullMark: 100 },
  ];

  // ── Bar chart data for overview ────────────────────────────
  const barChartData = analyses.slice(0, 8).map((a) => ({
    name: `@${a.profile_username.slice(0, 10)}`,
    "Nefret-Izleme": a.metrics?.hate_watching?.score || 0,
    "Duygu Kaymasi": a.metrics?.sentiment_drift?.score || 0,
    Tutma: a.metrics?.drop_off?.score || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-500"
                : "bg-red-500/10 border-red-500/30 text-red-500"
            }`}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Viral Drafts Modal */}
      <AnimatePresence>
        {selectedDrafts && (
          <ViralDraftsModal
            drafts={selectedDrafts.drafts}
            username={selectedDrafts.username}
            onClose={() => setSelectedDrafts(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            Psikolojik Analiz Paneli
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Profil analizi, metrik takibi ve viral icerik uretimi
          </p>
        </div>
        <button
          onClick={() => {
            fetchAnalyses(pagination.page);
            fetchTargets();
          }}
          className="bg-primary text-white font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 text-sm w-fit"
        >
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Toplam Analiz",
            value: stats.totalAnalyses,
            icon: BarChart2,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Aktif Hedef",
            value: stats.activeTargets,
            icon: Target,
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
          {
            label: "Ort. Nefret-Izleme",
            value: stats.avgHateWatching,
            icon: Eye,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            suffix: "/100",
          },
          {
            label: "Max Duygu Kaymasi",
            value: stats.topSentimentDrift,
            icon: Activity,
            color: "text-red-500",
            bg: "bg-red-500/10",
            suffix: "/100",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">
                  {stat.value}
                  {"suffix" in stat && <span className="text-sm text-muted-foreground">{stat.suffix}</span>}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overview Chart */}
      {barChartData.length > 0 && (
        <motion.div
          className="bg-card border border-border rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Metrik Karsilastirmasi</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="Nefret-Izleme" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Duygu Kaymasi" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Tutma" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Target Management */}
      <motion.div
        className="bg-card border border-border rounded-xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Hedef Yonetimi
        </h2>

        {/* Add Target Form */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Kullanici adi (orn: tiktokuser)"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => e.key === "Enter" && handleAddTarget()}
            />
          </div>
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
          </select>
          <button
            onClick={handleAddTarget}
            disabled={addingTarget || !newUsername.trim()}
            className="bg-primary text-white font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Hedef Ekle
          </button>
        </div>

        {/* Target List */}
        {targetsLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ) : targets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Henuz hedef eklenmemis</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {targets.map((target) => (
              <div
                key={target.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  target.is_active
                    ? "bg-background border-border"
                    : "bg-muted/30 border-border/50 opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">@{target.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {target.platform} | Oncelik: {target.priority}
                  </p>
                  {target.last_analyzed_at && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Son: {formatDate(target.last_analyzed_at)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => handleToggleTarget(target)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      target.is_active
                        ? "hover:bg-yellow-500/10 text-yellow-500"
                        : "hover:bg-green-500/10 text-green-500"
                    }`}
                    title={target.is_active ? "Pasif yap" : "Aktif yap"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTarget(target)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Analysis List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Analizler
          </h2>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Profil ara..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">Henuz analiz yapilmamis</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => {
              const isExpanded = expandedAnalysis === analysis.id;
              const metrics = analysis.metrics;

              return (
                <motion.div
                  key={analysis.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  {/* Card Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedAnalysis(isExpanded ? null : analysis.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          @{analysis.profile_username}
                          <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {analysis.platform}
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(analysis.analyzed_at)} | {analysis.analysis_data.video_count} video analiz edildi |{" "}
                          {formatNumber(analysis.analysis_data.total_views)} goruntulenme
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrafts({
                              drafts: analysis.viral_post_drafts,
                              username: analysis.profile_username,
                            });
                          }}
                          className="bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1.5 text-xs"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Viral Post Uret
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnalysis(analysis);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metric Summary Row */}
                    {metrics && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[
                          { label: "Nefret-Izleme", score: metrics.hate_watching?.score || 0, icon: Eye },
                          { label: "Capa", score: metrics.anchor_points?.score || 0, icon: Target },
                          { label: "Tutma", score: metrics.drop_off?.score || 0, icon: Clock },
                          { label: "Demografik", score: metrics.demographics?.score || 0, icon: Users },
                          { label: "Duygu", score: metrics.sentiment_drift?.score || 0, icon: Activity },
                        ].map((m) => (
                          <span
                            key={m.label}
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${getScoreBgLight(m.score)} ${getScoreColor(m.score)}`}
                          >
                            <m.icon className="w-3 h-3" />
                            {m.label}: {m.score}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && metrics && (
                      <motion.div
                        className="border-t border-border"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 space-y-6">
                          {/* Radar Chart + Metrics Side by Side */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Radar Chart */}
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={getRadarData(metrics)}>
                                  <PolarGrid stroke="hsl(var(--border))" />
                                  <PolarAngleAxis
                                    dataKey="metric"
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                  />
                                  <PolarRadiusAxis
                                    angle={90}
                                    domain={[0, 100]}
                                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                  />
                                  <Radar
                                    name="Skor"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Metric Bars */}
                            <div className="space-y-4">
                              <MetricBar label="Nefret-Izleme Indeksi" score={metrics.hate_watching.score} icon={Eye} />
                              <MetricBar label="Capa Noktasi Tespiti" score={metrics.anchor_points.score} icon={Target} />
                              <MetricBar label="Tahmini Izleyici Tutma" score={metrics.drop_off.score} icon={Clock} />
                              <MetricBar label="Demografik Haritalama" score={metrics.demographics.score} icon={Users} />
                              <MetricBar label="Duygu Kaymasi" score={metrics.sentiment_drift.score} icon={Activity} />
                            </div>
                          </div>

                          {/* Detailed Metric Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Hate Watching Detail */}
                            <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                <Eye className="w-4 h-4 text-red-500" />
                                Nefret-Izleme
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Yorum/Gosterim: {metrics.hate_watching.comment_to_view_ratio}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Negatiflik Tahmini: %{metrics.hate_watching.negativity_estimate}
                              </p>
                              <p className={`text-xs font-medium ${getScoreColor(metrics.hate_watching.score)}`}>
                                {metrics.hate_watching.label}
                              </p>
                            </div>

                            {/* Anchor Points Detail */}
                            <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                <Target className="w-4 h-4 text-blue-500" />
                                Capa Noktalari
                              </h4>
                              {metrics.anchor_points.triggers.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  Tetikleyiciler: {metrics.anchor_points.triggers.join(", ")}
                                </p>
                              )}
                              {metrics.anchor_points.top_hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {metrics.anchor_points.top_hashtags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {metrics.anchor_points.caption_keywords.length > 0 && (
                                <p className="text-xs text-muted-foreground truncate">
                                  Anahtar kelimeler: {metrics.anchor_points.caption_keywords.slice(0, 5).join(", ")}
                                </p>
                              )}
                            </div>

                            {/* Drop-off Detail */}
                            <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-green-500" />
                                Izleyici Tutma
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Ort. Izlenme: %{metrics.drop_off.estimated_avg_watch_percent}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Sure/Etkilesim: {metrics.drop_off.duration_engagement_ratio}
                              </p>
                              <p className={`text-xs font-medium ${getScoreColor(100 - metrics.drop_off.score)}`}>
                                {metrics.drop_off.label}
                              </p>
                            </div>

                            {/* Demographics Detail */}
                            <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-purple-500" />
                                Demografik
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Yas Araligi: {metrics.demographics.estimated_age_range}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Sosyo-Ekonomik: {metrics.demographics.socioeconomic_tier}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Dil Karmasikligi: {metrics.demographics.language_complexity}
                              </p>
                              {metrics.demographics.category_affinity.length > 0 && (
                                <p className="text-xs text-muted-foreground truncate">
                                  Kategoriler: {metrics.demographics.category_affinity.join(", ")}
                                </p>
                              )}
                            </div>

                            {/* Sentiment Drift Detail */}
                            <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-yellow-500" />
                                Duygu Kaymasi
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Begeni/Gosterim: {metrics.sentiment_drift.like_dislike_ratio}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Yorum Hizi: {metrics.sentiment_drift.comment_velocity}/1K
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                Yon:{" "}
                                {metrics.sentiment_drift.drift_direction === "positive" ? (
                                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                ) : metrics.sentiment_drift.drift_direction === "negative" ? (
                                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                ) : (
                                  <span className="text-muted-foreground">--</span>
                                )}
                                {metrics.sentiment_drift.drift_direction === "positive"
                                  ? "Pozitif"
                                  : metrics.sentiment_drift.drift_direction === "negative"
                                  ? "Negatif"
                                  : "Notr"}
                              </p>
                              <p className={`text-xs font-medium ${getScoreColor(metrics.sentiment_drift.score)}`}>
                                {metrics.sentiment_drift.label}
                              </p>
                            </div>

                            {/* Summary */}
                            <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                <MessageCircle className="w-4 h-4 text-primary" />
                                Ozet
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {analysis.analysis_data.summary}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>{formatNumber(analysis.analysis_data.total_views)} gosterim</span>
                                <span>{formatNumber(analysis.analysis_data.total_likes)} begeni</span>
                                <span>{formatNumber(analysis.analysis_data.total_comments)} yorum</span>
                                <span>{formatNumber(analysis.analysis_data.total_shares)} paylasim</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Etkilesim: %{(analysis.analysis_data.avg_engagement_rate * 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => fetchAnalyses(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchAnalyses(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
