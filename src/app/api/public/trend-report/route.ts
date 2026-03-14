import { NextResponse } from "next/server";
import { cached, cacheKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = cacheKey("public:trend-report", {});

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const dateRange = {
    start: weekAgo.toISOString().split("T")[0],
    end: now.toISOString().split("T")[0],
  };

  const result = await cached(key, async () => {
    return {
      dateRange,
      stats: {
        totalVideosAnalyzed: 0,
        activeTrends: 0,
        avgEngagement: 0,
      },
      trendingFormats: [],
      popularNiches: [],
      bestTimeSlots: [],
      topPostingTimes: [],
      fastestGrowingHashtags: [],
      dailyStats: [],
      source: "no_data" as const,
    };
  }, 900); // 15 minutes

  return NextResponse.json(result);
}
