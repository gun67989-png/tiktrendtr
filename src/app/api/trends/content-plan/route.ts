import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const TURKISH_DAYS = ["Pazar", "Pazartesi", "Sal\u0131", "\u00c7ar\u015famba", "Per\u015fembe", "Cuma", "Cumartesi"];

interface DailyTask {
  time: string;
  format: string;
  hashtags: string[];
  hook: string;
  viewTarget: number;
  likeTarget: number;
  type: "video" | "research" | "engage";
}

interface ContentPlan {
  dailyTasks: DailyTask[];
  weeklyInsights: {
    bestDays: string[];
    topFormats: string[];
    trendingSounds: string[];
    avgViewTarget: number;
    avgLikeTarget: number;
  };
  tacticSuggestions: string[];
  nicheStats: {
    avgViews: number;
    avgEngagement: number;
    totalVideos: number;
  };
}

async function generateContentPlan(niche?: string): Promise<ContentPlan | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    let query = supabase
      .from("trending_videos")
      .select("video_id, hashtags, caption, sound_name, category, format, view_count, like_count, comment_count, share_count, duration, scraped_at")
      .order("view_count", { ascending: false })
      .limit(2000);

    if (niche) {
      query = query.ilike("category", `%${niche}%`);
    }

    const { data, error } = await query;

    if (error) {
      apiLogger.error({ err: error }, "Content plan Supabase query error");
      return null;
    }

    if (!data || data.length === 0) return null;

    // --- Aggregate stats ---
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let engSum = 0;
    let engCount = 0;

    const hashtagCounts = new Map<string, { count: number; views: number }>();
    const soundCounts = new Map<string, { count: number; views: number }>();
    const formatCounts = new Map<string, { count: number; views: number; likes: number }>();
    const dayCounts = new Map<number, { count: number; engagement: number }>();
    const hourEngagement = new Map<number, { total: number; count: number }>();

    for (const v of data) {
      totalViews += v.view_count || 0;
      totalLikes += v.like_count || 0;
      totalComments += v.comment_count || 0;
      totalShares += v.share_count || 0;

      if (v.view_count > 0) {
        const eng = Math.min(((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100, 50);
        engSum += eng;
        engCount++;
      }

      // Hashtag aggregation
      if (v.hashtags && Array.isArray(v.hashtags)) {
        for (const rawTag of v.hashtags) {
          const tag = rawTag.toLowerCase().replace(/^#/, "").trim();
          if (!tag || tag.length < 2) continue;
          const agg = hashtagCounts.get(tag) || { count: 0, views: 0 };
          agg.count++;
          agg.views += v.view_count || 0;
          hashtagCounts.set(tag, agg);
        }
      }

      // Sound aggregation
      if (v.sound_name) {
        const sound = v.sound_name.trim();
        if (sound) {
          const agg = soundCounts.get(sound) || { count: 0, views: 0 };
          agg.count++;
          agg.views += v.view_count || 0;
          soundCounts.set(sound, agg);
        }
      }

      // Format aggregation
      const fmt = v.format || "standart";
      const fmtAgg = formatCounts.get(fmt) || { count: 0, views: 0, likes: 0 };
      fmtAgg.count++;
      fmtAgg.views += v.view_count || 0;
      fmtAgg.likes += v.like_count || 0;
      formatCounts.set(fmt, fmtAgg);

      // Day-of-week aggregation
      const scrapedDate = new Date(v.scraped_at);
      const dayOfWeek = scrapedDate.getDay();
      const dayAgg = dayCounts.get(dayOfWeek) || { count: 0, engagement: 0 };
      dayAgg.count++;
      if (v.view_count > 0) {
        dayAgg.engagement += Math.min(((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100, 50);
      }
      dayCounts.set(dayOfWeek, dayAgg);

      // Hour engagement (Turkey UTC+3)
      const hour = (scrapedDate.getUTCHours() + 3) % 24;
      const hourAgg = hourEngagement.get(hour) || { total: 0, count: 0 };
      if (v.view_count > 0) {
        hourAgg.total += Math.min(((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100, 50);
        hourAgg.count++;
      }
      hourEngagement.set(hour, hourAgg);
    }

    const avgViews = data.length > 0 ? Math.round(totalViews / data.length) : 0;
    const avgLikes = data.length > 0 ? Math.round(totalLikes / data.length) : 0;
    const avgEngagement = engCount > 0 ? Math.round((engSum / engCount) * 10) / 10 : 0;

    // --- Top hashtags ---
    const topHashtags = Array.from(hashtagCounts.entries())
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 20)
      .map(([tag]) => `#${tag}`);

    // --- Top sounds ---
    const trendingSounds = Array.from(soundCounts.entries())
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 5)
      .map(([sound]) => sound);

    // --- Top formats ---
    const topFormats = Array.from(formatCounts.entries())
      .sort((a, b) => (b[1].views / b[1].count) - (a[1].views / a[1].count))
      .slice(0, 4)
      .map(([fmt]) => fmt);

    // --- Best days ---
    const bestDays = Array.from(dayCounts.entries())
      .map(([day, agg]) => ({
        day,
        avgEng: agg.count > 0 ? agg.engagement / agg.count : 0,
      }))
      .sort((a, b) => b.avgEng - a.avgEng)
      .slice(0, 3)
      .map((d) => TURKISH_DAYS[d.day]);

    // --- Best hours ---
    const bestHours = Array.from(hourEngagement.entries())
      .map(([hour, agg]) => ({
        hour,
        avgEng: agg.count > 0 ? agg.total / agg.count : 0,
      }))
      .sort((a, b) => b.avgEng - a.avgEng);

    // --- Build daily tasks ---
    const pickHashtags = (count: number): string[] => {
      const shuffled = [...topHashtags].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    const hookSuggestions = [
      "Bu hileyi biliyor muydun?",
      "Kimse bundan bahsetmiyor...",
      "3 saniyede dikkatini \u00e7ekerim",
      "\u0130nan\u0131lmaz sonu\u00e7lar!",
      "Bunu denemeden ge\u00e7me!",
      "Sana bir s\u0131r vereyim...",
      "Bu videoyu kaydet!",
      "En b\u00fcy\u00fck hatalar\u0131n biri...",
    ];

    const bestHour1 = bestHours[0]?.hour ?? 9;
    const bestHour2 = bestHours[1]?.hour ?? 13;
    const bestHour3 = bestHours[2]?.hour ?? 18;
    const bestHour4 = bestHours[3]?.hour ?? 20;

    const dailyTasks: DailyTask[] = [
      {
        time: `${String(bestHour1).padStart(2, "0")}:00`,
        format: topFormats[0] || "POV",
        hashtags: pickHashtags(3),
        hook: hookSuggestions[Math.floor(Math.random() * hookSuggestions.length)],
        viewTarget: Math.round(avgViews * 0.3),
        likeTarget: Math.round(avgLikes * 0.3),
        type: "video",
      },
      {
        time: `${String(bestHour2).padStart(2, "0")}:00`,
        format: "Ara\u015ft\u0131rma",
        hashtags: pickHashtags(4),
        hook: "Ni\u015fine uygun hashtag ve ses analizi yap",
        viewTarget: 0,
        likeTarget: 0,
        type: "research",
      },
      {
        time: `${String(bestHour3).padStart(2, "0")}:00`,
        format: topFormats[1] || "Duet",
        hashtags: pickHashtags(3),
        hook: hookSuggestions[Math.floor(Math.random() * hookSuggestions.length)],
        viewTarget: Math.round(avgViews * 0.5),
        likeTarget: Math.round(avgLikes * 0.5),
        type: "video",
      },
      {
        time: `${String(bestHour4).padStart(2, "0")}:00`,
        format: "Etkile\u015fim",
        hashtags: [],
        hook: "Yorumlara cevap ver, topluluk etkile\u015fimi kur",
        viewTarget: 0,
        likeTarget: 0,
        type: "engage",
      },
    ];

    // --- Tactic suggestions ---
    const tacticSuggestions: string[] = [];

    if (avgEngagement < 5) {
      tacticSuggestions.push("Etkile\u015fim oran\u0131 d\u00fc\u015f\u00fck \u2014 ilk 3 saniyede dikkat \u00e7ekici hook kullan\u0131n");
      tacticSuggestions.push("Yorum b\u00f6l\u00fcm\u00fcnde soru sorun, izleyici etkile\u015fimini art\u0131r\u0131n");
    }

    if (topFormats.length > 0) {
      tacticSuggestions.push(`En y\u00fcksek performansl\u0131 format: "${topFormats[0]}" \u2014 bu formata a\u011f\u0131rl\u0131k verin`);
    }

    if (trendingSounds.length > 0) {
      tacticSuggestions.push(`Trend ses "${trendingSounds[0]}" kullanarak eri\u015fim art\u0131r\u0131n`);
    }

    if (bestDays.length > 0) {
      tacticSuggestions.push(`${bestDays[0]} g\u00fcn\u00fc en y\u00fcksek etkile\u015fim al\u0131yor \u2014 ana i\u00e7eri\u011finizi bu g\u00fcne planlay\u0131n`);
    }

    if (avgEngagement >= 5 && avgEngagement < 10) {
      tacticSuggestions.push("\u0130yi etkile\u015fim oran\u0131! \u015eimdi payla\u015f\u0131m odakl\u0131 i\u00e7erik deneyin (challenge, duet)");
    }

    // --- Weekly insights ---
    const weeklyInsights = {
      bestDays,
      topFormats: topFormats.slice(0, 3),
      trendingSounds: trendingSounds.slice(0, 3),
      avgViewTarget: Math.round(avgViews * 0.7),
      avgLikeTarget: Math.round(avgLikes * 0.7),
    };

    // --- Niche stats ---
    const nicheStats = {
      avgViews,
      avgEngagement,
      totalVideos: data.length,
    };

    return {
      dailyTasks,
      weeklyInsights,
      tacticSuggestions: tacticSuggestions.slice(0, 4),
      nicheStats,
    };
  } catch (e) {
    apiLogger.error({ err: e }, "Content plan generation error");
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get("niche") || undefined;

    const key = cacheKey("content-plan", { niche: niche || "all" });

    const result = await cached(
      key,
      async () => {
        const plan = await generateContentPlan(niche);

        if (plan) {
          return { plan, source: "live" as const };
        }

        return { plan: null, source: "no_data" as const, _cacheable: false };
      },
      1800
    );

    return NextResponse.json(result);
  } catch (e) {
    apiLogger.error({ err: e }, "Content plan API error");
    return NextResponse.json({ plan: null, source: "no_data" }, { status: 500 });
  }
}
