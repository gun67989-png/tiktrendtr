import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiLogger } from "@/lib/logger";
import { buildTiktokUrl } from "@/lib/tiktok-scraper";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const tag = decodeURIComponent(params.tag);
    const cleanTag = tag.startsWith("#") ? tag.slice(1) : tag;

    // Try to get real videos from Supabase that match this hashtag
    let realVideos: unknown[] = [];
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("trending_videos")
        .select("*")
        .or(`caption.ilike.%${cleanTag}%,hashtags.cs.{${cleanTag}}`)
        .order("view_count", { ascending: false })
        .limit(12);

      if (data && data.length > 0) {
        realVideos = data.map((v: Record<string, unknown>) => {
          const views = (v.view_count as number) || 0;
          const likes = (v.like_count as number) || 0;
          const comments = (v.comment_count as number) || 0;
          const shares = (v.share_count as number) || 0;
          const engRate = views > 0 ? Math.round(((likes + comments + shares) / views) * 10000) / 100 : 0;
          return {
            id: v.video_id,
            tiktokId: v.video_id,
            description: v.caption || "",
            creator: v.creator_username || "",
            thumbnailUrl: (v.thumbnail_url as string) || `https://picsum.photos/seed/${(v.video_id as string || "").slice(-6)}/400/700`,
            tiktokUrl: buildTiktokUrl(v.creator_username as string, v.video_id as string),
            views,
            likes,
            comments,
            shares,
            engagementRate: engRate,
            viralScore: Math.round((engRate * 0.4 + (views / 5000000) * 60) * 10) / 10,
            duration: (v.duration as number) || 0,
            format: v.format || null,
            publishedAt: v.scraped_at || new Date().toISOString(),
            soundName: v.sound_name || null,
          };
        });
      }
    }

    // If we have real videos, build a response from them
    if (realVideos.length > 0) {
      const totalViews = (realVideos as { views: number }[]).reduce((s, v) => s + v.views, 0);
      const totalLikes = (realVideos as { likes: number }[]).reduce((s, v) => s + v.likes, 0);
      const avgEng = totalViews > 0 ? Math.round((totalLikes / totalViews) * 10000) / 100 : 0;

      return NextResponse.json({
        tag: `#${cleanTag}`,
        name: cleanTag,
        videoCount: realVideos.length,
        totalViews,
        avgEngagement: avgEng,
        topVideos: realVideos,
        source: "live",
      });
    }

    return NextResponse.json(
      { error: "Hashtag bulunamad\u0131 veya hen\u00FCz yeterli veri yok" },
      { status: 404 }
    );
  } catch (e) {
    apiLogger.error({ err: e }, "Hashtag detail error");
    return NextResponse.json(
      { error: "Sunucu hatas\u0131" },
      { status: 500 }
    );
  }
}
