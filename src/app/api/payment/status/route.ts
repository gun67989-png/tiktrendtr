import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findUserById, getSubscriptionByUserId } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const subscription = await getSubscriptionByUserId(session.userId);

    const isActive =
      user.subscription_type === "premium" &&
      user.subscription_status === "active" &&
      (!user.subscription_end || new Date(user.subscription_end) > new Date());

    return NextResponse.json({
      subscription_type: user.subscription_type,
      subscription_status: user.subscription_status,
      subscription_start: user.subscription_start,
      subscription_end: user.subscription_end,
      is_active: isActive,
      cancel_at_period_end: subscription?.cancel_at_period_end || false,
      days_remaining: user.subscription_end
        ? Math.max(
            0,
            Math.ceil(
              (new Date(user.subscription_end).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 0,
    });
  } catch (error) {
    console.error("[Payment Status] Hata:", error);
    return NextResponse.json(
      { error: "Abonelik durumu alınamadı" },
      { status: 500 }
    );
  }
}
