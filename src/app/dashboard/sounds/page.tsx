"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Search, TrendingUp, ArrowRight, Volume2, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

import OnboardingTour from "@/components/OnboardingTour";
import { soundsTourSteps } from "@/lib/onboarding";

interface SoundItem {
  id: string | number;
  name: string;
  creator: string;
  usageCount: number;
  growthRate?: number;
  growth?: number;
  bpm: number | null;
  duration: string | number;
  genre: string;
  viralScore: number;
  soundType?: string;
}

type SoundTab = "all" | "music" | "sound";

export default function SoundsPage() {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [source, setSource] = useState<string>("generated");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SoundTab>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"viralScore" | "growthRate" | "usageCount">("viralScore");
  const [genreFilter, setGenreFilter] = useState("Tümü");
  const router = useRouter();

  // Fetch sounds from API
  useEffect(() => {
    async function fetchSounds() {
      setLoading(true);
      try {
        const typeParam = activeTab === "all" ? "all" : activeTab;
        const res = await fetch(`/api/trends/sounds?type=${typeParam}`);
        const data = await res.json();
        if (data.sounds && data.sounds.length > 0) {
          setSounds(data.sounds);
          setSource(data.source);
        } else {
          setSounds([]);
          setSource("none");
        }
      } catch {
        setSounds([]);
        setSource("none");
      } finally {
        setLoading(false);
      }
    }
    fetchSounds();
  }, [activeTab]);

  const genres = useMemo(() => {
    const g = new Set(sounds.map((s) => s.genre));
    return ["Tümü", ...Array.from(g)];
  }, [sounds]);

  const filtered = useMemo(() => {
    let result = sounds;
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
    return result.sort((a, b) => {
      if (sortBy === "growthRate") {
        return (b.growthRate ?? b.growth ?? 0) - (a.growthRate ?? a.growth ?? 0);
      }
      return (b[sortBy] ?? 0) - (a[sortBy] ?? 0);
    });
  }, [sounds, genreFilter, search, sortBy]);

  const tabs: { key: SoundTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "all", label: "Tümü", icon: <TrendingUp className="w-4 h-4" />, desc: "Tüm sesler ve müzikler" },
    { key: "music", label: "Müzikler", icon: <Music className="w-4 h-4" />, desc: "Şarkılar, beat'ler, remix'ler" },
    { key: "sound", label: "Viral Sesler", icon: <Mic className="w-4 h-4" />, desc: "Viral ses efektleri, konuşmalar, orijinal sesler" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <OnboardingTour tourKey="sounds" steps={soundsTourSteps} tourTitle="Sesler" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Volume2 className="text-teal" />
          Sesler & Müzikler
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Viral sesler ve trend müzikler — ayrı ayrı takip et
          {source === "live" && (
            <span className="ml-2 inline-flex items-center gap-1 text-teal text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              Canlı
            </span>
          )}
        </p>
      </div>

      {/* Tabs — Müzik vs Ses */}
      <div className="flex gap-2 p-1 bg-muted/30 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setGenreFilter("Tümü"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-teal shadow-sm border border-teal/20"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <p className="text-xs text-muted-foreground -mt-3">
        {tabs.find(t => t.key === activeTab)?.desc}
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "music" ? "Şarkı veya sanatçı ara..." : activeTab === "sound" ? "Viral ses ara..." : "Ses veya sanatçı ara..."}
            className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-text-muted focus:outline-none focus:border-teal/50 transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-card border border-border rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none"
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
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {loading ? "Yükleniyor..." : `${filtered.length} ${activeTab === "music" ? "müzik" : activeTab === "sound" ? "ses" : "ses/müzik"} bulundu`}
      </p>

      {/* Sound Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mb-4" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-8 bg-muted rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Volume2 className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground">Henüz ses verisi bulunamadı</p>
          <p className="text-xs text-muted-foreground mt-1">Veriler yüklendiğinde burada görünecek</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sound, i) => {
            const growthVal = sound.growthRate ?? sound.growth ?? 0;
            return (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => router.push(`/dashboard/sounds/${encodeURIComponent(sound.name)}`)}
                className="bg-card rounded-xl border border-border p-5 hover:border-border/80 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* Sound type badge */}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        sound.soundType === "music"
                          ? "bg-purple-500/10 text-purple-400"
                          : sound.soundType === "original"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-teal/10 text-teal"
                      }`}>
                        {sound.soundType === "music" ? "Müzik" : sound.soundType === "original" ? "Orijinal" : "Ses"}
                      </span>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {sound.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">@{sound.creator}</p>
                  </div>
                  <span className="text-xs font-mono bg-teal/10 text-teal px-2 py-1 rounded-md ml-2">
                    {typeof sound.viralScore === "number" ? sound.viralScore.toFixed(2) : "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Kullanım</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {sound.usageCount >= 1000
                        ? `${(sound.usageCount / 1000).toFixed(1)}K`
                        : sound.usageCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Büyüme</p>
                    <p className={`text-sm font-medium mt-0.5 ${growthVal >= 0 ? "text-teal" : "text-primary"}`}>
                      {growthVal >= 0 ? "+" : ""}{growthVal}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">BPM</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {sound.bpm || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Süre</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {typeof sound.duration === "number" ? `${sound.duration}s` : sound.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                    {sound.genre}
                  </span>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-3 h-3 ${growthVal >= 0 ? "text-teal" : "text-primary"}`} />
                    <span className="text-xs text-muted-foreground">
                      {growthVal >= 50 ? "Hızla yükseliyor" : growthVal >= 0 ? "Yükseliyor" : "Düşüyor"}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
