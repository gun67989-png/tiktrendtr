import { NextResponse } from "next/server";
import { generateOverview, generatePostingTimes, generateHashtags } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const overview = generateOverview();
  const postingTimes = generatePostingTimes();
  const hashtags = generateHashtags();

  // Build best posting times summary
  const topTimes = postingTimes
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);

  const bestTimeSlots = [
    { slot: "19:00 - 22:00", label: "Altin Saat", engagement: 92, description: "En yuksek etkilesim zamani" },
    { slot: "12:00 - 14:00", label: "Oglen Molasi", engagement: 71, description: "Ogle arasi scroll zamani" },
    { slot: "07:00 - 09:00", label: "Sabah Rutini", engagement: 58, description: "Ise/okula gidis zamani" },
    { slot: "22:00 - 00:00", label: "Gece Gezmesi", engagement: 65, description: "Gec saatlerde aktif kullanicilar" },
  ];

  // Fastest growing hashtags
  const fastestGrowing = hashtags
    .filter((h) => h.weeklyGrowth > 0)
    .sort((a, b) => b.weeklyGrowth - a.weeklyGrowth)
    .slice(0, 10)
    .map((h) => ({
      name: h.name,
      growth: h.weeklyGrowth,
      category: h.category,
      totalUses: h.totalUses,
    }));

  // Weekly report date range
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const dateRange = {
    start: weekAgo.toISOString().split("T")[0],
    end: now.toISOString().split("T")[0],
  };

  return NextResponse.json({
    dateRange,
    stats: {
      totalVideosAnalyzed: overview.totalVideosAnalyzed,
      activeTrends: overview.activeTrends,
      avgEngagement: overview.avgEngagement,
    },
    trendingFormats: overview.viralFormats,
    popularNiches: overview.trendingNiches,
    bestTimeSlots,
    topPostingTimes: topTimes.slice(0, 5).map((t) => ({
      day: t.day,
      hour: t.hour,
      engagement: t.engagement,
    })),
    fastestGrowingHashtags: fastestGrowing,
    dailyStats: overview.dailyStats.slice(-7),
  });
}
