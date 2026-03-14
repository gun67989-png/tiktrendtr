import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { calcViralScore, VIRAL_THRESHOLDS } from "@/lib/data";
import { buildTiktokUrl } from "@/lib/tiktok-scraper";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface DBVideo {
  video_id: string;
  creator_username: string;
  creator_nickname: string;
  caption: string;
  hashtags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  follower_count: number;
  thumbnail_url: string;
  duration: number;
  sound_name: string;
  sound_creator: string;
  sound_type: string | null;
  category: string;
  format: string;
  ad_format: string | null;
  creator_presence_score: number;
  scraped_at: string;
}

// Try to fetch real scraped videos from Supabase
async function getRealVideos(options: {
  limit: number;
  offset: number;
  category?: string;
  sortBy: string;
  order: string;
  adOnly?: boolean;
}): Promise<{ videos: unknown[]; total: number } | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // Build query
    let countQuery = supabase
      .from("trending_videos")
      .select("*", { count: "exact", head: true });

    let query = supabase
      .from("trending_videos")
      .select("*");

    // Apply category filter
    if (options.category && options.category !== "Tümü") {
      countQuery = countQuery.eq("category", options.category);
      query = query.eq("category", options.category);
    }

    // Apply ad-only filter
    if (options.adOnly) {
      countQuery = countQuery.not("ad_format", "is", null);
      query = query.not("ad_format", "is", null);
    }

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError || count === null || count === 0) return null;

    // Apply sort
    const sortColumn = options.sortBy === "viralScore" ? "view_count"
      : options.sortBy === "views" ? "view_count"
      : options.sortBy === "engagementRate" ? "like_count"
      : options.sortBy === "likeRatio" ? "like_count"
      : options.sortBy === "publishedAt" ? "scraped_at"
      : "view_count";

    query = query.order(sortColumn, { ascending: options.order === "asc" });

    // Apply pagination
    query = query.range(options.offset, options.offset + options.limit - 1);

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    // Transform DB rows to frontend video format with new scoring
    const videos = (data as DBVideo[]).map((v) => {
      const engRate = v.view_count > 0
        ? Math.round(((v.like_count + v.comment_count + v.share_count) / v.view_count) * 10000) / 100
        : 0;

      const likeRatio = v.view_count > 0
        ? Math.round((v.like_count / v.view_count) * 10000) / 100
        : 0;

      // Use the new comprehensive scoring system
      const scoreResult = calcViralScore({
        views: v.view_count,
        likes: v.like_count,
        comments: v.comment_count,
        shares: v.share_count,
        followerCount: v.follower_count ?? 0,
        creatorPresenceScore: v.creator_presence_score ?? 50,
        publishedAt: v.scraped_at,
      });

      return {
        id: v.video_id,
        tiktokId: v.video_id,
        description: v.caption,
        creator: v.creator_username,
        creatorAvatar: null,
        thumbnailUrl: v.thumbnail_url || `https://picsum.photos/seed/${v.video_id.slice(-6)}/400/700`,
        videoUrl: buildTiktokUrl(v.creator_username, v.video_id),
        tiktokUrl: buildTiktokUrl(v.creator_username, v.video_id),
        views: v.view_count,
        likes: v.like_count,
        comments: v.comment_count,
        shares: v.share_count,
        engagementRate: engRate,
        likeRatio,
        viralScore: scoreResult.viralScore,
        surpriseFactor: scoreResult.surpriseFactor,
        engagementVelocity: scoreResult.engagementVelocity,
        discoveryScore: scoreResult.discoveryScore,
        followerCount: v.follower_count ?? 0,
        tier: scoreResult.tier,
        duration: v.duration,
        format: v.format,
        adFormat: v.ad_format,
        category: v.category,
        contentType: "creator_oncam",
        creatorPresenceScore: v.creator_presence_score ?? 50,
        soundId: null,
        soundName: v.sound_name,
        soundCreator: v.sound_creator,
        soundType: v.sound_type || "sound",
        publishedAt: v.scraped_at,
        hashtags: v.hashtags || [],
      };
    });

    return { videos, total: count };
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to fetch real videos");
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 200);
  const offset = parseInt(searchParams.get("offset") || "0");
  const category = searchParams.get("category") || undefined;
  const sortBy = (searchParams.get("sortBy") || "viralScore") as string;
  const order = (searchParams.get("order") || "desc") as string;
  const adOnly = searchParams.get("adOnly") === "true";

  const key = cacheKey("trends:videos", { limit, offset, category, sortBy, order, adOnly: adOnly ? "1" : undefined });

  const result = await cached(
    key,
    async () => {
      // Try real data first
      const realData = await getRealVideos({ limit, offset, category, sortBy, order, adOnly });
      if (realData && realData.videos.length > 0) {
        return { videos: realData.videos, total: realData.total, limit, offset, source: "live" as const };
      }
      // No fake data — return empty
      return { videos: [], total: 0, limit, offset, source: "no_data" as const };
    },
    300 // 5 minutes
  );

  return NextResponse.json(result);
}
