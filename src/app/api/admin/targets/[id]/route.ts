import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/targets/:id
 * Update target (is_active, priority).
 */
export async function PATCH(
  request: NextRequest,
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

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.is_active !== undefined) {
      updateData.is_active = Boolean(body.is_active);
    }

    if (body.priority !== undefined) {
      const priority = parseInt(String(body.priority), 10);
      if (isNaN(priority)) {
        return NextResponse.json(
          { error: "Gecersiz oncelik degeri" },
          { status: 400 }
        );
      }
      updateData.priority = priority;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Guncellenecek alan belirtilmedi" },
        { status: 400 }
      );
    }

    const { data: target, error } = await supabase
      .from("analysis_targets")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      apiLogger.error({ error }, "Target update: guncelleme hatasi");
      return NextResponse.json(
        { error: "Guncelleme basarisiz" },
        { status: 500 }
      );
    }

    if (!target) {
      return NextResponse.json(
        { error: "Hedef bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ target });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/targets/:id
 * Remove an analysis target.
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
      .from("analysis_targets")
      .delete()
      .eq("id", id);

    if (error) {
      apiLogger.error({ error }, "Target delete: silme hatasi");
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
