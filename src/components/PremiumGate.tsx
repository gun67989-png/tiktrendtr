"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PlanType } from "@/lib/plans";

interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
  requiredPlan?: PlanType;
}

const PLAN_FEATURES: Record<string, string[]> = {
  lite: [
    "Trend video analizi",
    "Hashtag & ses analizi",
    "İçerik üretici takibi",
    "Sektörel Hook Kütüphanesi",
    "14 günlük veri döngüsü",
  ],
  standard: [
    "Tüm Lite özellikleri",
    "Duygu Analizi (Sentiment)",
    "AI İçerik Fikirleri",
    "Büyüme Stratejisi",
    "Trend Tahminleri",
    "Hook Analizi",
    "Günlük & Detaylı Rapor",
  ],
  enterprise: [
    "Tüm Standart özellikleri",
    "Rakip Analizi & Savaş Odası",
    "AI Hook Üretimi",
    "PDF Rapor Çıktısı",
    "Trend Doygunluk Analizi",
    "Öncelikli destek",
  ],
};

const PLAN_NAMES: Record<string, string> = {
  lite: "Bireysel Lite",
  standard: "Bireysel Standart",
  enterprise: "Kurumsal",
};

const PLAN_PRICES: Record<string, number> = {
  lite: 280,
  standard: 350,
  enterprise: 1250,
};

export default function PremiumGate({
  children,
  featureName = "Bu özellik",
  requiredPlan = "standard",
}: PremiumGateProps) {
  const [subscriptionType, setSubscriptionType] = useState<PlanType>("free");
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSubscriptionType(data.user.subscriptionType || "free");
          setUserRole(data.user.role || "user");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 shimmer rounded w-64" />
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  // Admin always has access
  if (userRole === "admin") {
    return <>{children}</>;
  }

  // Check plan hierarchy: enterprise > standard > lite > free
  const planRank: Record<PlanType, number> = { free: 0, lite: 1, standard: 2, enterprise: 3 };
  const hasAccess = planRank[subscriptionType] >= planRank[requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  const features = PLAN_FEATURES[requiredPlan] || PLAN_FEATURES.standard;
  const planName = PLAN_NAMES[requiredPlan] || "Standart";
  const planPrice = PLAN_PRICES[requiredPlan] || 350;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="max-w-lg w-full text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <Lock className="w-8 h-8 text-primary" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {planName} Plan Gerekli
          </h2>
          <p className="text-muted-foreground text-sm">
            {featureName} {planName} ve üzeri planlar için aktiftir. Planınızı yükselterek bu özelliğe erişin.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-teal" />
            <span className="text-sm font-semibold text-foreground">
              {planName} Plan ile neler kazanırsınız?
            </span>
          </div>
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-teal" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal text-white font-semibold rounded-lg hover:bg-teal/80 transition-colors"
        >
          Planını Yükselt
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[11px] text-muted-foreground">
          {planName} aylık ₺{planPrice} &middot; İstediğin zaman iptal et
        </p>
      </div>
    </motion.div>
  );
}
