"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FiClock, FiInfo } from "react-icons/fi";
import { generatePostingTimes } from "@/lib/data";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getColor(value: number): string {
  if (value >= 85) return "bg-neon-red";
  if (value >= 70) return "bg-neon-red/70";
  if (value >= 55) return "bg-amber-500/70";
  if (value >= 40) return "bg-amber-500/40";
  if (value >= 25) return "bg-teal/40";
  if (value >= 15) return "bg-teal/20";
  return "bg-surface-lighter";
}

function getLabel(value: number): string {
  if (value >= 85) return "Mükemmel";
  if (value >= 70) return "Çok İyi";
  if (value >= 55) return "İyi";
  if (value >= 40) return "Orta";
  if (value >= 25) return "Düşük";
  return "Çok Düşük";
}

export default function PostingTimesPage() {
  const data = useMemo(() => generatePostingTimes(), []);

  const getEngagement = (day: string, hour: number) => {
    const entry = data.find((d) => d.day === day && d.hour === hour);
    return entry?.engagement || 0;
  };

  const bestTimes = useMemo(() => {
    return [...data]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5);
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <FiClock className="text-amber-400" />
          En İyi Paylaşım Zamanları
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Türkiye&apos;deki etkileşim verilerine göre en iyi paylaşım saatleri
        </p>
      </div>

      {/* Best Times Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {bestTimes.map((t, i) => (
          <motion.div
            key={`${t.day}-${t.hour}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-surface rounded-xl border border-border p-4 text-center"
          >
            <div className="text-xs text-text-muted mb-1">#{i + 1} En İyi</div>
            <div className="text-lg font-bold text-neon-red">
              {String(t.hour).padStart(2, "0")}:00
            </div>
            <div className="text-sm text-text-secondary">{t.day}</div>
            <div className="text-xs text-teal mt-1">%{t.engagement} etkileşim</div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-surface rounded-xl border border-border p-4 flex items-start gap-3">
        <FiInfo className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
        <div className="text-sm text-text-secondary">
          <p className="font-medium text-text-primary mb-1">Nasıl okunur?</p>
          <p>
            Isı haritası, Türkiye&apos;deki TikTok kullanıcılarının etkileşim oranlarını gösterir.
            Kırmızı = yüksek etkileşim, koyu = düşük etkileşim. Prime time: 19:00-23:00 arası.
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-surface rounded-xl border border-border p-4 overflow-x-auto">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Haftalık Etkileşim Isı Haritası
        </h3>
        <div className="min-w-[500px]">
          {/* Hour labels */}
          <div className="flex items-center mb-1">
            <div className="w-16 flex-shrink-0" />
            <div className="flex-1 grid grid-cols-24 gap-px">
              {HOURS.map((h) => (
                <div key={h} className="text-center text-[8px] text-text-muted">
                  {h % 3 === 0 ? `${String(h).padStart(2, "0")}` : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap rows */}
          {DAYS.map((day, di) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: di * 0.05 }}
              className="flex items-center mb-px"
            >
              <div className="w-16 flex-shrink-0 text-[10px] text-text-secondary pr-2 text-right">
                {day.slice(0, 3)}
              </div>
              <div className="flex-1 grid grid-cols-24 gap-px">
                {HOURS.map((hour) => {
                  const engagement = getEngagement(day, hour);
                  return (
                    <div
                      key={hour}
                      className={`h-5 rounded-[2px] ${getColor(engagement)} cursor-pointer transition-all hover:scale-110 hover:z-10 relative group`}
                      title={`${day} ${String(hour).padStart(2, "0")}:00 - %${engagement} etkileşim`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20">
                        <div className="bg-surface-light border border-border rounded-lg px-2 py-1.5 text-[10px] whitespace-nowrap shadow-xl">
                          <p className="font-medium text-text-primary">{day} {String(hour).padStart(2, "0")}:00</p>
                          <p className="text-text-secondary">%{engagement} - {getLabel(engagement)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border/50">
          <span className="text-[10px] text-text-muted">Düşük</span>
          <div className="flex gap-0.5">
            <div className="w-5 h-2.5 rounded-sm bg-surface-lighter" />
            <div className="w-5 h-2.5 rounded-sm bg-teal/20" />
            <div className="w-5 h-2.5 rounded-sm bg-teal/40" />
            <div className="w-5 h-2.5 rounded-sm bg-amber-500/40" />
            <div className="w-5 h-2.5 rounded-sm bg-amber-500/70" />
            <div className="w-5 h-2.5 rounded-sm bg-neon-red/70" />
            <div className="w-5 h-2.5 rounded-sm bg-neon-red" />
          </div>
          <span className="text-[10px] text-text-muted">Yüksek</span>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Prime Time", desc: "19:00 - 23:00 arası en yüksek etkileşim oranına sahip", icon: "🌙" },
          { title: "Hafta Sonu", desc: "Cumartesi ve Pazar günleri %15 daha fazla etkileşim", icon: "📅" },
          { title: "Cuma Akşamı", desc: "Cuma 17:00 sonrası etkileşim %20 artıyor", icon: "🎉" },
        ].map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-surface rounded-xl border border-border p-4"
          >
            <span className="text-2xl">{tip.icon}</span>
            <h4 className="text-sm font-semibold text-text-primary mt-2">{tip.title}</h4>
            <p className="text-xs text-text-secondary mt-1">{tip.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
