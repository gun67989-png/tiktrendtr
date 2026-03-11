// TikTok Scraper - Fetches real trending videos via TikWM API
// Uses TikWM as a reliable proxy to get real TikTok data

export interface ScrapedVideo {
  video_id: string;
  creator_username: string;
  creator_nickname: string;
  caption: string;
  hashtags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  tiktok_url: string;
  thumbnail_url: string;
  duration: number;
  sound_name: string;
  sound_creator: string;
  category: string;
  format: string;
  scraped_at: string;
}

// Category detection based on hashtags and keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Yemek: ["yemek", "tarif", "yemektarifi", "mutfak", "kahvalti", "lezzet", "tatli", "food", "recipe", "mukbang", "asci", "chef", "sofra", "pilav", "corba", "kebap", "baklava", "turkishdishes"],
  Komedi: ["komedi", "comedy", "mizah", "caps", "eglence", "komik", "gulme", "sketch", "parodi", "funny", "humor", "espri"],
  Seyahat: ["seyahat", "travel", "gezi", "tatil", "istanbul", "antalya", "kapadokya", "turkiye", "turkey", "wanderlust", "kesfet"],
  Moda: ["moda", "fashion", "kombin", "ootd", "stil", "style", "grwm", "vintage", "trend", "kiyafet", "giyim"],
  Teknoloji: ["teknoloji", "tech", "iphone", "android", "samsung", "apple", "yazilim", "coding", "ai", "yapayZeka", "gadget"],
  Vlog: ["vlog", "gunluk", "rutin", "hayat", "life", "dailyroutine", "morningroutine", "dayinmylife", "evturu"],
  "Eğitim": ["egitim", "education", "ogren", "yks", "sinav", "matematik", "ingilizce", "universite", "ders", "study"],
  Spor: ["spor", "fitness", "gym", "workout", "antrenman", "exercise", "futbol", "basketbol", "health", "saglik"],
  "Müzik": ["muzik", "music", "sarki", "song", "cover", "gitar", "piano", "singing", "rap", "pop", "akustik"],
  Dans: ["dans", "dance", "koreografi", "choreography", "hiphop", "twerk", "salsa", "halay", "zeybek"],
  "Güzellik": ["guzellik", "beauty", "makyaj", "makeup", "skincare", "ciltbakim", "sac", "hair", "nail", "kozmetik"],
  Oyun: ["oyun", "game", "gaming", "gamer", "pubg", "valorant", "lol", "minecraft", "fortnite", "ps5", "xbox"],
};

function categorizeVideo(caption: string, hashtags: string[]): string {
  const text = (caption + " " + hashtags.join(" ")).toLowerCase().replace(/[#_]/g, "");
  let bestCategory = "Vlog";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  return bestCategory;
}

// Format detection
function detectFormat(caption: string): string {
  const text = caption.toLowerCase();
  if (text.includes("tutorial") || text.includes("nasil") || text.includes("rehber") || text.includes("adim adim")) return "Tutorial";
  if (text.includes("pov")) return "POV";
  if (text.includes("grwm") || text.includes("get ready")) return "Get Ready With Me";
  if (text.includes("once") && text.includes("sonra")) return "Önce/Sonra";
  if (text.includes("mukbang")) return "Mukbang";
  if (text.includes("challenge")) return "Challenge";
  if (text.includes("duet")) return "Duet";
  if (text.includes("storytime") || text.includes("hikaye")) return "Hikaye Anlatımı";
  return "Kısa Video";
}

// Extract hashtags from caption
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u024F\u0400-\u04FF\u00e7\u011f\u0131\u00f6\u015f\u00fc\u00c7\u011e\u0130\u00d6\u015e\u00dc]+/g);
  return matches ? matches.map(h => h.toLowerCase()) : [];
}

// TikWM API response types
interface TikWMVideo {
  video_id: string;
  title: string;
  cover: string;
  origin_cover: string;
  duration: number;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  download_count: number;
  create_time: number;
  author: {
    id: string;
    unique_id: string;
    nickname: string;
    avatar: string;
  };
  music_info?: {
    title: string;
    author: string;
  };
  region?: string;
}

interface TikWMResponse {
  code: number;
  msg: string;
  data: {
    videos: TikWMVideo[];
    cursor: number;
    hasMore: boolean;
  };
}

// Fetch videos from TikWM API for a keyword
async function fetchTikWMVideos(keyword: string, count: number = 30): Promise<ScrapedVideo[]> {
  const videos: ScrapedVideo[] = [];
  const now = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://www.tikwm.com/api/feed/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: `keywords=${encodeURIComponent(keyword)}&count=${count}&region=tr`,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[SCRAPER] TikWM HTTP ${response.status} for keyword: ${keyword}`);
      return [];
    }

    const result = await response.json() as TikWMResponse;

    if (result.code !== 0 || !result.data?.videos) {
      console.warn(`[SCRAPER] TikWM returned code ${result.code} for keyword: ${keyword}`);
      return [];
    }

    for (const v of result.data.videos) {
      if (!v.video_id || !v.author?.unique_id) continue;

      const caption = v.title || "";
      const hashtags = extractHashtags(caption);
      const category = categorizeVideo(caption, hashtags);
      const format = detectFormat(caption);

      videos.push({
        video_id: v.video_id,
        creator_username: v.author.unique_id,
        creator_nickname: v.author.nickname || v.author.unique_id,
        caption,
        hashtags,
        view_count: v.play_count || 0,
        like_count: v.digg_count || 0,
        comment_count: v.comment_count || 0,
        share_count: v.share_count || 0,
        tiktok_url: `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`,
        thumbnail_url: v.origin_cover || v.cover || "",
        duration: v.duration || 0,
        sound_name: v.music_info?.title || "Original Sound",
        sound_creator: v.music_info?.author || v.author.unique_id,
        category,
        format,
        scraped_at: now,
      });
    }

    console.log(`[SCRAPER] TikWM returned ${videos.length} videos for keyword: ${keyword}`);
    return videos;
  } catch (e) {
    console.error(`[SCRAPER] TikWM fetch failed for keyword: ${keyword}`, e);
    return [];
  }
}

// Main scraping function - fetches from TikWM API with Turkish keywords
export async function scrapeTrendingVideos(): Promise<ScrapedVideo[]> {
  const allVideos: ScrapedVideo[] = [];
  const seenIds = new Set<string>();

  // Turkish keywords covering all categories
  const keywordsToSearch = [
    { keyword: "türkiye trend", category: null },
    { keyword: "keşfet", category: null },
    { keyword: "yemek tarifi türk", category: "Yemek" },
    { keyword: "komedi türk", category: "Komedi" },
    { keyword: "istanbul gezi", category: "Seyahat" },
    { keyword: "moda kombin", category: "Moda" },
    { keyword: "teknoloji türkçe", category: "Teknoloji" },
    { keyword: "günlük vlog türk", category: "Vlog" },
    { keyword: "eğitim türkçe", category: "Eğitim" },
    { keyword: "spor fitness türk", category: "Spor" },
    { keyword: "türkçe müzik", category: "Müzik" },
    { keyword: "dans türk", category: "Dans" },
    { keyword: "makyaj güzellik", category: "Güzellik" },
    { keyword: "oyun gaming türk", category: "Oyun" },
  ];

  for (const { keyword, category } of keywordsToSearch) {
    if (allVideos.length >= 200) break;

    try {
      const videos = await fetchTikWMVideos(keyword, 20);

      for (const v of videos) {
        if (!seenIds.has(v.video_id)) {
          seenIds.add(v.video_id);
          // Override category if search was category-specific
          if (category) {
            v.category = category;
          }
          allVideos.push(v);
        }
      }
    } catch (e) {
      console.error(`[SCRAPER] Error fetching keyword "${keyword}":`, e);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`[SCRAPER] Total unique videos scraped: ${allVideos.length}`);
  return allVideos;
}
