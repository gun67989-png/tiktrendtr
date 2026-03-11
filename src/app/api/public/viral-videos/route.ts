import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  // Try real data first
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("trending_videos")
        .select("*")
        .order("view_count", { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        const videos = data.map((v: Record<string, unknown>) => {
          const views = (v.view_count as number) || 0;
          const likes = (v.like_count as number) || 0;
          const comments = (v.comment_count as number) || 0;
          const shares = (v.share_count as number) || 0;
          const engRate = views > 0
            ? Math.round(((likes + comments + shares) / views) * 10000) / 100
            : 0;

          return {
            id: v.video_id,
            creator: v.creator_username,
            description: ((v.caption as string) || "").substring(0, 100),
            thumbnailUrl: v.thumbnail_url || `https://picsum.photos/seed/${(v.video_id as string).slice(-6)}/400/700`,
            tiktokUrl: v.tiktok_url,
            views,
            likes,
            comments,
            shares,
            engagementRate: engRate,
            format: v.format || "Kisa Video",
            category: v.category || "Vlog",
            hashtags: (v.hashtags as string[]) || [],
            publishedAt: v.scraped_at,
          };
        });

        return NextResponse.json({ videos, source: "live" });
      }
    } catch {
      // Fall through to generated data
    }
  }

  // Fallback to generated data
  const { videos } = generateVideos({
    limit: 30,
    sortBy: "viralScore",
    order: "desc",
  });

  return NextResponse.json({
    videos: videos.map((v) => ({
      id: v.id,
      creator: v.creator,
      description: v.description.substring(0, 100),
      thumbnailUrl: v.thumbnailUrl,
      tiktokUrl: v.tiktokUrl,
      views: v.views,
      likes: v.likes,
      comments: v.comments,
      shares: v.shares,
      engagementRate: v.engagementRate,
      format: v.format,
      category: v.category,
      hashtags: v.hashtags,
      publishedAt: v.publishedAt,
    })),
    source: "generated",
  });
}
