import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { analyzeSentiment, isAIConfigured } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Standard and above can use sentiment analysis
    if (session.subscriptionType === "free" || session.subscriptionType === "lite") {
      if (session.role !== "admin") {
        return NextResponse.json({ error: "Bu özellik Standart plan gerektirir" }, { status: 403 });
      }
    }

    if (!isAIConfigured) {
      return NextResponse.json({ error: "AI servisi yapılandırılmamış" }, { status: 503 });
    }

    const { comments } = await request.json();
    if (!comments || !Array.isArray(comments)) {
      return NextResponse.json({ error: "Yorumlar gerekli" }, { status: 400 });
    }

    const result = await analyzeSentiment(comments);
    return NextResponse.json({ result });
  } catch (e) {
    console.error("[AI/Sentiment] Error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
