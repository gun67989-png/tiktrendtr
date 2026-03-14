import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { generateHooks, isAIConfigured } from "@/lib/ai";
import { aiLogger } from "@/lib/logger";

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

    // Only enterprise users can generate AI hooks
    if (session.subscriptionType !== "enterprise" && session.role !== "admin") {
      return NextResponse.json({ error: "Bu özellik Kurumsal plan gerektirir" }, { status: 403 });
    }

    if (!isAIConfigured) {
      return NextResponse.json({ error: "AI servisi yapılandırılmamış" }, { status: 503 });
    }

    const { niche, count } = await request.json();
    const result = await generateHooks(niche || "Genel", count || 5);

    return NextResponse.json({ result });
  } catch (e) {
    aiLogger.error({ err: e }, "Hook generation error");
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
