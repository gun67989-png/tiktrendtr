import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateVideos } from "@/lib/data";

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
  tiktok_url: string;
  thumbnail_url: string;
  duration: number;
  sound_name: string;
  sound_creator: string;
  category: string;
  format: string;
  scraped_at: string;
}

// Try to fetch real scraped videos from Supabase
async function getRealVideos(options: {
  limit: number;
  offset: number;
  category?: string;
  sortBy: string;
  order: string;
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

    // Get count
    const { count, error: countError } = await countQuery;
    if (countError || count === null || count === 0) return null;

    // Apply sort
    const sortColumn = options.sortBy === "viralScore" ? "view_count"
      : options.sortBy === "views" ? "view_count"
      : options.sortBy === "engagementRate" ? "like_count"
      : options.sortBy === "publishedAt" ? "scraped_at"
      : "view_count";

    query = query.order(sortColumn, { ascending: options.order === "asc" });

    // Apply pagination
    query = query.range(options.offset, options.offset + options.limit - 1);

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    // Transform DB rows to frontend video format
    const videos = (data as DBVideo[]).map((v, i) => {
      const engRate = v.view_count > 0
        ? Math.round(((v.like_count + v.comment_count + v.share_count) / v.view_count) * 10000) / 100
        : 0;

      const viralScore = Math.min(10, Math.max(0.1,
        Math.round((engRate / 15 * 0.35 + (v.view_count / 5000000) * 0.25 + 0.2 + 0.1) * 100) / 10
      ));

      return {
        id: v.video_id,
        tiktokId: v.video_id,
        description: v.caption,
        creator: v.creator_username,
        creatorAvatar: null,
        thumbnailUrl: v.thumbnail_url || `https://picsum.photos/seed/${v.video_id.slice(-6)}/400/700`,
        videoUrl: v.tiktok_url,
        tiktokUrl: v.tiktok_url,
        views: v.view_count,
        likes: v.like_count,
        comments: v.comment_count,
        shares: v.share_count,
        engagementRate: engRate,
        viralScore,
        duration: v.duration,
        format: v.format,
        category: v.category,
        contentType: "creator_oncam",
        soundId: null,
        soundName: v.sound_name,
        soundCreator: v.sound_creator,
        publishedAt: v.scraped_at,
        hashtags: v.hashtags || [],
      };
    });

    return { videos, total: count };
  } catch (e) {
    console.error("[API] Failed to fetch real videos:", e);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 120);
  const offset = parseInt(searchParams.get("offset") || "0");
  const category = searchParams.get("category") || undefined;
  const sortBy = (searchParams.get("sortBy") || "viralScore") as string;
  const order = (searchParams.get("order") || "desc") as string;

  // Try real data first
  const realData = await getRealVideos({ limit, offset, category, sortBy, order });

  if (realData && realData.videos.length > 0) {
    return NextResponse.json({
      videos: realData.videos,
      total: realData.total,
      limit,
      offset,
      source: "live",
    });
  }

  // Fall back to generated data
  const { videos, total } = generateVideos({
    limit,
    offset,
    category,
    sortBy: sortBy as "viralScore" | "views" | "engagementRate" | "publishedAt",
    order: order as "asc" | "desc",
  });

  return NextResponse.json({ videos, total, limit, offset, source: "generated" });
}
