import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateSoundDetail, calcViralScore } from "@/lib/data";
import { buildTiktokUrl } from "@/lib/tiktok-scraper";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ soundId: string }> }
) {
  try {
    const { soundId } = await params;

    // Try real data first: soundId is the sound name (URL encoded)
    if (isSupabaseConfigured && supabase) {
      const soundName = decodeURIComponent(soundId);

      // Find videos using this sound
      const { data: videos, error } = await supabase
        .from("trending_videos")
        .select("*")
        .ilike("sound_name", `%${soundName}%`)
        .order("view_count", { ascending: false })
        .limit(50);

      if (!error && videos && videos.length > 0) {
        // Aggregate sound stats
        const totalViews = videos.reduce((s, v) => s + (v.view_count || 0), 0);
        const totalLikes = videos.reduce((s, v) => s + (v.like_count || 0), 0);
        const totalComments = videos.reduce((s, v) => s + (v.comment_count || 0), 0);
        const totalShares = videos.reduce((s, v) => s + (v.share_count || 0), 0);

        // Category distribution
        const catCount: Record<string, number> = {};
        for (const v of videos) {
          const cat = v.category || "Genel";
          catCount[cat] = (catCount[cat] || 0) + 1;
        }

        const categories = Object.entries(catCount)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => ({
            category,
            count,
            percentage: Math.round((count / videos.length) * 100),
          }));

        // Creator distribution
        const creatorCount: Record<string, number> = {};
        for (const v of videos) {
          creatorCount[v.creator_username] = (creatorCount[v.creator_username] || 0) + 1;
        }

        const topCreators = Object.entries(creatorCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([username, count]) => ({ username, count }));

        // Average duration
        const durations = videos.filter((v) => v.duration).map((v) => v.duration);
        const avgDuration = durations.length > 0
          ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length)
          : 0;

        // Transform videos for frontend
        const linkedVideos = videos.map((v) => {
          const views = v.view_count || 0;
          const likes = v.like_count || 0;
          const comments = v.comment_count || 0;
          const shares = v.share_count || 0;
          const engRate = views > 0
            ? Math.round(((likes + comments + shares) / views) * 10000) / 100
            : 0;
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
            engagementRate: engRate,
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

        return NextResponse.json({
          sound: {
            name: videos[0].sound_name,
            creator: videos[0].sound_creator || "Bilinmiyor",
            videoCount: videos.length,
            totalViews,
            totalLikes,
            totalComments,
            totalShares,
            avgDuration,
            topCategory: categories[0]?.category || "Genel",
          },
          videos: linkedVideos,
          categories,
          topCreators,
          source: "live",
        });
      }
    }

    // Fall back to generated data
    const detail = generateSoundDetail(soundId);
    if (!detail) {
      return NextResponse.json({ error: "Ses bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (e) {
    console.error("[SOUND DETAIL] Error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
