"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  Search,
  Eye,
  Heart,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PremiumGate from "@/components/PremiumGate";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

interface Creator {
  username: string;
  nickname: string;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  followerCount: number;
  engagementRate: number;
  growth: number;
  topCategory: string;
  topFormat: string;
  topHashtags: string[];
  avgDuration: number;
  avgPresenceScore: number;
  creatorScore: number;
  latestVideoAt: string;
}

export default function CreatorsPage() {
  return (
    <PremiumGate featureName="İçerik Üreticileri" requiredPlan="lite">
      <CreatorsPageContent />
    </PremiumGate>
  );
}

function CreatorsPageContent() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("creatorScore");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trends/creators?limit=100")
      .then((r) => r.json())
      .then((data) => {
        if (data.creators) setCreators(data.creators);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(creators.map((c) => c.topCategory));
    return ["Tümü", ...Array.from(cats)];
  }, [creators]);

  const filtered = useMemo(() => {
    let result = creators;
    if (categoryFilter !== "Tümü") {
      result = result.filter((c) => c.topCategory === categoryFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.username.toLowerCase().includes(q) || c.nickname.toLowerCase().includes(q)
      );
    }
    const sortFn: Record<string, (a: Creator, b: Creator) => number> = {
      creatorScore: (a, b) => b.creatorScore - a.creatorScore,
      totalViews: (a, b) => b.totalViews - a.totalViews,
      videoCount: (a, b) => b.videoCount - a.videoCount,
      engagementRate: (a, b) => b.engagementRate - a.engagementRate,
      growth: (a, b) => b.growth - a.growth,
    };
    return [...result].sort(sortFn[sortBy] || sortFn.creatorScore);
  }, [creators, categoryFilter, search, sortBy]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="text-primary" />
          İçerik Üreticileri
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Trend videolardaki en etkili içerik üreticileri
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Toplam Üretici</p>
          <p className="text-xl font-bold text-foreground mt-1">{creators.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Toplam Video</p>
          <p className="text-xl font-bold text-foreground mt-1">
            {formatNumber(creators.reduce((s, c) => s + c.videoCount, 0))}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Toplam Görüntülenme</p>
          <p className="text-xl font-bold text-foreground mt-1">
            {formatNumber(creators.reduce((s, c) => s + c.totalViews, 0))}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Ort. Etkileşim</p>
          <p className="text-xl font-bold text-foreground mt-1">
            %{creators.length > 0
              ? (creators.reduce((s, c) => s + c.engagementRate, 0) / creators.length).toFixed(1)
              : "0"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Üretici ara..."
            className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-card border border-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none"
        >
          <option value="creatorScore">Üretici Skoru</option>
          <option value="totalViews">Görüntülenme</option>
          <option value="videoCount">Video Sayısı</option>
          <option value="engagementRate">Etkileşim Oranı</option>
          <option value="growth">Büyüme</option>
        </select>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Creator cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Sonuç bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((creator, i) => (
            <motion.div
              key={creator.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => router.push(`/dashboard/creators/${creator.username}`)}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:border-primary/30 transition-colors group"
            >
              {/* Creator header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {creator.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    @{creator.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{creator.nickname}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{creator.creatorScore.toFixed(0)}</p>
                  <p className="text-[10px] text-muted-foreground">Skor</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" /> İzlenme
                  </p>
                  <p className="text-sm font-semibold text-foreground">{formatNumber(creator.totalViews)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Play className="w-3 h-3" /> Video
                  </p>
                  <p className="text-sm font-semibold text-foreground">{creator.videoCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3" /> Etkileşim
                  </p>
                  <p className="text-sm font-semibold text-foreground">%{creator.engagementRate.toFixed(1)}</p>
                </div>
              </div>

              {/* Growth + Category */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {creator.topCategory}
                </span>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${
                  creator.growth > 0 ? "text-teal" : creator.growth < 0 ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {creator.growth > 0 ? <ArrowUp className="w-3 h-3" /> : creator.growth < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                  {creator.growth > 0 ? "+" : ""}{creator.growth}%
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Hashtags */}
              {creator.topHashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {creator.topHashtags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
