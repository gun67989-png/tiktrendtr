const cron = require('node-cron');
const scraperManager = require('./scraperManager');
const aiProcessor = require('./aiProcessor');
const cache = require('./cache');
const wsServer = require('./wsServer');

let cronJob = null;
let isRunning = false;
let currentHashtags = [];
let targetUsername = '';

/**
 * Tek bir scrape + process dongusu
 */
async function scrapeAndProcess() {
  if (isRunning) {
    console.log('[Scheduler] Onceki islem devam ediyor, atlanacak');
    return;
  }

  isRunning = true;
  const startTime = Date.now();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[Scheduler] Veri cekme basladi: ${new Date().toISOString()}`);
  console.log(`[Scheduler] Hashtag'ler: ${currentHashtags.join(', ')}`);
  console.log(`[Scheduler] Hedef kullanici: ${targetUsername || 'yok'}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    // 1. Veri cek (scraper otomatik secilir)
    console.log('[Scheduler] Adim 1/3: Veri cekiliyor...');
    const scrapedData = await scraperManager.scrape({
      hashtags: currentHashtags,
      targetUsername,
    });

    if (!scrapedData || !scrapedData.videos || scrapedData.videos.length === 0) {
      console.warn('[Scheduler] Bos veri dondu');

      // Cache'deki eski veriyi kullan
      const cachedData = cache.get('processed');
      if (cachedData) {
        wsServer.broadcastStale('Yeni veri cekilemedi, onceki veri gosteriliyor');
      }
      return;
    }

    // Ham veriyi cache'le
    cache.set('raw', scrapedData, 30); // 30 dakika
    console.log(`[Scheduler] ${scrapedData.videos.length} video cekildi (kaynak: ${scrapedData.source})`);

    // 2. AI ile isle
    console.log('[Scheduler] Adim 2/3: AI analizi yapiliyor...');
    const processedData = await aiProcessor.process(scrapedData);

    // Kullanici verilerini ekle
    if (scrapedData.userVideos && scrapedData.userVideos.length > 0) {
      processedData.userVideos = {
        username: targetUsername,
        totalVideos: scrapedData.userVideos.length,
        recentVideos: scrapedData.userVideos.slice(0, 20).map(v => ({
          id: v.id,
          url: v.url,
          thumbnail: v.thumbnail,
          description: v.description,
          stats: v.stats,
          createdAt: v.createdAt,
        })),
      };
    }

    // 3. Cache'le ve yayinla
    console.log('[Scheduler] Adim 3/3: Cache ve broadcast...');
    cache.set('processed', processedData, 15); // 15 dakika TTL
    cache.set(`trending`, processedData, 15);

    if (targetUsername) {
      cache.set(`user:${targetUsername}`, processedData.userVideos, 15);
    }

    // WebSocket broadcast
    wsServer.broadcast(processedData);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n[Scheduler] Tamamlandi! ${elapsed}sn surdu. ${processedData.videos?.length || 0} video islendi.\n`);

  } catch (err) {
    console.error('[Scheduler] Kritik hata:', err.message);

    // Eski cache varsa stale bildir
    const cachedData = cache.get('processed');
    if (cachedData) {
      wsServer.broadcastStale(`Hata: ${err.message}. Cache'deki veri kullaniliyor.`);
    }
  } finally {
    isRunning = false;
  }
}

/**
 * Cron zamanlayiciyi baslat
 */
function start(options = {}) {
  const {
    hashtags = (process.env.TARGET_HASHTAGS || 'fyp,trending,kesfet').split(',').map(h => h.trim()),
    username = process.env.TARGET_USERNAME || '',
    intervalMinutes = parseInt(process.env.SCRAPE_INTERVAL_MINUTES, 10) || 10,
  } = options;

  currentHashtags = hashtags;
  targetUsername = username;

  // Frontend'den hashtag degisikligi dinle
  wsServer.onHashtagChange((newHashtags) => {
    currentHashtags = newHashtags;
    console.log(`[Scheduler] Hashtag'ler guncellendi: ${newHashtags.join(', ')}`);
    // Hemen yeni bir cekme baslat
    scrapeAndProcess().catch(err => {
      console.error('[Scheduler] Hashtag degisikligi sonrasi hata:', err.message);
    });
  });

  // Cron job kur
  const cronExpression = `*/${intervalMinutes} * * * *`;
  cronJob = cron.schedule(cronExpression, () => {
    scrapeAndProcess().catch(err => {
      console.error('[Scheduler] Cron hata:', err.message);
    });
  });

  console.log(`[Scheduler] Her ${intervalMinutes} dakikada bir calisacak (cron: ${cronExpression})`);
  console.log(`[Scheduler] Hashtag'ler: ${currentHashtags.join(', ')}`);
  console.log(`[Scheduler] Hedef kullanici: ${targetUsername || 'belirlenmedi'}`);

  return { scrapeAndProcess };
}

/**
 * Zamanlayiciyi durdur
 */
function stop() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('[Scheduler] Durduruldu');
  }
}

module.exports = {
  start,
  stop,
  scrapeAndProcess,
};
