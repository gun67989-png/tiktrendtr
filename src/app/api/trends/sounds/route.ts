import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { generateSounds } from "@/lib/data";

export const dynamic = "force-dynamic";

interface SoundAgg {
  name: string;
  creator: string;
  count: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  categories: Record<string, number>;
  durations: number[];
  recentCount: number; // last 3 days
  olderCount: number;  // 4-7 days ago
}

async function getRealSounds() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // Fetch all videos with sound data
    const { data, error } = await supabase
      .from("trending_videos")
      .select("sound_name, sound_creator, view_count, like_count, comment_count, share_count, category, duration, scraped_at")
      .not("sound_name", "is", null)
      .order("view_count", { ascending: false })
      .limit(2000);

    if (error || !data || data.length === 0) return null;

    // Aggregate sounds by name
    const map = new Map<string, SoundAgg>();
    const now = Date.now();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    for (const video of data) {
      const name = (video.sound_name || "").trim();
      if (!name || name.length < 2 || name.toLowerCase() === "original sound") continue;

      // Use sound name as key (normalize)
      const key = name.toLowerCase();
      const age = now - new Date(video.scraped_at).getTime();

      let agg = map.get(key);
      if (!agg) {
        agg = {
          name,
          creator: video.sound_creator || "Bilinmiyor",
          count: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          categories: {},
          durations: [],
          recentCount: 0,
          olderCount: 0,
        };
        map.set(key, agg);
      }

      agg.count++;
      agg.totalViews += video.view_count || 0;
      agg.totalLikes += video.like_count || 0;
      agg.totalComments += video.comment_count || 0;
      agg.totalShares += video.share_count || 0;
      agg.categories[video.category] = (agg.categories[video.category] || 0) + 1;
      if (video.duration) agg.durations.push(video.duration);

      if (age <= threeDays) {
        agg.recentCount++;
      } else if (age <= sevenDays) {
        agg.olderCount++;
      }
    }

    // Convert to sorted array
    const sounds = Array.from(map.values())
      .filter((s) => s.count >= 2) // At least 2 videos
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 60)
      .map((s, i) => {
        // Calculate growth
        let growth = 0;
        if (s.olderCount > 0) {
          growth = Math.round(((s.recentCount - s.olderCount) / s.olderCount) * 100);
        } else if (s.recentCount > 0) {
          growth = 100;
        }

        // Dominant category
        const topCategory = Object.entries(s.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || "Genel";

        // Average duration
        const avgDuration = s.durations.length > 0
          ? Math.round(s.durations.reduce((a, b) => a + b, 0) / s.durations.length)
          : 30;

        // Guess genre from category
        const genreMap: Record<string, string> = {
          "Müzik": "Pop",
          "Dans": "Dance",
          "Komedi": "Comedy",
          "Moda": "Pop",
          "Güzellik": "R&B",
          "Spor": "Hip Hop",
          "Oyun": "Electronic",
          "Teknoloji": "Electronic",
          "Eğitim": "Ambient",
          "Yemek": "Pop",
          "Seyahat": "Indie",
          "Vlog": "Lo-Fi",
        };

        return {
          id: i + 1,
          name: s.name,
          creator: s.creator,
          usageCount: s.count,
          totalViews: s.totalViews,
          avgViews: Math.round(s.totalViews / s.count),
          growth,
          category: topCategory,
          genre: genreMap[topCategory] || "Pop",
          duration: avgDuration,
          bpm: null, // Not available from scraper
          isRising: growth > 30,
          trend: growth >= 0 ? "up" as const : "down" as const,
        };
      });

    return sounds;
  } catch (e) {
    console.error("[API] Failed to fetch real sounds:", e);
    return null;
  }
}

export async function GET() {
  // Try real data first
  const realSounds = await getRealSounds();

  if (realSounds && realSounds.length > 0) {
    return NextResponse.json({ sounds: realSounds, source: "live" });
  }

  // Fall back to generated data
  const sounds = generateSounds();
  return NextResponse.json({ sounds, source: "generated" });
}
