// TikTok Scraper - Fetches real trending videos from TikTok Turkey
// Scrapes TikTok's web pages and extracts embedded video data

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
  if (text.includes("once") && text.includes("sonra")) return "Once/Sonra";
  if (text.includes("mukbang")) return "Mukbang";
  if (text.includes("challenge")) return "Challenge";
  if (text.includes("duet")) return "Duet";
  if (text.includes("storytime") || text.includes("hikaye")) return "Hikaye Anlatimi";
  const formats = ["Tutorial", "POV", "Hikaye Anlatimi", "Challenge"];
  return formats[Math.floor(Math.random() * formats.length)];
}

// Extract hashtags from caption
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u024F\u0400-\u04FF]+/g);
  return matches ? matches.map(h => h.toLowerCase()) : [];
}

// Parse video data from TikTok's universal data
function parseVideoItems(data: Record<string, unknown>): ScrapedVideo[] {
  const videos: ScrapedVideo[] = [];
  const now = new Date().toISOString();

  try {
    // TikTok embeds data in __DEFAULT_SCOPE__
    const defaultScope = data["__DEFAULT_SCOPE__"] as Record<string, unknown> | undefined;
    if (!defaultScope) return videos;

    // Try different data paths that TikTok uses
    const possiblePaths = [
      "webapp.challenge-detail",
      "webapp.search",
      "webapp.video-feed",
      "seo.abtest",
    ];

    let itemList: unknown[] | null = null;

    for (const path of possiblePaths) {
      const section = defaultScope[path] as Record<string, unknown> | undefined;
      if (!section) continue;

      // Try to find item list
      if (section["itemList"]) {
        itemList = section["itemList"] as unknown[];
        break;
      }
      if (section["challengeInfo"]) {
        const challengeInfo = section["challengeInfo"] as Record<string, unknown>;
        if (challengeInfo["itemList"]) {
          itemList = challengeInfo["itemList"] as unknown[];
          break;
        }
      }
    }

    // Also try webapp.explore for explore page data
    const explore = defaultScope["webapp.explore"] as Record<string, unknown> | undefined;
    if (!itemList && explore) {
      itemList = explore["itemList"] as unknown[] | null;
    }

    // Try to find items in any nested structure
    if (!itemList) {
      for (const key of Object.keys(defaultScope)) {
        const section = defaultScope[key] as Record<string, unknown>;
        if (section && typeof section === "object") {
          for (const subKey of Object.keys(section)) {
            const val = section[subKey];
            if (Array.isArray(val) && val.length > 0 && val[0]?.id && val[0]?.author) {
              itemList = val;
              break;
            }
          }
          if (itemList) break;
        }
      }
    }

    if (!itemList || !Array.isArray(itemList)) return videos;

    for (const item of itemList) {
      try {
        const v = item as Record<string, unknown>;
        const author = v["author"] as Record<string, unknown> | undefined;
        const stats = v["stats"] as Record<string, unknown> | undefined;
        const videoInfo = v["video"] as Record<string, unknown> | undefined;
        const music = v["music"] as Record<string, unknown> | undefined;

        if (!author || !v["id"]) continue;

        const videoId = String(v["id"]);
        const username = String(author["uniqueId"] || "");
        if (!username || username === "undefined") continue;

        const caption = String(v["desc"] || "");
        const hashtags = extractHashtags(caption);
        const category = categorizeVideo(caption, hashtags);
        const format = detectFormat(caption);

        videos.push({
          video_id: videoId,
          creator_username: username,
          creator_nickname: String(author["nickname"] || username),
          caption,
          hashtags,
          view_count: Number(stats?.["playCount"] || 0),
          like_count: Number(stats?.["diggCount"] || 0),
          comment_count: Number(stats?.["commentCount"] || 0),
          share_count: Number(stats?.["shareCount"] || 0),
          tiktok_url: `https://www.tiktok.com/@${username}/video/${videoId}`,
          thumbnail_url: String(videoInfo?.["cover"] || videoInfo?.["dynamicCover"] || videoInfo?.["originCover"] || ""),
          duration: Number(videoInfo?.["duration"] || 0),
          sound_name: String(music?.["title"] || "Original Sound"),
          sound_creator: String(music?.["authorName"] || username),
          category,
          format,
          scraped_at: now,
        });
      } catch {
        continue;
      }
    }
  } catch (e) {
    console.error("[SCRAPER] Failed to parse video items:", e);
  }

  return videos;
}

// Scrape a TikTok hashtag/tag page
async function scrapeHashtagPage(hashtag: string): Promise<ScrapedVideo[]> {
  const url = `https://www.tiktok.com/tag/${encodeURIComponent(hashtag)}?lang=tr`;
  console.log(`[SCRAPER] Fetching ${url}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[SCRAPER] HTTP ${response.status} for tag/${hashtag}`);
      return [];
    }

    const html = await response.text();

    // Look for __UNIVERSAL_DATA_FOR_REHYDRATION__
    const rehydrationMatch = html.match(
      /<script\s+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
    );

    if (rehydrationMatch) {
      try {
        const data = JSON.parse(rehydrationMatch[1]);
        const videos = parseVideoItems(data);
        console.log(`[SCRAPER] Found ${videos.length} videos from __UNIVERSAL_DATA for tag/${hashtag}`);
        return videos;
      } catch (e) {
        console.warn(`[SCRAPER] Failed to parse __UNIVERSAL_DATA for tag/${hashtag}:`, e);
      }
    }

    // Fallback: Look for SIGI_STATE
    const sigiMatch = html.match(
      /<script\s+id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/
    );

    if (sigiMatch) {
      try {
        const data = JSON.parse(sigiMatch[1]);
        // SIGI_STATE has different structure - items are in ItemModule
        const itemModule = data["ItemModule"] as Record<string, unknown> | undefined;
        if (itemModule) {
          const videos: ScrapedVideo[] = [];
          const now = new Date().toISOString();

          for (const [videoId, itemData] of Object.entries(itemModule)) {
            const item = itemData as Record<string, unknown>;
            const username = String(item["author"] || "");
            if (!username) continue;

            const caption = String(item["desc"] || "");
            const hashtags = extractHashtags(caption);

            videos.push({
              video_id: videoId,
              creator_username: username,
              creator_nickname: String(item["nickname"] || username),
              caption,
              hashtags,
              view_count: Number((item["stats"] as Record<string, unknown>)?.["playCount"] || 0),
              like_count: Number((item["stats"] as Record<string, unknown>)?.["diggCount"] || 0),
              comment_count: Number((item["stats"] as Record<string, unknown>)?.["commentCount"] || 0),
              share_count: Number((item["stats"] as Record<string, unknown>)?.["shareCount"] || 0),
              tiktok_url: `https://www.tiktok.com/@${username}/video/${videoId}`,
              thumbnail_url: String((item["video"] as Record<string, unknown>)?.["cover"] || ""),
              duration: Number((item["video"] as Record<string, unknown>)?.["duration"] || 0),
              sound_name: String((item["music"] as Record<string, unknown>)?.["title"] || "Original Sound"),
              sound_creator: String((item["music"] as Record<string, unknown>)?.["authorName"] || username),
              category: categorizeVideo(caption, hashtags),
              format: detectFormat(caption),
              scraped_at: now,
            });
          }
          console.log(`[SCRAPER] Found ${videos.length} videos from SIGI_STATE for tag/${hashtag}`);
          return videos;
        }
      } catch (e) {
        console.warn(`[SCRAPER] Failed to parse SIGI_STATE for tag/${hashtag}:`, e);
      }
    }

    // Fallback: Try to find any JSON with video data in script tags
    const jsonScripts = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g);
    if (jsonScripts) {
      for (const script of jsonScripts) {
        try {
          const content = script.replace(/<\/?script[^>]*>/g, "");
          const data = JSON.parse(content);
          if (data && typeof data === "object") {
            const videos = parseVideoItems(data);
            if (videos.length > 0) {
              console.log(`[SCRAPER] Found ${videos.length} videos from JSON script for tag/${hashtag}`);
              return videos;
            }
          }
        } catch {
          continue;
        }
      }
    }

    console.warn(`[SCRAPER] No video data found in HTML for tag/${hashtag}`);
    return [];
  } catch (e) {
    console.error(`[SCRAPER] Failed to fetch tag/${hashtag}:`, e);
    return [];
  }
}

// Scrape TikTok explore page
async function scrapeExplorePage(): Promise<ScrapedVideo[]> {
  const url = "https://www.tiktok.com/explore?lang=tr";
  console.log(`[SCRAPER] Fetching explore page`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[SCRAPER] HTTP ${response.status} for explore page`);
      return [];
    }

    const html = await response.text();

    const rehydrationMatch = html.match(
      /<script\s+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
    );

    if (rehydrationMatch) {
      try {
        const data = JSON.parse(rehydrationMatch[1]);
        const videos = parseVideoItems(data);
        console.log(`[SCRAPER] Found ${videos.length} videos from explore page`);
        return videos;
      } catch (e) {
        console.warn(`[SCRAPER] Failed to parse explore page data:`, e);
      }
    }

    return [];
  } catch (e) {
    console.error(`[SCRAPER] Failed to fetch explore page:`, e);
    return [];
  }
}

// Main scraping function - tries multiple sources
export async function scrapeTrendingVideos(): Promise<ScrapedVideo[]> {
  const allVideos: ScrapedVideo[] = [];
  const seenIds = new Set<string>();

  // Turkish trending hashtags to scrape (covers all categories)
  const hashtagsToScrape = [
    "kesfet",
    "turkiye",
    "yemektarifi",
    "komedi",
    "moda",
    "dans",
    "seyahat",
    "teknoloji",
    "egitim",
    "spor",
    "muzik",
    "guzellik",
    "oyun",
    "trend",
  ];

  // Try explore page first
  const exploreVideos = await scrapeExplorePage();
  for (const v of exploreVideos) {
    if (!seenIds.has(v.video_id)) {
      seenIds.add(v.video_id);
      allVideos.push(v);
    }
  }

  // Then scrape hashtag pages with delay between requests
  for (const tag of hashtagsToScrape) {
    if (allVideos.length >= 200) break; // enough videos

    try {
      const videos = await scrapeHashtagPage(tag);
      for (const v of videos) {
        if (!seenIds.has(v.video_id)) {
          seenIds.add(v.video_id);
          allVideos.push(v);
        }
      }
    } catch (e) {
      console.error(`[SCRAPER] Error scraping tag/${tag}:`, e);
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`[SCRAPER] Total unique videos scraped: ${allVideos.length}`);
  return allVideos;
}
