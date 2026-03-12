import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPaymentsByUserId } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const payments = await getPaymentsByUserId(session.userId);

    // Hassas bilgileri çıkar
    const safePayments = payments.map((p) => ({
      id: p.id,
      payment_type: p.payment_type,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      period_start: p.period_start,
      period_end: p.period_end,
      card_last_four: p.card_last_four,
      card_type: p.card_type,
      created_at: p.created_at,
    }));

    return NextResponse.json({ payments: safePayments });
  } catch (error) {
    console.error("[Payment History] Hata:", error);
    return NextResponse.json(
      { error: "Ödeme geçmişi alınamadı" },
      { status: 500 }
    );
  }
}
