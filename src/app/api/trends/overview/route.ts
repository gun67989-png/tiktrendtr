import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateOverview, generateEmergingTrends } from "@/lib/data";

export const dynamic = "force-dynamic";

async function getLiveStats() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // Total video count
    const { count: totalVideos } = await supabase
      .from("trending_videos")
      .select("*", { count: "exact", head: true });

    // Unique hashtags = active trends
    const { data: hashtagData } = await supabase
      .from("trending_videos")
      .select("hashtags");

    let activeTrends = 0;
    const uniqueHashtags = new Set<string>();
    if (hashtagData) {
      for (const row of hashtagData) {
        if (row.hashtags && Array.isArray(row.hashtags)) {
          for (const tag of row.hashtags) {
            uniqueHashtags.add(tag.toLowerCase());
          }
        }
      }
      activeTrends = uniqueHashtags.size;
    }

    // Average engagement rate
    const { data: engData } = await supabase
      .from("trending_videos")
      .select("view_count, like_count, comment_count, share_count");

    let avgEngagement = 0;
    if (engData && engData.length > 0) {
      const totalEng = engData.reduce((sum, v) => {
        if (v.view_count === 0) return sum;
        return sum + ((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100;
      }, 0);
      const validCount = engData.filter((v) => v.view_count > 0).length;
      avgEngagement = validCount > 0 ? Math.round((totalEng / validCount) * 10) / 10 : 0;
    }

    // Category breakdown (trending niches)
    const { data: catData } = await supabase
      .from("trending_videos")
      .select("category");

    const categoryCounts: Record<string, number> = {};
    if (catData) {
      for (const row of catData) {
        const cat = row.category || "Diger";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    }
    const trendingNiches = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        count,
        growth: Math.round(Math.random() * 30 + 5),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      totalVideosAnalyzed: totalVideos || 0,
      activeTrends,
      avgEngagement,
      trendingNiches,
    };
  } catch (e) {
    console.error("[API/Overview] Live stats error:", e);
    return null;
  }
}

export async function GET() {
  const baseOverview = generateOverview();
  const emergingTrends = generateEmergingTrends();

  // Try live stats from Supabase
  const liveStats = await getLiveStats();

  if (liveStats && liveStats.totalVideosAnalyzed > 0) {
    const overview = {
      ...baseOverview,
      totalVideosAnalyzed: liveStats.totalVideosAnalyzed,
      activeTrends: liveStats.activeTrends,
      avgEngagement: liveStats.avgEngagement,
      trendingNiches:
        liveStats.trendingNiches.length > 0
          ? liveStats.trendingNiches
          : baseOverview.trendingNiches,
    };
    return NextResponse.json({ overview, emergingTrends, source: "live" });
  }

  return NextResponse.json({
    overview: baseOverview,
    emergingTrends,
    source: "generated",
  });
}
