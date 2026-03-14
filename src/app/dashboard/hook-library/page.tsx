"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Copy, Check, Search, Sparkles, TrendingUp } from "lucide-react";
import OnboardingTour from "@/components/OnboardingTour";
import { hookLibraryTourSteps } from "@/lib/onboarding";

interface Hook {
  id: number;
  title: string;
  script: string;
  niche: string;
  viralScore: number;
  usageCount: number;
  example: string;
}

const HOOKS: Hook[] = [
  { id: 1, title: "Shock Reveal", script: "Bunu deneyene kadar inanmıyordum...", niche: "Kozmetik", viralScore: 8.7, usageCount: 12400, example: "Makyaj öncesi-sonrası" },
  { id: 2, title: "POV Hook", script: "POV: İlk defa [ürün] deniyorsun ve...", niche: "Kozmetik", viralScore: 7.9, usageCount: 9800, example: "Ürün deneyimi" },
  { id: 3, title: "Karşılaştırma", script: "Sol taraf 50 TL, sağ taraf 500 TL. Farkı görebiliyor musun?", niche: "Moda", viralScore: 9.1, usageCount: 18200, example: "Ucuz vs pahalı" },
  { id: 4, title: "Soru Hook", script: "Telefonunu böyle kullanıyorsan yanlış yapıyorsun", niche: "Teknoloji", viralScore: 8.4, usageCount: 15600, example: "Telefon ipuçları" },
  { id: 5, title: "Liste Hook", script: "Bu 3 uygulama hayatını değiştirecek", niche: "Teknoloji", viralScore: 8.2, usageCount: 22100, example: "Uygulama önerileri" },
  { id: 6, title: "Story Hook", script: "Dün müşterimle yaşadığım şeyi anlatmam lazım...", niche: "Finans", viralScore: 7.6, usageCount: 6700, example: "Müşteri hikayesi" },
  { id: 7, title: "Yemek Reveal", script: "Bu tarifi 1M kişi denedi ama kimse [X] eklemeyi düşünmedi", niche: "Yemek", viralScore: 8.8, usageCount: 31200, example: "Tarif videosu" },
  { id: 8, title: "Transformation", script: "30 günde nasıl [X] kg verdim? İşte plan:", niche: "Fitness", viralScore: 8.5, usageCount: 14300, example: "Dönüşüm hikayesi" },
  { id: 9, title: "Eğitim Hook", script: "Okulda öğretmedikleri ama bilmen gereken tek şey:", niche: "Eğitim", viralScore: 7.8, usageCount: 11900, example: "Bilgi videosu" },
  { id: 10, title: "Challenge", script: "Bu trendi denemeden geçme! İşte nasıl:", niche: "Moda", viralScore: 8.0, usageCount: 20500, example: "Trend challenge" },
  { id: 11, title: "Seyahat Reveal", script: "Türkiye'de kimsenin bilmediği bu yer...", niche: "Seyahat", viralScore: 8.9, usageCount: 16800, example: "Gizli mekan keşfi" },
  { id: 12, title: "Oyun İpucu", script: "Bu ayarı açmazsan hep kaybedersin", niche: "Oyun", viralScore: 7.5, usageCount: 8900, example: "Oyun ipucu" },
];

const NICHES = ["Tümü", "Kozmetik", "Teknoloji", "Moda", "Yemek", "Fitness", "Eğitim", "Finans", "Seyahat", "Oyun"];

export default function HookLibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Tümü");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = HOOKS.filter((h) => {
    const matchNiche = selectedNiche === "Tümü" || h.niche === selectedNiche;
    const matchSearch = !search || h.title.toLowerCase().includes(search.toLowerCase()) || h.script.toLowerCase().includes(search.toLowerCase());
    return matchNiche && matchSearch;
  });

  const copyHook = (hook: Hook) => {
    navigator.clipboard.writeText(hook.script);
    setCopiedId(hook.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
        {NICHES.map((niche) => (
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
