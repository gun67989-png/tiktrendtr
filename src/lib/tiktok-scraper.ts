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
  follower_count: number;
  tiktok_url: string;
  thumbnail_url: string;
  duration: number;
  sound_name: string;
  sound_creator: string;
  category: string;
  format: string;
  ad_format: string | null; // null = not an ad, otherwise the ad type
  creator_presence_score: number; // 0-100: estimates if a human creator is visible on camera
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

// Format detection - expanded with 6 new format types
function detectFormat(caption: string): string {
  const text = caption.toLowerCase();
  if (text.includes("tutorial") || text.includes("nasil") || text.includes("rehber") || text.includes("adim adim")) return "Tutorial";
  if (text.includes("pov")) return "POV";
  if (text.includes("grwm") || text.includes("get ready")) return "Get Ready With Me";
  // Expanded Önce/Sonra: transformation keywords
  if ((text.includes("once") && text.includes("sonra")) || text.includes("dönüşüm") || text.includes("donusum") || text.includes("değişim") || text.includes("degisim") || text.includes("transformation")) return "Önce/Sonra";
  if (text.includes("mukbang")) return "Mukbang";
  if (text.includes("challenge")) return "Challenge";
  if (text.includes("duet")) return "Duet";
  // Reaction / Reaksiyon
  if (text.includes("reaction") || text.includes("reaksiyon") || text.includes("tepki") || text.includes("izledim ve")) return "Reaksiyon";
  // Comedy Sketch / Komedi Skeçi
  if (text.includes("sketch") || text.includes("skeç") || text.includes("skec") || text.includes("parodi") || text.includes("canlandırma") || text.includes("canlandirma")) return "Komedi Skeçi";
  // Street Interview / Sokak Röportajı
  if (text.includes("röportaj") || text.includes("roportaj") || text.includes("sorduk") || text.includes("mikrofon") || text.includes("sokakta sorduk")) return "Sokak Röportajı";
  // List Format / Liste
  if (text.includes("top 5") || text.includes("top 10") || text.includes("en iyi 10") || text.includes("en iyi 5") || text.includes("sıralama") || text.includes("siralama") || (text.includes("liste") && !text.includes("playlist"))) return "Liste";
  // Expanded Hikaye Anlatımı: storytime keywords
  if (text.includes("storytime") || text.includes("hikaye") || text.includes("hikayem") || text.includes("başıma gelen") || text.includes("basima gelen")) return "Hikaye Anlatımı";
  return "Kısa Video";
}

// Ad format detection - identifies if a video is an ad/product promotion
const AD_KEYWORDS = [
  // Product / purchase
  "ürün", "urun", "aldım", "aldim", "satin", "satın", "sipariş", "siparis",
  "bunu aldım", "bunu denedim", "haul", "unboxing", "kutu açılımı", "kutu acilimi",
  // Review / recommendation
  "inceleme", "review", "tavsiye", "öneri", "oneri", "denedim", "test ettim",
  "favorilerim", "favori ürünlerim",
  // Promotion / ad
  "reklam", "sponsor", "işbirliği", "isbirligi", "tanıtım", "tanitim",
  "ad", "sponsored", "collab",
  // Shopping / deals
  "indirim", "kampanya", "fırsat", "firsat", "alışveriş", "alisveris",
  "link", "linkte", "bioda", "bio'da",
  // Before/after product
  "sonuç", "sonuc", "etkisi", "kullanım", "kullanim",
];

function detectAdFormat(caption: string, hashtags: string[]): string | null {
  const text = (caption + " " + hashtags.join(" ")).toLowerCase().replace(/[#_]/g, " ");

  // Count ad keyword matches
  let adScore = 0;
  for (const kw of AD_KEYWORDS) {
    if (text.includes(kw)) adScore++;
  }

  // Not an ad if no ad keywords found
  if (adScore === 0) return null;

  // Detect specific ad format
  if (text.includes("haul") || text.includes("alışveriş") || text.includes("alisveris")) return "Haul";
  if (text.includes("unboxing") || text.includes("kutu açılımı") || text.includes("kutu acilimi")) return "Unboxing";
  if (text.includes("inceleme") || text.includes("review") || text.includes("test ettim")) return "Ürün İnceleme";
  if ((text.includes("önce") || text.includes("once")) && (text.includes("sonra") || text.includes("sonuc"))) return "Önce/Sonra";
  if (text.includes("denedim") || text.includes("bunu aldım") || text.includes("bunu aldim")) return "Ürün Deneyimi";
  if (text.includes("reklam") || text.includes("sponsor") || text.includes("işbirliği") || text.includes("isbirligi")) return "Sponsorlu";
  if (text.includes("tavsiye") || text.includes("öneri") || text.includes("oneri") || text.includes("favorilerim")) return "Tavsiye";
  if (text.includes("indirim") || text.includes("kampanya") || text.includes("fırsat") || text.includes("firsat")) return "Kampanya";

  return "UGC Reklam";
}

// ==========================================
// Creator Presence Score (0-100)
// Estimates how likely a human creator is visible/speaking on camera
// ==========================================

// Category-based presence likelihood
const CATEGORY_PRESENCE: Record<string, number> = {
  Komedi: 90,
  Vlog: 85,
  "Eğitim": 80,
  "Güzellik": 80,
  Moda: 75,
  Spor: 70,
  Yemek: 65,
  "Müzik": 65,
  Dans: 60,
  Teknoloji: 55,
  Seyahat: 40,
  Oyun: 25,
};

// Format-based presence likelihood
const FORMAT_PRESENCE: Record<string, number> = {
  "Get Ready With Me": 95,
  "POV": 90,
  "Reaksiyon": 88,
  "Komedi Skeçi": 92,
  "Sokak Röportajı": 95,
  "Hikaye Anlatımı": 85,
  "Mukbang": 80,
  "Challenge": 75,
  "Tutorial": 70,
  "Liste": 55,
  "Duet": 65,
  "Önce/Sonra": 60,
  "Kısa Video": 50,
};

// Turkish keywords that indicate creator is on camera / speaking
const HIGH_PRESENCE_KEYWORDS = [
  // Talking to camera
  "anlatiyorum", "anlatıyorum", "gosteriyorum", "gösteriyorum",
  "soyluyorum", "söylüyorum", "ogretiyorum", "öğretiyorum",
  "paylasiyorum", "paylaşıyorum",
  // First person
  "benim", "benimle", "hayatim", "hayatım", "gunum", "günüm", "rutinim",
  // Direct address to viewer
  "izleyin", "dinleyin", "bakin", "bakın", "deneyin",
  "takip edin", "yorumlara yazin", "yorumlara yazın",
  // On-camera indicators
  "grwm", "get ready", "hazirlaniyorum", "hazırlanıyorum",
  "kameraya", "kamerada", "canli", "canlı",
  "vlog", "storytime", "hikayem",
  // Performance / speaking
  "soyledim", "söyledim", "okudum", "seslendirdim",
  "performans", "cover", "konustum", "konuştum",
  // Comedy sketch / acting
  "sketch", "parodi", "canlandirma", "canlandırma",
  "rol", "oynadim", "oynadım", "taklit",
  // Transformation
  "donusum", "dönüşüm", "degisim", "değişim",
  // Reaction
  "reaksiyon", "reaction", "tepki",
];

// Keywords that indicate NO human creator on screen
const LOW_PRESENCE_KEYWORDS = [
  // Scenery / landscape
  "manzara", "drone", "doga", "doğa", "gokyuzu", "gökyüzü",
  "timelapse", "time lapse",
  // Stock / impersonal
  "infografik", "grafik", "istatistik", "haber",
  // Screen-based
  "gameplay", "screen recording", "ekran kaydi", "ekran kaydı",
  // Compilation / repost
  "derleme", "compilation",
  // Animal / object focused
  "kedi", "kopek", "köpek", "hayvan",
];

function calcCaptionPresence(caption: string, hashtags: string[]): number {
  const text = (caption + " " + hashtags.join(" ")).toLowerCase().replace(/[#_]/g, " ");
  let score = 50; // neutral baseline

  for (const kw of HIGH_PRESENCE_KEYWORDS) {
    if (text.includes(kw)) score += 12;
  }
  for (const kw of LOW_PRESENCE_KEYWORDS) {
    if (text.includes(kw)) score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

function calcSoundPresence(soundName: string, soundCreator: string, creatorUsername: string): number {
  const sn = soundName.toLowerCase();
  const sc = soundCreator.toLowerCase();
  const cu = creatorUsername.toLowerCase();

  // Creator's own sound = very likely talking
  if (sc === cu || sn.includes("original sound") || sn.includes("orijinal ses")) return 90;
  // Speech / narration sounds
  if (sn.includes("konuşma") || sn.includes("konusma") || sn.includes("motivasyon")) return 75;
  // Sound effects = likely comedic, creator visible
  if (sn.includes("sound effect") || sn.includes("efekt")) return 70;
  // Named popular music = more likely dance/lip-sync
  return 35;
}

function calcDurationPresence(duration: number): number {
  if (duration <= 5) return 15;
  if (duration <= 10) return 30;
  if (duration <= 15) return 50;
  if (duration <= 30) return 70;
  if (duration <= 60) return 80;
  if (duration <= 90) return 75;
  if (duration <= 120) return 60;
  if (duration <= 180) return 45;
  return 30;
}

function calculateCreatorPresence(
  caption: string,
  hashtags: string[],
  category: string,
  format: string,
  duration: number,
  soundName: string,
  soundCreator: string,
  creatorUsername: string
): number {
  const categorySignal = CATEGORY_PRESENCE[category] ?? 50;
  const formatSignal = FORMAT_PRESENCE[format] ?? 50;
  const captionSignal = calcCaptionPresence(caption, hashtags);
  const soundSignal = calcSoundPresence(soundName, soundCreator, creatorUsername);
  const durationSignal = calcDurationPresence(duration);

  const score = Math.round(
    formatSignal * 0.30 +
    categorySignal * 0.25 +
    captionSignal * 0.20 +
    soundSignal * 0.15 +
    durationSignal * 0.10
  );

  return Math.max(0, Math.min(100, score));
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

// Rotate User-Agent to avoid detection
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
];
let uaIndex = 0;
function getNextUA(): string {
  const ua = USER_AGENTS[uaIndex % USER_AGENTS.length];
  uaIndex++;
  return ua;
}

// Fetch a single page of videos from TikWM API
async function fetchTikWMPage(
  keyword: string,
  count: number,
  cursor: number = 0
): Promise<{ videos: ScrapedVideo[]; cursor: number; hasMore: boolean }> {
  const videos: ScrapedVideo[] = [];
  const now = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const bodyParts = [
      `keywords=${encodeURIComponent(keyword)}`,
      `count=${count}`,
      `region=tr`,
    ];
    if (cursor > 0) bodyParts.push(`cursor=${cursor}`);

    const response = await fetch("https://www.tikwm.com/api/feed/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": getNextUA(),
      },
      body: bodyParts.join("&"),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[SCRAPER] TikWM HTTP ${response.status} for keyword: ${keyword}`);
      return { videos: [], cursor: 0, hasMore: false };
    }

    const result = await response.json() as TikWMResponse;

    if (result.code !== 0 || !result.data?.videos) {
      console.warn(`[SCRAPER] TikWM returned code ${result.code} for keyword: ${keyword}`);
      return { videos: [], cursor: 0, hasMore: false };
    }

    const fourteenDaysAgo = Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60;

    for (const v of result.data.videos) {
      if (!v.video_id || !v.author?.unique_id) continue;
      if (v.create_time && v.create_time < fourteenDaysAgo) continue;

      const caption = v.title || "";
      const hashtags = extractHashtags(caption);
      const category = categorizeVideo(caption, hashtags);
      const format = detectFormat(caption);
      const adFormat = detectAdFormat(caption, hashtags);
      const soundName = v.music_info?.title || "Original Sound";
      const soundCreator = v.music_info?.author || v.author.unique_id;

      const creatorPresenceScore = calculateCreatorPresence(
        caption, hashtags, category, format,
        v.duration || 0, soundName, soundCreator, v.author.unique_id
      );

      const publishDate = v.create_time
        ? new Date(v.create_time * 1000).toISOString()
        : now;

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
        follower_count: 0,
        tiktok_url: `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`,
        thumbnail_url: v.origin_cover || v.cover || "",
        duration: v.duration || 0,
        sound_name: soundName,
        sound_creator: soundCreator,
        category,
        format,
        ad_format: adFormat,
        creator_presence_score: creatorPresenceScore,
        scraped_at: publishDate,
      });
    }

    return {
      videos,
      cursor: result.data.cursor || 0,
      hasMore: result.data.hasMore ?? false,
    };
  } catch (e) {
    console.error(`[SCRAPER] TikWM fetch failed for keyword: ${keyword}`, e);
    return { videos: [], cursor: 0, hasMore: false };
  }
}

// Fetch videos from TikWM API for a keyword — fetches up to `pages` pages using cursor pagination
async function fetchTikWMVideos(keyword: string, count: number = 30, pages: number = 2): Promise<ScrapedVideo[]> {
  const allVids: ScrapedVideo[] = [];
  let cursor = 0;

  for (let page = 0; page < pages; page++) {
    const result = await fetchTikWMPage(keyword, count, cursor);
    allVids.push(...result.videos);

    if (!result.hasMore || result.cursor === 0) break;
    cursor = result.cursor;

    // Delay between pages to avoid rate limiting
    if (page < pages - 1) {
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }

  console.log(`[SCRAPER] TikWM returned ${allVids.length} videos for keyword: ${keyword}`);
  return allVids;
}

// Fetch follower count for a creator via TikWM user info API
async function fetchFollowerCount(username: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://www.tikwm.com/api/user/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: `unique_id=${encodeURIComponent(username)}&count=1`,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return 0;

    const result = await response.json() as { code: number; data?: { author?: { follower_count?: number } } };
    return result.data?.author?.follower_count ?? 0;
  } catch {
    return 0;
  }
}

// Batch fetch follower counts for unique creators (3 concurrent, 500ms delay)
async function enrichWithFollowerCounts(videos: ScrapedVideo[]): Promise<void> {
  const uniqueCreators = new Map<string, number>();
  for (const v of videos) {
    if (!uniqueCreators.has(v.creator_username)) {
      uniqueCreators.set(v.creator_username, 0);
    }
  }

  const usernames = Array.from(uniqueCreators.keys());
  const BATCH_SIZE = 3;

  for (let i = 0; i < usernames.length; i += BATCH_SIZE) {
    const batch = usernames.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(u => fetchFollowerCount(u))
    );

    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "fulfilled") {
        uniqueCreators.set(batch[j], (results[j] as PromiseFulfilledResult<number>).value);
      }
    }

    if (i + BATCH_SIZE < usernames.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Apply follower counts to all videos
  for (const v of videos) {
    v.follower_count = uniqueCreators.get(v.creator_username) ?? 0;
  }

  console.log(`[SCRAPER] Enriched ${uniqueCreators.size} unique creators with follower counts`);
}

// Main scraping function - fetches from TikWM API with Turkish keywords
// Uses parallel batch processing (6 concurrent requests) to stay within Vercel timeout
export async function scrapeTrendingVideos(): Promise<ScrapedVideo[]> {
  const allVideos: ScrapedVideo[] = [];
  const seenIds = new Set<string>();

  // Expanded Turkish keywords for ~500 videos — covers popular hashtags & niches
  const keywordsToSearch = [
    // ── General trending & popular hashtags ──
    { keyword: "türkiye trend", category: null },
    { keyword: "keşfet", category: null },
    { keyword: "türk tiktok viral", category: null },
    { keyword: "tiktok türkiye", category: null },
    { keyword: "popüler video türkiye", category: null },
    { keyword: "fyp türk", category: null },
    { keyword: "#kesfet", category: null },
    { keyword: "#fyp türkiye", category: null },
    { keyword: "#viral türk", category: null },
    { keyword: "#trend türkiye 2024", category: null },
    // ── Yemek (Food) ──
    { keyword: "yemek tarifi türk", category: "Yemek" },
    { keyword: "kahvaltı tarifi", category: "Yemek" },
    { keyword: "tatlı tarifi", category: "Yemek" },
    { keyword: "sokak lezzetleri türkiye", category: "Yemek" },
    { keyword: "ev yemekleri kolay", category: "Yemek" },
    { keyword: "türk mutfağı", category: "Yemek" },
    { keyword: "mukbang türk", category: "Yemek" },
    // ── Komedi (Comedy) ──
    { keyword: "komedi türk", category: "Komedi" },
    { keyword: "komik video türkçe", category: "Komedi" },
    { keyword: "türk komedisi", category: "Komedi" },
    { keyword: "caps komik türk", category: "Komedi" },
    { keyword: "sketch türkçe", category: "Komedi" },
    // ── Seyahat (Travel) ──
    { keyword: "istanbul gezi", category: "Seyahat" },
    { keyword: "türkiye gezi rehberi", category: "Seyahat" },
    { keyword: "antalya tatil", category: "Seyahat" },
    { keyword: "kapadokya vlog", category: "Seyahat" },
    { keyword: "bodrum tatil", category: "Seyahat" },
    // ── Moda (Fashion) ──
    { keyword: "moda kombin", category: "Moda" },
    { keyword: "outfit türk", category: "Moda" },
    { keyword: "alışveriş haul", category: "Moda" },
    { keyword: "grwm türk", category: "Moda" },
    { keyword: "vintage moda türkiye", category: "Moda" },
    // ── Teknoloji (Tech) ──
    { keyword: "teknoloji türkçe", category: "Teknoloji" },
    { keyword: "telefon inceleme türk", category: "Teknoloji" },
    { keyword: "uygulama önerisi", category: "Teknoloji" },
    { keyword: "yapay zeka türkçe", category: "Teknoloji" },
    // ── Vlog ──
    { keyword: "günlük vlog türk", category: "Vlog" },
    { keyword: "bir günüm vlog", category: "Vlog" },
    { keyword: "ev turu türk", category: "Vlog" },
    { keyword: "sabah rutinim", category: "Vlog" },
    // ── Eğitim (Education) ──
    { keyword: "eğitim türkçe", category: "Eğitim" },
    { keyword: "YKS hazırlık", category: "Eğitim" },
    { keyword: "ingilizce öğren", category: "Eğitim" },
    { keyword: "matematik kolay", category: "Eğitim" },
    { keyword: "üniversite hayatı", category: "Eğitim" },
    // ── Spor (Sports) ──
    { keyword: "spor fitness türk", category: "Spor" },
    { keyword: "gym motivasyon türk", category: "Spor" },
    { keyword: "futbol türkiye", category: "Spor" },
    { keyword: "evde egzersiz", category: "Spor" },
    // ── Müzik (Music) ──
    { keyword: "türkçe müzik", category: "Müzik" },
    { keyword: "cover türkçe şarkı", category: "Müzik" },
    { keyword: "rap türk", category: "Müzik" },
    { keyword: "akustik cover türk", category: "Müzik" },
    // ── Dans (Dance) ──
    { keyword: "dans türk", category: "Dans" },
    { keyword: "koreografi türk", category: "Dans" },
    { keyword: "halay düğün", category: "Dans" },
    // ── Güzellik (Beauty) ──
    { keyword: "makyaj güzellik", category: "Güzellik" },
    { keyword: "cilt bakımı rutin", category: "Güzellik" },
    { keyword: "saç modeli", category: "Güzellik" },
    { keyword: "kozmetik önerisi türk", category: "Güzellik" },
    // ── Oyun (Gaming) ──
    { keyword: "oyun gaming türk", category: "Oyun" },
    { keyword: "valorant türk", category: "Oyun" },
    { keyword: "pubg mobile türk", category: "Oyun" },
    // ── Reklam / Ürün (Ads & Products) ──
    { keyword: "ürün tanıtım türk", category: null },
    { keyword: "bunu aldım tiktok", category: null },
    { keyword: "unboxing türk", category: null },
    { keyword: "ürün inceleme", category: null },
    { keyword: "haul türkçe", category: null },
    { keyword: "denedim türk", category: null },
    { keyword: "trendyol haul", category: null },
    { keyword: "hepsiburada inceleme", category: null },
  ];

  const BATCH_SIZE = 6;
  const MAX_VIDEOS = 500; // increased from 300

  for (let i = 0; i < keywordsToSearch.length; i += BATCH_SIZE) {
    if (allVideos.length >= MAX_VIDEOS) break;

    const batch = keywordsToSearch.slice(i, i + BATCH_SIZE);

    // Run batch in parallel — each keyword fetches 2 pages of 30 via cursor
    const batchResults = await Promise.allSettled(
      batch.map(({ keyword }) => fetchTikWMVideos(keyword, 30, 2))
    );

    // Process results
    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const category = batch[j].category;

      if (result.status === "fulfilled") {
        for (const v of result.value) {
          if (!seenIds.has(v.video_id)) {
            seenIds.add(v.video_id);
            if (category) {
              v.category = category;
            }
            allVideos.push(v);
          }
        }
      } else {
        console.error(`[SCRAPER] Batch keyword "${batch[j].keyword}" failed:`, result.reason);
      }
    }

    // Delay between batches to respect rate limits (2-3s)
    if (i + BATCH_SIZE < keywordsToSearch.length) {
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    }
  }

  console.log(`[SCRAPER] Total unique videos scraped: ${allVideos.length}`);

  // Enrich videos with follower counts (best-effort, non-blocking)
  try {
    await enrichWithFollowerCounts(allVideos);
  } catch (e) {
    console.warn("[SCRAPER] Follower enrichment failed, continuing without:", e);
  }

  return allVideos;
}
