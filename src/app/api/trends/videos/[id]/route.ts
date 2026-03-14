import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { calcViralScore } from "@/lib/data";
import { analyzeViralReason } from "@/lib/viral-reason";
import { apiLogger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const videoId = params.id;

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: "Veritabanı yapılandırılmamış" }, { status: 503 });
    }

    // Fetch video from database
    const { data: video, error } = await supabase
      .from("trending_videos")
      .select("*")
      .eq("video_id", videoId)
      .single();

    if (error || !video) {
      return NextResponse.json({ error: "Video bulunamadı" }, { status: 404 });
    }

    // Calculate viral score with breakdown
    const scoreResult = calcViralScore({
      views: video.view_count,
      likes: video.like_count,
      comments: video.comment_count,
      shares: video.share_count,
      followerCount: video.follower_count || 0,
      creatorPresenceScore: video.creator_presence_score || 50,
      publishedAt: video.scraped_at || video.created_at,
    });

    // Generate viral reason (AI-powered, cached)
    let viralReason = null;
    try {
      viralReason = await analyzeViralReason({
        video_id: video.video_id,
        caption: video.caption || "",
        view_count: video.view_count,
        like_count: video.like_count,
        comment_count: video.comment_count,
        share_count: video.share_count,
        format: video.format || "Kısa Video",
        category: video.category || "Vlog",
        sound_name: video.sound_name || "",
        hashtags: video.hashtags || [],
        duration: video.duration || 0,
      });
    } catch (e) {
      apiLogger.warn({ err: e, videoId }, "Viral reason analysis failed");
    }

    return NextResponse.json({
      ...video,
      viralScore: scoreResult.viralScore,
      viralTier: scoreResult.tier,
      breakdown: scoreResult.breakdown,
      surpriseFactor: scoreResult.surpriseFactor,
      engagementVelocity: scoreResult.engagementVelocity,
      discoveryScore: scoreResult.discoveryScore,
      viralReason,
    });
  } catch (error) {
    apiLogger.error({ err: error }, "Video detail fetch failed");
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
