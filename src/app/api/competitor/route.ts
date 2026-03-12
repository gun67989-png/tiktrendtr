import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { buildTiktokUrl } from "@/lib/tiktok-scraper";

export const dynamic = "force-dynamic";

interface TikWMVideo {
  video_id: string;
  title: string;
  cover: string;
  origin_cover: string;
  duration: number;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
  author: {
    id: string;
    unique_id: string;
    nickname: string;
    avatar: string;
  };
  music_info?: {
    title: string;
    author: string;
  };
}

interface TikWMResponse {
  code: number;
  msg: string;
  data: {
    videos: TikWMVideo[];
    cursor: number;
    hasMore: boolean;
  };
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u024F\u0400-\u04FF\u00e7\u011f\u0131\u00f6\u015f\u00fc\u00c7\u011e\u0130\u00d6\u015e\u00dc]+/g);
  return matches ? matches.map((h) => h.toLowerCase()) : [];
}

function detectFormat(caption: string): string {
  const text = caption.toLowerCase();
  if (text.includes("tutorial") || text.includes("nasil") || text.includes("rehber")) return "Tutorial";
  if (text.includes("pov")) return "POV";
  if (text.includes("grwm") || text.includes("get ready")) return "GRWM";
  if ((text.includes("once") && text.includes("sonra")) || text.includes("dönüşüm") || text.includes("transformation")) return "Önce/Sonra";
  if (text.includes("mukbang")) return "Mukbang";
  if (text.includes("challenge")) return "Challenge";
  if (text.includes("duet")) return "Duet";
  if (text.includes("reaction") || text.includes("reaksiyon") || text.includes("tepki")) return "Reaksiyon";
  if (text.includes("sketch") || text.includes("parodi") || text.includes("skeç")) return "Komedi Skeçi";
  if (text.includes("röportaj") || text.includes("sorduk")) return "Sokak Röportajı";
  if (text.includes("storytime") || text.includes("hikaye")) return "Hikaye Anlatımı";
  return "Kısa Video";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Kullanıcı adı gerekli" }, { status: 400 });
  }

  const cleanUsername = username.replace("@", "").trim().toLowerCase();

  try {
    // Step 1: Check Supabase for existing videos from this creator
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("trending_videos")
        .select("*")
        .ilike("creator_username", cleanUsername)
        .order("view_count", { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        // Transform DB data into analysis
        const videos = data.map((v: Record<string, unknown>) => ({
          id: v.video_id as string,
          description: (v.caption as string) || "",
          creator: (v.creator_username as string) || "",
          thumbnailUrl: (v.thumbnail_url as string) || "",
          tiktokUrl: buildTiktokUrl(v.creator_username as string, v.video_id as string),
          views: (v.view_count as number) || 0,
          likes: (v.like_count as number) || 0,
          comments: (v.comment_count as number) || 0,
          shares: (v.share_count as number) || 0,
          duration: (v.duration as number) || 0,
          format: (v.format as string) || "Kısa Video",
          hashtags: (v.hashtags as string[]) || [],
          publishedAt: (v.scraped_at as string) || new Date().toISOString(),
          soundName: (v.sound_name as string) || null,
        }));

        return NextResponse.json(buildAnalysis(cleanUsername, videos));
      }
    }

    // Step 2: Search TikWM for this user's videos
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://www.tikwm.com/api/feed/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: `keywords=${encodeURIComponent(cleanUsername)}&count=30&region=tr`,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: "TikWM API hatasi" }, { status: 502 });
    }

    const result = (await response.json()) as TikWMResponse;

    if (result.code !== 0 || !result.data?.videos) {
      return NextResponse.json({ error: "Video bulunamadi", videos: [] });
    }

    // Filter to only videos from this specific creator
    const creatorVideos = result.data.videos.filter(
      (v) => v.author?.unique_id?.toLowerCase() === cleanUsername
    );

    // If no exact match, use all results but note the creator
    const videosToAnalyze = creatorVideos.length > 0 ? creatorVideos : result.data.videos;
    const isExactMatch = creatorVideos.length > 0;

    const videos = videosToAnalyze.map((v) => {
      const caption = v.title || "";
      const hashtags = extractHashtags(caption);
      const engRate =
        v.play_count > 0
          ? Math.round(((v.digg_count + v.comment_count + v.share_count) / v.play_count) * 10000) / 100
          : 0;

      return {
        id: v.video_id,
        description: caption,
        creator: v.author?.unique_id || cleanUsername,
        thumbnailUrl: v.origin_cover || v.cover || "",
        tiktokUrl: `https://www.tiktok.com/@${v.author?.unique_id}/video/${v.video_id}`,
        views: v.play_count || 0,
        likes: v.digg_count || 0,
        comments: v.comment_count || 0,
        shares: v.share_count || 0,
        engagementRate: engRate,
        duration: v.duration || 0,
        format: detectFormat(caption),
        hashtags,
        publishedAt: v.create_time ? new Date(v.create_time * 1000).toISOString() : new Date().toISOString(),
        soundName: v.music_info?.title || null,
      };
    });

    const analysis = buildAnalysis(cleanUsername, videos);
    analysis.isExactMatch = isExactMatch;

    return NextResponse.json(analysis);
  } catch (e) {
    console.error("[COMPETITOR] Error:", e);
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}

function buildAnalysis(username: string, videos: Array<{
  id: string;
  description: string;
  creator: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration?: number;
  format: string;
  hashtags: string[];
  publishedAt: string;
  soundName?: string | null;
  engagementRate?: number;
}>) {
  if (videos.length === 0) {
    return { username, error: "Video bulunamadi", videos: [] };
  }

  // Sort by views descending
  const sorted = [...videos].sort((a, b) => b.views - a.views);

  // Average stats
  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0);
  const totalComments = videos.reduce((s, v) => s + v.comments, 0);
  const totalShares = videos.reduce((s, v) => s + v.shares, 0);
  const avgViews = Math.round(totalViews / videos.length);
  const avgEngRate = totalViews > 0
    ? Math.round(((totalLikes + totalComments + totalShares) / totalViews) * 10000) / 100
    : 0;

  // Top hashtags
  const hashtagCount: Record<string, number> = {};
  for (const v of videos) {
    for (const tag of v.hashtags) {
      hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
    }
  }
  const topHashtags = Object.entries(hashtagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Format distribution
  const formatCount: Record<string, number> = {};
  for (const v of videos) {
    formatCount[v.format] = (formatCount[v.format] || 0) + 1;
  }
  const formatDistribution = Object.entries(formatCount)
    .sort((a, b) => b[1] - a[1])
    .map(([format, count]) => ({ format, count, percentage: Math.round((count / videos.length) * 100) }));

  // Posting hours distribution
  const hourCount: Record<number, number> = {};
  for (const v of videos) {
    const hour = new Date(v.publishedAt).getHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  }
  const postingHours = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: hourCount[h] || 0,
  }));

  // Best posting hours (top 3)
  const bestHours = [...postingHours]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((h) => h.hour);

  // Average duration
  const avgDuration = videos.reduce((s, v) => s + (v.duration || 0), 0) / videos.length;

  return {
    username,
    isExactMatch: true,
    videoCount: videos.length,
    stats: {
      totalViews,
      avgViews,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagementRate: avgEngRate,
      avgDuration: Math.round(avgDuration),
    },
    topVideos: sorted.slice(0, 12),
    topHashtags,
    formatDistribution,
    postingHours,
    bestHours,
  };
}
