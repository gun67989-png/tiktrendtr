// Types
export interface Hashtag {
  id: string;
  name: string;
  totalUses: number;
  weeklyGrowth: number;
  category: string;
  viralScore: number;
  isEmerging: boolean;
  trend: number[];
}

export interface Sound {
  id: string;
  name: string;
  creator: string;
  usageCount: number;
  growthRate: number;
  bpm: number;
  duration: string;
  genre: string;
  viralScore: number;
}

export interface TrendOverview {
  totalVideosAnalyzed: number;
  activeTrends: number;
  avgEngagement: number;
  bestPostingTime: string;
  trendingNiches: { name: string; count: number; growth: number }[];
  trendingCities: { name: string; percentage: number }[];
  viralFormats: { name: string; count: number; description: string }[];
  dailyStats: { date: string; videos: number; engagement: number }[];
}

export interface PostingTimeData {
  hour: number;
  day: string;
  engagement: number;
}

export interface ContentIdea {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  sound: string;
  format: string;
  estimatedViews: string;
}

export interface GrowthStage {
  range: string;
  title: string;
  postingFrequency: string;
  contentFormats: string[];
  algorithmTips: string[];
  engagementStrategy: string[];
  duration: string;
}

// Viral Threshold Constants for Turkey Market
export const VIRAL_THRESHOLDS = {
  // Minimum views for a video to appear in "Top Viral" list
  MIN_VIEWS_FOR_TOP: 50_000,
  MIN_VIEWS: 500_000,
  MIN_LIKES: 50_000,
  MIN_ENGAGEMENT: 3.0,
  RELAXED_MIN_VIEWS: 200_000,
  RELAXED_MIN_LIKES: 20_000,
  TIERS: {
    MEGA_VIRAL: { minViews: 5_000_000, minLikes: 500_000, minSurprise: 1.5, label: "Mega Viral" },
    VIRAL: { minViews: 1_000_000, minLikes: 100_000, minSurprise: 0.8, label: "Viral" },
    TREND: { minViews: 500_000, minLikes: 50_000, minSurprise: 0, label: "Trend" },
    RISING: { minViews: 100_000, minLikes: 10_000, minSurprise: 2.0, label: "Yükselen Trend" },
  },
} as const;

// Viral tier type
export type ViralTier = "mega_viral" | "viral" | "trend" | "rising" | null;

// Calculate Surprise Factor: how much a video outperforms creator's follower base
export function calcSurpriseFactor(likes: number, followerCount: number): number {
  return Math.round(Math.log10(likes / (followerCount + 1)) * 100) / 100;
}

// Calculate Engagement Velocity: engagement per day since posting
export function calcEngagementVelocity(likes: number, comments: number, shares: number, publishedAt: string): number {
  const daysSincePosted = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  return Math.round((likes + comments + shares) / daysSincePosted);
}

// Calculate Discovery Score: how far beyond follower base the content reached
export function calcDiscoveryScore(views: number, followerCount: number): number {
  return Math.round((views / (followerCount + 1)) * 100) / 100;
}

// Determine viral tier based on metrics + surprise factor
export function getViralTier(views: number, likes: number, surpriseFactor: number): ViralTier {
  const t = VIRAL_THRESHOLDS.TIERS;
  if (views >= t.MEGA_VIRAL.minViews && likes >= t.MEGA_VIRAL.minLikes && surpriseFactor >= t.MEGA_VIRAL.minSurprise)
    return "mega_viral";
  if (views >= t.VIRAL.minViews && likes >= t.VIRAL.minLikes && surpriseFactor >= t.VIRAL.minSurprise)
    return "viral";
  if (views >= t.TREND.minViews && likes >= t.TREND.minLikes)
    return "trend";
  if (views >= t.RISING.minViews && likes >= t.RISING.minLikes && surpriseFactor >= t.RISING.minSurprise)
    return "rising";
  return null;
}

// Graduated view score - rewards high view counts progressively
export function calcViewScore(views: number): number {
  if (views >= 10_000_000) return 1.0;
  if (views >= 5_000_000) return 0.90 + (views - 5_000_000) / 5_000_000 * 0.10;
  if (views >= 1_000_000) return 0.70 + (views - 1_000_000) / 4_000_000 * 0.20;
  if (views >= 500_000) return 0.50 + (views - 500_000) / 500_000 * 0.20;
  if (views >= 200_000) return 0.30 + (views - 200_000) / 300_000 * 0.20;
  if (views >= 100_000) return 0.15 + (views - 100_000) / 100_000 * 0.15;
  if (views >= 50_000) return 0.05 + (views - 50_000) / 50_000 * 0.10;
  return views / 50_000 * 0.05;
}

// Viral score breakdown for transparency
export interface ViralScoreBreakdown {
  engagement_rate: number;
  view_growth_rate: number;
  share_rate: number;
  comment_activity: number;
  recency_score: number;
}

// Compute full viral score using the weighted formula:
// viral_score = (engagement_rate * 0.35) + (view_growth_rate * 0.25) + (share_rate * 0.15) + (comment_activity * 0.15) + (recency_score * 0.10)
export function calcViralScore(opts: {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followerCount: number;
  creatorPresenceScore: number;
  publishedAt: string;
}): { viralScore: number; surpriseFactor: number; engagementVelocity: number; discoveryScore: number; tier: ViralTier; breakdown: ViralScoreBreakdown } {
  const { views, likes, comments, shares, followerCount, publishedAt } = opts;

  // If no views, minimal score
  if (views <= 0) {
    return { viralScore: 0, surpriseFactor: 0, engagementVelocity: 0, discoveryScore: 0, tier: null, breakdown: { engagement_rate: 0, view_growth_rate: 0, share_rate: 0, comment_activity: 0, recency_score: 0 } };
  }

  // Core metrics (raw ratios)
  const rawEngagementRate = (likes + comments + shares) / views; // typically 0.01 to 0.20
  const rawShareRate = shares / views; // typically 0.001 to 0.05
  const rawCommentActivity = comments / views; // typically 0.001 to 0.05

  // Normalized components (0-1 scale, capped)
  // engagement_rate: 10% engagement = 1.0 (very high for TikTok)
  const engagementRateNorm = Math.min(1, rawEngagementRate / 0.10);

  // view_growth_rate: estimated from engagement velocity + view magnitude
  const engagementVelocity = calcEngagementVelocity(likes, comments, shares, publishedAt);
  const viewGrowthNorm = Math.min(1, (calcViewScore(views) * 0.6 + Math.min(1, engagementVelocity / 50_000) * 0.4));

  // share_rate: 2% share rate = 1.0 (excellent sharing)
  const shareRateNorm = Math.min(1, rawShareRate / 0.02);

  // comment_activity: 2% comment rate = 1.0 (very active discussion)
  const commentActivityNorm = Math.min(1, rawCommentActivity / 0.02);

  // recency_score: newer videos score higher
  const daysSincePublished = Math.max(0.1, (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24));
  const recencyNorm = daysSincePublished <= 1 ? 1.0
    : daysSincePublished <= 2 ? 0.90
    : daysSincePublished <= 3 ? 0.75
    : daysSincePublished <= 5 ? 0.55
    : daysSincePublished <= 7 ? 0.40
    : daysSincePublished <= 14 ? 0.20
    : 0.05;

  // Weighted formula
  const rawScore =
    engagementRateNorm * 0.35 +
    viewGrowthNorm * 0.25 +
    shareRateNorm * 0.15 +
    commentActivityNorm * 0.15 +
    recencyNorm * 0.10;

  // Scale to 0-10
  const viralScore = Math.min(10, Math.max(0.1, Math.round(rawScore * 100) / 10));

  // Keep legacy metrics for compatibility
  const surpriseFactor = calcSurpriseFactor(likes, followerCount);
  const discoveryScore = calcDiscoveryScore(views, followerCount);
  const tier = getViralTier(views, likes, surpriseFactor);

  const breakdown: ViralScoreBreakdown = {
    engagement_rate: Math.round(engagementRateNorm * 100) / 100,
    view_growth_rate: Math.round(viewGrowthNorm * 100) / 100,
    share_rate: Math.round(shareRateNorm * 100) / 100,
    comment_activity: Math.round(commentActivityNorm * 100) / 100,
    recency_score: Math.round(recencyNorm * 100) / 100,
  };

  return { viralScore, surpriseFactor, engagementVelocity, discoveryScore, tier, breakdown };
}

// Legacy viral score calculation (for hashtags/sounds)
export function calculateViralScore(
  engagementRate: number,
  growthRate: number,
  videoVolume: number,
  recency: number
): number {
  return Math.round(
    (engagementRate * 0.35 +
      growthRate * 0.25 +
      videoVolume * 0.2 +
      recency * 0.2) *
      100
  ) / 100;
}

// Turkish TikTok Categories
export const CATEGORIES = [
  "Yemek",
  "Komedi",
  "Seyahat",
  "Moda",
  "Teknoloji",
  "Vlog",
  "Eğitim",
  "Spor",
  "Müzik",
  "Dans",
  "Güzellik",
  "Oyun",
];

export const TURKISH_CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Antalya",
  "Bursa",
  "Adana",
  "Trabzon",
  "Gaziantep",
  "Konya",
  "Mersin",
];

// Growth strategy stages
export function getGrowthStages(): GrowthStage[] {
  return [
    {
      range: "0 → 1K",
      title: "Başlangıç Aşaması",
      postingFrequency: "Günde 3-5 video",
      duration: "2-4 hafta",
      contentFormats: [
        "Trend sesleri kullanarak kısa videolar (15-30sn)",
        "POV formatında günlük hayat videoları",
        "Popüler challenge'lara katılım",
        "Duet ve Stitch videoları",
      ],
      algorithmTips: [
        "İlk 1 saat içinde 200+ izlenme hedefle",
        "Video açıklamalarına 3-5 hashtag ekle",
        "Videoları 19:00-22:00 arası paylaş",
        "İlk 3 saniye çok önemli - güçlü hook kullan",
        "Trending sesleri mutlaka kullan",
        "Video süresini kısa tut (15-30 saniye)",
      ],
      engagementStrategy: [
        "Her yoruma cevap ver",
        "Niş'indeki 50 hesabı takip et ve etkileşim kur",
        "Diğer videoları yorumla (ilk 1 saat önemli)",
        "Canlı yayın aç (en az haftada 2 kez)",
        "Takipçilerden video fikirlerini sor",
      ],
    },
    {
      range: "1K → 10K",
      title: "Büyüme Aşaması",
      postingFrequency: "Günde 2-3 video",
      duration: "1-3 ay",
      contentFormats: [
        "Seri içerikler oluştur (Bölüm 1, 2, 3...)",
        "Tutorial ve eğitim videoları",
        "Hikaye anlatımı (Storytime)",
        "Önce/Sonra dönüşüm videoları",
        "Trend adaptasyonları (kendi tarzında)",
      ],
      algorithmTips: [
        "Watch time'ı artır - videoyu sonuna kadar izletecek yapı kur",
        "Loop videoları dene (başa dönen videolar)",
        "CTA (Call-to-Action) ekle: 'Devamı için takip et!'",
        "Carousel post'ları dene",
        "SEO için açıklamalara anahtar kelimeler ekle",
        "Kendi orijinal seslerini oluştur",
      ],
      engagementStrategy: [
        "Topluluk oluşturmaya başla",
        "Haftalık canlı yayın rutini kur",
        "Takipçilerle anket ve soru-cevap yap",
        "Küçük creator'larla işbirliği yap",
        "E-posta listesi oluşturmaya başla",
      ],
    },
    {
      range: "10K → 100K",
      title: "Ölçeklendirme Aşaması",
      postingFrequency: "Günde 1-2 kaliteli video",
      duration: "3-6 ay",
      contentFormats: [
        "Uzun form içerikler (1-3 dakika)",
        "Mini belgesel tarzı videolar",
        "İşbirliği videoları",
        "Marka ortaklıkları için portfolio videoları",
        "Behind-the-scenes içerikler",
        "Eğitim serileri",
      ],
      algorithmTips: [
        "Kaliteyi artır - iyi ışık, ses ve kurgu",
        "Niche'inde otorite ol",
        "Cross-platform paylaşım yap (Instagram Reels, YouTube Shorts)",
        "Analytics'i düzenli takip et",
        "A/B testing yap - farklı hook'lar dene",
        "Viral olan içerikleri analiz et ve tekrarla",
      ],
      engagementStrategy: [
        "Marka işbirlikleri için DM'lere açık ol",
        "Creator Fund'a başvur",
        "Büyük creator'larla işbirliği yap",
        "Topluluk etkinlikleri düzenle",
        "Fan sayfalarını destekle",
        "Merchandise düşünmeye başla",
      ],
    },
  ];
}

// Hashtag detail data
export interface HashtagDetail {
  name: string;
  totalUses: number;
  totalViews: number;
  weeklyGrowth: number;
  engagementRate: number;
  viralScore: number;
  category: string;
  isEmerging: boolean;
  dailyGrowth: { date: string; uses: number; views: number }[];
  engagementHistory: { date: string; rate: number }[];
  trendUsage: { date: string; videos: number }[];
  topVideos: HashtagVideo[];
}

export interface HashtagVideo {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  viralScore: number;
  duration: number;
  format: string | null;
  publishedAt: string;
  soundName: string | null;
}

// Sound detail data
export interface SoundDetail {
  id: string;
  name: string;
  creator: string;
  usageCount: number;
  growthRate: number;
  bpm: number;
  duration: string;
  genre: string;
  viralScore: number;
  usageHistory: { date: string; count: number }[];
  topVideos: HashtagVideo[];
}

// Video analytics detail
export interface VideoAnalytics {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  viralScore: number;
  duration: number;
  format: string | null;
  category: string | null;
  publishedAt: string;
  soundName: string | null;
  soundCreator: string | null;
  soundId: string | null;
  hashtags: string[];
  viewsOverTime: { date: string; views: number }[];
  engagementOverTime: { date: string; rate: number }[];
  nicheAvgEngagement: number;
  nicheAvgViews: number;
  growthSpeed: string;
  bestPostingHour: number;
}

// Content type classification - prioritize active creator content
export type ContentType = "creator_oncam" | "tutorial" | "storytelling" | "comedy_skit" | "challenge" | "duet";

export interface VideoListItem {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  creatorAvatar: string | null;
  thumbnailUrl: string;
  videoUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  likeRatio?: number;
  viralScore: number;
  surpriseFactor: number;
  engagementVelocity: number;
  discoveryScore: number;
  followerCount: number;
  tier: ViralTier;
  duration: number;
  format: string | null;
  category: string | null;
  contentType: ContentType;
  creatorPresenceScore: number;
  soundId: string | null;
  soundName: string | null;
  soundCreator: string | null;
  publishedAt: string;
  hashtags: string[];
}

// Emerging trends detection
export interface EmergingTrend {
  id: string;
  type: "hashtag" | "sound" | "format";
  name: string;
  signal: string;
  growthRate: number;
  detectedAt: string;
  confidence: number;
  category: string;
}

