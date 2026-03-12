import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateHashtagDetail } from "@/lib/data";
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

    // Fall back to generated data for charts/stats
    const detail = generateHashtagDetail(tag);

    if (!detail) {
      return NextResponse.json(
        { error: "Hashtag bulunamadi" },
        { status: 404 }
      );
    }

    // Override fake videos with real ones if available
    if (realVideos.length > 0) {
      detail.topVideos = realVideos as typeof detail.topVideos;
    }

    return NextResponse.json(detail);
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
