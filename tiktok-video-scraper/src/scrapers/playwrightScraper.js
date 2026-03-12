let chromium, stealthPlugin;

try {
  // playwright-extra ve stealth plugin
  const { chromium: pw } = require('playwright-extra');
  stealthPlugin = require('puppeteer-extra-plugin-stealth');
  pw.use(stealthPlugin());
  chromium = pw;
} catch {
  // Fallback: normal playwright
  try {
    const { chromium: pw } = require('playwright');
    chromium = pw;
  } catch {
    chromium = null;
  }
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function randomDelay() {
  return 3000 + Math.random() * 5000;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isAvailable() {
  return chromium !== null;
}

/**
 * TikTok sayfasindan API interceptleriyle veri cek
 */
async function scrapeTikTokPage(url, page, interceptedData) {
  try {
    // TikTok API isteklerini intercept et
    await page.route('**/api/recommend/**', async (route) => {
      try {
        const response = await route.fetch();
        const body = await response.json();
        if (body && body.itemList) {
          interceptedData.push(...body.itemList);
        }
      } catch {
        // Sessizce devam et
      }
      await route.continue().catch(() => {});
    });

    await page.route('**/api/comment/**', async (route) => {
      try {
        const response = await route.fetch();
        const body = await response.json();
        if (body && body.comments) {
          interceptedData.push({ _type: 'comments', data: body.comments });
        }
      } catch {
        // Sessizce devam et
      }
      await route.continue().catch(() => {});
    });

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(randomDelay());

    // Sayfayi asagi kaydir, daha fazla icerik yukle
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await sleep(1500 + Math.random() * 2000);
    }

    // DOM'dan veri cikarmayi dene (fallback)
    const domVideos = await page.evaluate(() => {
      const items = [];
      const videoElements = document.querySelectorAll('[data-e2e="recommend-list-item-container"], [class*="DivItemContainer"]');

      videoElements.forEach(el => {
        try {
          const linkEl = el.querySelector('a[href*="/video/"]');
          const descEl = el.querySelector('[data-e2e="video-desc"], [class*="SpanText"]');
          const statsEls = el.querySelectorAll('[data-e2e="video-views"], strong');

          if (linkEl) {
            items.push({
              url: linkEl.href || '',
              description: descEl ? descEl.textContent : '',
              statsText: Array.from(statsEls).map(s => s.textContent),
            });
          }
        } catch {
          // Sessizce devam et
        }
      });
      return items;
    });

    return domVideos;
  } catch (err) {
    console.error(`[Playwright] Sayfa scrape hatasi (${url}):`, err.message);
    return [];
  }
}

/**
 * Stats metin formati parse et (1.2M -> 1200000)
 */
function parseStatText(text) {
  if (!text) return 0;
  text = text.trim().toUpperCase();
  if (text.includes('M')) return Math.round(parseFloat(text) * 1_000_000);
  if (text.includes('K')) return Math.round(parseFloat(text) * 1_000);
  if (text.includes('B')) return Math.round(parseFloat(text) * 1_000_000_000);
  return parseInt(text.replace(/\D/g, ''), 10) || 0;
}

/**
 * DOM videosu → standart format
 */
function normalizeDOMVideo(domItem, sourceHashtag = null) {
  const urlMatch = (domItem.url || '').match(/\/@([^/]+)\/video\/(\d+)/);
  const username = urlMatch ? urlMatch[1] : 'unknown';
  const videoId = urlMatch ? urlMatch[2] : String(Date.now());

  const desc = domItem.description || '';
  const hashtags = [];
  if (sourceHashtag) hashtags.push(sourceHashtag);
  const tagMatches = desc.match(/#[\w\u00C0-\u024F\u0400-\u04FF]+/g);
  if (tagMatches) {
    tagMatches.forEach(t => {
      const cleaned = t.replace('#', '').toLowerCase();
      if (!hashtags.includes(cleaned)) hashtags.push(cleaned);
    });
  }

  const stats = domItem.statsText || [];
  return {
    id: videoId,
    url: domItem.url || `https://www.tiktok.com/@${username}/video/${videoId}`,
    thumbnail: '',
    description: desc,
    author: {
      username,
      displayName: username,
      followers: 0,
      avatar: '',
    },
    stats: {
      views: stats[0] ? parseStatText(stats[0]) : 0,
      likes: stats[1] ? parseStatText(stats[1]) : 0,
      comments: stats[2] ? parseStatText(stats[2]) : 0,
      shares: stats[3] ? parseStatText(stats[3]) : 0,
    },
    hashtags,
    createdAt: Date.now(),
    comments: [],
  };
}

/**
 * Intercepted API veri → standart format
 */
function normalizeInterceptedVideo(item) {
  const author = item.author || {};
  const stats = item.stats || {};
  const desc = item.desc || '';

  const hashtags = [];
  const tagMatches = desc.match(/#[\w\u00C0-\u024F\u0400-\u04FF]+/g);
  if (tagMatches) {
    tagMatches.forEach(t => {
      const cleaned = t.replace('#', '').toLowerCase();
      if (!hashtags.includes(cleaned)) hashtags.push(cleaned);
    });
  }

  if (item.challenges) {
    item.challenges.forEach(c => {
      const tag = (c.title || '').toLowerCase();
      if (tag && !hashtags.includes(tag)) hashtags.push(tag);
    });
  }

  return {
    id: String(item.id || ''),
    url: `https://www.tiktok.com/@${author.uniqueId || 'user'}/video/${item.id || ''}`,
    thumbnail: item.video?.cover || item.video?.originCover || '',
    description: desc,
    author: {
      username: author.uniqueId || '',
      displayName: author.nickname || '',
      followers: author.followerCount || 0,
      avatar: author.avatarThumb || '',
    },
    stats: {
      likes: stats.diggCount || 0,
      views: stats.playCount || 0,
      comments: stats.commentCount || 0,
      shares: stats.shareCount || 0,
    },
    hashtags,
    createdAt: item.createTime ? item.createTime * 1000 : Date.now(),
    comments: [],
  };
}

/**
 * Ana scrape fonksiyonu
 */
async function scrape({ hashtags, targetUsername }) {
  if (!isAvailable()) {
    throw new Error('[Playwright] Playwright kurulu degil');
  }

  console.log('[Playwright] Headless browser baslatiliyor...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allVideos = [];

  try {
    for (const tag of hashtags) {
      const context = await browser.newContext({
        userAgent: getRandomUA(),
        viewport: { width: 1920, height: 1080 },
        locale: 'tr-TR',
      });
      const page = await context.newPage();

      try {
        const intercepted = [];
        const url = `https://www.tiktok.com/tag/${encodeURIComponent(tag)}`;
        console.log(`[Playwright] Scraping: ${url}`);

        const domVideos = await scrapeTikTokPage(url, page, intercepted);

        // Intercepted API verisi varsa onu kullan (daha zengin)
        if (intercepted.length > 0) {
          const normalized = intercepted
            .filter(item => !item._type) // Yorum datalarini filtrele
            .map(item => normalizeInterceptedVideo(item));
          allVideos.push(...normalized);
        } else if (domVideos.length > 0) {
          // DOM fallback
          const normalized = domVideos.map(d => normalizeDOMVideo(d, tag));
          allVideos.push(...normalized);
        }

        console.log(`[Playwright] #${tag}: ${intercepted.length || domVideos.length} video bulundu`);
      } catch (err) {
        console.error(`[Playwright] #${tag} hatasi:`, err.message);
      } finally {
        await context.close();
      }

      await sleep(randomDelay());
    }

    // Kullanici videolari
    let userVideos = [];
    if (targetUsername) {
      const context = await browser.newContext({
        userAgent: getRandomUA(),
        viewport: { width: 1920, height: 1080 },
        locale: 'tr-TR',
      });
      const page = await context.newPage();

      try {
        const intercepted = [];
        const url = `https://www.tiktok.com/@${targetUsername}`;
        console.log(`[Playwright] Kullanici sayfasi: ${url}`);

        await scrapeTikTokPage(url, page, intercepted);

        if (intercepted.length > 0) {
          userVideos = intercepted
            .filter(item => !item._type)
            .map(item => normalizeInterceptedVideo(item));
        }
        console.log(`[Playwright] @${targetUsername}: ${userVideos.length} video bulundu`);
      } catch (err) {
        console.error(`[Playwright] @${targetUsername} hatasi:`, err.message);
      } finally {
        await context.close();
      }
    }

    // Tekrar eden videolari cikar
    const uniqueMap = new Map();
    for (const v of allVideos) {
      if (!uniqueMap.has(v.id)) {
        uniqueMap.set(v.id, v);
      }
    }

    return {
      videos: Array.from(uniqueMap.values()),
      userVideos,
      fetchedAt: Date.now(),
      source: 'playwright',
    };
  } finally {
    await browser.close();
    console.log('[Playwright] Browser kapatildi');
  }
}

module.exports = {
  scrape,
  isAvailable,
};
