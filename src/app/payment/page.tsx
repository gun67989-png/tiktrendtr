"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader, AlertCircle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

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
  const planParam = searchParams.get("plan") || "standard";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const planPrices: Record<string, number> = { lite: 280, standard: 350, enterprise: 1250 };
  const planNames: Record<string, string> = { lite: "Bireysel Lite", standard: "Bireysel Standart", enterprise: "Kurumsal" };
  const selectedPrice = planPrices[planParam] || 350;
  const selectedName = planNames[planParam] || "Pro Plan";

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
        setError(data.error || "Ödeme başlatılamadı");
        return;
      }

      if (data.checkoutFormContent) {
        setCheckoutHtml(data.checkoutFormContent);
      } else if (data.paymentPageUrl) {
        // Fallback: redirect to iyzico payment page
        window.location.href = data.paymentPageUrl;
      } else {
        setError("Ödeme formu oluşturulamadı");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [paymentType, planParam]);

  useEffect(() => {
    initCheckout();
  }, [initCheckout]);

  // iyzico checkout form HTML'ini render et
  useEffect(() => {
    if (checkoutHtml && formRef.current) {
      formRef.current.innerHTML = checkoutHtml;
      // iyzico script'lerini çalıştır
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
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Planlara Dön</span>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Shield className="w-3.5 h-3.5 text-teal" />
            <span>256-bit SSL ile korunuyor</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {selectedName}
          </h1>
          <p className="text-muted-foreground text-sm">
            {paymentType === "subscription"
              ? `Aylık otomatik yenilenen abonelik - ₺${selectedPrice}/ay`
              : `Tek seferlik ödeme ile 30 gün erişimi - ₺${selectedPrice}`}
          </p>
        </motion.div>

        {/* Ödeme Özeti */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">Valyze {selectedName}</span>
            <span className="text-sm font-semibold text-foreground">₺{selectedPrice},00</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Toplam</span>
            <span className="text-lg font-bold text-primary">₺{selectedPrice},00</span>
          </div>
          {paymentType === "subscription" && (
            <p className="text-[11px] text-muted-foreground mt-3">
              Her ay otomatik olarak yenilenecektir. İstediğiniz zaman iptal edebilirsiniz.
            </p>
          )}
        </motion.div>

        {/* Ödeme Formu */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Ödeme formu yükleniyor...
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
                  Planlara Dön
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div ref={formRef} id="iyzipay-checkout-form" className="w-full" />
          )}
        </motion.div>

        {/* Güvenlik Bilgisi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 space-y-2"
        >
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[11px]">3D Secure</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <span className="text-[11px]">iyzico ile güvenli ödeme</span>
            <div className="w-px h-3 bg-border" />
            <span className="text-[11px]">PCI DSS uyumlu</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
