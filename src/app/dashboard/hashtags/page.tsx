"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Search, Copy, Check, Filter, ArrowRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/data";
import OnboardingTour from "@/components/OnboardingTour";
import { hashtagsTourSteps } from "@/lib/onboarding";

interface HashtagData {
  id: number;
  tag: string;
  name: string;
  viewCount: number;
  videoCount: number;
  growth: number;
  category: string;
  viralScore: number;
  avgViews: number;
  engagementRate: number;
  trend: "up" | "down";
}

export default function HashtagsPage() {
  const [hashtags, setHashtags] = useState<HashtagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [sortBy, setSortBy] = useState<"viralScore" | "growth" | "viewCount">("viralScore");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchHashtags();
  }, []);

  async function fetchHashtags() {
    setLoading(true);
    try {
      const res = await fetch("/api/trends/hashtags");
      const data = await res.json();
      setHashtags(data.hashtags || []);
      setSource(data.source || "unknown");
    } catch {
      setHashtags([]);
      setSource("error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let result = [...hashtags];
    if (category !== "Tümü") {
      result = result.filter((h) => h.category === category);
    }
    if (search) {
      result = result.filter((h) =>
        (h.name || h.tag || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    return result.sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
  }, [hashtags, category, search, sortBy]);

  const copyHashtags = () => {
    const bundle = filtered.slice(0, 5).map((h) => h.tag || `#${h.name}`).join(" ");
    navigator.clipboard.writeText(bundle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allCategories = ["Tümü", ...CATEGORIES];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted/50 rounded-lg w-48 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-card border border-border rounded-lg animate-pulse" />
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
      <OnboardingTour tourKey="hashtags" steps={hashtagsTourSteps} tourTitle="Hashtag'ler" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Hash className="text-primary" />
            Trend Hashtag&apos;ler
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Türkiye&apos;de en çok kullanılan ve büyüyen hashtag&apos;ler
            {source === "live" && <span className="ml-2 text-teal text-xs">● Canlı Veri</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchHashtags}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-teal/50 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={copyHashtags}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-teal/50 transition-all text-sm"
          >
            {copied ? (
              <>
                <Check className="text-teal" />
                <span className="text-teal">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="text-muted-foreground" />
                <span className="text-muted-foreground">Top 5 Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hashtag ara..."
              className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-card border border-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="viralScore">Viral Skor</option>
              <option value="growth">Haftalık Büyüme</option>
              <option value="viewCount">Toplam Görüntülenme</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} hashtag bulundu</p>

      {/* Empty State */}
      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <Hash className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Henüz hashtag verisi yok</p>
          <p className="text-sm mt-1">Veriler 6 saatte bir güncellenir. Lütfen daha sonra tekrar kontrol edin.</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-12">#</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Hashtag</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Videolar</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Görüntülenme</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Büyüme</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Kategori</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Viral Skor</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((hashtag, i) => (
                  <motion.tr
                    key={hashtag.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => router.push(`/dashboard/hashtags/${encodeURIComponent(hashtag.name)}`)}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{hashtag.tag}</span>
                        {hashtag.growth > 80 && (
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            🔥
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {hashtag.videoCount.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {hashtag.viewCount >= 1_000_000
                        ? `${(hashtag.viewCount / 1_000_000).toFixed(1)}M`
                        : hashtag.viewCount >= 1000
                          ? `${(hashtag.viewCount / 1000).toFixed(0)}K`
                          : hashtag.viewCount.toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          hashtag.growth >= 0 ? "text-teal" : "text-primary"
                        }`}
                      >
                        {hashtag.growth >= 0 ? "+" : ""}
                        {hashtag.growth}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                        {hashtag.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min((hashtag.viralScore / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-foreground">
                          {hashtag.viralScore.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
