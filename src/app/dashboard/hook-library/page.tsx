"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Copy, Check, Search, Sparkles, TrendingUp, Loader2 } from "lucide-react";
import OnboardingTour from "@/components/OnboardingTour";
import { hookLibraryTourSteps } from "@/lib/onboarding";
import PremiumGate from "@/components/PremiumGate";

interface Hook {
  id: number;
  title: string;
  script: string;
  niche: string;
  viralScore: number;
  usageCount: number;
  example: string;
  source: "trending" | "curated";
}

export default function HookLibraryPage() {
  return (
    <PremiumGate featureName="Hook Kütüphanesi" requiredPlan="lite">
      <HookLibraryPageContent />
    </PremiumGate>
  );
}

function HookLibraryPageContent() {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Tümü");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchHooks() {
      try {
        const res = await fetch("/api/hooks");
        if (!res.ok) throw new Error("Failed to fetch hooks");
        const data: Hook[] = await res.json();
        setHooks(data);
      } catch (err) {
        console.error("Hook fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHooks();
  }, []);

  const niches = ["Tümü", ...Array.from(new Set(hooks.map((h) => h.niche)))];

  const filtered = hooks.filter((h) => {
    const matchNiche = selectedNiche === "Tümü" || h.niche === selectedNiche;
    const matchSearch = !search || h.title.toLowerCase().includes(search.toLowerCase()) || h.script.toLowerCase().includes(search.toLowerCase());
    return matchNiche && matchSearch;
  });

  const copyHook = (hook: Hook) => {
    navigator.clipboard.writeText(hook.script);
    setCopiedId(hook.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-teal animate-spin" />
        <span className="ml-3 text-muted-foreground text-sm">Hook&apos;lar yükleniyor...</span>
      </div>
    );
  }

  if (hooks.length === 0) {
    return (
      <div className="text-center py-32">
        <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Henüz hook bulunamadı</h2>
        <p className="text-sm text-muted-foreground">Hook kütüphanesi şu anda boş. Daha sonra tekrar kontrol edin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingTour steps={hookLibraryTourSteps} tourKey="hook-library" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sektörel Hook Kütüphanesi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Nişinize özel viral giriş cümleleri (hook) keşfedin ve içeriklerinize uyarlayın
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Hook ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>
      </div>

      {/* Niche Filters */}
      <div className="flex flex-wrap gap-2">
        {niches.map((niche) => (
          <button
            key={niche}
            onClick={() => setSelectedNiche(niche)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedNiche === niche
                ? "bg-teal text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {niche}
          </button>
        ))}
      </div>

      {/* Hooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((hook, i) => (
          <motion.div
            key={hook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-card rounded-xl border border-border p-5 hover:border-teal/30 transition-colors group"
          >
            {/* Top */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-foreground">{hook.title}</span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    hook.source === "trending"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-violet-500/10 text-violet-500"
                  }`}
                >
                  {hook.source === "trending" ? "Trend" : "Şablon"}
                </span>
              </div>
              <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded font-mono">
                {hook.viralScore.toFixed(1)}
              </span>
            </div>

            {/* Script */}
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <p className="text-sm text-foreground italic">&ldquo;{hook.script}&rdquo;</p>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground bg-card-light px-2 py-0.5 rounded">{hook.niche}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {(hook.usageCount / 1000).toFixed(1)}K kullanım
                </span>
              </div>
            </div>

            {/* Example */}
            <p className="text-[11px] text-muted-foreground mb-3">
              <span className="font-medium">Örnek:</span> {hook.example}
            </p>

            {/* Copy Button */}
            <button
              onClick={() => copyHook(hook)}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-teal/10 text-teal text-xs font-medium hover:bg-teal/20 transition-colors"
            >
              {copiedId === hook.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Hook&apos;u Kopyala
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Bu filtreye uygun hook bulunamadı</p>
        </div>
      )}
    </div>
  );
}
