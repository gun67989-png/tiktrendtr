"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLoader,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import Link from "next/link";

interface SubscriptionStatus {
  subscription_type: "free" | "premium";
  subscription_status: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  is_active: boolean;
  cancel_at_period_end: boolean;
  days_remaining: number;
}

interface PaymentRecord {
  id: string;
  payment_type: "single" | "subscription";
  amount: number;
  currency: string;
  status: "pending" | "success" | "failure" | "refunded";
  period_start: string | null;
  period_end: string | null;
  card_last_four: string | null;
  card_type: string | null;
  created_at: string;
}

export default function BillingPage() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/payment/status").then((r) => r.json()),
      fetch("/api/payment/history").then((r) => r.json()),
    ])
      .then(([statusData, historyData]) => {
        if (statusData.subscription_type) setStatus(statusData);
        if (historyData.payments) setPayments(historyData.payments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    if (!confirm("Aboneliğinizi iptal etmek istediğinizden emin misiniz? Dönem sonuna kadar Pro özellikleriniz devam edecek.")) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch("/api/payment/cancel", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setCancelMessage(data.message);
        // Status'u yenile
        const statusRes = await fetch("/api/payment/status");
        const statusData = await statusRes.json();
        if (statusData.subscription_type) setStatus(statusData);
      } else {
        setCancelMessage(data.error || "İptal işlemi başarısız oldu");
      }
    } catch {
      setCancelMessage("Bağlantı hatası");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency === "TRY" ? "₺" : "$"}${amount.toFixed(2)}`;
  };

  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal/10 text-teal">
            <FiCheckCircle className="w-3 h-3" />
            Başarılı
          </span>
        );
      case "failure":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400">
            <FiXCircle className="w-3 h-3" />
            Başarısız
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400">
            <FiClock className="w-3 h-3" />
            Bekliyor
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400">
            <FiAlertCircle className="w-3 h-3" />
            İade
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <FiLoader className="w-8 h-8 text-neon-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary mb-1">Fatura & Abonelik</h1>
        <p className="text-sm text-text-secondary">
          Abonelik durumunuzu yönetin ve ödeme geçmişinizi görüntüleyin.
        </p>
      </motion.div>

      {/* Cancel message */}
      {cancelMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4"
        >
          <p className="text-sm text-amber-400">{cancelMessage}</p>
        </motion.div>
      )}

      {/* Subscription Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl border border-border p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FiCreditCard className="w-5 h-5 text-neon-red" />
          Mevcut Plan
        </h2>

        {status?.is_active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <span className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                  <FiZap className="w-4 h-4" />
                  Pro Plan
                </span>
              </div>
              {status.cancel_at_period_end && (
                <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                  Dönem sonunda iptal edilecek
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Başlangıç</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(status.subscription_start)}
                </p>
              </div>
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Bitiş</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(status.subscription_end)}
                </p>
              </div>
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Kalan</p>
                <p className="text-sm font-medium text-text-primary">
                  {status.days_remaining} gün
                </p>
              </div>
            </div>

            {!status.cancel_at_period_end && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                {cancelling ? "İptal ediliyor..." : "Aboneliği İptal Et"}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-surface-light border border-border">
                <span className="text-sm font-medium text-text-secondary">Free Plan</span>
              </div>
            </div>

            <p className="text-sm text-text-secondary">
              Pro plana yükselterek tüm gelişmiş analiz araçlarına erişin.
            </p>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-red to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-neon-red/25 transition-all"
            >
              Pro&apos;ya Yükselt
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl border border-border p-6"
      >
        <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-neon-red" />
          Ödeme Geçmişi
        </h2>

        {payments.length === 0 ? (
          <p className="text-sm text-text-muted py-8 text-center">
            Henüz ödeme geçmişiniz bulunmuyor.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[11px] text-text-muted uppercase tracking-wider py-3 px-2">
                    Tarih
                  </th>
                  <th className="text-left text-[11px] text-text-muted uppercase tracking-wider py-3 px-2">
                    Tip
                  </th>
                  <th className="text-left text-[11px] text-text-muted uppercase tracking-wider py-3 px-2">
                    Tutar
                  </th>
                  <th className="text-left text-[11px] text-text-muted uppercase tracking-wider py-3 px-2">
                    Kart
                  </th>
                  <th className="text-left text-[11px] text-text-muted uppercase tracking-wider py-3 px-2">
                    Dönem
                  </th>
                  <th className="text-left text-[11px] text-text-muted uppercase tracking-wider py-3 px-2">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 hover:bg-surface-light/50 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-text-primary">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="py-3 px-2 text-sm text-text-secondary">
                      {p.payment_type === "subscription" ? "Abonelik" : "Tek Seferlik"}
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-text-primary">
                      {formatAmount(p.amount, p.currency)}
                    </td>
                    <td className="py-3 px-2 text-sm text-text-secondary">
                      {p.card_last_four ? `**** ${p.card_last_four}` : "-"}
                    </td>
                    <td className="py-3 px-2 text-xs text-text-muted">
                      {p.period_start && p.period_end
                        ? `${formatDate(p.period_start)} - ${formatDate(p.period_end)}`
                        : "-"}
                    </td>
                    <td className="py-3 px-2">{getStatusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
