"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiMusic, FiSearch, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { generateSounds } from "@/lib/data";

export default function SoundsPage() {
  const allSounds = useMemo(() => generateSounds(), []);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"viralScore" | "growthRate" | "usageCount">("viralScore");
  const [genreFilter, setGenreFilter] = useState("Tümü");
  const router = useRouter();

  const genres = useMemo(() => {
    const g = new Set(allSounds.map((s) => s.genre));
    return ["Tümü", ...Array.from(g)];
  }, [allSounds]);

  const filtered = useMemo(() => {
    let result = allSounds;
    if (genreFilter !== "Tümü") {
      result = result.filter((s) => s.genre === genreFilter);
    }
    if (search) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.creator.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result.sort((a, b) => b[sortBy] - a[sortBy]);
  }, [allSounds, genreFilter, search, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <FiMusic className="text-teal" />
          Trend Sesler
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          En popüler ve hızla büyüyen TikTok sesleri
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ses veya sanatçı ara..."
            className="w-full bg-surface border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-teal/50 transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-surface border border-border rounded-lg py-2.5 px-3 text-sm text-text-primary focus:outline-none"
        >
          <option value="viralScore">Viral Skor</option>
          <option value="growthRate">Büyüme Oranı</option>
          <option value="usageCount">Kullanım Sayısı</option>
        </select>
      </div>

      {/* Genre filters */}
      <div className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenreFilter(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              genreFilter === g
                ? "bg-teal/10 text-teal border border-teal/30"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="text-xs text-text-muted">{filtered.length} ses bulundu</p>

      {/* Sound Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((sound, i) => (
          <motion.div
            key={sound.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => router.push(`/dashboard/sounds/${sound.id}`)}
            className="bg-surface rounded-xl border border-border p-5 hover:border-teal/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {sound.name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">@{sound.creator}</p>
              </div>
              <span className="text-xs font-mono bg-teal/10 text-teal px-2 py-1 rounded-md ml-2">
                {sound.viralScore.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase">Kullanım</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">
                  {sound.usageCount >= 1000
                    ? `${(sound.usageCount / 1000).toFixed(1)}K`
                    : sound.usageCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">Büyüme</p>
                <p className={`text-sm font-medium mt-0.5 ${sound.growthRate >= 0 ? "text-teal" : "text-neon-red"}`}>
                  {sound.growthRate >= 0 ? "+" : ""}{sound.growthRate}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">BPM</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">
                  {sound.bpm || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">Süre</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">{sound.duration}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
              <span className="text-xs bg-surface-light text-text-secondary px-2 py-1 rounded-md">
                {sound.genre}
              </span>
              <div className="flex items-center gap-2">
                <FiTrendingUp className={`w-3 h-3 ${sound.growthRate >= 0 ? "text-teal" : "text-neon-red"}`} />
                <span className="text-xs text-text-muted">
                  {sound.growthRate >= 50 ? "Hızla yükseliyor" : sound.growthRate >= 0 ? "Yükseliyor" : "Düşüyor"}
                </span>
                <FiArrowRight className="w-3 h-3 text-text-muted" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
