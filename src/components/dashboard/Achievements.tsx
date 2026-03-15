"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Flame, Target, Eye, Hash, Zap, TrendingUp, Award, X } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  bgColor: string;
  condition: string; // Human-readable condition
  points: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_visit",
    title: "İlk Adım",
    description: "Valyze'a ilk kez giriş yaptınız",
    icon: Star,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    condition: "Platformu ziyaret et",
    points: 10,
  },
  {
    id: "trend_explorer",
    title: "Trend Kaşifi",
    description: "Trend videolar sayfasını ziyaret ettiniz",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
    condition: "Trend Videolar sayfasını aç",
    points: 15,
  },
  {
    id: "hashtag_hunter",
    title: "Hashtag Avcısı",
    description: "Hashtag sayfasını incelemeye başladınız",
    icon: Hash,
    color: "text-teal",
    bgColor: "bg-teal/10",
    condition: "Hashtag'ler sayfasını aç",
    points: 15,
  },
  {
    id: "sound_seeker",
    title: "Ses Arayıcısı",
    description: "Trend sesleri keşfettiniz",
    icon: Zap,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    condition: "Sesler sayfasını aç",
    points: 15,
  },
  {
    id: "idea_generator",
    title: "Fikir Makinesi",
    description: "İçerik fikirleri sayfasını kullandınız",
    icon: Flame,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    condition: "İçerik Fikirleri sayfasını aç",
    points: 20,
  },
  {
    id: "hook_master",
    title: "Hook Ustası",
    description: "Hook kütüphanesinden bir hook kopyaladınız",
    icon: Target,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    condition: "Bir hook kopyala",
    points: 25,
  },
  {
    id: "time_optimizer",
    title: "Zaman Optimizörü",
    description: "En iyi paylaşım zamanlarını öğrendiniz",
    icon: Eye,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    condition: "Paylaşım Zamanı sayfasını aç",
    points: 15,
  },
  {
    id: "growth_strategist",
    title: "Büyüme Stratejisti",
    description: "Büyüme stratejisi sayfasını inceledınız",
    icon: Award,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    condition: "Büyüme Stratejisi sayfasını aç",
    points: 20,
  },
  {
    id: "competitor_analyst",
    title: "Rakip Analizci",
    description: "Bir rakip analizi yaptınız",
    icon: Eye,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    condition: "Rakip Analizi yap",
    points: 30,
  },
  {
    id: "all_rounder",
    title: "Her Şeyin Uzmanı",
    description: "Tüm temel özellikleri kullandınız",
    icon: Trophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    condition: "Tüm başarıları aç",
    points: 50,
  },
];

// Page-to-achievement mapping
const PAGE_ACHIEVEMENTS: Record<string, string> = {
  "/dashboard": "first_visit",
  "/dashboard/trending-videos": "trend_explorer",
  "/dashboard/hashtags": "hashtag_hunter",
  "/dashboard/sounds": "sound_seeker",
  "/dashboard/ideas": "idea_generator",
  "/dashboard/posting-times": "time_optimizer",
  "/dashboard/growth": "growth_strategist",
  "/dashboard/competitor": "competitor_analyst",
};

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("valyze_achievements");
    if (saved) setUnlocked(JSON.parse(saved));
  }, []);

  const unlock = (achievementId: string) => {
    if (unlocked.includes(achievementId)) return;

    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return;

    const updated = [...unlocked, achievementId];
    setUnlocked(updated);
    localStorage.setItem("valyze_achievements", JSON.stringify(updated));
    setNewAchievement(achievement);

    // Check all-rounder
    const basicAchievements = ACHIEVEMENTS.filter((a) => a.id !== "all_rounder").map((a) => a.id);
    if (basicAchievements.every((id) => updated.includes(id)) && !updated.includes("all_rounder")) {
      setTimeout(() => {
        const allRounder = [...updated, "all_rounder"];
        setUnlocked(allRounder);
        localStorage.setItem("valyze_achievements", JSON.stringify(allRounder));
        setNewAchievement(ACHIEVEMENTS.find((a) => a.id === "all_rounder")!);
      }, 3000);
    }

    setTimeout(() => setNewAchievement(null), 3000);
  };

  const checkPageAchievement = (pathname: string) => {
    const achievementId = PAGE_ACHIEVEMENTS[pathname];
    if (achievementId) unlock(achievementId);
  };

  const unlockCustom = (id: string) => unlock(id);

  const totalPoints = unlocked.reduce((sum, id) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    return sum + (a?.points || 0);
  }, 0);

  const maxPoints = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);

  return { unlocked, newAchievement, checkPageAchievement, unlockCustom, totalPoints, maxPoints };
}

// Toast notification for new achievement
export function AchievementToast({ achievement }: { achievement: Achievement | null }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 bg-card border border-amber-400/30 rounded-xl p-4 shadow-xl shadow-amber-400/5 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${achievement.bgColor} flex items-center justify-center flex-shrink-0`}>
              <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">Başarı Açıldı!</p>
              <p className="text-sm font-semibold text-foreground">{achievement.title}</p>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
              <p className="text-[10px] text-amber-400 mt-1">+{achievement.points} puan</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Full achievements panel
export function AchievementsPanel({ isOpen, onClose, unlocked, totalPoints, maxPoints }: {
  isOpen: boolean;
  onClose: () => void;
  unlocked: string[];
  totalPoints: number;
  maxPoints: number;
}) {
  const progress = Math.round((totalPoints / maxPoints) * 100);

  // Determine level
  let level = "Başlangıç";
  let levelColor = "text-muted-foreground";
  if (totalPoints >= 200) { level = "Uzman"; levelColor = "text-amber-500"; }
  else if (totalPoints >= 100) { level = "İleri Seviye"; levelColor = "text-purple-400"; }
  else if (totalPoints >= 50) { level = "Orta Seviye"; levelColor = "text-teal"; }
  else if (totalPoints >= 20) { level = "Keşifçi"; levelColor = "text-blue-400"; }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-400" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Başarılar</h2>
                  <p className="text-xs text-muted-foreground">
                    <span className={`font-semibold ${levelColor}`}>{level}</span> — {totalPoints}/{maxPoints} puan
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-5 pt-4">
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Achievements grid */}
            <div className="p-5 grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlocked.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl border p-3 transition-all ${
                      isUnlocked
                        ? `${achievement.bgColor} border-transparent`
                        : "bg-muted/30 border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <achievement.icon className={`w-4 h-4 ${isUnlocked ? achievement.color : "text-muted-foreground"}`} />
                      <span className={`text-xs font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                        {achievement.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{isUnlocked ? achievement.description : achievement.condition}</p>
                    <p className={`text-[10px] mt-1 font-medium ${isUnlocked ? achievement.color : "text-muted-foreground"}`}>
                      {isUnlocked ? `+${achievement.points} puan` : `${achievement.points} puan`}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
