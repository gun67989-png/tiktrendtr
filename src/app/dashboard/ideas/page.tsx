"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Copy, Check, RefreshCw, Hash, Music, Eye } from "lucide-react";
import PremiumGate from "@/components/PremiumGate";

const NICHES = [
  { id: "yemek", label: "Yemek", emoji: "🍳" },
  { id: "komedi", label: "Komedi", emoji: "😂" },
  { id: "seyahat", label: "Seyahat", emoji: "✈️" },
  { id: "moda", label: "Moda", emoji: "👗" },
  { id: "eğitim", label: "Eğitim", emoji: "📚" },
  { id: "teknoloji", label: "Teknoloji", emoji: "💻" },
];

interface Idea {
  title: string;
  format: string;
  hook: string;
  caption: string;
  hashtags: string[];
  sound: string;
  estimatedViews: string;
}

function IdeasContent() {
  const [selectedNiche, setSelectedNiche] = useState("komedi");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ideas?niche=${encodeURIComponent(selectedNiche)}`);
      const json = await res.json();
      if (json.ideas && json.ideas.length > 0) {
        setIdeas(json.ideas);
      } else {
        setIdeas([]);
      }
    } catch {
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }, [selectedNiche]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas, refreshKey]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="text-amber-400" />
            Viral İçerik Fikirleri
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI destekli içerik önerileri ile viral videolar oluşturun
          </p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-amber-400/50 transition-all text-sm text-muted-foreground hover:text-amber-400"
        >
          <RefreshCw className="w-4 h-4" />
          Yeni Fikirler
        </button>
      </div>

      {/* Niche Selection */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Niş Seçin</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {NICHES.map((niche) => (
            <button
              key={niche.id}
              onClick={() => setSelectedNiche(niche.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                selectedNiche === niche.id
                  ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80"
              }`}
            >
              <span className="text-2xl">{niche.emoji}</span>
              <span className="text-xs font-medium">{niche.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ideas */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3 mb-3" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground">Henüz içerik fikri bulunamadı</p>
          <p className="text-xs text-muted-foreground mt-1">Veriler yüklendiğinde burada görünecek</p>
        </div>
      ) : (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedNiche}-${refreshKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {ideas.map((idea, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-amber-400/20 transition-all"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-1 rounded-md">
                    {idea.format}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {idea.estimatedViews}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-3">
                  {idea.title}
                </h3>
              </div>

              {/* Hook */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    İlk 3 Saniye Hook
                  </p>
                  <button
                    onClick={() => copyToClipboard(idea.hook, `hook-${i}`)}
                    className="text-muted-foreground hover:text-amber-400 transition-colors"
                  >
                    {copiedId === `hook-${i}` ? (
                      <Check className="w-3 h-3 text-teal" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-foreground italic">
                  &quot;{idea.hook}&quot;
                </p>
              </div>

              {/* Caption */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Açıklama
                  </p>
                  <button
                    onClick={() => copyToClipboard(idea.caption, `caption-${i}`)}
                    className="text-muted-foreground hover:text-amber-400 transition-colors"
                  >
                    {copiedId === `caption-${i}` ? (
                      <Check className="w-3 h-3 text-teal" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{idea.caption}</p>
              </div>

              {/* Hashtags & Sound */}
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Hashtag&apos;ler
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-muted text-teal px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(idea.hashtags.join(" "), `tags-${i}`)
                    }
                    className="text-xs text-muted-foreground hover:text-teal mt-2 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === `tags-${i}` ? (
                      <>
                        <Check className="w-3 h-3" /> Kopyalandı
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Tümünü Kopyala
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Music className="w-3 h-3" /> Önerilen Ses
                  </p>
                  <p className="text-sm text-foreground">{idea.sound}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      )}
    </motion.div>
  );
}

export default function IdeasPage() {
  return (
    <PremiumGate featureName="İçerik Fikirleri">
      <IdeasContent />
    </PremiumGate>
  );
}
