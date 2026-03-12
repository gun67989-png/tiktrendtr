const researchApiScraper = require('./scrapers/researchApiScraper');
const rapidApiScraper = require('./scrapers/rapidApiScraper');
const tikwmScraper = require('./scrapers/tikwmScraper');
const playwrightScraper = require('./scrapers/playwrightScraper');
const { getMockData } = require('./mockData');

/**
 * Scraper oncelik sirasi:
 * 1. TikTok Research API (token varsa)
 * 2. RapidAPI (key varsa ve limit dolmamissa)
 * 3. TikWM (key gerektirmez, her zaman musait)
 * 4. Playwright (headless scraping)
 * 5. Mock data (test modu veya hepsi basarisiz)
 */

const SCRAPERS = [
  {
    name: 'ResearchAPI',
    module: researchApiScraper,
    check: () => researchApiScraper.isAvailable(),
  },
  {
    name: 'RapidAPI',
    module: rapidApiScraper,
    check: () => rapidApiScraper.isAvailable(),
  },
  {
    name: 'TikWM',
    module: tikwmScraper,
    check: () => tikwmScraper.isAvailable(),
  },
  {
    name: 'Playwright',
    module: playwrightScraper,
    check: () => playwrightScraper.isAvailable(),
  },
];

/**
 * En uygun scraper'i sec ve calistir
 */
async function scrape(options) {
  const {
    hashtags = ['fyp', 'trending', 'kesfet'],
    targetUsername = '',
  } = options;

  // Test modu kontrolu
  if (process.env.TEST_MODE === 'true') {
    console.log('[ScraperManager] TEST_MODE aktif, mock data donduruluyor');
    return getMockData(hashtags, targetUsername);
  }

  // Scraper'lari sirayla dene
  for (const scraper of SCRAPERS) {
    if (!scraper.check()) {
      console.log(`[ScraperManager] ${scraper.name} uygun degil, atlaniyor`);
      continue;
    }

    try {
      console.log(`[ScraperManager] ${scraper.name} ile cekiliyor...`);
      const result = await scraper.module.scrape({ hashtags, targetUsername });

      if (result && result.videos && result.videos.length > 0) {
        console.log(`[ScraperManager] ${scraper.name} basarili: ${result.videos.length} video`);
        return result;
      }

      console.warn(`[ScraperManager] ${scraper.name} bos sonuc dondu, siradakine geciliyor`);
    } catch (err) {
      console.error(`[ScraperManager] ${scraper.name} hata verdi:`, err.message);
      continue;
    }
  }

  // Hicbiri calismadiysa mock data don
  console.warn('[ScraperManager] Tum scraper\'lar basarisiz, mock data donduruluyor');
  return getMockData(hashtags, targetUsername);
}

/**
 * Hangi scraper'larin musait oldugunu goster
 */
function getAvailableScrapers() {
  return SCRAPERS.map(s => ({
    name: s.name,
    available: s.check(),
  }));
}

module.exports = {
  scrape,
  getAvailableScrapers,
};
