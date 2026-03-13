"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, Clock, Hash, Music, Play } from "lucide-react";
import { generateEmergingTrends } from "@/lib/data";
import PremiumGate from "@/components/PremiumGate";

const typeIcons: Record<string, typeof Hash> = {
  hashtag: Hash,
  sound: Music,
  format: Play,
};

const typeLabels: Record<string, string> = {
  hashtag: "Hashtag",
  sound: "Ses",
  format: "Format",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Az önce";
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

function PredictionsContent() {
  const trends = useMemo(() => generateEmergingTrends(), []);
  const [filter, setFilter] = useState<"all" | "hashtag" | "sound" | "format">("all");

  const filtered = filter === "all" ? trends : trends.filter((t) => t.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="text-primary" />
          Trend Tahminleri
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI destekli erken trend tespiti ve tahmin sistemi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Tespit Edilen Trend", value: trends.length, icon: TrendingUp, color: "text-primary" },
          { label: "Ortalama Güven", value: `%${Math.round(trends.reduce((a, t) => a + t.confidence, 0) / trends.length)}`, icon: Target, color: "text-teal" },
          { label: "Son Tarama", value: "2 saat önce", icon: Clock, color: "text-amber-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg bg-muted`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "hashtag", "sound", "format"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === type
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {type === "all" ? "Tümü" : typeLabels[type]}
          </button>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          🧠 Tahmin Sistemi Nasıl Çalışır?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Veri Toplama", desc: "Hashtag kullanımı, ses adaptasyonu ve video kümelenmesi izlenir" },
            { step: "2", title: "Anomali Tespiti", desc: "Normal büyüme oranlarının üzerindeki ani artışlar tespit edilir" },
            { step: "3", title: "Güven Skoru", desc: "Birden fazla sinyal birleştirilerek güven skoru hesaplanır" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{item.step}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Cards */}
      <div className="space-y-4">
        {filtered.map((trend, i) => {
          const Icon = typeIcons[trend.type] || Hash;
          return (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-5 hover:border-primary/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left - Icon & Type */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{trend.name}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        🔥 Yükselen
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {typeLabels[trend.type]}
                      </span>
                      <span className="text-xs text-muted-foreground">{trend.category}</span>
                    </div>
                  </div>
                </div>

                {/* Middle - Signal */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Sinyal</p>
                  <p className="text-sm text-muted-foreground">{trend.signal}</p>
                </div>

                {/* Right - Metrics */}
                <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Büyüme</p>
                    <p className="text-lg font-bold text-teal">+{trend.growthRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Güven</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${trend.confidence}%`,
                            backgroundColor: trend.confidence >= 80 ? "#00d4aa" : trend.confidence >= 60 ? "#f59e0b" : "#ff3b5c",
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">%{trend.confidence}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Tespit</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(trend.detectedAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function PredictionsPage() {
  return (
    <PremiumGate featureName="Trend Tahminleri">
      <PredictionsContent />
    </PremiumGate>
  );
}
