import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { runFullAnalysis } from "@/lib/psychological-analysis";
import type { VideoData } from "@/lib/psychological-analysis";
import { cronLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auto-analyze
 *
 * Cron-triggered endpoint that picks the next analysis target (round-robin),
 * fetches recent videos, runs psychological analysis, and stores the summary.
 *
 * Auth: CRON_SECRET header
 */
export async function GET(request: NextRequest) {
  // ── Auth: verify CRON_SECRET ──────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("x-cron-secret") || request.headers.get("authorization");

  if (!cronSecret || authHeader !== cronSecret) {
    cronLogger.warn("Auto-analyze: unauthorized request");
    return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "Supabase yapilandirilmamis" },
      { status: 503 }
    );
  }

  try {
    // ── Pick next target (round-robin by last_analyzed_at) ──
    const { data: target, error: targetError } = await supabase
      .from("analysis_targets")
      .select("*")
      .eq("is_active", true)
      .order("last_analyzed_at", { ascending: true, nullsFirst: true })
      .limit(1)
      .single();

    if (targetError || !target) {
      cronLogger.info("Auto-analyze: aktif hedef bulunamadi");
      return NextResponse.json(
        { message: "Aktif analiz hedefi bulunamadi" },
        { status: 200 }
      );
    }

    cronLogger.info({ username: target.username }, "Auto-analyze: hedef secildi");

    // ── Fetch latest 2 videos for this profile ──────────────
    const { data: rawVideos, error: videosError } = await supabase
      .from("trending_videos")
      .select("*")
      .eq("creator_username", target.username)
      .order("scraped_at", { ascending: false })
      .limit(2);

    if (videosError) {
      cronLogger.error({ error: videosError }, "Auto-analyze: video cekme hatasi");
      return NextResponse.json(
        { error: "Videolar cekilemedi" },
        { status: 500 }
      );
    }

    if (!rawVideos || rawVideos.length === 0) {
      cronLogger.info({ username: target.username }, "Auto-analyze: video bulunamadi");

      // Update last_analyzed_at so we move to next target
      await supabase
        .from("analysis_targets")
        .update({ last_analyzed_at: new Date().toISOString() })
        .eq("id", target.id);

      return NextResponse.json(
        { message: `${target.username} icin video bulunamadi`, target: target.username },
        { status: 200 }
      );
    }

    // ── Map to VideoData type ───────────────────────────────
    const videos: VideoData[] = rawVideos.map((v) => ({
      video_id: v.video_id,
      creator_username: v.creator_username,
      creator_nickname: v.creator_nickname || "",
      caption: v.caption || "",
      hashtags: Array.isArray(v.hashtags) ? v.hashtags : [],
      view_count: v.view_count || 0,
      like_count: v.like_count || 0,
      comment_count: v.comment_count || 0,
      share_count: v.share_count || 0,
      follower_count: v.follower_count || 0,
      duration: v.duration || 0,
      sound_name: v.sound_name || undefined,
      sound_creator: v.sound_creator || undefined,
      sound_type: v.sound_type || null,
      category: v.category || undefined,
      format: v.format || undefined,
      ad_format: v.ad_format || null,
      scraped_at: v.scraped_at || undefined,
    }));

    // ── Run analysis ────────────────────────────────────────
    const analysisResult = runFullAnalysis(
      target.username,
      target.platform || "tiktok",
      videos
    );

    // ── Store ONLY the JSONB summary ────────────────────────
    const { data: savedAnalysis, error: insertError } = await supabase
      .from("analyses")
      .insert({
        profile_username: analysisResult.profile_username,
        platform: analysisResult.platform,
        analysis_data: analysisResult.analysis_data,
        metrics: analysisResult.metrics,
        viral_post_drafts: analysisResult.viral_post_drafts,
        analyzed_at: analysisResult.analyzed_at,
      })
      .select("id, profile_username, analyzed_at")
      .single();

    if (insertError) {
      cronLogger.error({ error: insertError }, "Auto-analyze: analiz kaydetme hatasi");
      return NextResponse.json(
        { error: "Analiz kaydedilemedi" },
        { status: 500 }
      );
    }

    // ── Update target's last_analyzed_at ────────────────────
    await supabase
      .from("analysis_targets")
      .update({ last_analyzed_at: new Date().toISOString() })
      .eq("id", target.id);

    cronLogger.info(
      { analysisId: savedAnalysis?.id, username: target.username },
      "Auto-analyze: analiz tamamlandi"
    );

    // ── Memory cleanup ──────────────────────────────────────
    // Allow GC to reclaim video data
    videos.length = 0;

    return NextResponse.json({
      success: true,
      analysis_id: savedAnalysis?.id,
      target: target.username,
      metrics_summary: {
        hate_watching: analysisResult.metrics.hate_watching.score,
        anchor_points: analysisResult.metrics.anchor_points.score,
        drop_off: analysisResult.metrics.drop_off.score,
        demographics: analysisResult.metrics.demographics.score,
        sentiment_drift: analysisResult.metrics.sentiment_drift.score,
      },
      video_count: analysisResult.analysis_data.video_count,
      drafts_generated: analysisResult.viral_post_drafts.length,
    });
  } catch (err) {
    cronLogger.error({ error: err }, "Auto-analyze: beklenmeyen hata");
    return NextResponse.json(
      { error: "Beklenmeyen sunucu hatasi" },
      { status: 500 }
    );
  }
}
