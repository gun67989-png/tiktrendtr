import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findUserById, createPayment } from "@/lib/db";
import { createSinglePaymentCheckout, createSubscriptionCheckout } from "@/lib/iyzico";

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const body = await request.json();
    const paymentType = body.type === "subscription" ? "subscription" : "single";

    // Kullanıcı bilgilerini al
    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Zaten premium mi kontrol et
    if (
      user.subscription_type === "premium" &&
      user.subscription_end &&
      new Date(user.subscription_end) > new Date()
    ) {
      return NextResponse.json(
        { error: "Zaten aktif bir Pro aboneliğiniz var" },
        { status: 400 }
      );
    }

    // IP adresini al
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // İsmi parçala
    const nameParts = (user.username || "Kullanici").split(" ");
    const name = nameParts[0] || "Kullanici";
    const surname = nameParts.slice(1).join(" ") || "Valyze";

    const conversationId = `${paymentType}_${user.id}_${Date.now()}`;

    // iyzico checkout form oluştur
    const checkoutParams = {
      userId: user.id,
      email: user.email,
      name,
      surname,
      ip,
      conversationId,
    };

    const result =
      paymentType === "subscription"
        ? await createSubscriptionCheckout(checkoutParams)
        : await createSinglePaymentCheckout(checkoutParams);

    // Ödemeyi veritabanına kaydet (pending durumunda)
    await createPayment({
      user_id: user.id,
      payment_type: paymentType,
      iyzico_token: result.token,
      conversation_id: conversationId,
      amount: 299,
      currency: "TRY",
    });

    return NextResponse.json({
      success: true,
      token: result.token,
      checkoutFormContent: result.checkoutFormContent,
      paymentPageUrl: result.paymentPageUrl,
    });
  } catch (error) {
    console.error("[Payment Checkout] Hata:", error);
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Ödeme başlatılamadı: ${message}` },
      { status: 500 }
    );
  }
}
