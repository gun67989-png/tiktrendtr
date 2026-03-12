import Iyzipay from "iyzipay";
import crypto from "crypto";

// ============================================================
// iyzico Client — Checkout Form + Subscription yönetimi
// ============================================================

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || "sandbox-api-key",
  secretKey: process.env.IYZICO_SECRET_KEY || "sandbox-secret-key",
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ============================================================
// Promise Wrapper'lar (iyzipay callback tabanlı)
// ============================================================

function initializeCheckoutForm(
  request: Iyzipay.CheckoutFormInitializeRequest
): Promise<Iyzipay.CheckoutFormInitializeResponse> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) return reject(err);
      if (result.status === "failure") {
        return reject(
          new Error(result.errorMessage || `iyzico hata: ${result.errorCode}`)
        );
      }
      resolve(result);
    });
  });
}

function retrieveCheckoutForm(
  request: Iyzipay.CheckoutFormRetrieveRequest
): Promise<Iyzipay.CheckoutFormRetrieveResponse> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// ============================================================
// Tek Seferlik Ödeme (30 günlük Pro)
// ============================================================

export interface CreateCheckoutParams {
  userId: string;
  email: string;
  name: string;
  surname: string;
  ip: string;
  conversationId?: string;
}

export async function createSinglePaymentCheckout(
  params: CreateCheckoutParams
): Promise<Iyzipay.CheckoutFormInitializeResponse> {
  const request: Iyzipay.CheckoutFormInitializeRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: params.conversationId || `single_${params.userId}_${Date.now()}`,
    price: "299",
    paidPrice: "299",
    currency: Iyzipay.CURRENCY.TRY,
    basketId: `basket_single_${params.userId}_${Date.now()}`,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    callbackUrl: `${BASE_URL}/api/payment/callback`,
    enabledInstallments: [1],
    buyer: {
      id: params.userId,
      name: params.name || "Kullanici",
      surname: params.surname || "TikTrendTR",
      email: params.email,
      identityNumber: "11111111111", // TC zorunlu ama saklanmayacak
      registrationAddress: "Istanbul, Turkey",
      ip: params.ip || "127.0.0.1",
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: {
      contactName: `${params.name || "Kullanici"} ${params.surname || "TikTrendTR"}`,
      city: "Istanbul",
      country: "Turkey",
      address: "Istanbul, Turkey",
    },
    billingAddress: {
      contactName: `${params.name || "Kullanici"} ${params.surname || "TikTrendTR"}`,
      city: "Istanbul",
      country: "Turkey",
      address: "Istanbul, Turkey",
    },
    basketItems: [
      {
        id: "TIKTRENDTR_PRO_MONTHLY",
        name: "TikTrendTR Pro Plan (30 Gün)",
        category1: "Abonelik",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "299",
      },
    ],
  };

  return initializeCheckoutForm(request);
}

// ============================================================
// Abonelik Ödeme (Yenilenen)
// ============================================================

export async function createSubscriptionCheckout(
  params: CreateCheckoutParams
): Promise<Iyzipay.CheckoutFormInitializeResponse> {
  const request: Iyzipay.CheckoutFormInitializeRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: params.conversationId || `sub_${params.userId}_${Date.now()}`,
    price: "299",
    paidPrice: "299",
    currency: Iyzipay.CURRENCY.TRY,
    basketId: `basket_sub_${params.userId}_${Date.now()}`,
    paymentGroup: Iyzipay.PAYMENT_GROUP.SUBSCRIPTION,
    callbackUrl: `${BASE_URL}/api/payment/subscription/callback`,
    enabledInstallments: [1],
    buyer: {
      id: params.userId,
      name: params.name || "Kullanici",
      surname: params.surname || "TikTrendTR",
      email: params.email,
      identityNumber: "11111111111",
      registrationAddress: "Istanbul, Turkey",
      ip: params.ip || "127.0.0.1",
      city: "Istanbul",
      country: "Turkey",
    },
    shippingAddress: {
      contactName: `${params.name || "Kullanici"} ${params.surname || "TikTrendTR"}`,
      city: "Istanbul",
      country: "Turkey",
      address: "Istanbul, Turkey",
    },
    billingAddress: {
      contactName: `${params.name || "Kullanici"} ${params.surname || "TikTrendTR"}`,
      city: "Istanbul",
      country: "Turkey",
      address: "Istanbul, Turkey",
    },
    basketItems: [
      {
        id: "TIKTRENDTR_PRO_SUBSCRIPTION",
        name: "TikTrendTR Pro Aylık Abonelik",
        category1: "Abonelik",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: "299",
      },
    ],
  };

  return initializeCheckoutForm(request);
}

// ============================================================
// Ödeme Sonucu Sorgulama
// ============================================================

export async function verifyPayment(
  token: string,
  conversationId?: string
): Promise<Iyzipay.CheckoutFormRetrieveResponse> {
  return retrieveCheckoutForm({
    locale: Iyzipay.LOCALE.TR,
    conversationId: conversationId,
    token,
  });
}

// ============================================================
// Yardımcı Fonksiyonlar
// ============================================================

export function isPaymentSuccessful(
  result: Iyzipay.CheckoutFormRetrieveResponse
): boolean {
  return (
    result.status === "success" &&
    result.paymentStatus === "SUCCESS"
  );
}

export function calculatePeriodEnd(startDate: Date = new Date()): Date {
  const end = new Date(startDate);
  end.setDate(end.getDate() + 30);
  return end;
}

/**
 * HMAC doğrulama — iyzico webhook imza kontrolü
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secretKey: string = process.env.IYZICO_SECRET_KEY || ""
): boolean {
  // iyzico webhook imza doğrulaması
  // Basit karşılaştırma — production'da crypto.timingSafeEqual kullanılmalı
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export { iyzipay };
