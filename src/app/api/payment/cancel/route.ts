import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  findUserById,
  updateUser,
  getSubscriptionByUserId,
  updateSubscription,
} from "@/lib/db";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    if (user.subscription_type !== "premium") {
      return NextResponse.json(
        { error: "Aktif bir aboneliğiniz yok" },
        { status: 400 }
      );
    }

    // Abonelik kaydını güncelle - dönem sonunda iptal olacak
    const subscription = await getSubscriptionByUserId(session.userId);
    if (subscription) {
      await updateSubscription(subscription.id, {
        status: "cancelled",
        cancel_at_period_end: true,
      });
    }

    // Kullanıcı durumunu güncelle
    await updateUser(session.userId, {
      subscription_status: "cancelled",
    });

    console.log(`[Cancel] Abonelik iptal edildi: user=${session.userId}, dönem sonuna kadar aktif`);

    return NextResponse.json({
      success: true,
      message: "Aboneliğiniz dönem sonunda iptal edilecektir. O zamana kadar Pro özellikleriniz devam edecek.",
      subscription_end: user.subscription_end,
    });
  } catch (error) {
    console.error("[Cancel] Hata:", error);
    return NextResponse.json(
      { error: "Abonelik iptal edilemedi" },
      { status: 500 }
    );
  }
}
