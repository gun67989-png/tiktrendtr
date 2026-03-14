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

        const topCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "Genel";

        // Average duration
        const durations = videos.filter((v) => v.duration).map((v) => v.duration);
        const avgDuration = durations.length > 0
          ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length)
          : 30;

        // Growth calculation
        const now = Date.now();
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        let recentCount = 0;
        let olderCount = 0;
        for (const v of videos) {
          const age = now - new Date(v.scraped_at).getTime();
          if (age <= threeDays) recentCount++;
          else olderCount++;
        }
        const growthRate = olderCount > 0
          ? Math.round(((recentCount - olderCount) / olderCount) * 100)
          : recentCount > 0 ? 100 : 0;

        // Viral score
        const avgEngagement = totalViews > 0
          ? (totalLikes + totalComments + totalShares) / totalViews
          : 0;
        const usageScore = Math.min(videos.length / 10, 1);
        const viewScore = Math.min(Math.log10(totalViews + 1) / 8, 1);
        const viralScore = Math.round((usageScore * 0.3 + viewScore * 0.4 + avgEngagement * 3) * 100) / 100;

        // Generate usage history (30 days)
        const usageHistory = [];
        for (let d = 29; d >= 0; d--) {
          const date = new Date();
          date.setDate(date.getDate() - d);
          const dateStr = date.toISOString().slice(0, 10);
          const dayCount = videos.filter((v) => {
            const vDate = new Date(v.scraped_at).toISOString().slice(0, 10);
            return vDate === dateStr;
          }).length;
          usageHistory.push({ date: dateStr, count: dayCount });
        }

        // Genre mapping
        const genreMap: Record<string, string> = {
          "Müzik": "Pop", "Dans": "Dance", "Komedi": "Comedy", "Moda": "Pop",
          "Güzellik": "R&B", "Spor": "Hip Hop", "Oyun": "Electronic",
          "Teknoloji": "Electronic", "Eğitim": "Ambient", "Yemek": "Pop",
          "Seyahat": "Indie", "Vlog": "Lo-Fi",
        };

        // Transform top videos for frontend (SoundDetail.topVideos format)
        const topVideos = videos.slice(0, 12).map((v) => {
          const views = v.view_count || 0;
          const likes = v.like_count || 0;
          const comments = v.comment_count || 0;
          const shares = v.share_count || 0;
          const engRate = views > 0
            ? Math.round(((likes + comments + shares) / views) * 10000) / 100
            : 0;

          const scoreResult = calcViralScore({
            views, likes, comments, shares,
            followerCount: v.follower_count ?? 0,
            creatorPresenceScore: v.creator_presence_score ?? 50,
            publishedAt: v.scraped_at,
          });

          return {
            id: v.video_id,
            description: v.caption,
            creator: v.creator_username,
            thumbnailUrl: v.thumbnail_url || `https://picsum.photos/seed/${v.video_id.slice(-6)}/400/700`,
            tiktokUrl: buildTiktokUrl(v.creator_username, v.video_id),
            views,
            likes,
            comments,
            shares,
            engagementRate: engRate,
            viralScore: scoreResult.viralScore,
            duration: v.duration,
            format: v.format,
            category: v.category,
            publishedAt: v.scraped_at,
            hashtags: v.hashtags || [],
          };
        });

        // Return SoundDetail-compatible format
        return NextResponse.json({
          id: soundName,
          name: videos[0].sound_name,
          creator: videos[0].sound_creator || "Bilinmiyor",
          usageCount: videos.length,
          growthRate,
          bpm: null,
          duration: `${avgDuration}s`,
          genre: genreMap[topCategory] || "Pop",
          viralScore,
          usageHistory,
          topVideos,
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
