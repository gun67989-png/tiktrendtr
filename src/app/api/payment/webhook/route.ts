import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/iyzico";
import {
  updateUser,
  updateSubscription,
  getSubscriptionByUserId,
} from "@/lib/db";
import { paymentLogger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-iyz-signature") || "";

    // HMAC imza doğrulaması
    if (!verifyWebhookSignature(body, signature)) {
      paymentLogger.warn("Invalid webhook signature, request rejected");
      return NextResponse.json({ error: "Geçersiz imza" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { iyziEventType, paymentId } = payload;

    paymentLogger.info({ iyziEventType, paymentId }, "Webhook event received");

    switch (iyziEventType) {
      case "PAYMENT_SUCCESS": {
        // Yenilenen abonelik ödemesi başarılı
        // Token'dan kullanıcıyı bul ve süresini uzat
        if (payload.userId) {
          const now = new Date();
          const periodEnd = new Date(now);
          periodEnd.setDate(periodEnd.getDate() + 30);

          await updateUser(payload.userId, {
            subscription_type: "standard",
            subscription_status: "active",
            subscription_end: periodEnd.toISOString(),
          });

          const subscription = await getSubscriptionByUserId(payload.userId);
          if (subscription) {
            await updateSubscription(subscription.id, {
              status: "active",
              current_period_start: now.toISOString(),
              current_period_end: periodEnd.toISOString(),
            });
          }

          paymentLogger.info({ userId: payload.userId }, "Subscription renewed");
        }
        break;
      }

      case "PAYMENT_FAILURE": {
        if (payload.userId) {
          const subscription = await getSubscriptionByUserId(payload.userId);
          if (subscription) {
            await updateSubscription(subscription.id, {
              status: "past_due",
            });
          }
          paymentLogger.warn({ userId: payload.userId }, "Payment failed");
        }
        break;
      }

      case "SUBSCRIPTION_CANCELLED": {
        if (payload.userId) {
          const subscription = await getSubscriptionByUserId(payload.userId);
          if (subscription) {
            await updateSubscription(subscription.id, {
              status: "cancelled",
              cancel_at_period_end: true,
            });
          }
          paymentLogger.info({ userId: payload.userId }, "Subscription cancelled");
        }
        break;
      }

      default:
        paymentLogger.info({ iyziEventType }, "Unknown webhook event");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    paymentLogger.error({ err: error }, "Webhook error");
    return NextResponse.json({ error: "Webhook hatası" }, { status: 500 });
  }
}
