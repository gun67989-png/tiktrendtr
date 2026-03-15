"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowLeft, Zap, Star, AlertCircle, CheckCircle, Loader, Crown, Sparkles, Shield, ChevronDown, Mail } from "lucide-react";
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

const PLAN_GRADIENTS: Record<PlanType, string> = {
  free: "bg-gradient-to-br from-card via-card to-muted/30",
  lite: "bg-gradient-to-br from-card via-card to-blue-500/5",
  standard: "bg-gradient-to-br from-card via-teal/5 to-teal/10",
  enterprise: "bg-gradient-to-br from-card via-card to-amber-500/5",
};

const PLAN_ICON_COLORS: Record<PlanType, string> = {
  free: "text-muted-foreground",
  lite: "text-blue-400",
  standard: "text-teal",
  enterprise: "text-amber-400",
};

const PLAN_CHECK_STYLES: Record<PlanType, { bg: string; icon: string }> = {
  free: { bg: "bg-muted", icon: "text-muted-foreground" },
  lite: { bg: "bg-blue-400/10", icon: "text-blue-400" },
  standard: { bg: "bg-teal/10", icon: "text-teal" },
  enterprise: { bg: "bg-amber-400/10", icon: "text-amber-400" },
};

function PricingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const COMPARISON_FEATURES = [
    { name: "Veri saklama süresi", free: "7 gün", lite: "14 gün", standard: "28 gün", enterprise: "30 gün" },
    { name: "Trend video analizi", free: "Sınırlı", lite: "Sınırsız", standard: "Sınırsız", enterprise: "Sınırsız" },
    { name: "Hashtag analizi", free: "check", lite: "check", standard: "check", enterprise: "check" },
    { name: "Ses trendleri", free: "check", lite: "check", standard: "check", enterprise: "check" },
    { name: "Paylaşım zamanı", free: "check", lite: "check", standard: "check", enterprise: "check" },
    { name: "İçerik üretici takibi", free: "cross", lite: "check", standard: "check", enterprise: "check" },
    { name: "Hook Kütüphanesi", free: "cross", lite: "check", standard: "check", enterprise: "check" },
    { name: "Duygu Analizi", free: "cross", lite: "cross", standard: "check", enterprise: "check" },
    { name: "AI İçerik Fikirleri", free: "cross", lite: "cross", standard: "check", enterprise: "check" },
    { name: "Trend Tahminleri", free: "cross", lite: "cross", standard: "check", enterprise: "check" },
    { name: "Günlük Rapor", free: "cross", lite: "cross", standard: "check", enterprise: "check" },
    { name: "Rakip Analizi", free: "cross", lite: "cross", standard: "cross", enterprise: "check" },
    { name: "PDF Rapor Dışa Aktarma", free: "cross", lite: "cross", standard: "cross", enterprise: "check" },
  ];

  const renderCellValue = (value: string, isStandardCol?: boolean) => {
    if (value === "check") {
      return (
        <div className="flex justify-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isStandardCol ? "bg-teal/15" : "bg-teal/10"}`}>
            <Check className="w-3 h-3 text-teal" />
          </div>
        </div>
      );
    }
    if (value === "cross") {
      return (
        <div className="flex justify-center">
          <X className="w-4 h-4 text-muted-foreground/30" />
        </div>
      );
    }
    return <span className={`text-sm font-medium ${isStandardCol ? "text-teal" : "text-foreground"}`}>{value}</span>;
  };

  const faqs = [
    { q: "Veri döngüsü ne demek?", a: "Her plana göre verileriniz belirli bir süre saklanır. Süre dolduğunda eski veriler silinir ve yeni veriler eklenmeye devam eder. Lite: 14 gün, Standart: 4 hafta, Kurumsal: 30 gün." },
    { q: "İstediğim zaman iptal edebilir miyim?", a: "Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar erişiminiz devam eder." },
    { q: "Ödeme yöntemleri nelerdir?", a: "Kredi kartı ve banka kartı ile iyzico güvenli altyapısı üzerinden ödeme yapabilirsiniz. 3D Secure ile korunur." },
    { q: "Planlar arası geçiş yapabilir miyim?", a: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Fark hesaplanarak uygulanır." },
    { q: "Kurumsal plan ne fark eder?", a: "Kurumsal plan ile rakip analizi, AI hook üretimi, PDF rapor çıktısı ve 30 günlük arşiv dahil tüm özelliklere erişirsiniz." },
    { q: "Ücretsiz plan ne kadar süre kullanılabilir?", a: "Ücretsiz plan süresiz olarak kullanılabilir. İstediğiniz zaman ücretli plana geçebilirsiniz." },
    { q: "Verilerim güvende mi?", a: "Tüm veriler SSL şifreleme ile korunmaktadır. Ödeme işlemleri PCI DSS uyumlu iyzico altyapısı üzerinden gerçekleştirilir." },
    { q: "API erişimi var mı?", a: "Şu an API erişimi sunulmamaktadır. Kurumsal plan kullanıcıları için gelecekte API erişimi planlanmaktadır." },
    { q: "Fatura alabilir miyim?", a: "Evet, her ödeme sonrası otomatik olarak e-fatura oluşturulur ve e-posta adresinize gönderilir." },
    { q: "Yıllık ödeme seçeneği var mı?", a: "Şu an sadece aylık abonelik seçeneği mevcuttur. Yıllık plan yakında eklenecektir." },
  ];

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Size Uygun{" "}
            <span className="bg-gradient-to-r from-teal via-primary to-teal bg-clip-text text-transparent">
              Planı Seçin
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Valyze ile viral içerik üretmeye bugün başlayın. Tüm planlar anında aktif olur, istediğiniz zaman değiştirebilirsiniz.
          </p>
        </motion.div>

        {/* Money-back Guarantee Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal/10 via-teal/5 to-teal/10 border border-teal/20 rounded-full px-6 py-3">
            <div className="w-8 h-8 rounded-full bg-teal/15 flex items-center justify-center">
              <Shield className="w-4 h-4 text-teal" />
            </div>
            <div>
              <span className="text-sm font-semibold text-teal">7 Gün Para İade Garantisi</span>
              <p className="text-xs text-muted-foreground">Memnun kalmazsanız, soru sormadan iade</p>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {planOrder.map((planId, idx) => {
            const plan = PLANS[planId];
            const Icon = PLAN_ICONS[planId];
            const isCurrentPlan = currentPlan === planId;
            const isPopular = planId === "standard";
            const checkStyle = PLAN_CHECK_STYLES[planId];

            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl border-2 p-6 relative flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${PLAN_GRADIENTS[planId]} ${PLAN_COLORS[planId]} ${
                  isPopular ? "ring-2 ring-teal/20 lg:scale-105 lg:-my-2 shadow-xl shadow-teal/5" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-teal to-teal/80 text-white text-[11px] font-bold px-4 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-teal/20">
                      <Star className="w-3 h-3" />
                      EN POPÜLER
                    </div>
                  </div>
                )}

                {planId === "lite" && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-500/90 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                      BAŞLANGIÇ
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    planId === "free" ? "bg-muted" :
                    planId === "lite" ? "bg-blue-400/10" :
                    planId === "standard" ? "bg-teal/10" :
                    "bg-amber-400/10"
                  }`}>
                    <Icon className={`w-5 h-5 ${PLAN_ICON_COLORS[planId]}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {plan.retentionDays} günlük veri saklama
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">₺{plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground text-sm ml-1">/ay</span>}
                  {planId === "standard" && (
                    <p className="text-xs text-teal mt-1 font-medium">En iyi fiyat/performans</p>
                  )}
                  {planId === "enterprise" && (
                    <p className="text-xs text-amber-400 mt-1 font-medium">Tam erişim</p>
                  )}
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
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isPopular
                        ? "bg-gradient-to-r from-teal to-teal/80 text-white hover:shadow-lg hover:shadow-teal/20"
                        : planId === "enterprise"
                        ? "bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:shadow-lg hover:shadow-amber-500/20"
                        : "bg-primary text-white hover:bg-primary/80"
                    }`}
                  >
                    {isLoggedIn ? "Yükselt" : "Başla"}
                  </button>
                )}

                <div className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${checkStyle.bg}`}>
                        <Check className={`w-2.5 h-2.5 ${checkStyle.icon}`} />
                      </div>
                      <span className="text-[12px] text-muted-foreground leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-full px-6 py-3">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal" />
              <span className="text-xs text-muted-foreground">7 gün iade garantisi</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs text-muted-foreground">Güvenli ödeme</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs text-muted-foreground">İstediğiniz zaman iptal</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Özellik Karşılaştırması</h2>
          <p className="text-muted-foreground text-sm text-center mb-8">Tüm planları detaylı karşılaştırın</p>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left text-sm font-semibold text-foreground py-4 pl-6 pr-4 w-[200px]">Özellik</th>
                    <th className="text-center text-sm font-semibold text-muted-foreground py-4 px-3">Free</th>
                    <th className="text-center text-sm font-semibold text-blue-400 py-4 px-3">Lite</th>
                    <th className="text-center text-sm font-semibold text-teal py-4 px-3 bg-teal/5">
                      <div className="flex items-center justify-center gap-1.5">
                        <Star className="w-3.5 h-3.5" />
                        Standart
                      </div>
                    </th>
                    <th className="text-center text-sm font-semibold text-amber-400 py-4 px-3">Kurumsal</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((feature, idx) => (
                    <tr key={feature.name} className={`border-t border-border/50 ${idx % 2 === 0 ? "bg-muted/10" : ""}`}>
                      <td className="text-sm text-muted-foreground py-3.5 pl-6 pr-4 font-medium">{feature.name}</td>
                      <td className="text-center py-3.5 px-3">{renderCellValue(feature.free)}</td>
                      <td className="text-center py-3.5 px-3">{renderCellValue(feature.lite)}</td>
                      <td className="text-center py-3.5 px-3 bg-teal/5">{renderCellValue(feature.standard, true)}</td>
                      <td className="text-center py-3.5 px-3">{renderCellValue(feature.enterprise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Sık Sorulan Sorular</h2>
          <p className="text-muted-foreground text-sm text-center mb-8">Merak ettiklerinize hızlıca yanıt bulun</p>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-card rounded-xl border border-border overflow-hidden transition-colors hover:border-border/80">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <h4 className="text-sm font-semibold text-foreground pr-4">{faq.q}</h4>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">Sorularınız mı var?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Size yardımcı olmaktan mutluluk duyarız. Bize istediğiniz zaman ulaşabilirsiniz.
            </p>
            <a
              href="mailto:destek@valyze.com"
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-primary/15 transition-colors"
            >
              <Mail className="w-4 h-4" />
              destek@valyze.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
