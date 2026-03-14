import { getRedis } from "./redis";

/**
 * Get cached value or execute fetcher and cache result.
 * Falls back to fetcher if Redis is not configured.
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const redis = getRedis();

  if (redis) {
    try {
      const hit = await redis.get<T>(key);
      if (hit !== null && hit !== undefined) return hit;
    } catch {
      // Redis error — fall through to fetcher
    }
  }

  const data = await fetcher();

  if (redis) {
    try {
      await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
    } catch {
      // Cache write failed — non-critical
    }
  }

  return data;
}

/**
 * Invalidate cache keys matching a prefix pattern.
 */
export async function invalidateCache(prefix: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    // Upstash scan + delete
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, {
        match: `${prefix}*`,
        count: 100,
      });
      cursor = Number(result[0]);
      const keys = result[1] as string[];
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== 0);
  } catch {
    // Non-critical
  }
}

/**
 * Build a cache key from path and query params.
 */
export function cacheKey(prefix: string, params?: Record<string, string | number | undefined>): string {
  const parts = [prefix];
  if (params) {
    const sorted = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    if (sorted) parts.push(sorted);
  }
  return parts.join(":");
}
