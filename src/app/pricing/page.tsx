"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Zap, Star, AlertCircle, CheckCircle, Loader, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { PLANS, type PlanType } from "@/lib/plans";

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-primary" /></div>}>
      <PricingPageContent />
    </Suspense>
  );
}

const PLAN_ICONS: Record<PlanType, React.ElementType> = {
  free: Sparkles,
  lite: Zap,
  standard: Star,
  enterprise: Crown,
};

const PLAN_COLORS: Record<PlanType, string> = {
  free: "border-border",
  lite: "border-blue-400/30",
  standard: "border-teal/30",
  enterprise: "border-amber-400/30",
};

const PLAN_HIGHLIGHT: Record<PlanType, string> = {
  free: "",
  lite: "",
  standard: "ring-2 ring-teal/20",
  enterprise: "",
};

function PricingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setCurrentPlan(data.user.subscriptionType || "free");
        }
      })
      .catch(() => {});
  }, []);

  const handlePlanClick = (planId: PlanType) => {
    if (!isLoggedIn) {
      router.push("/register");
      return;
    }
    if (planId === "free" || planId === currentPlan) return;
    router.push(`/payment?type=subscription&plan=${planId}`);
  };

  const planOrder: PlanType[] = ["free", "lite", "standard", "enterprise"];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Ana Sayfa</span>
          </Link>
          {!isLoggedIn ? (
            <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Giriş Yap
            </Link>
          ) : (
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Error Banner */}
        {errorParam && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 max-w-2xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  {errorParam === "payment_failed" ? "Ödeme başarısız oldu" : "Bir hata oluştu"}
                </p>
                {messageParam && <p className="text-xs text-red-400/70 mt-1">{messageParam}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Planınızı Seçin</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Valyze ile viral içerik üretmeye bugün başlayın. İstediğiniz zaman plan değiştirebilirsiniz.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {planOrder.map((planId, idx) => {
            const plan = PLANS[planId];
            const Icon = PLAN_ICONS[planId];
            const isCurrentPlan = currentPlan === planId;
            const isPopular = planId === "standard";

            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-card rounded-xl border-2 p-6 relative flex flex-col ${PLAN_COLORS[planId]} ${PLAN_HIGHLIGHT[planId]}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-teal text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      EN POPÜLER
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <Icon className={`w-6 h-6 mb-2 ${plan.badgeColor}`} />
                  <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {plan.retentionDays} günlük veri saklama
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">₺{plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground text-sm ml-1">/ay</span>}
                </div>

                {isCurrentPlan ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-teal/10 border border-teal/20 text-teal text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Aktif Plan
                  </div>
                ) : planId === "free" ? (
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/register"}
                    className="block text-center py-2.5 px-4 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-all"
                  >
                    {isLoggedIn ? "Dashboard" : "Ücretsiz Başla"}
                  </Link>
                ) : (
                  <button
                    onClick={() => handlePlanClick(planId)}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors ${
                      isPopular
                        ? "bg-teal text-white hover:bg-teal/80"
                        : "bg-primary text-white hover:bg-primary/80"
                    }`}
                  >
                    {isLoggedIn ? "Yükselt" : "Başla"}
                  </button>
                )}

                <div className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        planId === "free" ? "bg-muted" : "bg-teal/10"
                      }`}>
                        <Check className={`w-2.5 h-2.5 ${planId === "free" ? "text-muted-foreground" : "text-teal"}`} />
                      </div>
                      <span className="text-[12px] text-muted-foreground leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            {[
              { q: "Veri döngüsü ne demek?", a: "Her plana göre verileriniz belirli bir süre saklanır. Süre dolduğunda eski veriler silinir ve yeni veriler eklenmeye devam eder. Lite: 14 gün, Standart: 4 hafta, Kurumsal: 30 gün." },
              { q: "İstediğim zaman iptal edebilir miyim?", a: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar erişiminiz devam eder." },
              { q: "Ödeme yöntemleri nelerdir?", a: "Kredi kartı ve banka kartı ile iyzico güvenli altyapısı üzerinden ödeme yapabilirsiniz. 3D Secure ile korunur." },
              { q: "Planlar arası geçiş yapabilir miyim?", a: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Fark hesaplanarak uygulanır." },
              { q: "Kurumsal plan ne fark eder?", a: "Kurumsal plan ile rakip analizi, AI hook üretimi, PDF rapor çıktısı ve 30 günlük arşiv dahil tüm özelliklere erişirsiniz." },
            ].map((faq) => (
              <div key={faq.q} className="bg-card rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
