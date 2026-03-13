import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { analyzeComments, analyzeCreatorCommentPatterns } from "@/lib/comment-analysis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: "Veritabanı yapılandırılmamış" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");
    const username = searchParams.get("username");

    // Single video analysis
    if (videoId) {
      const { data, error } = await supabase
        .from("trending_videos")
        .select("view_count, like_count, comment_count, share_count, duration, category, follower_count")
        .eq("video_id", videoId)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Video bulunamadı" }, { status: 404 });
      }

      const analysis = analyzeComments({
        views: data.view_count || 0,
        likes: data.like_count || 0,
        comments: data.comment_count || 0,
        shares: data.share_count || 0,
        duration: data.duration || 0,
        category: data.category || undefined,
        followerCount: data.follower_count || undefined,
      });

      return NextResponse.json({ videoId, analysis });
    }

    // Creator-level analysis
    if (username) {
      const { data, error } = await supabase
        .from("trending_videos")
        .select("view_count, like_count, comment_count, share_count, duration, category")
        .ilike("creator_username", username)
        .order("view_count", { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        return NextResponse.json({ error: "İçerik üretici bulunamadı" }, { status: 404 });
      }

      const patterns = analyzeCreatorCommentPatterns(
        data.map((v) => ({
          views: v.view_count || 0,
          likes: v.like_count || 0,
          comments: v.comment_count || 0,
          shares: v.share_count || 0,
          duration: v.duration || 0,
          category: v.category || undefined,
        }))
      );

      // Also analyze each video individually
      const videoAnalyses = data.slice(0, 10).map((v) => ({
        analysis: analyzeComments({
          views: v.view_count || 0,
          likes: v.like_count || 0,
          comments: v.comment_count || 0,
          shares: v.share_count || 0,
          duration: v.duration || 0,
          category: v.category || undefined,
        }),
      }));

      return NextResponse.json({
        username,
        patterns,
        topVideoAnalyses: videoAnalyses,
      });
    }

    // Global comment stats
    const { data, error } = await supabase
      .from("trending_videos")
      .select("view_count, like_count, comment_count, share_count, duration, category")
      .order("comment_count", { ascending: false })
      .limit(500);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Veri bulunamadı" }, { status: 404 });
    }

    // Category-level analysis
    const catGroups: Record<string, Array<{ views: number; likes: number; comments: number; shares: number; duration: number }>> = {};
    for (const v of data) {
      const cat = v.category || "Genel";
      if (!catGroups[cat]) catGroups[cat] = [];
      catGroups[cat].push({
        views: v.view_count || 0,
        likes: v.like_count || 0,
        comments: v.comment_count || 0,
        shares: v.share_count || 0,
        duration: v.duration || 0,
      });
    }

    const categoryStats = Object.entries(catGroups).map(([category, videos]) => {
      const totalComments = videos.reduce((s, v) => s + v.comments, 0);
      const totalViews = videos.reduce((s, v) => s + v.views, 0);
      const avgRate = totalViews > 0 ? Math.round((totalComments / totalViews) * 10000) / 100 : 0;
      return {
        category,
        videoCount: videos.length,
        totalComments,
        avgCommentRate: avgRate,
      };
    }).sort((a, b) => b.avgCommentRate - a.avgCommentRate);

    // Top commented videos
    const topCommented = data.slice(0, 10).map((v) => ({
      comments: v.comment_count,
      views: v.view_count,
      rate: v.view_count > 0 ? Math.round((v.comment_count / v.view_count) * 10000) / 100 : 0,
      category: v.category,
    }));

    // Overall stats
    const totalComments = data.reduce((s, v) => s + (v.comment_count || 0), 0);
    const totalViews = data.reduce((s, v) => s + (v.view_count || 0), 0);

    return NextResponse.json({
      stats: {
        totalComments,
        totalViews,
        avgCommentRate: totalViews > 0 ? Math.round((totalComments / totalViews) * 10000) / 100 : 0,
        videoCount: data.length,
      },
      categoryStats,
      topCommented,
    });
  } catch (e) {
    console.error("[COMMENTS API] Error:", e);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
