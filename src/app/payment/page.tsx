"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiLoader, FiAlertCircle, FiArrowLeft, FiShield } from "react-icons/fi";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><FiLoader className="w-8 h-8 text-neon-red animate-spin" /></div>}>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const paymentType = searchParams.get("type") || "single";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ type: paymentType }),
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
  }, [paymentType]);

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
      <nav className="border-b border-border bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm">Planlara Dön</span>
          </Link>
          <div className="flex items-center gap-2 text-text-muted text-xs">
            <FiShield className="w-3.5 h-3.5 text-teal" />
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
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {paymentType === "subscription" ? "Pro Abonelik" : "Pro Plan (30 Gün)"}
          </h1>
          <p className="text-text-secondary text-sm">
            {paymentType === "subscription"
              ? "Aylık otomatik yenilenen abonelik - ₺299/ay"
              : "Tek seferlik ödeme ile 30 gün Pro erişimi - ₺299"}
          </p>
        </motion.div>

        {/* Ödeme Özeti */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-xl border border-border p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-text-secondary">Valyze Pro Plan</span>
            <span className="text-sm font-semibold text-text-primary">₺299,00</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-text-primary">Toplam</span>
            <span className="text-lg font-bold text-neon-red">₺299,00</span>
          </div>
          {paymentType === "subscription" && (
            <p className="text-[11px] text-text-muted mt-3">
              Her ay otomatik olarak yenilenecektir. İstediğiniz zaman iptal edebilirsiniz.
            </p>
          )}
        </motion.div>

        {/* Ödeme Formu */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-xl border border-border p-6"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <FiLoader className="w-8 h-8 text-neon-red animate-spin" />
              <p className="text-sm text-text-secondary">
                Ödeme formu yükleniyor...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <FiAlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm text-red-400 text-center">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => initCheckout()}
                  className="px-4 py-2 text-sm rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20 transition-colors"
                >
                  Tekrar Dene
                </button>
                <Link
                  href="/pricing"
                  className="px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:bg-surface-light transition-colors"
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
          <div className="flex items-center justify-center gap-4 text-text-muted">
            <div className="flex items-center gap-1.5">
              <FiShield className="w-3.5 h-3.5" />
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
