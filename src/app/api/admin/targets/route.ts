import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/targets
 * List all analysis targets.
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase yapilandirilmamis" },
        { status: 503 }
      );
    }

    const { data: targets, error } = await supabase
      .from("analysis_targets")
      .select("*")
      .order("priority", { ascending: false });

    if (error) {
      apiLogger.error({ error }, "Targets list: sorgu hatasi");
      return NextResponse.json({ error: "Sorgulama hatasi" }, { status: 500 });
    }

    return NextResponse.json({ targets: targets || [] });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}

/**
 * POST /api/admin/targets
 * Add a new analysis target { username, platform }.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase yapilandirilmamis" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { username, platform } = body;

    if (!username || typeof username !== "string" || username.trim().length < 2) {
      return NextResponse.json(
        { error: "Gecerli bir kullanici adi girin (en az 2 karakter)" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().replace("@", "");
    const cleanPlatform = (platform || "tiktok").trim().toLowerCase();

    // Check for duplicate
    const { data: existing } = await supabase
      .from("analysis_targets")
      .select("id")
      .eq("username", cleanUsername)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Bu kullanici zaten hedef listesinde" },
        { status: 409 }
      );
    }

    const { data: target, error } = await supabase
      .from("analysis_targets")
      .insert({
        username: cleanUsername,
        platform: cleanPlatform,
        priority: 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      apiLogger.error({ error }, "Target create: ekleme hatasi");
      return NextResponse.json(
        { error: "Hedef eklenemedi" },
        { status: 500 }
      );
    }

    return NextResponse.json({ target }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
