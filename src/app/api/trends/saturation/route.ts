import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface SaturationTrend {
  name: string;
  type: "hashtag" | "sound";
  saturation: number;
  growth: string;
  competition: string;
  opportunityScore: number;
  videoCount: number;
  avgViews: number;
}

interface SaturationResult {
  trends: SaturationTrend[];
  source: "live" | "no_data";
}

async function fetchSaturation(): Promise<SaturationResult> {
  if (!isSupabaseConfigured || !supabase) {
    apiLogger.warn("Supabase not configured for saturation analysis");
    return { trends: [], source: "no_data" };
  }

  try {
    // Fetch recent trending videos (last 14 days worth of data)
    const { data: videos, error } = await supabase
      .from("trending_videos")
      .select("hashtags, sound_name, view_count, like_count, comment_count, share_count, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error || !videos || videos.length === 0) {
      apiLogger.info("No trending videos found for saturation analysis");
      return { trends: [], source: "no_data" };
    }

    const totalVideos = videos.length;

    // Split videos into recent (first half) and older (second half) for growth detection
    const midpoint = Math.floor(totalVideos / 2);

    // --- Hashtag saturation ---
    const hashtagStats: Record<string, {
      count: number;
      recentCount: number;
      olderCount: number;
      totalViews: number;
      totalLikes: number;
      totalComments: number;
      totalShares: number;
    }> = {};

    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      const isRecent = i < midpoint;
      const tags: string[] = Array.isArray(v.hashtags)
        ? v.hashtags
        : typeof v.hashtags === "string"
          ? v.hashtags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [];

      for (const tag of tags) {
        const normalized = tag.replace(/^#/, "").toLowerCase().trim();
        if (!normalized || normalized.length < 2) continue;

        if (!hashtagStats[normalized]) {
          hashtagStats[normalized] = { count: 0, recentCount: 0, olderCount: 0, totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0 };
        }
        const s = hashtagStats[normalized];
        s.count++;
        if (isRecent) s.recentCount++;
        else s.olderCount++;
        s.totalViews += v.view_count || 0;
        s.totalLikes += v.like_count || 0;
        s.totalComments += v.comment_count || 0;
        s.totalShares += v.share_count || 0;
      }
    }

    // --- Sound saturation ---
    const soundStats: Record<string, {
      count: number;
      recentCount: number;
      olderCount: number;
      totalViews: number;
      totalLikes: number;
      totalComments: number;
      totalShares: number;
    }> = {};

    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      const isRecent = i < midpoint;
      const soundName = (v.sound_name || "").trim();
      if (!soundName || soundName.length < 2) continue;

      if (!soundStats[soundName]) {
        soundStats[soundName] = { count: 0, recentCount: 0, olderCount: 0, totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0 };
      }
      const s = soundStats[soundName];
      s.count++;
      if (isRecent) s.recentCount++;
      else s.olderCount++;
      s.totalViews += v.view_count || 0;
      s.totalLikes += v.like_count || 0;
      s.totalComments += v.comment_count || 0;
      s.totalShares += v.share_count || 0;
    }

    // Build saturation trends from both hashtags and sounds
    const trends: SaturationTrend[] = [];

    const calculateTrend = (
      name: string,
      type: "hashtag" | "sound",
      stats: { count: number; recentCount: number; olderCount: number; totalViews: number; totalLikes: number; totalComments: number; totalShares: number }
    ): SaturationTrend => {
      // Saturation score: percentage of total videos that use this trend (0-100)
      const saturation = Math.min(100, Math.round((stats.count / totalVideos) * 100 * 5));

      // Growth direction based on recent vs older usage ratio
      let growth: "rising" | "peaked" | "declining";
      if (stats.olderCount === 0) {
        growth = "rising";
      } else {
        const ratio = stats.recentCount / stats.olderCount;
        if (ratio > 1.3) growth = "rising";
        else if (ratio < 0.7) growth = "declining";
        else growth = "peaked";
      }

      // Competition level based on average view count
      const avgViews = stats.count > 0 ? Math.round(stats.totalViews / stats.count) : 0;
      let competition: "low" | "medium" | "high";
      if (avgViews > 1000000) competition = "high";
      else if (avgViews > 200000) competition = "medium";
      else competition = "low";

      // Engagement rate
      const engagementRate = stats.totalViews > 0
        ? ((stats.totalLikes + stats.totalComments + stats.totalShares) / stats.totalViews) * 100
        : 0;

      // Opportunity score: inverse of saturation * engagement rate
      // Lower saturation + high engagement = better opportunity (0-100 scale)
      const opportunityScore = Math.min(100, Math.round(
        ((100 - saturation) / 100) * engagementRate * 10
      ));

      return {
        name: type === "hashtag" ? `#${name}` : name,
        type,
        saturation,
        growth,
        competition,
        opportunityScore: Math.max(0, opportunityScore),
        videoCount: stats.count,
        avgViews,
      };
    };

    // Process hashtags (minimum 2 occurrences to be relevant)
    for (const [name, stats] of Object.entries(hashtagStats)) {
      if (stats.count >= 2) {
        trends.push(calculateTrend(name, "hashtag", stats));
      }
    }

    // Process sounds (minimum 2 occurrences)
    for (const [name, stats] of Object.entries(soundStats)) {
      if (stats.count >= 2) {
        trends.push(calculateTrend(name, "sound", stats));
      }
    }

    // Sort by saturation descending, take top 20
    trends.sort((a, b) => b.saturation - a.saturation);
    const topTrends = trends.slice(0, 20);

    apiLogger.info({ trendCount: topTrends.length }, "Saturation analysis complete");
    return { trends: topTrends, source: "live" };
  } catch (err) {
    apiLogger.error({ err }, "Saturation analysis failed");
    return { trends: [], source: "no_data" };
  }
}

export async function GET() {
  const key = cacheKey("trends:saturation", {});
  const result = await cached(key, fetchSaturation, 1800); // 30 min cache
  return NextResponse.json(result);
}
