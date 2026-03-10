import { NextRequest, NextResponse } from "next/server";
import { generateVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 60);
  const offset = parseInt(searchParams.get("offset") || "0");
  const category = searchParams.get("category") || undefined;
  const sortBy = (searchParams.get("sortBy") || "viralScore") as "viralScore" | "views" | "engagementRate" | "publishedAt";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  const { videos, total } = generateVideos({ limit, offset, category, sortBy, order });

  return NextResponse.json({ videos, total, limit, offset });
}
