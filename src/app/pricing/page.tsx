"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheck, FiArrowLeft, FiZap, FiStar, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import Link from "next/link";

const FREE_FEATURES = [
  "Trend video keşfi (sınırlı)",
  "Temel hashtag analizi",
  "Ses trendleri",
  "Paylaşım zamanı önerileri",
  "Reklam fikirleri",
];

const PRO_FEATURES = [
  "Sınırsız trend video analizi",
  "Gelişmiş hashtag & ses zekası",
  "Paylaşım zamanı optimizasyonu",
  "AI içerik fikirleri",
  "Büyüme stratejisi rehberi",
  "Trend tahmin sistemi",
  "Rakip analizi & karşılaştırma",
  "Viral hook pattern analizi",
  "Günlük detaylı trend raporu",
  "Reklam format önerileri",
  "Öncelikli destek",
];

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><FiLoader className="w-8 h-8 animate-spin text-neon-red" /></div>}>
      <PricingPageContent />
    </Suspense>
  );
}

function PricingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setIsPremium(data.user.subscriptionType === "premium");
        }
      })
      .catch(() => {});
  }, []);

  const handleProClick = (type: "single" | "subscription") => {
    if (!isLoggedIn) {
      router.push("/register");
      return;
    }
    if (isPremium) return;
    router.push(`/payment?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm">Ana Sayfa</span>
          </Link>
          {!isLoggedIn ? (
            <Link href="/login" className="text-sm text-text-secondary hover:text-neon-red transition-colors">
              Giriş Yap
            </Link>
          ) : (
            <Link href="/dashboard" className="text-sm text-text-secondary hover:text-neon-red transition-colors">
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Error/Success Banners */}
        {errorParam && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  {errorParam === "payment_failed"
                    ? "Ödeme başarısız oldu"
                    : errorParam === "token_missing"
                    ? "Ödeme token bulunamadı"
                    : errorParam === "payment_not_found"
                    ? "Ödeme kaydı bulunamadı"
                    : "Bir hata oluştu"}
                </p>
                {messageParam && (
                  <p className="text-xs text-red-400/70 mt-1">{messageParam}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Planınızı Seçin
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            TikTrend ile viral içerik üretmeye bugün başlayın. İstediğiniz zaman plan değiştirebilirsiniz.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-2xl border border-border p-8"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-1">Free</h3>
              <p className="text-text-muted text-sm">Başlangıç için</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-text-primary">₺0</span>
              <span className="text-text-muted text-sm ml-1">/ay</span>
            </div>

            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              className="block w-full text-center py-3 px-6 rounded-xl border border-border text-text-primary font-medium hover:bg-surface-light transition-all"
            >
              {isLoggedIn ? "Dashboard'a Git" : "Ücretsiz Başla"}
            </Link>

            <div className="mt-8 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-surface-light flex items-center justify-center shrink-0">
                    <FiCheck className="w-3 h-3 text-text-muted" />
                  </div>
                  <span className="text-sm text-text-secondary">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-2xl border-2 border-neon-red/30 p-8 relative"
          >
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-neon-red to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1.5">
                <FiStar className="w-3 h-3" />
                EN POPÜLER
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                Pro
                <FiZap className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-text-muted text-sm">Profesyonel içerik üreticileri için</p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-text-primary">₺299</span>
              <span className="text-text-muted text-sm ml-1">/ay</span>
            </div>

            {isPremium ? (
              <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-teal/10 border border-teal/20 text-teal font-medium">
                <FiCheckCircle className="w-4 h-4" />
                Aktif Pro Üye
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleProClick("subscription")}
                  className="block w-full text-center py-3 px-6 rounded-xl bg-gradient-to-r from-neon-red to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-neon-red/25 transition-all hover:-translate-y-0.5"
                >
                  Aylık Abone Ol
                </button>
                <button
                  onClick={() => handleProClick("single")}
                  className="block w-full text-center py-2.5 px-6 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-surface-light transition-all"
                >
                  Tek Seferlik 30 Gün
                </button>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {PRO_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                    <FiCheck className="w-3 h-3 text-teal" />
                  </div>
                  <span className="text-sm text-text-secondary">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Ücretsiz plan ne kadar süre kullanılabilir?",
                a: "Free plan süresiz olarak kullanılabilir. İstediğiniz zaman Pro'ya geçebilirsiniz.",
              },
              {
                q: "İstediğim zaman iptal edebilir miyim?",
                a: "Evet, Pro aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar erişiminiz devam eder.",
              },
              {
                q: "Ödeme yöntemleri nelerdir?",
                a: "Kredi kartı ve banka kartı ile iyzico güvenli altyapısı üzerinden ödeme yapabilirsiniz. 3D Secure ile korunur.",
              },
              {
                q: "Aylık abonelik ile tek seferlik ödeme farkı nedir?",
                a: "Aylık abonelikte her ay otomatik yenilenir, iptal edene kadar devam eder. Tek seferlik ödemede 30 günlük erişim sağlanır, otomatik yenilenmez.",
              },
              {
                q: "Pro plan ile ne fark eder?",
                a: "Pro plan ile tüm gelişmiş analiz araçlarına erişirsiniz: rakip analizi, hook pattern tespiti, günlük raporlar, AI içerik önerileri ve daha fazlası.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-surface rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-2">{faq.q}</h4>
                <p className="text-sm text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
