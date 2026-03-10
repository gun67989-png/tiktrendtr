"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap, FiCopy, FiCheck, FiRefreshCw, FiHash, FiMusic, FiEye } from "react-icons/fi";
import { generateContentIdeas } from "@/lib/data";

const NICHES = [
  { id: "yemek", label: "Yemek", emoji: "🍳" },
  { id: "komedi", label: "Komedi", emoji: "😂" },
  { id: "seyahat", label: "Seyahat", emoji: "✈️" },
  { id: "moda", label: "Moda", emoji: "👗" },
  { id: "eğitim", label: "Eğitim", emoji: "📚" },
  { id: "teknoloji", label: "Teknoloji", emoji: "💻" },
];

export default function IdeasPage() {
  const [selectedNiche, setSelectedNiche] = useState("komedi");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const ideas = useMemo(
    () => generateContentIdeas(selectedNiche),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedNiche, refreshKey]
  );

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
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <FiZap className="text-amber-400" />
            Viral İçerik Fikirleri
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            AI destekli içerik önerileri ile viral videolar oluşturun
          </p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-amber-400/50 transition-all text-sm text-text-secondary hover:text-amber-400"
        >
          <FiRefreshCw className="w-4 h-4" />
          Yeni Fikirler
        </button>
      </div>

      {/* Niche Selection */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Niş Seçin</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {NICHES.map((niche) => (
            <button
              key={niche.id}
              onClick={() => setSelectedNiche(niche.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                selectedNiche === niche.id
                  ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary hover:border-border/80"
              }`}
            >
              <span className="text-2xl">{niche.emoji}</span>
              <span className="text-xs font-medium">{niche.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ideas */}
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
              className="bg-surface rounded-xl border border-border overflow-hidden hover:border-amber-400/20 transition-all"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs bg-amber-400/10 text-amber-400 px-2 py-1 rounded-md">
                    {idea.format}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <FiEye className="w-3 h-3" />
                    {idea.estimatedViews}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mt-3">
                  {idea.title}
                </h3>
              </div>

              {/* Hook */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">
                    İlk 3 Saniye Hook
                  </p>
                  <button
                    onClick={() => copyToClipboard(idea.hook, `hook-${i}`)}
                    className="text-text-muted hover:text-amber-400 transition-colors"
                  >
                    {copiedId === `hook-${i}` ? (
                      <FiCheck className="w-3 h-3 text-teal" />
                    ) : (
                      <FiCopy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-text-primary italic">
                  &quot;{idea.hook}&quot;
                </p>
              </div>

              {/* Caption */}
              <div className="p-5 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">
                    Açıklama
                  </p>
                  <button
                    onClick={() => copyToClipboard(idea.caption, `caption-${i}`)}
                    className="text-text-muted hover:text-amber-400 transition-colors"
                  >
                    {copiedId === `caption-${i}` ? (
                      <FiCheck className="w-3 h-3 text-teal" />
                    ) : (
                      <FiCopy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-text-secondary">{idea.caption}</p>
              </div>

              {/* Hashtags & Sound */}
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                    <FiHash className="w-3 h-3" /> Hashtag&apos;ler
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-surface-light text-teal px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(idea.hashtags.join(" "), `tags-${i}`)
                    }
                    className="text-xs text-text-muted hover:text-teal mt-2 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === `tags-${i}` ? (
                      <>
                        <FiCheck className="w-3 h-3" /> Kopyalandı
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-3 h-3" /> Tümünü Kopyala
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
                    <FiMusic className="w-3 h-3" /> Önerilen Ses
                  </p>
                  <p className="text-sm text-text-primary">{idea.sound}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
