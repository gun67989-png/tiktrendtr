import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface CreatorAgg {
  username: string;
  nickname: string;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgFollowers: number;
  categories: Record<string, number>;
  formats: Record<string, number>;
  hashtags: Record<string, number>;
  avgPresenceScore: number;
  presenceScores: number[];
  durations: number[];
  recentCount: number;
  olderCount: number;
  latestVideoAt: string;
}

async function fetchCreators(limit: number, sortBy: string, category?: string, search?: string) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    // Fetch all videos for aggregation
    const { data, error } = await supabase
      .from("trending_videos")
      .select("creator_username, creator_nickname, view_count, like_count, comment_count, share_count, follower_count, category, format, hashtags, duration, creator_presence_score, scraped_at")
      .order("view_count", { ascending: false })
      .limit(5000);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ creators: [], total: 0 });
    }

    // Aggregate by creator
    const map = new Map<string, CreatorAgg>();
    const now = Date.now();
    const threeDays = 3 * 86400000;
    const sevenDays = 7 * 86400000;

    for (const v of data) {
      const username = (v.creator_username || "").trim();
      if (!username) continue;

      const key = username.toLowerCase();
      const age = now - new Date(v.scraped_at).getTime();

      let agg = map.get(key);
      if (!agg) {
        agg = {
          username,
          nickname: v.creator_nickname || username,
          videoCount: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          avgFollowers: 0,
          categories: {},
          formats: {},
          hashtags: {},
          avgPresenceScore: 0,
          presenceScores: [],
          durations: [],
          recentCount: 0,
          olderCount: 0,
          latestVideoAt: v.scraped_at,
        };
        map.set(key, agg);
      }

      agg.videoCount++;
      agg.totalViews += v.view_count || 0;
      agg.totalLikes += v.like_count || 0;
      agg.totalComments += v.comment_count || 0;
      agg.totalShares += v.share_count || 0;
      agg.avgFollowers = v.follower_count || agg.avgFollowers;

      if (v.category) agg.categories[v.category] = (agg.categories[v.category] || 0) + 1;
      if (v.format) agg.formats[v.format] = (agg.formats[v.format] || 0) + 1;
      if (v.duration) agg.durations.push(v.duration);
      if (v.creator_presence_score != null) agg.presenceScores.push(v.creator_presence_score);

      if (v.hashtags && Array.isArray(v.hashtags)) {
        for (const tag of v.hashtags) {
          agg.hashtags[tag] = (agg.hashtags[tag] || 0) + 1;
        }
      }

      if (age <= threeDays) agg.recentCount++;
      else if (age <= sevenDays) agg.olderCount++;

      if (v.scraped_at > agg.latestVideoAt) agg.latestVideoAt = v.scraped_at;
    }

    // Convert to sorted array
    let creators = Array.from(map.values())
      .filter((c) => c.videoCount >= 1)
      .map((c) => {
        const engRate = c.totalViews > 0
          ? Math.round(((c.totalLikes + c.totalComments + c.totalShares) / c.totalViews) * 10000) / 100
          : 0;

        let growth = 0;
        if (c.olderCount > 0) {
          growth = Math.round(((c.recentCount - c.olderCount) / c.olderCount) * 100);
        } else if (c.recentCount > 0) {
          growth = 100;
        }

        const topCategory = Object.entries(c.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "Genel";
        const topFormat = Object.entries(c.formats).sort((a, b) => b[1] - a[1])[0]?.[0] || "Kısa Video";
        const topHashtags = Object.entries(c.hashtags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]) => tag);

        const avgDuration = c.durations.length > 0
          ? Math.round(c.durations.reduce((a, b) => a + b, 0) / c.durations.length)
          : 0;

        const avgPresence = c.presenceScores.length > 0
          ? Math.round(c.presenceScores.reduce((a, b) => a + b, 0) / c.presenceScores.length)
          : 50;

        // Creator score: weighted mix of views, engagement, video count, growth
        const viewScore = Math.min(c.totalViews / 10_000_000, 1) * 40;
        const engScore = Math.min(engRate / 15, 1) * 25;
        const countScore = Math.min(c.videoCount / 10, 1) * 20;
        const growthScore = Math.min(Math.max(growth, 0) / 100, 1) * 15;
        const creatorScore = Math.round((viewScore + engScore + countScore + growthScore) * 10) / 10;

        return {
          username: c.username,
          nickname: c.nickname,
          videoCount: c.videoCount,
          totalViews: c.totalViews,
          totalLikes: c.totalLikes,
          totalComments: c.totalComments,
          totalShares: c.totalShares,
          followerCount: c.avgFollowers,
          engagementRate: engRate,
          growth,
          topCategory,
          topFormat,
          topHashtags,
          avgDuration,
          avgPresenceScore: avgPresence,
          creatorScore,
          latestVideoAt: c.latestVideoAt,
        };
      });

    // Apply filters
    if (category && category !== "Tümü") {
      creators = creators.filter((c) => c.topCategory === category);
    }
    if (search) {
      const q = search.toLowerCase();
      creators = creators.filter(
        (c) => c.username.toLowerCase().includes(q) || c.nickname.toLowerCase().includes(q)
      );
    }

    // Sort
    const sortFn: Record<string, (a: typeof creators[0], b: typeof creators[0]) => number> = {
      totalViews: (a, b) => b.totalViews - a.totalViews,
      videoCount: (a, b) => b.videoCount - a.videoCount,
      engagementRate: (a, b) => b.engagementRate - a.engagementRate,
      growth: (a, b) => b.growth - a.growth,
      creatorScore: (a, b) => b.creatorScore - a.creatorScore,
    };
    creators.sort(sortFn[sortBy] || sortFn.totalViews);

    const total = creators.length;
    creators = creators.slice(0, limit);

    return { creators, total, source: "live" as const };
  } catch (e) {
    apiLogger.error({ err: e }, "Creators API error");
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const sortBy = searchParams.get("sortBy") || "totalViews";
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const key = cacheKey("trends:creators", { limit, sortBy, category, search });

  const result = await cached(
    key,
    async () => {
      const data = await fetchCreators(limit, sortBy, category, search);
      if (data) return data;
      return { creators: [], total: 0, source: "live" as const };
    },
    900 // 15 minutes
  );

  return NextResponse.json(result);
}
