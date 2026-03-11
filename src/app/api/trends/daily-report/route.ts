import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: "Veritabani yapilandirilmamis" }, { status: 500 });
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Get all recent videos (last 7 days for comparison)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const { data: allVideos, error } = await supabase
      .from("trending_videos")
      .select("*")
      .gte("scraped_at", sevenDaysAgo)
      .order("view_count", { ascending: false });

    if (error || !allVideos || allVideos.length === 0) {
      return NextResponse.json({
        date: todayStr,
        error: "Yeterli veri bulunamadi",
        topVideos: [],
        trendingHashtags: [],
        trendingSounds: [],
        emergingFormats: [],
        stats: { totalVideos: 0, avgViews: 0, avgEngagement: 0, topCategory: "—" },
      });
    }

    // Split into today vs older
    const recentVideos = allVideos.filter((v: Record<string, unknown>) => {
      const scraped = v.scraped_at as string;
      return scraped >= oneDayAgo;
    });

    const olderVideos = allVideos.filter((v: Record<string, unknown>) => {
      const scraped = v.scraped_at as string;
      return scraped < oneDayAgo;
    });

    // ===== TOP 10 VIRAL VIDEOS =====
    const topVideos = allVideos.slice(0, 10).map((v: Record<string, unknown>) => {
      const views = (v.view_count as number) || 0;
      const likes = (v.like_count as number) || 0;
      const comments = (v.comment_count as number) || 0;
      const shares = (v.share_count as number) || 0;
      const engRate = views > 0 ? Math.round(((likes + comments + shares) / views) * 10000) / 100 : 0;

      return {
        id: v.video_id,
        creator: v.creator_username,
        description: ((v.caption as string) || "").substring(0, 80),
        thumbnailUrl: v.thumbnail_url,
        tiktokUrl: v.tiktok_url,
        views,
        likes,
        comments,
        shares,
        engagementRate: engRate,
        format: v.format || "Kısa Video",
        category: v.category || "Vlog",
      };
    });

    // ===== TRENDING HASHTAGS =====
    // Count hashtags in recent vs older to find fastest growing
    const recentHashtags: Record<string, number> = {};
    const olderHashtags: Record<string, number> = {};

    for (const v of recentVideos) {
      const tags = (v as Record<string, unknown>).hashtags as string[] || [];
      for (const tag of tags) {
        recentHashtags[tag] = (recentHashtags[tag] || 0) + 1;
      }
    }

    for (const v of olderVideos) {
      const tags = (v as Record<string, unknown>).hashtags as string[] || [];
      for (const tag of tags) {
        olderHashtags[tag] = (olderHashtags[tag] || 0) + 1;
      }
    }

    const trendingHashtags = Object.entries(recentHashtags)
      .map(([tag, count]) => {
        const oldCount = olderHashtags[tag] || 0;
        const growth = oldCount > 0 ? Math.round(((count - oldCount) / oldCount) * 100) : count > 1 ? 100 : 0;
        return { tag, count, oldCount, growth };
      })
      .filter((h) => h.count >= 2)
      .sort((a, b) => b.growth - a.growth || b.count - a.count)
      .slice(0, 10);

    // ===== TRENDING SOUNDS =====
    const soundCount: Record<string, { count: number; creator: string; views: number }> = {};
    for (const v of allVideos) {
      const vObj = v as Record<string, unknown>;
      const soundName = (vObj.sound_name as string) || "Bilinmeyen";
      if (!soundCount[soundName]) {
        soundCount[soundName] = { count: 0, creator: (vObj.sound_creator as string) || "", views: 0 };
      }
      soundCount[soundName].count++;
      soundCount[soundName].views += (vObj.view_count as number) || 0;
    }

    const trendingSounds = Object.entries(soundCount)
      .filter(([name]) => !name.includes("original sound") && !name.includes("orijinal ses"))
      .map(([name, stats]) => ({
        name,
        creator: stats.creator,
        videoCount: stats.count,
        totalViews: stats.views,
      }))
      .sort((a, b) => b.videoCount - a.videoCount || b.totalViews - a.totalViews)
      .slice(0, 10);

    // ===== EMERGING FORMATS =====
    const recentFormats: Record<string, number> = {};
    const olderFormats: Record<string, number> = {};

    for (const v of recentVideos) {
      const format = ((v as Record<string, unknown>).format as string) || "Kısa Video";
      recentFormats[format] = (recentFormats[format] || 0) + 1;
    }
    for (const v of olderVideos) {
      const format = ((v as Record<string, unknown>).format as string) || "Kısa Video";
      olderFormats[format] = (olderFormats[format] || 0) + 1;
    }

    const emergingFormats = Object.entries(recentFormats)
      .map(([format, count]) => {
        const oldCount = olderFormats[format] || 0;
        const growth = oldCount > 0 ? Math.round(((count - oldCount) / oldCount) * 100) : count > 1 ? 100 : 0;
        return { format, count, oldCount, growth };
      })
      .sort((a, b) => b.growth - a.growth || b.count - a.count)
      .slice(0, 6);

    // ===== CATEGORY DISTRIBUTION =====
    const categoryCount: Record<string, number> = {};
    for (const v of allVideos) {
      const cat = ((v as Record<string, unknown>).category as string) || "Vlog";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }
    const categoryDistribution = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / allVideos.length) * 100),
      }));

    const topCategory = categoryDistribution[0]?.category || "—";

    // ===== OVERALL STATS =====
    const totalViews = allVideos.reduce((s: number, v: Record<string, unknown>) => s + ((v.view_count as number) || 0), 0);
    const totalLikes = allVideos.reduce((s: number, v: Record<string, unknown>) => s + ((v.like_count as number) || 0), 0);
    const totalComments = allVideos.reduce((s: number, v: Record<string, unknown>) => s + ((v.comment_count as number) || 0), 0);
    const totalShares = allVideos.reduce((s: number, v: Record<string, unknown>) => s + ((v.share_count as number) || 0), 0);
    const avgViews = Math.round(totalViews / allVideos.length);
    const avgEngagement = totalViews > 0
      ? Math.round(((totalLikes + totalComments + totalShares) / totalViews) * 10000) / 100
      : 0;

    return NextResponse.json({
      date: todayStr,
      stats: {
        totalVideos: allVideos.length,
        recentVideos: recentVideos.length,
        totalViews,
        avgViews,
        avgEngagement,
        topCategory,
      },
      topVideos,
      trendingHashtags,
      trendingSounds,
      emergingFormats,
      categoryDistribution,
    });
  } catch (e) {
    console.error("[DAILY-REPORT] Error:", e);
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
