import { NextResponse } from "next/server";
import { generateHashtags } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const hashtags = generateHashtags();

  const enriched = hashtags.map((h) => {
    const avgViews = Math.round(h.totalUses * (2.5 + Math.random() * 5));
    return {
      id: h.id,
      name: h.name,
      totalUses: h.totalUses,
      weeklyGrowth: h.weeklyGrowth,
      category: h.category,
      viralScore: h.viralScore,
      isEmerging: h.isEmerging,
      avgViews,
      trend: h.trend,
    };
  });

  return NextResponse.json({ hashtags: enriched });
}
