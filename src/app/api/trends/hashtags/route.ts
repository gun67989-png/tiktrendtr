import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface HashtagAgg {
  tag: string;
  count: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  categories: Record<string, number>;
  recentViews: number; // last 3 days
  olderViews: number;  // 4-7 days ago
}

async function getRealHashtags() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // Fetch all videos with their hashtags from last 14 days
    const { data, error } = await supabase
      .from("trending_videos")
      .select("hashtags, view_count, like_count, comment_count, share_count, category, scraped_at")
      .order("view_count", { ascending: false })
      .limit(2000);

    if (error || !data || data.length === 0) return null;

    // Aggregate hashtags
    const map = new Map<string, HashtagAgg>();
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    for (const video of data) {
      if (!video.hashtags || !Array.isArray(video.hashtags)) continue;

      const age = now - new Date(video.scraped_at).getTime();

      for (const rawTag of video.hashtags) {
        const tag = rawTag.toLowerCase().replace(/^#/, "").trim();
        if (!tag || tag.length < 2) continue;

        let agg = map.get(tag);
        if (!agg) {
          agg = {
            tag,
            count: 0,
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
            categories: {},
            recentViews: 0,
            olderViews: 0,
          };
          map.set(tag, agg);
        }

        agg.count++;
        agg.totalViews += video.view_count || 0;
        agg.totalLikes += video.like_count || 0;
        agg.totalComments += video.comment_count || 0;
        agg.totalShares += video.share_count || 0;
        agg.categories[video.category] = (agg.categories[video.category] || 0) + 1;

        if (age <= threeDays) {
          agg.recentViews += video.view_count || 0;
        } else if (age <= sevenDays) {
          agg.olderViews += video.view_count || 0;
        }
      }
    }

    // Convert to sorted array
    const hashtags = Array.from(map.values())
      .filter((h) => h.count >= 2) // At least 2 videos
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 100)
      .map((h, i) => {
        // Calculate growth rate from recent vs older views
        let growth = 0;
        if (h.olderViews > 0) {
          growth = Math.round(((h.recentViews - h.olderViews) / h.olderViews) * 100);
        } else if (h.recentViews > 0) {
          growth = 100; // All views are recent = new trend
        }

        // Determine dominant category
        const topCategory = Object.entries(h.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "Genel";

        // Viral score based on views and engagement
        const engRate = h.totalViews > 0
          ? ((h.totalLikes + h.totalComments + h.totalShares) / h.totalViews) * 100
          : 0;
        const viralScore = Math.min(10, Math.round(
          (Math.log10(Math.max(h.totalViews, 1)) * 0.6 + engRate * 0.4) * 10
        ) / 10);

        return {
          id: i + 1,
          tag: `#${h.tag}`,
          name: h.tag,
          viewCount: h.totalViews,
          videoCount: h.count,
          growth,
          category: topCategory,
          viralScore,
          avgViews: Math.round(h.totalViews / h.count),
          engagementRate: Math.round(engRate * 100) / 100,
          trend: growth >= 0 ? "up" as const : "down" as const,
          trendData: [], // Could add sparkline data later
        };
      });

    return hashtags;
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to fetch real hashtags");
    return null;
  }
}

export async function GET() {
  const key = cacheKey("trends:hashtags", {});

  const result = await cached(
    key,
    async () => {
      const realHashtags = await getRealHashtags();
      if (realHashtags && realHashtags.length > 0) {
        return { hashtags: realHashtags, source: "live" as const };
      }
      // No fake data — return empty with clear indicator
      return { hashtags: [], source: "no_data" as const, message: "Henüz yeterli veri yok. Veriler 6 saatte bir güncellenir." };
    },
    600 // 10 minutes
  );

  return NextResponse.json(result);
}
