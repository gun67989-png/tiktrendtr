"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Target, Calendar, Users, Zap, CheckCircle, Lightbulb, ArrowRight, BookOpen, Clock, Play } from "lucide-react";
import { getGrowthStages } from "@/lib/data";
import PremiumGate from "@/components/PremiumGate";

const NICHE_TIPS: Record<string, string[]> = {
  Kozmetik: [
    "Before/After dönüşüm videoları en yüksek kaydetme oranına sahiptir",
    "GRWM (Get Ready With Me) formatı kozmetik nişinde %40 daha fazla izlenme alır",
    "Ürün inceleme videolarında doğal ışık kullanımı güvenilirliği artırır",
    "Trending ses + makyaj geçişi kombinasyonu viral potansiyeli yükseltir",
  ],
  Teknoloji: [
    "Unboxing ve ilk izlenim videoları teknoloji nişinde en çok paylaşılır",
    "Kısa ve öz 'nasıl yapılır' içerikleri kaydetme oranını artırır",
    "Yeni çıkan ürünlerin ilk günlerinde içerik üretmek keşfet şansını yükseltir",
    "Karşılaştırma videoları (A vs B) yüksek yorum etkileşimi sağlar",
  ],
  Moda: [
    "Outfit of the Day (OOTD) serisi tutarlı takipçi büyümesi sağlar",
    "Sezon geçişlerinde gardırop düzenleme içerikleri trend olur",
    "Uygun fiyatlı vs lüks karşılaştırmaları geniş kitleye ulaşır",
    "Kişisel stil ipuçları içerikleri en yüksek takip oranına sahiptir",
  ],
  Yemek: [
    "Overhead (kuşbakışı) çekim yemek videolarında altın standarttır",
    "30 saniyenin altında hızlı tarif videoları en çok paylaşılır",
    "Trend olan yiyecekleri deneme içerikleri keşfet algoritmasını tetikler",
    "ASMR yemek sesleri izlenme süresini önemli ölçüde artırır",
  ],
  "Eğitim": [
    "3 şey öğreneceksin formatı eğitim nişinde en etkili hook'tur",
    "Karmaşık konuları basitleştiren animasyonlar kaydetme oranını artırır",
    "Günlük bilgi serisi formatı sadık takipçi kitlesi oluşturur",
    "Sınav/quiz formatı yorum etkileşimini %60 artırır",
  ],
  Fitness: [
    "Egzersiz rutini videolarında ilk 3 saniyede sonucu gösterin",
    "Evde yapılabilir egzersiz içerikleri en geniş kitleye ulaşır",
    "İlerleme videoları (transformation) en yüksek kaydetme oranına sahiptir",
    "Beslenme ipuçları + egzersiz kombinasyonu çapraz kitle çeker",
  ],
  Oyun: [
    "Oyun içi epic anlar ve fail derlemeleri en çok paylaşılır",
    "Yeni çıkan oyunların ilk 48 saatinde içerik üretmek kritiktir",
    "İpucu ve trick videoları kaydetme oranını maksimize eder",
    "Canlı yayın kesitleri kısa video platformlarında çok iyi performans gösterir",
  ],
  Seyahat: [
    "Gizli mekan keşifleri seyahat nişinde en çok kaydedilen içerik türüdür",
    "Bütçe dostu seyahat ipuçları geniş kitleye hitap eder",
    "Drone çekimleri ve geçiş efektleri izlenme süresini artırır",
    "Yerel yemek deneyimleri seyahat + yemek çapraz kitlesini çeker",
  ],
};

const stageColors = [
  { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", accent: "#ff3b5c" },
  { bg: "bg-teal/10", border: "border-teal/30", text: "text-teal", accent: "#00d4aa" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", accent: "#a855f7" },
];

function GrowthContent() {
  const stages = useMemo(() => getGrowthStages(), []);
  const [niche, setNiche] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setNiche(data.user.subscriptionNiche || null);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="text-teal" />
          Büyüme Stratejisi{niche ? ` - ${niche}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          0&apos;dan 100K takipçiye ulaşmak için adım adım yol haritası
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Büyüme Yolu</span>
          <span className="text-xs text-muted-foreground">3 Aşama</span>
        </div>
        <div className="flex items-center gap-2">
          {stages.map((stage, i) => (
            <div key={stage.range} className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <div className="h-2 rounded-full overflow-hidden bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3 + i * 0.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stageColors[i].accent }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-center">{stage.range}</p>
              </div>
              {i < stages.length - 1 && (
                <div className="w-2 h-2 rounded-full bg-muteder flex-shrink-0" />
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
            className={`bg-card rounded-xl border ${stageColors[i].border} overflow-hidden`}
          >
            {/* Stage Header */}
            <div className={`${stageColors[i].bg} px-6 py-4 border-b ${stageColors[i].border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stageColors[i].accent + "20" }}
                  >
                    <Target className={`w-5 h-5 ${stageColors[i].text}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${stageColors[i].text}`}>{stage.range}</h2>
                    <p className="text-sm text-muted-foreground">{stage.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{stage.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{stage.postingFrequency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Content Formats */}
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4" style={{ color: stageColors[i].accent }} />
                  İçerik Formatları
                </h3>
                <ul className="space-y-2">
                  {stage.contentFormats.map((format, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle
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
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" style={{ color: stageColors[i].accent }} />
                  Algoritma İpuçları
                </h3>
                <ul className="space-y-2">
                  {stage.algorithmTips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle
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
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" style={{ color: stageColors[i].accent }} />
                  Etkileşim Stratejisi
                </h3>
                <ul className="space-y-2">
                  {stage.engagementStrategy.map((strategy, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle
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
        className="bg-card rounded-xl border border-amber-400/20 p-4 sm:p-6"
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
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-amber-400 flex-shrink-0">✦</span>
              {rule}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Niche Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-card rounded-xl border border-teal/20 p-4 sm:p-6"
      >
        <h3 className="text-sm font-semibold text-teal flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4" />
          Nişinize Özel İpuçları
        </h3>
        {niche && NICHE_TIPS[niche] ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NICHE_TIPS[niche].map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground bg-teal/5 rounded-lg p-3"
              >
                <CheckCircle className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nişinizi belirleyerek size özel büyüme ipuçları alabilirsiniz. Ayarlardan nişinizi seçerek kişiselleştirilmiş öneriler görün.
          </p>
        )}
      </motion.div>

      {/* CTA - Related Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            href: "/dashboard/hook-library",
            title: "Hook Kütüphanesi",
            description: "Dikkat çekici açılışlar ile izlenme sürenizi artırın",
            icon: BookOpen,
            color: "text-primary",
            borderColor: "border-primary/20",
            bgColor: "bg-primary/5",
          },
          {
            href: "/dashboard/posting-times",
            title: "Paylaşım Zamanları",
            description: "En yüksek etkileşim saatlerini keşfedin",
            icon: Clock,
            color: "text-teal",
            borderColor: "border-teal/20",
            bgColor: "bg-teal/5",
          },
          {
            href: "/dashboard/trending-videos",
            title: "Trend Videolar",
            description: "Güncel trendleri takip edin ve ilham alın",
            icon: Play,
            color: "text-purple-400",
            borderColor: "border-purple-500/20",
            bgColor: "bg-purple-500/5",
          },
        ].map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={`group bg-card rounded-xl border ${cta.borderColor} p-4 sm:p-5 hover:${cta.bgColor} transition-colors`}
          >
            <div className="flex items-center gap-3 mb-2">
              <cta.icon className={`w-5 h-5 ${cta.color}`} />
              <h4 className="text-sm font-semibold text-foreground">{cta.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{cta.description}</p>
            <span className={`text-xs font-medium ${cta.color} flex items-center gap-1 group-hover:gap-2 transition-all`}>
              Keşfet <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
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
