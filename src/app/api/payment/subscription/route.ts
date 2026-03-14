import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findUserById, createPayment } from "@/lib/db";
import { createSubscriptionCheckout } from "@/lib/iyzico";

const PLAN_PRICES: Record<string, number> = {
  lite: 280,
  standard: 350,
  enterprise: 1250,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (
      user.subscription_type !== "free" &&
      user.subscription_end &&
      new Date(user.subscription_end) > new Date()
    ) {
      return NextResponse.json(
        { error: "Zaten aktif bir aboneliğiniz var" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const plan = (body.plan as string) || "standard";
    const price = PLAN_PRICES[plan] || 350;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const nameParts = (user.username || "Kullanici").split(" ");
    // Encode plan type in conversation_id so callback knows which plan
    const conversationId = `sub_${plan}_${user.id}_${Date.now()}`;

    const result = await createSubscriptionCheckout({
      userId: user.id,
      email: user.email,
      name: nameParts[0] || "Kullanici",
      surname: nameParts.slice(1).join(" ") || "Valyze",
      ip,
      conversationId,
      price,
    });

    await createPayment({
      user_id: user.id,
      payment_type: "subscription",
      iyzico_token: result.token,
      conversation_id: conversationId,
      amount: price,
      currency: "TRY",
    });

    return NextResponse.json({
      success: true,
      token: result.token,
      checkoutFormContent: result.checkoutFormContent,
      paymentPageUrl: result.paymentPageUrl,
    });
  } catch (error) {
    console.error("[Subscription] Hata:", error);
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return NextResponse.json(
      { error: `Abonelik başlatılamadı: ${message}` },
      { status: 500 }
    );
  }
}
