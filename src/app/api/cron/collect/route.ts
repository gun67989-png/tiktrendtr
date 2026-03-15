import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { scrapeTrendingVideos, scrapeTrendingVideosBatch, buildTiktokUrl, type ScrapedVideo } from "@/lib/tiktok-scraper";
import { invalidateCache } from "@/lib/cache";
import { cronLogger } from "@/lib/logger";
import { validateVideoBatch } from "@/lib/video-validation";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for scraping

// Create the trending_videos table if it doesn't exist
async function ensureTable(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    // Try a simple select to see if table exists
    const { error } = await supabase
      .from("trending_videos")
      .select("video_id")
      .limit(1);

    if (error && error.code === "42P01") {
      // Table doesn't exist, create it via SQL
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS trending_videos (
            video_id TEXT PRIMARY KEY,
            creator_username TEXT NOT NULL,
            creator_nickname TEXT,
            caption TEXT,
            hashtags TEXT[],
            view_count BIGINT DEFAULT 0,
            like_count BIGINT DEFAULT 0,
            comment_count BIGINT DEFAULT 0,
            share_count BIGINT DEFAULT 0,
            tiktok_url TEXT NOT NULL,
            thumbnail_url TEXT,
            duration INTEGER DEFAULT 0,
            sound_name TEXT,
            sound_creator TEXT,
            category TEXT DEFAULT 'Vlog',
            format TEXT,
            ad_format TEXT,
            creator_presence_score INTEGER DEFAULT 50,
            follower_count BIGINT DEFAULT 0,
            scraped_at TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `,
      });

      if (createError) {
        cronLogger.warn({ err: createError.message }, "Could not create table via RPC, trying direct insert");
      }
    }

    // Ensure columns exist (migration for existing tables)
    try {
      await supabase.rpc("exec_sql", {
        sql: `ALTER TABLE trending_videos ADD COLUMN IF NOT EXISTS creator_presence_score INTEGER DEFAULT 50;`,
      });
    } catch {
      // Column likely already exists, ignore
    }

    try {
      await supabase.rpc("exec_sql", {
        sql: `ALTER TABLE trending_videos ADD COLUMN IF NOT EXISTS ad_format TEXT;`,
      });
    } catch {
      // Column likely already exists, ignore
    }

    try {
      await supabase.rpc("exec_sql", {
        sql: `ALTER TABLE trending_videos ADD COLUMN IF NOT EXISTS follower_count BIGINT DEFAULT 0;`,
      });
    } catch {
      // Column likely already exists, ignore
    }

    try {
      await supabase.rpc("exec_sql", {
        sql: `ALTER TABLE trending_videos ADD COLUMN IF NOT EXISTS sound_type TEXT DEFAULT 'sound';`,
      });
    } catch {
      // Column likely already exists, ignore
    }

    return true;
  } catch (e) {
    cronLogger.warn({ err: e }, "Table check failed");
    return false;
  }
}

// Download a thumbnail image from URL with retries and fallback
async function downloadThumbnail(url: string): Promise<Uint8Array | null> {
  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer": "https://www.tiktok.com/",
    "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
  };

  // Try original URL first
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength >= 1000) return new Uint8Array(buffer);
    }
  } catch {
    // First attempt failed, try fallback
  }

  // Fallback: try without Referer header (some CDN nodes block it)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      headers: { "User-Agent": headers["User-Agent"], "Accept": headers["Accept"] },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      if (buffer.byteLength >= 1000) return new Uint8Array(buffer);
    }
  } catch {
    // Both attempts failed
  }

  return null;
}

// Cache thumbnails to Supabase Storage — returns updated videos with permanent URLs
async function cacheThumbnails(videos: ScrapedVideo[]): Promise<ScrapedVideo[]> {
  if (!isSupabaseConfigured || !supabase) return videos;

  const BUCKET = "thumbnails";
  const BATCH_SIZE = 5; // 5 concurrent downloads
  let cached = 0;
  let failed = 0;

  // Ensure bucket exists (ignore error if already exists)
  try {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 500000, // 500KB max per thumbnail
    });
  } catch {
    // Bucket already exists, fine
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  for (let i = 0; i < videos.length; i += BATCH_SIZE) {
    const batch = videos.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (video) => {
        const originalUrl = video.thumbnail_url;
        if (!originalUrl || originalUrl.includes("supabase")) return; // Already cached

        try {
          const imageData = await downloadThumbnail(originalUrl);

          if (!imageData) {
            failed++;
            if (failed <= 3) cronLogger.warn({ videoId: video.video_id, url: originalUrl.substring(0, 80) }, "Thumbnail download failed");
            return;
          }

          const filePath = `${video.video_id}.jpg`;

          const { error: uploadError } = await supabase!.storage
            .from(BUCKET)
            .upload(filePath, imageData, {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (uploadError) {
            failed++;
            if (failed <= 3) cronLogger.warn({ videoId: video.video_id, err: uploadError.message }, "Thumbnail upload failed");
            return;
          }

          if (supabaseUrl) {
            video.thumbnail_url = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;
            cached++;
          }
        } catch (e) {
          failed++;
          if (failed <= 3) cronLogger.warn({ videoId: video.video_id, err: e }, "Thumbnail cache error");
        }
      })
    );

    // Small delay between batches
    if (i + BATCH_SIZE < videos.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  cronLogger.info({ cached, total: videos.length, failed }, "Cached thumbnails to Supabase Storage");
  return videos;
}

// Store videos in Supabase with validation
async function storeVideos(videos: ScrapedVideo[]): Promise<{ stored: number; rejected: number }> {
  if (!isSupabaseConfigured || !supabase || videos.length === 0) return { stored: 0, rejected: 0 };

  try {
    // Validate all videos before storing
    const now = new Date().toISOString();
    const rawVideos = videos.map((v) => ({
      ...v,
      collected_at: v.collected_at || now,
      published_at: v.published_at || v.scraped_at || now,
    }));

    const { valid: validatedVideos, rejected } = validateVideoBatch(rawVideos);

    if (rejected > 0) {
      cronLogger.info({ rejected }, "Rejected invalid videos during validation");
    }

    if (validatedVideos.length === 0) return { stored: 0, rejected };

    const rows = validatedVideos.map((v) => ({
      video_id: v.video_id,
      creator_username: v.creator_username,
      creator_nickname: v.creator_nickname,
      caption: v.caption,
      hashtags: v.hashtags,
      view_count: v.view_count,
      like_count: v.like_count,
      comment_count: v.comment_count,
      share_count: v.share_count,
      thumbnail_url: v.thumbnail_url,
      duration: v.duration,
      sound_name: v.sound_name,
      sound_creator: v.sound_creator,
      sound_type: v.sound_type || "sound",
      category: v.category,
      format: v.format,
      ad_format: v.ad_format,
      creator_presence_score: v.creator_presence_score,
      follower_count: v.follower_count,
      tiktok_url: buildTiktokUrl(v.creator_username, v.video_id),
      scraped_at: v.published_at, // DB column = TikTok publish time
    }));

    // Upsert in batches of 50
    let stored = 0;
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { data, error } = await supabase
        .from("trending_videos")
        .upsert(batch, { onConflict: "video_id" })
        .select("video_id");

      if (error) {
        cronLogger.warn({ err: error.message }, "Batch insert failed");
      } else {
        stored += data?.length ?? 0;
      }
    }

    return { stored, rejected };
  } catch (e) {
    cronLogger.error({ err: e }, "Store failed");
    return { stored: 0, rejected: 0 };
  }
}

// Clean old videos (keep only last 14 days)
async function cleanOldVideos(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0;

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("trending_videos")
      .delete()
      .lt("scraped_at", sevenDaysAgo.toISOString())
      .select("video_id");

    if (error) {
      cronLogger.warn({ err: error.message }, "Cleanup failed");
      return 0;
    }

    return data?.length ?? 0;
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const timestamp = new Date().toISOString();

    // Batch parametresi: ?batch=1 veya ?batch=2 (Vercel cron için)
    // Parametre yoksa tam scrape yapar (lokal/manual)
    const { searchParams } = new URL(request.url);
    const batchParam = searchParams.get("batch");
    const parsedBatch = batchParam ? parseInt(batchParam, 10) : null;
    const validBatch = parsedBatch && parsedBatch >= 1 && parsedBatch <= 6 ? parsedBatch : null;

    cronLogger.info({ timestamp, batch: validBatch ?? "full" }, "Data collection started");

    // Step 1: Ensure database table exists
    await ensureTable();

    // Step 2: Scrape real TikTok data
    cronLogger.info("Starting TikTok scraping");
    const scrapedVideos = validBatch
      ? await scrapeTrendingVideosBatch(validBatch)
      : await scrapeTrendingVideos();
    cronLogger.info({ count: scrapedVideos.length }, "Scraped videos");

    // Step 3: Cache thumbnails to Supabase Storage (permanent URLs)
    cronLogger.info("Caching thumbnails");
    const videosWithCachedThumbs = await cacheThumbnails(scrapedVideos);

    // Step 4: Store in database (with validation)
    const { stored: storedCount, rejected: rejectedCount } = await storeVideos(videosWithCachedThumbs);
    cronLogger.info({ storedCount, rejectedCount }, "Stored videos in database");

    // Step 5: Clean old records on batch 6 or full scrape
    const cleanedCount = (!validBatch || validBatch === 6) ? await cleanOldVideos() : 0;

    const results = {
      timestamp,
      batch: validBatch ?? "full",
      videosScraped: scrapedVideos.length,
      videosStored: storedCount,
      videosRejected: rejectedCount,
      videosCleanedUp: cleanedCount,
      status: scrapedVideos.length > 0 ? "success" : "no_data",
      message: scrapedVideos.length > 0
        ? `Batch ${validBatch ?? "full"}: ${scrapedVideos.length} video çekildi, ${rejectedCount} reddedildi`
        : "Veri çekilemedi. Sonraki döngüde tekrar denenecek.",
    };

    cronLogger.info({ results }, "Collection completed");

    // Always invalidate caches after collection attempt (prevents stale data)
    await invalidateCache("trends:");

    return NextResponse.json(results);
  } catch (error) {
    cronLogger.error({ err: error }, "Data collection failed");
    return NextResponse.json(
      { error: "Collection failed", status: "error" },
      { status: 500 }
    );
  }
}
