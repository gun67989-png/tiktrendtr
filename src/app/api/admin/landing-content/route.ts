import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getLandingContent, upsertLandingContent } from "@/lib/landing-content";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const content = await getLandingContent();
    return NextResponse.json(content);
  } catch (e) {
    apiLogger.error({ err: e }, "Admin landing-content GET failed");
    return NextResponse.json({ error: "Sunucu hatas\u0131" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const body = await request.json();
    const { section, content } = body;

    const validSections = ["stats", "features", "testimonials", "plans"];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: "Ge\u00E7ersiz b\u00F6l\u00FCm. Ge\u00E7erli: " + validSections.join(", ") },
        { status: 400 }
      );
    }

    if (!content || !Array.isArray(content)) {
      return NextResponse.json(
        { error: "\u0130\u00E7erik bir dizi olmal\u0131d\u0131r" },
        { status: 400 }
      );
    }

    const ok = await upsertLandingContent(section, content);
    if (!ok) {
      return NextResponse.json(
        { error: "\u0130\u00E7erik kaydedilemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    apiLogger.error({ err: e }, "Admin landing-content PUT failed");
    return NextResponse.json({ error: "Sunucu hatas\u0131" }, { status: 500 });
  }
}
