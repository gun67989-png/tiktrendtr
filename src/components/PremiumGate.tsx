"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Zap, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Premium gate component ─────────────────────────────────
interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
}

const PRO_FEATURES = [
  "Sınırsız trend video analizi",
  "Rakip analizi & karşılaştırma",
  "Viral hook pattern tespiti",
  "Günlük detaylı trend raporu",
  "AI destekli içerik fikirleri",
  "Gelişmiş büyüme stratejileri",
];

export default function PremiumGate({ children, featureName = "Bu özellik" }: PremiumGateProps) {
  const [subscriptionType, setSubscriptionType] = useState<"free" | "premium">("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSubscriptionType(data.user.subscriptionType || "free");
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

  if (subscriptionType === "premium") {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Lock icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
        >
          <Lock className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Premium Özellik
          </h2>
          <p className="text-muted-foreground text-sm">
            {featureName} Pro abonelere özeldir. Tüm gelişmiş özelliklere erişmek için planınızı yükseltin.
          </p>
        </div>

        {/* Features list */}
        <div className="bg-card rounded-xl border border-border p-6 text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Pro Plan ile neler kazanırsınız?</span>
          </div>
          {PRO_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-teal" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          Pro&apos;ya Yükselt
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[11px] text-muted-foreground">
          Aylık sadece ₺299 &middot; İstediğin zaman iptal et
        </p>
      </div>
    </motion.div>
  );
}
