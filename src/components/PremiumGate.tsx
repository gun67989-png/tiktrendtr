"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLock, FiZap, FiCheck, FiArrowRight } from "react-icons/fi";
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
          className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-red/20 to-purple-500/20 border border-neon-red/30 flex items-center justify-center"
        >
          <FiLock className="w-8 h-8 text-neon-red" />
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Premium Özellik
          </h2>
          <p className="text-text-secondary text-sm">
            {featureName} Pro abonelere özeldir. Tüm gelişmiş özelliklere erişmek için planınızı yükseltin.
          </p>
        </div>

        {/* Features list */}
        <div className="bg-surface rounded-xl border border-border p-6 text-left space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <FiZap className="w-4 h-4 text-neon-red" />
            <span className="text-sm font-semibold text-text-primary">Pro Plan ile neler kazanırsınız?</span>
          </div>
          {PRO_FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                <FiCheck className="w-3 h-3 text-teal" />
              </div>
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-neon-red to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-neon-red/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          Pro&apos;ya Yükselt
          <FiArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[11px] text-text-muted">
          Aylık sadece ₺299 &middot; İstediğin zaman iptal et
        </p>
      </div>
    </motion.div>
  );
}
