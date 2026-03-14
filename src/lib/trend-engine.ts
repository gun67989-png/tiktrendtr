// Trend Detection Engine
// Detects emerging trends from real data patterns using 5 signals

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type TrendSignalType = "engagement_spike" | "sound_growth" | "hashtag_growth" | "format_rising" | "comment_velocity";

export interface TrendSignal {
  type: TrendSignalType;
  label: string; // e.g., hashtag name, sound name, format name
  score: number; // 0-100 confidence
  growth: number; // percentage growth
  count: number; // current count
  previousCount: number; // previous period count
  isEmerging: boolean;
  detectedAt: string;
}

export interface TrendDetectionResult {
  signals: TrendSignal[];
  emergingTrends: TrendSignal[];
  detectedAt: string;
  totalVideosAnalyzed: number;
}

// Threshold for marking a signal as "emerging"
const EMERGING_THRESHOLD = 50; // 50% growth

/**
 * Detect emerging trends by analyzing recent vs previous period data.
 * Compares last 12 hours vs previous 12 hours for spike detection.
 */
export async function detectTrends(): Promise<TrendDetectionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { signals: [], emergingTrends: [], detectedAt: new Date().toISOString(), totalVideosAnalyzed: 0 };
  }

  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // Fetch recent videos (last 24h)
  const { data: recentVideos, error } = await supabase
    .from("trending_videos")
    .select("hashtags, sound_name, sound_creator, format, view_count, like_count, comment_count, share_count, created_at")
    .gte("created_at", twentyFourHoursAgo)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error || !recentVideos || recentVideos.length === 0) {
    return { signals: [], emergingTrends: [], detectedAt: now.toISOString(), totalVideosAnalyzed: 0 };
  }

  // Split into current period (last 12h) and previous period (12-24h ago)
  const currentPeriod = recentVideos.filter(v => v.created_at >= twelveHoursAgo);
  const previousPeriod = recentVideos.filter(v => v.created_at < twelveHoursAgo);

  const signals: TrendSignal[] = [];

  // Signal 1: Hashtag Growth
  const currentHashtags = countHashtags(currentPeriod);
  const previousHashtags = countHashtags(previousPeriod);
  for (const [tag, count] of Object.entries(currentHashtags)) {
    const prev = previousHashtags[tag] || 0;
    if (count >= 3) { // Minimum 3 uses to be considered
      const growth = prev > 0 ? ((count - prev) / prev) * 100 : count * 100;
      signals.push({
        type: "hashtag_growth",
        label: `#${tag}`,
        score: Math.min(100, Math.round(growth)),
        growth: Math.round(growth),
        count,
        previousCount: prev,
        isEmerging: growth >= EMERGING_THRESHOLD,
        detectedAt: now.toISOString(),
      });
    }
  }

  // Signal 2: Sound Adoption Growth
  const currentSounds = countField(currentPeriod, "sound_name");
  const previousSounds = countField(previousPeriod, "sound_name");
  for (const [sound, count] of Object.entries(currentSounds)) {
    if (sound === "Original Sound" || count < 3) continue;
    const prev = previousSounds[sound] || 0;
    const growth = prev > 0 ? ((count - prev) / prev) * 100 : count * 100;
    signals.push({
      type: "sound_growth",
      label: sound,
      score: Math.min(100, Math.round(growth)),
      growth: Math.round(growth),
      count,
      previousCount: prev,
      isEmerging: growth >= EMERGING_THRESHOLD,
      detectedAt: now.toISOString(),
    });
  }

  // Signal 3: Format Rising
  const currentFormats = countField(currentPeriod, "format");
  const previousFormats = countField(previousPeriod, "format");
  for (const [format, count] of Object.entries(currentFormats)) {
    if (count < 3) continue;
    const prev = previousFormats[format] || 0;
    const growth = prev > 0 ? ((count - prev) / prev) * 100 : count * 100;
    signals.push({
      type: "format_rising",
      label: format,
      score: Math.min(100, Math.round(growth)),
      growth: Math.round(growth),
      count,
      previousCount: prev,
      isEmerging: growth >= EMERGING_THRESHOLD,
      detectedAt: now.toISOString(),
    });
  }

  // Signal 4: Engagement Spikes (videos with abnormally high engagement)
  const avgEngagement = currentPeriod.reduce((sum, v) => {
    const eng = v.view_count > 0 ? (v.like_count + v.comment_count + v.share_count) / v.view_count : 0;
    return sum + eng;
  }, 0) / Math.max(1, currentPeriod.length);

  const spikeVideos = currentPeriod.filter(v => {
    if (v.view_count < 50000) return false;
    const eng = (v.like_count + v.comment_count + v.share_count) / v.view_count;
    return eng > avgEngagement * 2; // 2x above average
  });

  if (spikeVideos.length > 0) {
    signals.push({
      type: "engagement_spike",
      label: `${spikeVideos.length} video with engagement spike`,
      score: Math.min(100, spikeVideos.length * 20),
      growth: Math.round((spikeVideos.length / Math.max(1, currentPeriod.length)) * 100),
      count: spikeVideos.length,
      previousCount: 0,
      isEmerging: spikeVideos.length >= 3,
      detectedAt: now.toISOString(),
    });
  }

  // Signal 5: Comment Velocity (videos getting unusually high comment rates)
  const highCommentVideos = currentPeriod.filter(v => {
    if (v.view_count < 10000) return false;
    const commentRate = v.comment_count / v.view_count;
    return commentRate > 0.02; // >2% comment rate is very high
  });

  if (highCommentVideos.length > 0) {
    signals.push({
      type: "comment_velocity",
      label: `${highCommentVideos.length} video with high comment activity`,
      score: Math.min(100, highCommentVideos.length * 15),
      growth: 0,
      count: highCommentVideos.length,
      previousCount: 0,
      isEmerging: highCommentVideos.length >= 5,
      detectedAt: now.toISOString(),
    });
  }

  // Sort signals by score
  signals.sort((a, b) => b.score - a.score);

  const emergingTrends = signals.filter(s => s.isEmerging);

  return {
    signals: signals.slice(0, 50), // Top 50 signals
    emergingTrends: emergingTrends.slice(0, 20), // Top 20 emerging
    detectedAt: now.toISOString(),
    totalVideosAnalyzed: recentVideos.length,
  };
}

// Helper: Count hashtag occurrences across videos
function countHashtags(videos: Array<{ hashtags: string[] | null }>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of videos) {
    if (!v.hashtags) continue;
    for (const tag of v.hashtags) {
      const normalized = tag.toLowerCase().replace(/^#/, "");
      if (normalized.length > 1) {
        counts[normalized] = (counts[normalized] || 0) + 1;
      }
    }
  }
  return counts;
}

// Helper: Count occurrences of a string field
function countField(videos: Array<Record<string, unknown>>, field: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of videos) {
    const val = v[field] as string;
    if (val && val.length > 0) {
      counts[val] = (counts[val] || 0) + 1;
    }
  }
  return counts;
}
