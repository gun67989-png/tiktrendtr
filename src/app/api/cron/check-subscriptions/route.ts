import { NextRequest, NextResponse } from "next/server";
import {
  getExpiredPaidUsers,
  updateUser,
  getSubscriptionByUserId,
  updateSubscription,
} from "@/lib/db";
import { cronLogger } from "@/lib/logger";

/**
 * Cron Job: Süresi dolan premium kullanıcıları free'ye düşür
 * Her 6 saatte bir çağrılmalı (Vercel Cron veya harici servis)
 *
 * Güvenlik: CRON_SECRET header kontrolü
 */
export async function GET(request: NextRequest) {
  try {
    // Cron güvenlik kontrolü
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    cronLogger.info("Abonelik kontrolu baslatiliyor");

    // Süresi dolmuş premium kullanıcıları bul
    const expiredUsers = await getExpiredPaidUsers();

    let downgraded = 0;

    for (const user of expiredUsers) {
      // cancel_at_period_end kontrolü
      const subscription = await getSubscriptionByUserId(user.id);

      // Aktif auto-renew abonelik varsa atla (webhook yenileyecek)
      if (
        subscription &&
        subscription.status === "active" &&
        !subscription.cancel_at_period_end
      ) {
        continue;
      }

      // Free'ye düşür
      await updateUser(user.id, {
        subscription_type: "free",
        subscription_status: "expired",
      });

      if (subscription) {
        await updateSubscription(subscription.id, {
          status: "expired",
        });
      }

      downgraded++;
      cronLogger.info({ username: user.username, userId: user.id }, "Kullanici free'ye dusuruldu");
    }

    cronLogger.info({ checked: expiredUsers.length, downgraded }, "Tamamlandi");

    return NextResponse.json({
      success: true,
      checked: expiredUsers.length,
      downgraded,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    cronLogger.error({ err: error }, "Cron error");
    return NextResponse.json(
      { error: "Cron hatası" },
      { status: 500 }
    );
  }
}
