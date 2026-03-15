import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analyses/:id
 * Single analysis detail.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase yapilandirilmamis" },
        { status: 503 }
      );
    }

    const { data: analysis, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !analysis) {
      return NextResponse.json(
        { error: "Analiz bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/analyses/:id
 * Remove an analysis.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: "Supabase yapilandirilmamis" },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", id);

    if (error) {
      apiLogger.error({ error }, "Analysis delete: silme hatasi");
      return NextResponse.json(
        { error: "Silme basarisiz" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
