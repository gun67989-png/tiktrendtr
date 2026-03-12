const axios = require('axios');

const BASE_URL = 'https://www.tikwm.com/api';

function isAvailable() {
  // TikWM her zaman musait, API key gerektirmez
  return true;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(endpoint, params, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sleep(1000); // rate limit koruması
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      if (response.data && response.data.code === 0) {
        return response.data;
      }

      // API hata dondu ama HTTP basarili
      if (response.data && response.data.code !== 0) {
        console.warn(`[TikWM] API hata kodu: ${response.data.code} - ${response.data.msg || 'bilinmeyen hata'}`);
        if (attempt === retries) return response.data;
      }
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.warn(`[TikWM] Rate limited (429). 30sn bekleniyor... (${attempt}/${retries})`);
        await sleep(30000);
        continue;
      }
      if (attempt === retries) {
        throw new Error(`[TikWM] ${retries} denemede basarisiz: ${err.message}`);
      }
      console.warn(`[TikWM] Hata, tekrar deneniyor (${attempt}/${retries}): ${err.message}`);
      await sleep(3000 * attempt);
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
      const data = await makeRequest('/feed/search', {
        keywords: tag,
        count: 20,
        cursor: 0,
        region: 'TR',
      });

      if (data && data.data && data.data.videos) {
        const videos = data.data.videos.map(v => normalizeVideo(v, tag));
        allVideos.push(...videos);
        console.log(`[TikWM] #${tag}: ${videos.length} video bulundu`);
      }
    } catch (err) {
      console.error(`[TikWM] Hashtag "${tag}" cekilemedi:`, err.message);
    }

    await sleep(1500);
  }

  // Tekrar eden videolari kaldir
  const uniqueMap = new Map();
  for (const v of allVideos) {
    if (!uniqueMap.has(v.id)) {
      uniqueMap.set(v.id, v);
    } else {
      const existing = uniqueMap.get(v.id);
      const merged = new Set([...existing.hashtags, ...v.hashtags]);
      existing.hashtags = Array.from(merged);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Kullanici videolarini cek
 */
async function fetchUserVideos(username, count = 30) {
  try {
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
    console.error(`[TikWM] Kullanici videolari cekilemedi (${username}):`, err.message);
    return [];
  }
}

/**
 * Video yorumlarini cek
 */
async function fetchVideoComments(videoUrl, count = 30) {
  try {
    // TikWM yorum endpoint'i video URL veya ID alabilir
    const data = await makeRequest('/comment/list', {
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
    console.error(`[TikWM] Yorumlar cekilemedi:`, err.message);
    return [];
  }
}

/**
 * Follower sayisini cek (kullanici profili uzerinden)
 */
async function fetchFollowerCount(username) {
  try {
    const data = await makeRequest('/user/posts', {
      unique_id: username,
      count: 1,
    });

    if (data && data.data && data.data.videos && data.data.videos.length > 0) {
      return data.data.videos[0].author?.follower_count || 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * TikWM video formati → standart format
 */
function normalizeVideo(raw, sourceHashtag = null) {
  const hashtags = [];
  if (sourceHashtag) hashtags.push(sourceHashtag);

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
 * Ana scrape fonksiyonu
 */
async function scrape({ hashtags, targetUsername }) {
  console.log(`[TikWM] Scraping basliyor... Hashtag'ler: ${hashtags.join(', ')}`);

  // 1. Trend videolar
  const videos = await fetchTrendingVideos(hashtags);
  console.log(`[TikWM] Toplam ${videos.length} unique trend video cekildi`);

  // 2. Ilk 10 video icin yorumlar
  const topVideos = videos.slice(0, 10);
  for (const video of topVideos) {
    video.comments = await fetchVideoComments(video.url, 30);
    await sleep(800);
  }
  const withComments = topVideos.filter(v => v.comments.length > 0).length;
  console.log(`[TikWM] ${withComments}/${topVideos.length} video icin yorumlar cekildi`);

  // 3. Kullanici videolari
  let userVideos = [];
  if (targetUsername) {
    userVideos = await fetchUserVideos(targetUsername);
    console.log(`[TikWM] @${targetUsername}: ${userVideos.length} video cekildi`);
  }

  return {
    videos,
    userVideos,
    fetchedAt: Date.now(),
    source: 'tikwm',
  };
}

module.exports = {
  scrape,
  isAvailable,
  fetchTrendingVideos,
  fetchVideoComments,
  fetchUserVideos,
  fetchFollowerCount,
};
