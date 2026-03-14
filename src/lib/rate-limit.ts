import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function createLimiter(requests: number, window: string) {
  const r = getRedis();
  if (!r) return null;
  return new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(requests, window as `${number} ${"s" | "m" | "h" | "d"}`),
    analytics: true,
    prefix: "valyze:ratelimit",
  });
}

// Rate limiters for different route types
const limiters = {
  general: () => createLimiter(60, "1 m"),
  auth: () => createLimiter(5, "1 m"),
  ai: () => createLimiter(10, "1 m"),
  public: () => createLimiter(30, "1 m"),
};

export type RateLimitType = keyof typeof limiters;

export function getRateLimitType(pathname: string): RateLimitType {
  if (pathname.startsWith("/api/auth")) return "auth";
  if (pathname.startsWith("/api/ai")) return "ai";
  if (pathname.startsWith("/api/public")) return "public";
  return "general";
}

export async function checkRateLimit(
  identifier: string,
  type: RateLimitType
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = limiters[type]();
  if (!limiter) {
    // Redis not configured — allow all requests
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // Redis error — fail open (allow request)
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}
