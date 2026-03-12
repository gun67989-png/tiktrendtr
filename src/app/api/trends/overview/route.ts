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

    // Fetch all videos for aggregation
    const { data: allData } = await supabase
      .from("trending_videos")
      .select("hashtags, view_count, like_count, comment_count, share_count, category, scraped_at")
      .order("view_count", { ascending: false })
      .limit(2000);

    if (!allData || allData.length === 0) return null;

    // Unique hashtags = active trends
    const uniqueHashtags = new Set<string>();
    for (const row of allData) {
      if (row.hashtags && Array.isArray(row.hashtags)) {
        for (const tag of row.hashtags) {
          uniqueHashtags.add(tag.toLowerCase());
        }
      }
    }

    // Average engagement rate
    let totalEng = 0;
    let validCount = 0;
    for (const v of allData) {
      if (v.view_count > 0) {
        totalEng += ((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100;
        validCount++;
      }
    }
    const avgEngagement = validCount > 0 ? Math.round((totalEng / validCount) * 10) / 10 : 0;

    // Best posting time from data
    const hourCounts: Record<number, { total: number; count: number }> = {};
    for (const v of allData) {
      const date = new Date(v.scraped_at);
      const hour = (date.getUTCHours() + 3) % 24; // Turkey UTC+3
      if (!hourCounts[hour]) hourCounts[hour] = { total: 0, count: 0 };
      if (v.view_count > 0) {
        hourCounts[hour].total += ((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100;
        hourCounts[hour].count++;
      }
    }
    const bestHour = Object.entries(hourCounts)
      .map(([h, d]) => ({ hour: parseInt(h), avg: d.count > 0 ? d.total / d.count : 0 }))
      .sort((a, b) => b.avg - a.avg)[0];
    const bestPostingTime = bestHour
      ? `${String(bestHour.hour).padStart(2, "0")}:00 - ${String((bestHour.hour + 3) % 24).padStart(2, "0")}:00`
      : "19:00 - 22:00";

    // Category breakdown (trending niches)
    const categoryCounts: Record<string, number> = {};
    for (const row of allData) {
      const cat = row.category || "Diger";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    const trendingNiches = Object.entries(categoryCounts)
      .map(([name, count]) => {
        // Calculate growth by comparing recent vs older videos
        const recentCount = allData.filter((v) => {
          const age = Date.now() - new Date(v.scraped_at).getTime();
          return v.category === name && age < 3 * 24 * 60 * 60 * 1000;
        }).length;
        const olderCount = allData.filter((v) => {
          const age = Date.now() - new Date(v.scraped_at).getTime();
          return v.category === name && age >= 3 * 24 * 60 * 60 * 1000 && age < 7 * 24 * 60 * 60 * 1000;
        }).length;
        const growth = olderCount > 0 ? Math.round(((recentCount - olderCount) / olderCount) * 100) : recentCount > 0 ? 50 : 0;

        return { name, count, growth };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Emerging trends from hashtags (recently appearing, fast growing)
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const hashtagRecent = new Map<string, { count: number; views: number }>();
    const hashtagOlder = new Map<string, { count: number; views: number }>();

    for (const v of allData) {
      if (!v.hashtags || !Array.isArray(v.hashtags)) continue;
      const age = now - new Date(v.scraped_at).getTime();
      const isRecent = age < threeDays;

      for (const rawTag of v.hashtags) {
        const tag = rawTag.toLowerCase().replace(/^#/, "").trim();
        if (!tag || tag.length < 3) continue;

        const map = isRecent ? hashtagRecent : hashtagOlder;
        const agg = map.get(tag) || { count: 0, views: 0 };
        agg.count++;
        agg.views += v.view_count || 0;
        map.set(tag, agg);
      }
    }

    const emergingTrends = Array.from(hashtagRecent.entries())
      .map(([tag, recent]) => {
        const older = hashtagOlder.get(tag);
        let growth = 0;
        if (older && older.count > 0) {
          growth = Math.round(((recent.count - older.count) / older.count) * 100);
        } else {
          growth = 100; // brand new
        }
        return {
          tag: `#${tag}`,
          growth,
          videoCount: recent.count + (older?.count || 0),
          totalViews: recent.views + (older?.views || 0),
          confidence: Math.min(100, Math.round((recent.count / Math.max(allData.length * 0.01, 1)) * 100)),
        };
      })
      .filter((t) => t.growth > 20 && t.videoCount >= 2)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 8);

    return {
      totalVideosAnalyzed: totalVideos || 0,
      activeTrends: uniqueHashtags.size,
      avgEngagement,
      bestPostingTime,
      trendingNiches,
      emergingTrends,
    };
  } catch (e) {
    console.error("[API/Overview] Live stats error:", e);
    return null;
  }
}

export async function GET() {
  const liveStats = await getLiveStats();

  if (liveStats && liveStats.totalVideosAnalyzed > 0) {
    const baseOverview = generateOverview();
    const overview = {
      ...baseOverview,
      totalVideosAnalyzed: liveStats.totalVideosAnalyzed,
      activeTrends: liveStats.activeTrends,
      avgEngagement: liveStats.avgEngagement,
      bestPostingTime: liveStats.bestPostingTime,
      trendingNiches: liveStats.trendingNiches,
    };

    return NextResponse.json({
      overview,
      emergingTrends: liveStats.emergingTrends.length > 0 ? liveStats.emergingTrends : generateEmergingTrends(),
      source: "live",
    });
  }

  return NextResponse.json({
    overview: generateOverview(),
    emergingTrends: generateEmergingTrends(),
    source: "generated",
  });
}
