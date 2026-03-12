/**
 * In-memory cache with TTL (Time To Live)
 * Keys: "trending", "user:{username}", "video:{id}:comments", "processed"
 */

class Cache {
  constructor() {
    this._store = new Map();
    this._timers = new Map();

    // Her 60 saniyede suresi dolan verilerri temizle
    this._cleanupInterval = setInterval(() => this._cleanup(), 60000);
  }

  /**
   * Cache'e veri kaydet
   * @param {string} key - Cache anahtari
   * @param {*} data - Saklanacak veri
   * @param {number} ttlMinutes - Yasam suresi (dakika). 0 = sinirsiz
   */
  set(key, data, ttlMinutes = 15) {
    // Eski timer varsa temizle
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key));
      this._timers.delete(key);
    }

    const entry = {
      data,
      createdAt: Date.now(),
      expiresAt: ttlMinutes > 0 ? Date.now() + ttlMinutes * 60 * 1000 : 0,
    };

    this._store.set(key, entry);

    // TTL timer kur
    if (ttlMinutes > 0) {
      const timer = setTimeout(() => {
        this._store.delete(key);
        this._timers.delete(key);
      }, ttlMinutes * 60 * 1000);

      // Timer'in process'i canli tutmasini engelle
      if (timer.unref) timer.unref();
      this._timers.set(key, timer);
    }
  }

  /**
   * Cache'den veri oku
   * @param {string} key - Cache anahtari
   * @returns {*|null} Veri veya null (bulunamazsa/suresi dolmussa)
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;

    // TTL kontrolu
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this._store.delete(key);
      if (this._timers.has(key)) {
        clearTimeout(this._timers.get(key));
        this._timers.delete(key);
      }
      return null;
    }

    return entry.data;
  }

  /**
   * Cache'de key var mi kontrol et
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Belirli bir key'i sil
   */
  delete(key) {
    this._store.delete(key);
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key));
      this._timers.delete(key);
    }
  }

  /**
   * Tum cache'i temizle
   */
  clear() {
    for (const timer of this._timers.values()) {
      clearTimeout(timer);
    }
    this._store.clear();
    this._timers.clear();
  }

  /**
   * Cache istatistikleri
   */
  stats() {
    const entries = [];
    for (const [key, entry] of this._store) {
      entries.push({
        key,
        createdAt: new Date(entry.createdAt).toISOString(),
        expiresAt: entry.expiresAt > 0 ? new Date(entry.expiresAt).toISOString() : 'never',
        isExpired: entry.expiresAt > 0 && Date.now() > entry.expiresAt,
        sizeEstimate: JSON.stringify(entry.data).length,
      });
    }
    return {
      totalEntries: this._store.size,
      entries,
    };
  }

  /**
   * Suresi dolmus entryleri temizle
   */
  _cleanup() {
    const now = Date.now();
    for (const [key, entry] of this._store) {
      if (entry.expiresAt > 0 && now > entry.expiresAt) {
        this._store.delete(key);
        if (this._timers.has(key)) {
          clearTimeout(this._timers.get(key));
          this._timers.delete(key);
        }
      }
    }
  }

  /**
   * Kapatma islemi
   */
  destroy() {
    clearInterval(this._cleanupInterval);
    this.clear();
  }
}

// Singleton instance
const cache = new Cache();

module.exports = cache;
