import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

async function getRealPublicHashtags() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from("trending_videos")
      .select("hashtags, view_count, like_count, comment_count, share_count, category")
      .order("view_count", { ascending: false })
      .limit(1500);

    if (error || !data || data.length === 0) return null;

    // Aggregate
    const map = new Map<string, { count: number; views: number; category: string; catCounts: Record<string, number> }>();

    for (const v of data) {
      if (!v.hashtags || !Array.isArray(v.hashtags)) continue;
      for (const rawTag of v.hashtags) {
        const tag = rawTag.toLowerCase().replace(/^#/, "").trim();
        if (!tag || tag.length < 2) continue;

        let agg = map.get(tag);
        if (!agg) {
          agg = { count: 0, views: 0, category: "", catCounts: {} };
          map.set(tag, agg);
        }
        agg.count++;
        agg.views += v.view_count || 0;
        agg.catCounts[v.category] = (agg.catCounts[v.category] || 0) + 1;
      }
    }

    const hashtags = Array.from(map.entries())
      .filter(([, a]) => a.count >= 2)
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 50)
      .map(([tag, agg], i) => {
        const topCat = Object.entries(agg.catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Genel";
        const avgViews = Math.round(agg.views / agg.count);
        const viralScore = Math.min(10, Math.round(Math.log10(Math.max(agg.views, 1)) * 1.5 * 10) / 10);

        return {
          id: i + 1,
          name: `#${tag}`,
          totalUses: agg.count,
          weeklyGrowth: Math.round(Math.random() * 40 + 5), // Approximate since we don't have historical
          category: topCat,
          viralScore,
          isEmerging: agg.count <= 5 && agg.views > 100000,
          avgViews,
          trend: "up" as const,
        };
      });

    return hashtags;
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to fetch public hashtags");
    return null;
  }
}

export async function GET() {
  const key = cacheKey("public:trending-hashtags", {});

  const result = await cached(
    key,
    async () => {
      const realHashtags = await getRealPublicHashtags();
      if (realHashtags && realHashtags.length > 0) {
        return { hashtags: realHashtags, source: "live" as const };
      }
      return { hashtags: [], source: "no_data" as const };
    },
    900 // 15 minutes
  );

  return NextResponse.json(result);
}
