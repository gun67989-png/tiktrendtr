import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface ContentROI {
  format: string;
  videoCount: number;
  avgViews: number;
  avgEngagement: number;
  avgShares: number;
  roi: number; // engagement per video — higher = better ROI
  trend: "up" | "down" | "stable";
}

interface TimeSlotROI {
  hour: number;
  dayOfWeek: string;
  avgEngagement: number;
  videoCount: number;
}

interface HashtagROI {
  hashtag: string;
  videoCount: number;
  totalViews: number;
  avgEngagement: number;
  roi: number;
}

interface AdPerformanceData {
  contentROI: ContentROI[];
  bestTimeSlots: TimeSlotROI[];
  hashtagROI: HashtagROI[];
  summary: {
    totalVideosAnalyzed: number;
    avgEngagementRate: number;
    bestFormat: string;
    bestTime: string;
    topHashtag: string;
    overallROI: number; // 0-100 score
  };
}

async function computeAdPerformance(niche?: string): Promise<AdPerformanceData | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const query = supabase
      .from("trending_videos")
      .select("video_id, hashtags, caption, sound_name, category, format, view_count, like_count, comment_count, share_count, duration, scraped_at")
      .order("view_count", { ascending: false })
      .limit(2000);

    const { data, error } = await query;
    if (error || !data || data.length < 10) return null;

    // Filter by niche if provided
    const videos = niche
      ? data.filter((v) => {
          const cat = (v.category || "").toLowerCase();
          return cat.includes(niche.toLowerCase());
        })
      : data;

    const source = videos.length >= 10 ? videos : data;

    // --- 1. Content Format ROI ---
    const formatMap = new Map<string, { views: number[]; engagements: number[]; shares: number[] }>();

    for (const v of source) {
      const fmt = v.format || "Bilinmiyor";
      const views = v.view_count || 1;
      const rawEngagement = ((v.like_count + v.comment_count + v.share_count) / views) * 100;
      const engagement = Math.min(rawEngagement, 50); // Cap at 50% to filter outliers

      if (!formatMap.has(fmt)) formatMap.set(fmt, { views: [], engagements: [], shares: [] });
      const entry = formatMap.get(fmt)!;
      entry.views.push(views);
      entry.engagements.push(engagement);
      entry.shares.push(v.share_count || 0);
    }

    const contentROI: ContentROI[] = Array.from(formatMap.entries())
      .filter(([, s]) => s.views.length >= 3)
      .map(([format, s]) => {
        const avgViews = Math.round(s.views.reduce((a, b) => a + b, 0) / s.views.length);
        const avgEngagement = Math.round((s.engagements.reduce((a, b) => a + b, 0) / s.engagements.length) * 100) / 100;
        const avgShares = Math.round(s.shares.reduce((a, b) => a + b, 0) / s.shares.length);
        // ROI = combined metric of engagement + reach
        const roi = Math.round(avgEngagement * Math.log10(Math.max(avgViews, 10)) * 10);

        return {
          format,
          videoCount: s.views.length,
          avgViews,
          avgEngagement,
          avgShares,
          roi,
          trend: avgEngagement > 5 ? "up" as const : avgEngagement > 2 ? "stable" as const : "down" as const,
        };
      })
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 10);

    // --- 2. Time Slot ROI ---
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const timeMap = new Map<string, { engagements: number[]; count: number }>();

    for (const v of source) {
      if (!v.scraped_at) continue;
      const date = new Date(v.scraped_at);
      const day = date.getUTCDay();
      const hour = (date.getUTCHours() + 3) % 24; // Turkey time UTC+3
      const key = `${day}-${hour}`;
      const views = v.view_count || 1;
      const engagement = Math.min(((v.like_count + v.comment_count + v.share_count) / views) * 100, 50);

      if (!timeMap.has(key)) timeMap.set(key, { engagements: [], count: 0 });
      const entry = timeMap.get(key)!;
      entry.engagements.push(engagement);
      entry.count++;
    }

    const bestTimeSlots: TimeSlotROI[] = Array.from(timeMap.entries())
      .filter(([, s]) => s.count >= 2)
      .map(([key, s]) => {
        const [dayIdx, hour] = key.split("-").map(Number);
        return {
          hour,
          dayOfWeek: days[dayIdx],
          avgEngagement: Math.round((s.engagements.reduce((a, b) => a + b, 0) / s.engagements.length) * 100) / 100,
          videoCount: s.count,
        };
      })
      .sort((a, b) => b.avgEngagement - a.avgEngagement)
      .slice(0, 10);

    // --- 3. Hashtag ROI ---
    const hashtagMap = new Map<string, { views: number; engagements: number[]; count: number }>();

    for (const v of source) {
      if (!v.hashtags || !Array.isArray(v.hashtags)) continue;
      const views = v.view_count || 1;
      const engagement = Math.min(((v.like_count + v.comment_count + v.share_count) / views) * 100, 50);

      for (const rawTag of v.hashtags) {
        const tag = rawTag.toLowerCase().replace(/^#/, "").trim();
        if (!tag || tag.length < 3 || ["fyp", "foryou", "viral", "tiktok"].includes(tag)) continue;

        if (!hashtagMap.has(tag)) hashtagMap.set(tag, { views: 0, engagements: [], count: 0 });
        const entry = hashtagMap.get(tag)!;
        entry.views += views;
        entry.engagements.push(engagement);
        entry.count++;
      }
    }

    const hashtagROI: HashtagROI[] = Array.from(hashtagMap.entries())
      .filter(([, s]) => s.count >= 3)
      .map(([hashtag, s]) => {
        const avgEngagement = Math.round((s.engagements.reduce((a, b) => a + b, 0) / s.engagements.length) * 100) / 100;
        const roi = Math.round(avgEngagement * Math.log10(Math.max(s.views, 10)) * 10);
        return {
          hashtag,
          videoCount: s.count,
          totalViews: s.views,
          avgEngagement,
          roi,
        };
      })
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 15);

    // --- 4. Summary ---
    const totalEngagement = source.reduce((sum, v) => {
      const views = v.view_count || 1;
      return sum + Math.min(((v.like_count + v.comment_count + v.share_count) / views) * 100, 50);
    }, 0);
    const avgEngagementRate = Math.round((totalEngagement / source.length) * 100) / 100;

    const bestFormat = contentROI[0]?.format || "—";
    const bestTime = bestTimeSlots[0] ? `${bestTimeSlots[0].dayOfWeek} ${String(bestTimeSlots[0].hour).padStart(2, "0")}:00` : "—";
    const topHashtag = hashtagROI[0]?.hashtag || "—";

    // Overall ROI score: 0-100 based on engagement rate vs industry benchmarks
    // TikTok avg engagement is ~3-5%, so we scale accordingly
    const overallROI = Math.min(100, Math.round(avgEngagementRate * 12));

    return {
      contentROI,
      bestTimeSlots,
      hashtagROI,
      summary: {
        totalVideosAnalyzed: source.length,
        avgEngagementRate,
        bestFormat,
        bestTime,
        topHashtag,
        overallROI,
      },
    };
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to compute ad performance");
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get("niche") || undefined;

    const key = cacheKey("ad-performance", { niche: niche || "all" });

    const result = await cached(
      key,
      async () => {
        const data = await computeAdPerformance(niche);
        if (data) {
          return { performance: data, source: "live" as const };
        }
        return { performance: null, source: "no_data" as const, _cacheable: false };
      },
      1800 // 30 minutes
    );

    return NextResponse.json(result);
  } catch (e) {
    apiLogger.error({ err: e }, "Ad performance API error");
    return NextResponse.json({ performance: null, source: "no_data" }, { status: 500 });
  }
}
