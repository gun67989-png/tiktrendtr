/**
 * Psychological Analysis Engine
 *
 * Analyzes video engagement data to produce 5 core metrics:
 * 1. Hate-Watching Index
 * 2. Anchor Point Detection
 * 3. Estimated Drop-off
 * 4. Demographic Mapping
 * 5. Sentiment Drift
 *
 * All outputs are JSONB summaries — no raw comment data is stored.
 */

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface VideoData {
  video_id: string;
  creator_username: string;
  creator_nickname?: string;
  caption: string;
  hashtags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  follower_count: number;
  duration: number;
  sound_name?: string;
  sound_creator?: string;
  sound_type?: string | null;
  category?: string;
  format?: string;
  ad_format?: string | null;
  scraped_at?: string;
}

export interface HateWatchingMetric {
  score: number; // 0-100
  comment_to_view_ratio: number;
  negativity_estimate: number;
  label: string;
}

export interface AnchorPointMetric {
  score: number;
  triggers: string[];
  top_hashtags: string[];
  caption_keywords: string[];
  engagement_spike_indicators: string[];
}

export interface DropOffMetric {
  score: number; // 0-100, higher = more retention
  estimated_avg_watch_percent: number;
  duration_engagement_ratio: number;
  label: string;
}

export interface DemographicMetric {
  score: number;
  estimated_age_range: string;
  socioeconomic_tier: string;
  language_complexity: string;
  peak_activity_hours: string[];
  category_affinity: string[];
}

export interface SentimentDriftMetric {
  score: number; // 0-100, higher = faster sentiment shift
  like_dislike_ratio: number;
  comment_velocity: number;
  drift_direction: "positive" | "negative" | "neutral";
  label: string;
}

export interface AnalysisMetrics {
  hate_watching: HateWatchingMetric;
  anchor_points: AnchorPointMetric;
  drop_off: DropOffMetric;
  demographics: DemographicMetric;
  sentiment_drift: SentimentDriftMetric;
}

export interface AnalysisResult {
  profile_username: string;
  platform: string;
  metrics: AnalysisMetrics;
  analysis_data: {
    video_count: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    avg_engagement_rate: number;
    analyzed_video_ids: string[];
    summary: string;
  };
  viral_post_drafts: ViralDraft[];
  analyzed_at: string;
}

export interface ViralDraft {
  id: number;
  text: string;
  hook_type: string;
  estimated_engagement: string;
  target_emotion: string;
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// ────────────────────────────────────────────────────────────
// Metric Calculators
// ────────────────────────────────────────────────────────────

function calculateHateWatching(videos: VideoData[]): HateWatchingMetric {
  if (videos.length === 0) {
    return { score: 0, comment_to_view_ratio: 0, negativity_estimate: 0, label: "Veri yok" };
  }

  const totalViews = videos.reduce((sum, v) => sum + v.view_count, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.comment_count, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.like_count, 0);

  // Comment-to-view ratio (higher = more controversial)
  const commentToViewRatio = totalViews > 0 ? totalComments / totalViews : 0;

  // Negativity estimate: high comments relative to likes suggests controversy
  const likeToCommentRatio = totalComments > 0 ? totalLikes / totalComments : 0;
  // If people comment a lot but don't like much, likely negative engagement
  const negativityEstimate = clamp(
    (1 - Math.min(likeToCommentRatio / 20, 1)) * 100,
    0,
    100
  );

  // Score combines both factors
  const rawScore = (commentToViewRatio * 5000) * 0.6 + negativityEstimate * 0.4;
  const score = clamp(Math.round(rawScore), 0, 100);

  let label = "Normal";
  if (score >= 70) label = "Yuksek Nefret-Izleme";
  else if (score >= 40) label = "Orta Nefret-Izleme";
  else if (score >= 20) label = "Hafif Tartismali";

  return {
    score,
    comment_to_view_ratio: Math.round(commentToViewRatio * 10000) / 10000,
    negativity_estimate: Math.round(negativityEstimate),
    label,
  };
}

function detectAnchorPoints(videos: VideoData[]): AnchorPointMetric {
  if (videos.length === 0) {
    return { score: 0, triggers: [], top_hashtags: [], caption_keywords: [], engagement_spike_indicators: [] };
  }

  // Collect all hashtags with frequency
  const hashtagCounts: Record<string, number> = {};
  videos.forEach((v) => {
    v.hashtags.forEach((tag) => {
      const normalized = tag.toLowerCase().replace("#", "");
      hashtagCounts[normalized] = (hashtagCounts[normalized] || 0) + 1;
    });
  });

  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => `#${tag}`);

  // Extract caption keywords (words > 4 chars, appearing frequently)
  const wordCounts: Record<string, number> = {};
  const triggerWords = [
    "skandal", "ifsa", "gercek", "sok", "inanamaz", "olay", "son dakika",
    "acil", "dikkat", "tehlike", "bomba", "patlama", "kavga", "tartisma",
    "viral", "trend", "fy", "fyp", "kesfet",
  ];

  videos.forEach((v) => {
    const words = v.caption.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      const clean = word.replace(/[^a-zA-ZğüşöçıİĞÜŞÖÇ]/g, "");
      if (clean.length > 3) {
        wordCounts[clean] = (wordCounts[clean] || 0) + 1;
      }
    });
  });

  const captionKeywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);

  // Detect triggers
  const foundTriggers = triggerWords.filter((tw) =>
    videos.some((v) => v.caption.toLowerCase().includes(tw))
  );

  // Engagement spike indicators
  const avgEngagement =
    videos.reduce((sum, v) => sum + v.like_count + v.comment_count + v.share_count, 0) / videos.length;

  const spikeIndicators = videos
    .filter((v) => v.like_count + v.comment_count + v.share_count > avgEngagement * 1.5)
    .map((v) => `Video ${v.video_id}: ${Math.round(((v.like_count + v.comment_count + v.share_count) / avgEngagement) * 100)}% ort. ustu`);

  const score = clamp(
    Math.round(
      (foundTriggers.length * 15) +
      (topHashtags.length * 5) +
      (spikeIndicators.length * 10) +
      (captionKeywords.length * 3)
    ),
    0,
    100
  );

  return {
    score,
    triggers: foundTriggers,
    top_hashtags: topHashtags,
    caption_keywords: captionKeywords,
    engagement_spike_indicators: spikeIndicators.slice(0, 3),
  };
}

function estimateDropOff(videos: VideoData[]): DropOffMetric {
  if (videos.length === 0) {
    return { score: 50, estimated_avg_watch_percent: 50, duration_engagement_ratio: 0, label: "Veri yok" };
  }

  // Duration vs engagement: shorter videos with high engagement = good retention
  const avgDuration = videos.reduce((sum, v) => sum + v.duration, 0) / videos.length;
  const avgViews = videos.reduce((sum, v) => sum + v.view_count, 0) / videos.length;
  const avgLikes = videos.reduce((sum, v) => sum + v.like_count, 0) / videos.length;

  // Like-to-view ratio as a proxy for watch completion
  const likeToViewRatio = avgViews > 0 ? avgLikes / avgViews : 0;

  // Shorter duration + higher engagement = better retention
  const durationFactor = avgDuration > 0 ? Math.min(60 / avgDuration, 2) : 1;
  const engagementRatio = likeToViewRatio * durationFactor;

  const estimatedWatchPercent = clamp(
    Math.round(likeToViewRatio * 500 * durationFactor),
    10,
    95
  );

  const score = clamp(estimatedWatchPercent, 0, 100);

  let label = "Dusuk Tutma";
  if (score >= 70) label = "Yuksek Tutma";
  else if (score >= 50) label = "Orta Tutma";
  else if (score >= 30) label = "Dusuk-Orta Tutma";

  return {
    score,
    estimated_avg_watch_percent: estimatedWatchPercent,
    duration_engagement_ratio: Math.round(engagementRatio * 10000) / 10000,
    label,
  };
}

function mapDemographics(videos: VideoData[]): DemographicMetric {
  if (videos.length === 0) {
    return {
      score: 0,
      estimated_age_range: "Bilinmiyor",
      socioeconomic_tier: "Bilinmiyor",
      language_complexity: "Bilinmiyor",
      peak_activity_hours: [],
      category_affinity: [],
    };
  }

  // Analyze caption complexity as proxy for demographic
  const allCaptions = videos.map((v) => v.caption).join(" ");
  const avgWordLength = allCaptions.split(/\s+/).reduce((sum, w) => sum + w.length, 0) /
    Math.max(allCaptions.split(/\s+/).length, 1);
  const emojiRegex = /[\uD83C-\uDBFF][\uDC00-\uDFFF]/g;
  const emojiCount = (allCaptions.match(emojiRegex) || []).length;

  // Category analysis
  const categories = videos
    .map((v) => v.category)
    .filter((c): c is string => !!c);
  const categoryCounts: Record<string, number> = {};
  categories.forEach((c) => {
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });
  const categoryAffinity = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  // Age estimation based on content patterns
  let ageRange = "18-24";
  let socioTier = "Orta";

  if (avgWordLength > 6 && emojiCount < 3) {
    ageRange = "25-34";
    socioTier = "Orta-Ust";
  } else if (avgWordLength > 5) {
    ageRange = "18-24";
    socioTier = "Orta";
  } else {
    ageRange = "13-17";
    socioTier = "Ogrenci";
  }

  let languageComplexity = "Orta";
  if (avgWordLength > 7) languageComplexity = "Yuksek";
  else if (avgWordLength < 4) languageComplexity = "Dusuk";

  // Peak activity from scraped_at timestamps
  const hours: string[] = [];
  videos.forEach((v) => {
    if (v.scraped_at) {
      const hour = new Date(v.scraped_at).getHours();
      const bucket = `${String(hour).padStart(2, "0")}:00-${String((hour + 2) % 24).padStart(2, "0")}:00`;
      if (!hours.includes(bucket)) hours.push(bucket);
    }
  });

  const score = clamp(
    Math.round(
      (categoryAffinity.length * 10) +
      (hours.length * 5) +
      (avgWordLength > 3 ? 20 : 10) +
      (emojiCount > 0 ? 15 : 5)
    ),
    0,
    100
  );

  return {
    score,
    estimated_age_range: ageRange,
    socioeconomic_tier: socioTier,
    language_complexity: languageComplexity,
    peak_activity_hours: hours.slice(0, 4),
    category_affinity: categoryAffinity,
  };
}

function calculateSentimentDrift(videos: VideoData[]): SentimentDriftMetric {
  if (videos.length === 0) {
    return { score: 0, like_dislike_ratio: 0, comment_velocity: 0, drift_direction: "neutral", label: "Veri yok" };
  }

  const totalLikes = videos.reduce((sum, v) => sum + v.like_count, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.comment_count, 0);
  const totalViews = videos.reduce((sum, v) => sum + v.view_count, 0);
  const totalShares = videos.reduce((sum, v) => sum + v.share_count, 0);

  // Like-to-view ratio change (proxy for sentiment)
  const likeDislikeRatio = totalViews > 0 ? totalLikes / totalViews : 0;

  // Comment velocity (comments per 1000 views)
  const commentVelocity = totalViews > 0 ? (totalComments / totalViews) * 1000 : 0;

  // Share ratio indicates positive sentiment
  const shareRatio = totalViews > 0 ? totalShares / totalViews : 0;

  // Determine drift direction
  let driftDirection: "positive" | "negative" | "neutral" = "neutral";
  if (likeDislikeRatio > 0.05 && shareRatio > 0.005) {
    driftDirection = "positive";
  } else if (commentVelocity > 5 && likeDislikeRatio < 0.03) {
    driftDirection = "negative";
  }

  // Score: higher comment velocity + lower like ratio = faster negative drift
  const rawScore =
    commentVelocity * 5 +
    (1 - Math.min(likeDislikeRatio * 10, 1)) * 30 +
    (driftDirection === "negative" ? 20 : 0);

  const score = clamp(Math.round(rawScore), 0, 100);

  let label = "Stabil";
  if (score >= 70) label = "Hizli Negatif Kayma";
  else if (score >= 50) label = "Orta Kayma";
  else if (score >= 30) label = "Hafif Dalgalanma";

  return {
    score,
    like_dislike_ratio: Math.round(likeDislikeRatio * 10000) / 10000,
    comment_velocity: Math.round(commentVelocity * 100) / 100,
    drift_direction: driftDirection,
    label,
  };
}

// ────────────────────────────────────────────────────────────
// Main Analysis Function
// ────────────────────────────────────────────────────────────

export function analyzeProfile(videos: VideoData[]): AnalysisMetrics {
  const metrics: AnalysisMetrics = {
    hate_watching: calculateHateWatching(videos),
    anchor_points: detectAnchorPoints(videos),
    drop_off: estimateDropOff(videos),
    demographics: mapDemographics(videos),
    sentiment_drift: calculateSentimentDrift(videos),
  };

  return metrics;
}

// ────────────────────────────────────────────────────────────
// Viral Draft Generator
// ────────────────────────────────────────────────────────────

export function generateViralDrafts(
  analysis: AnalysisResult
): ViralDraft[] {
  const { metrics, analysis_data } = analysis;
  const username = analysis.profile_username;
  const seed = hashString(username + analysis.analyzed_at);

  const hookTypes = [
    { type: "Merak", emotion: "merak" },
    { type: "Tartisma", emotion: "saskinlik" },
    { type: "Bilgi", emotion: "guven" },
  ];

  const templates: Array<(m: AnalysisMetrics, u: string, d: typeof analysis_data) => string> = [
    (m, u, d) => {
      const engRate = (d.avg_engagement_rate * 100).toFixed(1);
      return `${u} hesabinin iceriklerini analiz ettik. ${engRate}% etkilesim orani ile ${m.hate_watching.label.toLowerCase()} kategorisinde. ${m.anchor_points.top_hashtags.slice(0, 3).join(", ")} hashtag'leri one cikiyor. #valyze #analiz`;
    },
    (m, u) => {
      return `Neden ${u} bu kadar viral? Cevap: ${m.anchor_points.triggers.length > 0 ? m.anchor_points.triggers.slice(0, 2).join(" + ") : "dikkat cekici format"}. Izleyici tutma orani: %${m.drop_off.estimated_avg_watch_percent}. Hedef kitle: ${m.demographics.estimated_age_range} yas grubu. #tiktokanaliz #viral`;
    },
    (m, u) => {
      const driftLabel = m.sentiment_drift.drift_direction === "positive" ? "pozitif" : m.sentiment_drift.drift_direction === "negative" ? "negatif" : "notr";
      return `${u} icin duygu analizi: ${driftLabel} yonde kayma tespit edildi (skor: ${m.sentiment_drift.score}/100). Yorum hizi: her 1K goruntulemede ${m.sentiment_drift.comment_velocity.toFixed(1)} yorum. #icerikanalizi #sosyalmedya`;
    },
  ];

  const drafts: ViralDraft[] = templates.map((template, i) => {
    const hookInfo = hookTypes[i % hookTypes.length];
    const text = template(metrics, username, analysis_data);
    const engLabels = ["dusuk", "orta", "yuksek"];
    const engIdx = Math.min(Math.floor((seed + i) % 3), 2);

    return {
      id: i + 1,
      text,
      hook_type: hookInfo.type,
      estimated_engagement: engLabels[engIdx],
      target_emotion: hookInfo.emotion,
    };
  });

  return drafts;
}

// ────────────────────────────────────────────────────────────
// Full Analysis Pipeline
// ────────────────────────────────────────────────────────────

export function runFullAnalysis(
  profileUsername: string,
  platform: string,
  videos: VideoData[]
): AnalysisResult {
  const metrics = analyzeProfile(videos);

  const totalViews = videos.reduce((sum, v) => sum + v.view_count, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.like_count, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.comment_count, 0);
  const totalShares = videos.reduce((sum, v) => sum + v.share_count, 0);
  const totalEngagement = totalLikes + totalComments + totalShares;
  const avgEngagementRate = totalViews > 0 ? totalEngagement / totalViews : 0;

  const result: AnalysisResult = {
    profile_username: profileUsername,
    platform,
    metrics,
    analysis_data: {
      video_count: videos.length,
      total_views: totalViews,
      total_likes: totalLikes,
      total_comments: totalComments,
      total_shares: totalShares,
      avg_engagement_rate: Math.round(avgEngagementRate * 10000) / 10000,
      analyzed_video_ids: videos.map((v) => v.video_id),
      summary: `${profileUsername} profili icin ${videos.length} video analiz edildi. Ortalama etkilesim orani: %${(avgEngagementRate * 100).toFixed(2)}`,
    },
    viral_post_drafts: [],
    analyzed_at: new Date().toISOString(),
  };

  result.viral_post_drafts = generateViralDrafts(result);

  return result;
}
