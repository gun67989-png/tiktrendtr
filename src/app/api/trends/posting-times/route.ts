import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generatePostingTimes } from "@/lib/data";

export const dynamic = "force-dynamic";

async function getRealPostingTimes() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // Fetch videos with their scraped_at timestamps and engagement data
    const { data, error } = await supabase
      .from("trending_videos")
      .select("scraped_at, view_count, like_count, comment_count, share_count")
      .order("view_count", { ascending: false })
      .limit(2000);

    if (error || !data || data.length < 20) return null;

    // Build heatmap: day (0=Pazar..6=Cumartesi) x hour (0-23)
    // Each cell = average engagement rate of videos posted at that time
    const grid: { total: number; count: number }[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 24 }, () => ({ total: 0, count: 0 }))
    );

    for (const v of data) {
      const date = new Date(v.scraped_at);
      const day = date.getUTCDay(); // 0=Sun
      // Convert UTC to Turkey time (UTC+3)
      const hour = (date.getUTCHours() + 3) % 24;

      const views = v.view_count || 1;
      const engagement = ((v.like_count + v.comment_count + v.share_count) / views) * 100;

      grid[day][hour].total += engagement;
      grid[day][hour].count++;
    }

    // Convert to engagement rates
    const days = ["Pazar", "Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma", "Cumartesi"];
    const heatmap = days.map((dayName, dayIdx) => ({
      day: dayName,
      hours: Array.from({ length: 24 }, (_, h) => {
        const cell = grid[dayIdx][h];
        return {
          hour: h,
          engagement: cell.count > 0 ? Math.round((cell.total / cell.count) * 100) / 100 : 0,
          videoCount: cell.count,
        };
      }),
    }));

    // Find top 5 time slots
    const allSlots: { day: string; hour: number; engagement: number; videoCount: number }[] = [];
    for (const dayData of heatmap) {
      for (const hourData of dayData.hours) {
        if (hourData.videoCount > 0) {
          allSlots.push({
            day: dayData.day,
            hour: hourData.hour,
            engagement: hourData.engagement,
            videoCount: hourData.videoCount,
          });
        }
      }
    }

    const bestTimes = allSlots
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5)
      .map((s, i) => ({
        rank: i + 1,
        day: s.day,
        hour: `${String(s.hour).padStart(2, "0")}:00`,
        engagement: s.engagement,
        videoCount: s.videoCount,
      }));

    return { heatmap, bestTimes };
  } catch (e) {
    console.error("[API] Failed to compute posting times:", e);
    return null;
  }
}

export async function GET() {
  const realData = await getRealPostingTimes();

  if (realData) {
    return NextResponse.json({ postingTimes: realData, source: "live" });
  }

  const postingTimes = generatePostingTimes();
  return NextResponse.json({ postingTimes, source: "generated" });
}
