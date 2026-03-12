const axios = require('axios');

// Gunluk istek sayaci
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();

const DAILY_LIMIT = 450; // 500 ucretsiz, 450'de dur guvenli ol

function resetDailyCounterIfNeeded() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = today;
  }
}

function isAvailable() {
  resetDailyCounterIfNeeded();
  return !!(process.env.RAPIDAPI_KEY) && dailyRequestCount < DAILY_LIMIT;
}

function getRemainingRequests() {
  resetDailyCounterIfNeeded();
  return DAILY_LIMIT - dailyRequestCount;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(endpoint, params, retries = 3) {
  resetDailyCounterIfNeeded();

  if (dailyRequestCount >= DAILY_LIMIT) {
    throw new Error(`RapidAPI daily limit reached (${DAILY_LIMIT})`);
  }

  const config = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST || 'tiktok-scraper7.p.rapidapi.com'}${endpoint}`,
    params,
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'tiktok-scraper7.p.rapidapi.com',
    },
    timeout: 30000,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sleep(1000); // rate limit: min 1sn bekle
      const response = await axios(config);
      dailyRequestCount++;
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.warn(`[RapidAPI] Rate limited (429). 60sn bekleniyor... (Deneme ${attempt}/${retries})`);
        await sleep(60000);
        continue;
      }
      if (attempt === retries) {
        throw new Error(`[RapidAPI] ${retries} denemede basarisiz: ${err.message}`);
      }
      console.warn(`[RapidAPI] Hata, tekrar deneniyor (${attempt}/${retries}): ${err.message}`);
      await sleep(2000 * attempt);
    }
  }
}

/**
 * Trend videolari hashtag'e gore cek
 */
async function fetchTrendingVideos(hashtags = ['fyp', 'trending']) {
  const allVideos = [];

  for (const tag of hashtags) {
    try {
      if (!isAvailable()) {
        console.warn(`[RapidAPI] Limit doldu, kalan hashtag'ler atlanacak`);
        break;
      }
      const data = await makeRequest('/feed/search', {
        keywords: tag,
        count: 20,
        cursor: 0,
        region: 'TR',
        publish_time: 0,
        sort_type: 0,
      });

      if (data && data.data && data.data.videos) {
        const videos = data.data.videos.map(v => normalizeVideo(v, tag));
        allVideos.push(...videos);
      }
    } catch (err) {
      console.error(`[RapidAPI] Hashtag "${tag}" cekilemedi:`, err.message);
    }
  }

  // Tekrar eden videolari kaldir
  const uniqueMap = new Map();
  for (const v of allVideos) {
    if (!uniqueMap.has(v.id)) {
      uniqueMap.set(v.id, v);
    } else {
      // Hashtag'leri birlestir
      const existing = uniqueMap.get(v.id);
      const merged = new Set([...existing.hashtags, ...v.hashtags]);
      existing.hashtags = Array.from(merged);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Video yorumlarini cek
 */
async function fetchVideoComments(videoUrl, count = 30) {
  try {
    if (!isAvailable()) return [];

    const data = await makeRequest('/video/comments', {
      url: videoUrl,
      count: Math.min(count, 50),
      cursor: 0,
    });

    if (data && data.data && data.data.comments) {
      return data.data.comments.map(c => ({
        username: c.user?.unique_id || c.user?.nickname || 'unknown',
        text: c.text || '',
        likes: c.digg_count || 0,
        createdAt: c.create_time ? c.create_time * 1000 : Date.now(),
      }));
    }
    return [];
  } catch (err) {
    console.error(`[RapidAPI] Yorumlar cekilemedi (${videoUrl}):`, err.message);
    return [];
  }
}

/**
 * Kullanici videolarini cek
 */
async function fetchUserVideos(username, count = 30) {
  try {
    if (!isAvailable()) return [];

    const data = await makeRequest('/user/posts', {
      unique_id: username,
      count: Math.min(count, 30),
      cursor: 0,
    });

    if (data && data.data && data.data.videos) {
      return data.data.videos.map(v => normalizeVideo(v));
    }
    return [];
  } catch (err) {
    console.error(`[RapidAPI] Kullanici videolari cekilemedi (${username}):`, err.message);
    return [];
  }
}

/**
 * RapidAPI video formati → standart format
 */
function normalizeVideo(raw, sourceHashtag = null) {
  const hashtags = [];
  if (sourceHashtag) hashtags.push(sourceHashtag);

  // Aciklamadan hashtag'leri cikar
  const desc = raw.title || raw.desc || '';
  const tagMatches = desc.match(/#[\w\u00C0-\u024F\u0400-\u04FF]+/g);
  if (tagMatches) {
    tagMatches.forEach(t => {
      const cleaned = t.replace('#', '').toLowerCase();
      if (!hashtags.includes(cleaned)) hashtags.push(cleaned);
    });
  }

  return {
    id: String(raw.video_id || raw.id || ''),
    url: `https://www.tiktok.com/@${raw.author?.unique_id || 'user'}/video/${raw.video_id || raw.id || ''}`,
    thumbnail: raw.cover || raw.origin_cover || '',
    description: desc,
    author: {
      username: raw.author?.unique_id || '',
      displayName: raw.author?.nickname || '',
      followers: raw.author?.follower_count || 0,
      avatar: raw.author?.avatar || '',
    },
    stats: {
      likes: raw.digg_count || 0,
      views: raw.play_count || 0,
      comments: raw.comment_count || 0,
      shares: raw.share_count || 0,
    },
    hashtags,
    createdAt: raw.create_time ? raw.create_time * 1000 : Date.now(),
    comments: [],
  };
}

/**
 * Tam scrape islemi: trend videolar + yorumlar + kullanici videolari
 */
async function scrape({ hashtags, targetUsername }) {
  console.log(`[RapidAPI] Scraping basliyor... (Kalan istek: ${getRemainingRequests()})`);

  // 1. Trend videolar
  const videos = await fetchTrendingVideos(hashtags);
  console.log(`[RapidAPI] ${videos.length} trend video cekildi`);

  // 2. Her video icin yorumlar (ilk 10 video, rate limit icin)
  const topVideos = videos.slice(0, 10);
  for (const video of topVideos) {
    if (!isAvailable()) break;
    video.comments = await fetchVideoComments(video.url, 30);
    await sleep(500);
  }
  console.log(`[RapidAPI] Yorumlar cekildi (${topVideos.filter(v => v.comments.length > 0).length} video)`);

  // 3. Kullanici videolari
  let userVideos = [];
  if (targetUsername && isAvailable()) {
    userVideos = await fetchUserVideos(targetUsername);
    console.log(`[RapidAPI] ${userVideos.length} kullanici videosu cekildi (@${targetUsername})`);
  }

  return {
    videos,
    userVideos,
    fetchedAt: Date.now(),
    source: 'rapidapi',
  };
}

module.exports = {
  scrape,
  isAvailable,
  getRemainingRequests,
  fetchTrendingVideos,
  fetchVideoComments,
  fetchUserVideos,
};
