import { NextRequest, NextResponse } from "next/server";
import {
  findPaymentByToken,
  updatePayment,
  updateUser,
  createSubscription,
} from "@/lib/db";
import {
  verifyPayment,
  isPaymentSuccessful,
  calculatePeriodEnd,
} from "@/lib/iyzico";

export async function POST(request: NextRequest) {
  try {
    // iyzico callback'i form-urlencoded olarak gelir
    const formData = await request.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.redirect(
        new URL("/pricing?error=token_missing", request.url)
      );
    }

    // iyzico'dan ödeme sonucunu sorgula
    const paymentResult = await verifyPayment(token);

    // Veritabanındaki ödeme kaydını bul
    const payment = await findPaymentByToken(token);
    if (!payment) {
      console.error("[Payment Callback] Token bulunamadı:", token);
      return NextResponse.redirect(
        new URL("/pricing?error=payment_not_found", request.url)
      );
    }

    if (isPaymentSuccessful(paymentResult)) {
      // Başarılı ödeme
      const now = new Date();
      const periodEnd = calculatePeriodEnd(now);

      // Ödeme kaydını güncelle
      await updatePayment(payment.id, {
        status: "success",
        iyzico_payment_id: paymentResult.paymentId,
        period_start: now.toISOString(),
        period_end: periodEnd.toISOString(),
        card_last_four: paymentResult.lastFourDigits || null,
        card_type: paymentResult.cardType || null,
      });

      // Kullanıcıyı premium yap
      await updateUser(payment.user_id, {
        subscription_type: "premium",
        subscription_status: "active",
        subscription_start: now.toISOString(),
        subscription_end: periodEnd.toISOString(),
      });

      // Subscription kaydı oluştur
      await createSubscription({
        user_id: payment.user_id,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      });

      console.log(
        `[Payment Callback] Başarılı ödeme: user=${payment.user_id}, paymentId=${paymentResult.paymentId}`
      );

      // Dashboard'a yönlendir
      return NextResponse.redirect(
        new URL("/dashboard?payment=success", request.url)
      );
    } else {
      // Başarısız ödeme
      await updatePayment(payment.id, {
        status: "failure",
        error_message:
          paymentResult.errorMessage || "Ödeme başarısız oldu",
      });

      console.warn(
        `[Payment Callback] Başarısız ödeme: user=${payment.user_id}, error=${paymentResult.errorMessage}`
      );

      return NextResponse.redirect(
        new URL(
          `/pricing?error=payment_failed&message=${encodeURIComponent(
            paymentResult.errorMessage || "Ödeme işlemi başarısız oldu"
          )}`,
          request.url
        )
      );
    }
  } catch (error) {
    console.error("[Payment Callback] Kritik hata:", error);
    return NextResponse.redirect(
      new URL("/pricing?error=system_error", request.url)
    );
  }
}
