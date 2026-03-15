"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ChevronRight, CheckCircle, Lightbulb, TrendingUp, Hash, Music, Zap, Target } from "lucide-react";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
  color: string;
  link: string;
  tip: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: "explore-trends",
    title: "Trend Videoları Keşfet",
    description: "Türkiye'de viral olan videoları inceleyin. Viral skor, etkileşim oranı ve format bilgilerini görün.",
    icon: TrendingUp,
    color: "text-primary",
    link: "/dashboard/trending-videos",
    tip: "Viral skor 7+ olan videolara odaklanın — bunlar gerçek trend göstergeleri.",
  },
  {
    id: "check-hashtags",
    title: "Trend Hashtag'leri Takip Et",
    description: "En çok kullanılan ve en hızlı büyüyen hashtag'leri görün. İçeriklerinizde kullanın.",
    icon: Hash,
    color: "text-teal",
    link: "/dashboard/hashtags",
    tip: "Haftalık büyümesi %50+ olan hashtag'ler yükselen trendleri gösterir.",
  },
  {
    id: "find-sounds",
    title: "Popüler Sesleri Bul",
    description: "Trend olan sesleri keşfedin. Doğru ses seçimi videonuzun keşfet'e düşme şansını artırır.",
    icon: Music,
    color: "text-purple-400",
    link: "/dashboard/sounds",
    tip: "Yükselen sesler (🔥 işaretli) algoritma tarafından desteklenir.",
  },
  {
    id: "posting-time",
    title: "En İyi Paylaşım Zamanını Öğren",
    description: "Hangi gün ve saatte paylaşım yaparsanız en yüksek etkileşimi alırsınız?",
    icon: Target,
    color: "text-blue-400",
    link: "/dashboard/posting-times",
    tip: "Türkiye'de en yüksek etkileşim genellikle 19:00-22:00 arasında olur.",
  },
  {
    id: "get-ideas",
    title: "İçerik Fikri Al",
    description: "Nişinize özel viral içerik fikirleri, hook önerileri ve hazır caption'lar alın.",
    icon: Lightbulb,
    color: "text-amber-400",
    link: "/dashboard/ideas",
    tip: "Her fikirde önerilen hashtag'leri ve sesleri de kullanın — combo etkisi yaratır.",
  },
  {
    id: "use-hooks",
    title: "Güçlü Hook Kullan",
    description: "İlk 3 saniye her şeydir. Hook kütüphanesinden kanıtlanmış açılış cümlelerini kullanın.",
    icon: Zap,
    color: "text-orange-400",
    link: "/dashboard/hook-library",
    tip: "En yüksek viral skora sahip hook'ları kopyalayıp kendi nişinize uyarlayın.",
  },
];

export default function BeginnerGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("valyze_guide_completed");
    if (saved) setCompletedSteps(JSON.parse(saved));
    const isDismissed = localStorage.getItem("valyze_guide_dismissed");
    if (isDismissed) setDismissed(true);
  }, []);

  const toggleStep = (stepId: string) => {
    const updated = completedSteps.includes(stepId)
      ? completedSteps.filter((s) => s !== stepId)
      : [...completedSteps, stepId];
    setCompletedSteps(updated);
    localStorage.setItem("valyze_guide_completed", JSON.stringify(updated));
  };

  const progress = Math.round((completedSteps.length / GUIDE_STEPS.length) * 100);
  const allDone = completedSteps.length === GUIDE_STEPS.length;

  if (dismissed && !isOpen) return null;

  return (
    <>
      {/* Collapsed banner */}
      {!isOpen && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-amber-400/20 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Başlangıç Rehberi</h3>
              <p className="text-xs text-muted-foreground">
                {allDone ? "Tebrikler! Tüm adımları tamamladınız!" : `${completedSteps.length}/${GUIDE_STEPS.length} adım tamamlandı`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Progress bar */}
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              {allDone ? "Görüntüle" : "Devam Et"} <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                setDismissed(true);
                localStorage.setItem("valyze_guide_dismissed", "true");
              }}
              className="text-muted-foreground hover:text-foreground ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Full guide modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Başlangıç Rehberi</h2>
                    <p className="text-xs text-muted-foreground">{progress}% tamamlandı</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-5 pt-4">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="p-5 space-y-3">
                {GUIDE_STEPS.map((step, i) => {
                  const isDone = completedSteps.includes(step.id);
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-xl border p-4 transition-all ${
                        isDone
                          ? "bg-teal/5 border-teal/20"
                          : "bg-card border-border hover:border-amber-400/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                            isDone
                              ? "bg-teal border-teal text-white"
                              : "border-border hover:border-amber-400"
                          }`}
                        >
                          {isDone && <CheckCircle className="w-4 h-4" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <step.icon className={`w-4 h-4 ${step.color}`} />
                            <h3 className={`text-sm font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                          {!isDone && (
                            <div className="mt-2 bg-amber-400/5 border border-amber-400/10 rounded-lg p-2">
                              <p className="text-[11px] text-amber-400/80">
                                <Lightbulb className="w-3 h-3 inline mr-1" />
                                {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              {allDone && (
                <div className="p-5 border-t border-border text-center">
                  <p className="text-sm text-teal font-medium">Tebrikler! Artık Valyze&apos;ı profesyonel gibi kullanabilirsiniz.</p>
                  <p className="text-xs text-muted-foreground mt-1">Bu rehbere istediğiniz zaman sidebar&apos;dan ulaşabilirsiniz.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
