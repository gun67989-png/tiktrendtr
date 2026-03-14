"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Building2,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  Cpu,
  Shirt,
  UtensilsCrossed,
  GraduationCap,
  Dumbbell,
  Gamepad2,
  Plane,
  Music2,
  DollarSign,
  HeartPulse,
  MoreHorizontal,
  Zap,
  Crown,
  Star,
} from "lucide-react";
import type { PlanType, Niche } from "@/lib/plans";

const NICHE_OPTIONS: { label: Niche; icon: React.ElementType }[] = [
  { label: "Kozmetik", icon: Palette },
  { label: "Teknoloji", icon: Cpu },
  { label: "Moda", icon: Shirt },
  { label: "Yemek", icon: UtensilsCrossed },
  { label: "Eğitim", icon: GraduationCap },
  { label: "Fitness", icon: Dumbbell },
  { label: "Oyun", icon: Gamepad2 },
  { label: "Seyahat", icon: Plane },
  { label: "Müzik", icon: Music2 },
  { label: "Finans", icon: DollarSign },
  { label: "Sağlık", icon: HeartPulse },
  { label: "Diğer", icon: MoreHorizontal },
];

const PLAN_OPTIONS: { id: PlanType; name: string; price: string; desc: string; icon: React.ElementType; color: string; retention: string }[] = [
  { id: "lite", name: "Bireysel Lite", price: "₺280/ay", desc: "2 Haftalık Döngü", icon: Zap, color: "border-blue-400 bg-blue-400/5", retention: "Veriler 14 günde bir tazelenir" },
  { id: "standard", name: "Bireysel Standart", price: "₺350/ay", desc: "4 Haftalık Arşiv", icon: Star, color: "border-teal bg-teal/5", retention: "Veriler 4 hafta boyunca saklanır" },
  { id: "enterprise", name: "Kurumsal", price: "₺1.250/ay", desc: "Tam Paket + Rakip Analizi", icon: Crown, color: "border-amber-400 bg-amber-400/5", retention: "30 günlük arşiv + AI raporlar" },
];

interface OnboardingFlowProps {
  username?: string;
  onComplete: () => void;
}

export default function OnboardingFlow({ username, onComplete }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"brand" | "individual" | null>(null);
  const [niche, setNiche] = useState<Niche | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFinish = async (plan: PlanType | "free") => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, niche, plan }),
      });
      if (res.ok) {
        if (plan !== "free") {
          router.push(`/payment?type=subscription&plan=${plan}`);
        }
        onComplete();
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-2xl border border-border max-w-xl w-full overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="flex gap-1 p-4 pb-0">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? "bg-teal" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Role */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-teal mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-foreground">
                    Hoş geldin{username ? `, ${username}` : ""}!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seni daha iyi tanıyalım. Nasıl kullanacaksın?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setRole("brand"); setStep(2); }}
                    className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-teal/50 ${
                      role === "brand" ? "border-teal bg-teal/5" : "border-border"
                    }`}
                  >
                    <Building2 className="w-8 h-8 text-teal" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Marka</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Markam için analiz yapacağım
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => { setRole("individual"); setStep(2); }}
                    className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all hover:border-teal/50 ${
                      role === "individual" ? "border-teal bg-teal/5" : "border-border"
                    }`}
                  >
                    <User className="w-8 h-8 text-purple-400" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">Bireysel</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        İçerik üretici / influencer&apos;ım
                      </p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Niche */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">Sektörünü Seç</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    İçeriklerini sana özel filtreleyeceğiz
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {NICHE_OPTIONS.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setNiche(label)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:border-teal/50 ${
                        niche === label ? "border-teal bg-teal/5" : "border-border"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${niche === label ? "text-teal" : "text-muted-foreground"}`} />
                      <span className="text-[11px] font-medium text-foreground">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                  </button>
                  <button
                    onClick={() => niche && setStep(3)}
                    disabled={!niche}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-teal text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal/80"
                  >
                    Devam
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">Planını Seç</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    İstediğin zaman değiştirebilirsin
                  </p>
                </div>

                <div className="space-y-3">
                  {PLAN_OPTIONS.map(({ id, name, price, desc, icon: Icon, color, retention }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedPlan(id)}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all text-left hover:border-teal/50 ${
                        selectedPlan === id ? color : "border-border"
                      }`}
                    >
                      <Icon className={`w-6 h-6 shrink-0 ${selectedPlan === id ? "text-teal" : "text-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{name}</p>
                          <span className="text-sm font-bold text-foreground">{price}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{desc} — {retention}</p>
                      </div>
                      {selectedPlan === id && <Check className="w-5 h-5 text-teal shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                  </button>
                  <button
                    onClick={() => selectedPlan && handleFinish(selectedPlan)}
                    disabled={!selectedPlan || saving}
                    className="flex items-center gap-1 px-5 py-2.5 rounded-lg bg-teal text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal/80"
                  >
                    {saving ? "Kaydediliyor..." : "Başla"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleFinish("free")}
                  disabled={saving}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Şimdilik Free ile devam et
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
