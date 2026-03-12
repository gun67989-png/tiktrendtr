"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FiTrendingUp, FiTarget, FiCalendar, FiUsers, FiZap, FiCheckCircle } from "react-icons/fi";
import { getGrowthStages } from "@/lib/data";
import PremiumGate from "@/components/PremiumGate";

const stageColors = [
  { bg: "bg-neon-red/10", border: "border-neon-red/30", text: "text-neon-red", accent: "#ff3b5c" },
  { bg: "bg-teal/10", border: "border-teal/30", text: "text-teal", accent: "#00d4aa" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", accent: "#a855f7" },
];

function GrowthContent() {
  const stages = useMemo(() => getGrowthStages(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <FiTrendingUp className="text-teal" />
          Büyüme Stratejisi
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          0&apos;dan 100K takipçiye ulaşmak için adım adım yol haritası
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-text-primary">Büyüme Yolu</span>
          <span className="text-xs text-text-muted">3 Aşama</span>
        </div>
        <div className="flex items-center gap-2">
          {stages.map((stage, i) => (
            <div key={stage.range} className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <div className="h-2 rounded-full overflow-hidden bg-surface-light">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3 + i * 0.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stageColors[i].accent }}
                  />
                </div>
                <p className="text-[10px] text-text-muted mt-1 text-center">{stage.range}</p>
              </div>
              {i < stages.length - 1 && (
                <div className="w-2 h-2 rounded-full bg-surface-lighter flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Growth Stages */}
      <div className="space-y-6">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.range}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
            className={`bg-surface rounded-xl border ${stageColors[i].border} overflow-hidden`}
          >
            {/* Stage Header */}
            <div className={`${stageColors[i].bg} px-6 py-4 border-b ${stageColors[i].border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stageColors[i].accent + "20" }}
                  >
                    <FiTarget className={`w-5 h-5 ${stageColors[i].text}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${stageColors[i].text}`}>{stage.range}</h2>
                    <p className="text-sm text-text-secondary">{stage.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-text-muted">
                    <FiCalendar className="w-3 h-3" />
                    <span className="text-xs">{stage.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-muted mt-1">
                    <FiUsers className="w-3 h-3" />
                    <span className="text-xs">{stage.postingFrequency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Content Formats */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                  <FiZap className="w-4 h-4" style={{ color: stageColors[i].accent }} />
                  İçerik Formatları
                </h3>
                <ul className="space-y-2">
                  {stage.contentFormats.map((format, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <FiCheckCircle
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: stageColors[i].accent }}
                      />
                      {format}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Algorithm Tips */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                  <FiTrendingUp className="w-4 h-4" style={{ color: stageColors[i].accent }} />
                  Algoritma İpuçları
                </h3>
                <ul className="space-y-2">
                  {stage.algorithmTips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <FiCheckCircle
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: stageColors[i].accent }}
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engagement Strategy */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                  <FiUsers className="w-4 h-4" style={{ color: stageColors[i].accent }} />
                  Etkileşim Stratejisi
                </h3>
                <ul className="space-y-2">
                  {stage.engagementStrategy.map((strategy, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                      <FiCheckCircle
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: stageColors[i].accent }}
                      />
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-surface rounded-xl border border-amber-400/20 p-4 sm:p-6"
      >
        <h3 className="text-sm font-semibold text-amber-400 mb-4">💡 Altın Kurallar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "İlk 3 saniye her şeydir - güçlü hook kullanın",
            "Tutarlılık > Mükemmellik - her gün paylaşın",
            "Trend seslerini ve hashtag'leri takip edin",
            "Topluluk oluşturun - yorumlara cevap verin",
            "Analytics'i takip edin ve A/B test yapın",
            "Niş'inize sadık kalın ama yeniliklere açık olun",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="text-amber-400 flex-shrink-0">✦</span>
              {rule}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GrowthPage() {
  return (
    <PremiumGate featureName="Büyüme Stratejisi">
      <GrowthContent />
    </PremiumGate>
  );
}
