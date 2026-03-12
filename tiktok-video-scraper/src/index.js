require('dotenv').config();

const wsServer = require('./wsServer');
const scheduler = require('./scheduler');
const scraperManager = require('./scraperManager');
const cache = require('./cache');

const PORT = parseInt(process.env.WS_PORT, 10) || 8080;

async function main() {
  console.log(`
  ████████╗██╗██╗  ██╗████████╗██████╗ ███████╗███╗   ██╗██████╗
  ╚══██╔══╝██║██║ ██╔╝╚══██╔══╝██╔══██╗██╔════╝████╗  ██║██╔══██╗
     ██║   ██║█████╔╝    ██║   ██████╔╝█████╗  ██╔██╗ ██║██║  ██║
     ██║   ██║██╔═██╗    ██║   ██╔══██╗██╔══╝  ██║╚██╗██║██║  ██║
     ██║   ██║██║  ██╗   ██║   ██║  ██║███████╗██║ ╚████║██████╔╝
     ╚═╝   ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝
  `);
  console.log('  TikTok Video Scraper - Multi-AI Processing System');
  console.log('  =================================================\n');

  // Ortam bilgileri
  console.log('[Config] Mod:', process.env.TEST_MODE === 'true' ? 'TEST (Mock Data)' : 'PRODUCTION');
  console.log('[Config] WS Port:', PORT);
  console.log('[Config] Scrape Interval:', process.env.SCRAPE_INTERVAL_MINUTES || '10', 'dakika');

  // Musait scraper'lari goster
  const scrapers = scraperManager.getAvailableScrapers();
  console.log('[Config] Scraper durumu:');
  scrapers.forEach(s => {
    console.log(`  ${s.available ? '✓' : '✗'} ${s.name}: ${s.available ? 'HAZIR' : 'KAPALI'}`);
  });

  // AI durumu (2-li paralel: Claude + Gemini)
  console.log('[Config] AI durumu:');
  console.log(`  ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗'} Claude: ${process.env.ANTHROPIC_API_KEY ? 'HAZIR' : 'API key yok'} (yorum analizi + viral skor)`);
  console.log(`  ${process.env.GOOGLE_AI_KEY ? '✓' : '✗'} Gemini: ${process.env.GOOGLE_AI_KEY ? 'HAZIR' : 'API key yok'} (trend analizi + hashtag)`);
  console.log('');

  // 1. WebSocket sunucusunu baslat
  wsServer.start(PORT);

  // 2. Ilk veri cekimini hemen yap
  console.log('[Main] Ilk veri cekimi baslatiliyor...\n');
  const { scrapeAndProcess } = scheduler.start({
    hashtags: (process.env.TARGET_HASHTAGS || 'fyp,trending,kesfet').split(',').map(h => h.trim()),
    username: process.env.TARGET_USERNAME || '',
    intervalMinutes: parseInt(process.env.SCRAPE_INTERVAL_MINUTES, 10) || 10,
  });

  // Hemen ilk cekimi yap
  await scrapeAndProcess();

  console.log('\n[Main] Sistem hazir. Frontend ws://localhost:' + PORT + ' adresine baglanabilir.\n');
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Main] Kapatiliyor...');
  scheduler.stop();
  await wsServer.stop();
  cache.destroy();
  console.log('[Main] Temiz kapatma tamamlandi');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[Main] SIGTERM alindi, kapatiliyor...');
  scheduler.stop();
  await wsServer.stop();
  cache.destroy();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('[Main] Yakalanmamis Promise hatasi:', err);
});

process.on('uncaughtException', (err) => {
  console.error('[Main] Yakalanmamis hata:', err);
  process.exit(1);
});

main().catch(err => {
  console.error('[Main] Baslatma hatasi:', err);
  process.exit(1);
});
