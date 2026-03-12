const axios = require('axios');

function isAvailable() {
  return !!(process.env.TIKTOK_RESEARCH_TOKEN);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const BASE_URL = 'https://open.tiktokapis.com/v2';

async function makeRequest(endpoint, body, retries = 3) {
  const config = {
    method: 'POST',
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${process.env.TIKTOK_RESEARCH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: body,
    timeout: 30000,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios(config);
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.warn(`[ResearchAPI] Rate limited. 30sn bekleniyor... (${attempt}/${retries})`);
        await sleep(30000);
        continue;
      }
      if (err.response && err.response.status === 401) {
        throw new Error('[ResearchAPI] Token gecersiz veya suresi dolmus');
      }
      if (attempt === retries) {
        throw new Error(`[ResearchAPI] ${retries} denemede basarisiz: ${err.message}`);
      }
      console.warn(`[ResearchAPI] Hata, tekrar deneniyor (${attempt}/${retries}): ${err.message}`);
      await sleep(3000 * attempt);
    }
  }
}

/**
 * Trend videolari arastirma API ile cek
 */
async function fetchTrendingVideos(hashtags) {
  const allVideos = [];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const tag of hashtags) {
    try {
      const data = await makeRequest('/research/video/query/', {
        query: {
          and: [
            { field_name: 'hashtag_name', operation: 'EQ', field_values: [tag] },
            { field_name: 'region_code', operation: 'IN', field_values: ['TR'] },
          ],
        },
        max_count: 20,
        start_date: weekAgo.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0],
      });

      if (data && data.data && data.data.videos) {
        const videos = data.data.videos.map(v => normalizeResearchVideo(v, tag));
        allVideos.push(...videos);
      }
    } catch (err) {
      console.error(`[ResearchAPI] Hashtag "${tag}" cekilemedi:`, err.message);
    }

    await sleep(1000);
  }

  // Tekrarlari kaldir
  const uniqueMap = new Map();
  for (const v of allVideos) {
    if (!uniqueMap.has(v.id)) {
      uniqueMap.set(v.id, v);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Kullanici videolarini cek
 */
async function fetchUserVideos(username) {
  try {
    const data = await makeRequest('/research/video/query/', {
      query: {
        and: [
          { field_name: 'username', operation: 'EQ', field_values: [username] },
        ],
      },
      max_count: 30,
    });

    if (data && data.data && data.data.videos) {
      return data.data.videos.map(v => normalizeResearchVideo(v));
    }
    return [];
  } catch (err) {
    console.error(`[ResearchAPI] Kullanici videolari cekilemedi (${username}):`, err.message);
    return [];
  }
}

/**
 * Video yorumlarini cek
 */
async function fetchVideoComments(videoId, count = 30) {
  try {
    const data = await makeRequest('/research/video/comment/list/', {
      video_id: videoId,
      max_count: Math.min(count, 100),
      cursor: 0,
    });

    if (data && data.data && data.data.comments) {
      return data.data.comments.map(c => ({
        username: c.user?.display_name || c.user?.username || 'unknown',
        text: c.text || '',
        likes: c.like_count || 0,
        createdAt: c.create_time ? c.create_time * 1000 : Date.now(),
      }));
    }
    return [];
  } catch (err) {
    console.error(`[ResearchAPI] Yorumlar cekilemedi (${videoId}):`, err.message);
    return [];
  }
}

/**
 * Research API format → standart format
 */
function normalizeResearchVideo(raw, sourceHashtag = null) {
  const hashtags = [];
  if (sourceHashtag) hashtags.push(sourceHashtag);

  if (raw.hashtag_names) {
    raw.hashtag_names.forEach(t => {
      const cleaned = t.toLowerCase();
      if (!hashtags.includes(cleaned)) hashtags.push(cleaned);
    });
  }

  return {
    id: String(raw.id || ''),
    url: raw.share_url || raw.embed_link || '',
    thumbnail: '',
    description: raw.video_description || '',
    author: {
      username: raw.username || '',
      displayName: raw.display_name || raw.username || '',
      followers: 0,
      avatar: '',
    },
    stats: {
      likes: raw.like_count || 0,
      views: raw.view_count || 0,
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
  console.log('[ResearchAPI] Scraping basliyor...');

  // 1. Trend videolar
  const videos = await fetchTrendingVideos(hashtags);
  console.log(`[ResearchAPI] ${videos.length} trend video cekildi`);

  // 2. Yorumlar (ilk 10 video)
  const topVideos = videos.slice(0, 10);
  for (const video of topVideos) {
    video.comments = await fetchVideoComments(video.id, 30);
    await sleep(500);
  }

  // 3. Kullanici videolari
  let userVideos = [];
  if (targetUsername) {
    userVideos = await fetchUserVideos(targetUsername);
    console.log(`[ResearchAPI] ${userVideos.length} kullanici videosu cekildi (@${targetUsername})`);
  }

  return {
    videos,
    userVideos,
    fetchedAt: Date.now(),
    source: 'research',
  };
}

module.exports = {
  scrape,
  isAvailable,
};
