import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analyses?page=1&limit=20
 *
 * List all psychological analyses with pagination.
 * Requires admin role (checked via cookie session).
 */
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase yapilandirilmamis" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabase
      .from("analyses")
      .select("*", { count: "exact", head: true });

    if (countError) {
      apiLogger.error({ error: countError }, "Analyses list: count hatasi");
      return NextResponse.json({ error: "Sayim hatasi" }, { status: 500 });
    }

    // Get paginated results
    const { data: analyses, error } = await supabase
      .from("analyses")
      .select("*")
      .order("analyzed_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      apiLogger.error({ error }, "Analyses list: sorgu hatasi");
      return NextResponse.json({ error: "Sorgulama hatasi" }, { status: 500 });
    }

    return NextResponse.json({
      analyses: analyses || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
