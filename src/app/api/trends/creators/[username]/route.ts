import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { calcViralScore } from "@/lib/data";
import { buildTiktokUrl } from "@/lib/tiktok-scraper";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: "Veritabanı yapılandırılmamış" }, { status: 500 });
    }

    const { username } = await params;

    // Fetch all videos by this creator
    const { data, error } = await supabase
      .from("trending_videos")
      .select("*")
      .ilike("creator_username", username)
      .order("view_count", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "İçerik üretici bulunamadı" }, { status: 404 });
    }

    // Profile stats
    const totalViews = data.reduce((s, v) => s + (v.view_count || 0), 0);
    const totalLikes = data.reduce((s, v) => s + (v.like_count || 0), 0);
    const totalComments = data.reduce((s, v) => s + (v.comment_count || 0), 0);
    const totalShares = data.reduce((s, v) => s + (v.share_count || 0), 0);
    const engRate = totalViews > 0
      ? Math.round(((totalLikes + totalComments + totalShares) / totalViews) * 10000) / 100
      : 0;

    // Category distribution
    const catCount: Record<string, number> = {};
    const formatCount: Record<string, number> = {};
    const soundCount: Record<string, { count: number; creator: string }> = {};
    const hashtagCount: Record<string, number> = {};

    for (const v of data) {
      if (v.category) catCount[v.category] = (catCount[v.category] || 0) + 1;
      if (v.format) formatCount[v.format] = (formatCount[v.format] || 0) + 1;
      if (v.sound_name) {
        if (!soundCount[v.sound_name]) soundCount[v.sound_name] = { count: 0, creator: v.sound_creator || "" };
        soundCount[v.sound_name].count++;
      }
      if (v.hashtags && Array.isArray(v.hashtags)) {
        for (const tag of v.hashtags) {
          hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
        }
      }
    }

    const categories = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count, percentage: Math.round((count / data.length) * 100) }));

    const formats = Object.entries(formatCount)
      .sort((a, b) => b[1] - a[1])
      .map(([format, count]) => ({ format, count }));

    const sounds = Object.entries(soundCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, stats]) => ({ name, creator: stats.creator, count: stats.count }));

    const topHashtags = Object.entries(hashtagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([tag, count]) => ({ tag, count }));

    // Transform videos
    const videos = data.map((v) => {
      const views = v.view_count || 0;
      const likes = v.like_count || 0;
      const comments = v.comment_count || 0;
      const shares = v.share_count || 0;
      const videoEngRate = views > 0 ? Math.round(((likes + comments + shares) / views) * 10000) / 100 : 0;
      const likeRatio = views > 0 ? Math.round((likes / views) * 10000) / 100 : 0;

      const scoreResult = calcViralScore({
        views,
        likes,
        comments,
        shares,
        followerCount: v.follower_count ?? 0,
        creatorPresenceScore: v.creator_presence_score ?? 50,
        publishedAt: v.scraped_at,
      });

      return {
        id: v.video_id,
        tiktokId: v.video_id,
        description: v.caption,
        creator: v.creator_username,
        thumbnailUrl: v.thumbnail_url || `https://picsum.photos/seed/${v.video_id.slice(-6)}/400/700`,
        tiktokUrl: buildTiktokUrl(v.creator_username, v.video_id),
        views,
        likes,
        comments,
        shares,
        engagementRate: videoEngRate,
        likeRatio,
        viralScore: scoreResult.viralScore,
        duration: v.duration,
        format: v.format,
        adFormat: v.ad_format,
        category: v.category,
        creatorPresenceScore: v.creator_presence_score ?? 50,
        soundName: v.sound_name,
        soundCreator: v.sound_creator,
        publishedAt: v.scraped_at,
        hashtags: v.hashtags || [],
      };
    });

    // Average presence score
    const presenceScores = data.filter((v) => v.creator_presence_score != null).map((v) => v.creator_presence_score);
    const avgPresence = presenceScores.length > 0
      ? Math.round(presenceScores.reduce((a: number, b: number) => a + b, 0) / presenceScores.length)
      : 50;

    // Average duration
    const durations = data.filter((v) => v.duration).map((v) => v.duration);
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length)
      : 0;

    const profile = {
      username: data[0].creator_username,
      nickname: data[0].creator_nickname || data[0].creator_username,
      followerCount: data[0].follower_count || 0,
      videoCount: data.length,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      engagementRate: engRate,
      avgPresenceScore: avgPresence,
      avgDuration,
      topCategory: categories[0]?.category || "Genel",
    };

    return NextResponse.json({
      profile,
      videos,
      categories,
      formats,
      sounds,
      topHashtags,
    });
  } catch (e) {
    console.error("[CREATOR DETAIL] Error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
