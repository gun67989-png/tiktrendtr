"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader, AlertCircle, ArrowLeft, Shield, Check, Lock, CreditCard, RefreshCw } from "lucide-react";
import Link from "next/link";
import { PLANS, type PlanType } from "@/lib/plans";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader className="w-8 h-8 text-primary animate-spin" /></div>}>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const paymentType = searchParams.get("type") || "single";
  const planParam = (searchParams.get("plan") || "standard") as PlanType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const plan = PLANS[planParam] || PLANS.standard;

  const initCheckout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint =
        paymentType === "subscription"
          ? "/api/payment/subscription"
          : "/api/payment/checkout";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: paymentType, plan: planParam }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "\u00D6deme ba\u015Flat\u0131lamad\u0131");
        return;
      }

      if (data.checkoutFormContent) {
        setCheckoutHtml(data.checkoutFormContent);
      } else if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
      } else {
        setError("\u00D6deme formu olu\u015Fturulamad\u0131");
      }
    } catch {
      setError("Ba\u011Flant\u0131 hatas\u0131. L\u00FCtfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [paymentType, planParam]);

  useEffect(() => {
    initCheckout();
  }, [initCheckout]);

  useEffect(() => {
    if (checkoutHtml && formRef.current) {
      formRef.current.innerHTML = checkoutHtml;
      const scripts = formRef.current.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [checkoutHtml]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Planlara D\u00F6n</span>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Shield className="w-3.5 h-3.5 text-teal" />
            <span>256-bit SSL ile korunuyor</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {plan.name} Plan\u0131
          </h1>
          <p className="text-muted-foreground text-sm">
            {paymentType === "subscription"
              ? `Ayl\u0131k otomatik yenilenen abonelik`
              : `Tek seferlik \u00F6deme ile 30 g\u00FCn eri\u015Fimi`}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Plan Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-4"
          >
            {/* What You Get */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Ne Elde Edeceksiniz</h3>
              <ul className="space-y-2">
                {plan.features.slice(0, 8).map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 8 && (
                  <li className="text-xs text-muted-foreground/60 pl-5">
                    +{plan.features.length - 8} \u00F6zellik daha
                  </li>
                )}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">\u00D6deme \u00D6zeti</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Valyze {plan.name}</span>
                  <span className="text-xs font-semibold text-foreground">\u20BA{plan.price},00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Veri saklama s\u00FCresi</span>
                  <span className="text-xs text-foreground">{plan.retentionDays} g\u00FCn</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between items-center">
                  <span className="text-sm font-semibold text-foreground">Toplam</span>
                  <span className="text-lg font-bold text-primary">\u20BA{plan.price},00</span>
                </div>
              </div>
              {paymentType === "subscription" && (
                <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Her ay otomatik yenilenecektir.
                </p>
              )}
            </div>

            {/* Trust Signals */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-teal" />
                <span className="text-xs text-muted-foreground">3D Secure ile korunan \u00F6deme</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-teal" />
                <span className="text-xs text-muted-foreground">Visa, Mastercard, yerli kartlar</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-teal" />
                <span className="text-xs text-muted-foreground">PCI DSS uyumlu iyzico altyap\u0131s\u0131</span>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="text-[10px] text-muted-foreground/60 space-y-1 px-1">
              <p>\u0130stedi\u011Finiz zaman iptal edebilirsiniz. \u0130ptal sonras\u0131 d\u00F6nem sonuna kadar eri\u015Fiminiz devam eder.</p>
              <p>
                <Link href="/iptal-ve-iade" className="text-primary hover:underline">\u0130ptal ve \u0130ade Politikas\u0131</Link>
                {" \u00B7 "}
                <Link href="/mesafeli-satis-sozlesmesi" className="text-primary hover:underline">Mesafeli Sat\u0131\u015F S\u00F6zle\u015Fmesi</Link>
              </p>
            </div>
          </motion.div>

          {/* Right: Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3"
          >
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">\u00D6deme Bilgileri</h3>

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    \u00D6deme formu y\u00FCkleniyor...
                  </p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-sm text-red-400 text-center">{error}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => initCheckout()}
                      className="px-4 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Tekrar Dene
                    </button>
                    <Link
                      href="/pricing"
                      className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Planlara D\u00F6n
                    </Link>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div ref={formRef} id="iyzipay-checkout-form" className="w-full" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
