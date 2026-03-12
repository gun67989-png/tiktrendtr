const { WebSocketServer } = require('ws');
const http = require('http');
const express = require('express');
const cache = require('./cache');

let wss = null;
let server = null;
let onHashtagsChanged = null; // Callback: frontend hashtag degisikligi bildirdiginde

/**
 * WebSocket + HTTP sunucusu baslat
 */
function start(port = 8080) {
  const app = express();

  // CORS ayarlari
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    const stats = cache.stats();
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      cache: {
        entries: stats.totalEntries,
      },
      clients: wss ? wss.clients.size : 0,
    });
  });

  // REST fallback: son veriyi HTTP ile al
  app.get('/api/latest', (req, res) => {
    const data = cache.get('processed');
    if (data) {
      res.json(data);
    } else {
      res.status(204).json({ message: 'Henuz veri yok' });
    }
  });

  // Cache stats
  app.get('/api/cache', (req, res) => {
    res.json(cache.stats());
  });

  server = http.createServer(app);
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`[WS] Yeni client baglandi: ${clientIP} (Toplam: ${wss.clients.size})`);

    // Baglanti mesaji
    ws.send(JSON.stringify({ type: 'connected', status: 'ok', timestamp: Date.now() }));

    // Cache'deki son veriyi hemen gonder (bekletme)
    const latestData = cache.get('processed');
    if (latestData) {
      ws.send(JSON.stringify({
        type: 'update',
        ...formatForFrontend(latestData),
      }));
    }

    // Frontend'den gelen mesajlari dinle
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === 'setHashtags' && Array.isArray(msg.hashtags)) {
          console.log(`[WS] Hashtag guncellendi: ${msg.hashtags.join(', ')}`);

          // Hashtag degisikligi callback'i
          if (onHashtagsChanged) {
            onHashtagsChanged(msg.hashtags);
          }

          // Onay gonder
          ws.send(JSON.stringify({
            type: 'hashtagsUpdated',
            hashtags: msg.hashtags,
            timestamp: Date.now(),
          }));
        }

        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }

      } catch (err) {
        console.error('[WS] Mesaj parse hatasi:', err.message);
      }
    });

    ws.on('close', () => {
      console.log(`[WS] Client ayrildi (Kalan: ${wss.clients.size})`);
    });

    ws.on('error', (err) => {
      console.error('[WS] Client hatasi:', err.message);
    });
  });

  // Heartbeat - bagli clientlari kontrol et
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
  });

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  server.listen(port, () => {
    console.log(`[WS] WebSocket + HTTP sunucusu port ${port}'de dinliyor`);
  });

  return { server, wss };
}

/**
 * Tum bagli clientlara veri gonder
 */
function broadcast(data) {
  if (!wss) return;

  const message = JSON.stringify({
    type: 'update',
    ...formatForFrontend(data),
  });

  let sentCount = 0;
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
      sentCount++;
    }
  });

  if (sentCount > 0) {
    console.log(`[WS] Guncelleme yayinlandi: ${sentCount} client`);
  }
}

/**
 * Stale data bildirimi gonder
 */
function broadcastStale(message = 'Veri cekilemedi, cache kullaniliyor') {
  if (!wss) return;

  const msg = JSON.stringify({
    type: 'stale',
    message,
    timestamp: Date.now(),
  });

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

/**
 * Processed data → frontend formati
 */
function formatForFrontend(data) {
  if (!data) return {};

  // Trending videolar (top 20)
  const trendingVideos = (data.videos || []).slice(0, 20).map(v => ({
    id: v.id,
    url: v.url,
    thumbnail: v.thumbnail || '',
    description: v.description || '',
    author: v.author || v.authorDisplayName || '',
    stats: v.stats || { likes: 0, views: 0, comments: 0, shares: 0 },
    viralPotential: v.viralPotential || 0,
    topComments: (v.topComments || []).slice(0, 3),
    commentSentiment: v.commentSentiment || 'neutral',
  }));

  // Hashtag istatistikleri
  const hashtags = (data.topHashtags || []).map(h => ({
    tag: h.tag,
    videoCount: h.videoCount || 0,
    trend: h.trend || 'stable',
  }));

  return {
    fetchedAt: data.processedAt || Date.now(),
    source: data.source || 'unknown',
    trending: {
      hashtags,
      videos: trendingVideos,
    },
    userVideos: data.userVideos || null,
    trendScore: data.trendScore || 0,
    topTrends: data.topTrends || [],
    overallMood: data.overallMood || 'neutral',
    // Gemini insights
    geminiInsights: data.geminiInsights || null,
  };
}

/**
 * Hashtag degisikligi callback'i ayarla
 */
function onHashtagChange(callback) {
  onHashtagsChanged = callback;
}

/**
 * Sunucuyu kapat
 */
function stop() {
  return new Promise((resolve) => {
    if (wss) {
      wss.clients.forEach(client => client.terminate());
      wss.close();
    }
    if (server) {
      server.close(() => {
        console.log('[WS] Sunucu kapatildi');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  start,
  broadcast,
  broadcastStale,
  onHashtagChange,
  stop,
};
