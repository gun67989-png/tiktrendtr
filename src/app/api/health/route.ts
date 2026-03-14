import { NextResponse } from "next/server";

const startTime = Date.now();

async function checkSupabase(): Promise<{ ok: boolean; latency: number }> {
  const start = Date.now();
  try {
    const { supabase, isSupabaseConfigured } = await import("@/lib/supabase");
    if (!isSupabaseConfigured || !supabase) return { ok: false, latency: 0 };
    const { error } = await supabase.from("users").select("id").limit(1);
    return { ok: !error, latency: Date.now() - start };
  } catch {
    return { ok: false, latency: Date.now() - start };
  }
}

async function checkRedis(): Promise<{ ok: boolean; latency: number }> {
  const start = Date.now();
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return { ok: false, latency: 0 };
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({ url, token });
    await redis.ping();
    return { ok: true, latency: Date.now() - start };
  } catch {
    return { ok: false, latency: Date.now() - start };
  }
}

export async function GET() {
  const [supabase, redis] = await Promise.all([checkSupabase(), checkRedis()]);

  const aiConfigured = !!(
    process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY
  );

  const allCritical = supabase.ok; // DB is critical
  const status = allCritical ? 200 : 503;

  return NextResponse.json(
    {
      status: allCritical ? "healthy" : "degraded",
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      services: {
        database: { status: supabase.ok ? "up" : "down", latency_ms: supabase.latency },
        redis: { status: redis.ok ? "up" : "not_configured", latency_ms: redis.latency },
        ai: { status: aiConfigured ? "configured" : "not_configured" },
      },
    },
    { status }
  );
}
