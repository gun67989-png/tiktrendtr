import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { scrapeTrendingVideos, scrapeTrendingVideosBatch, type ScrapedVideo } from "@/lib/tiktok-scraper";

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
        console.warn("[CRON] Could not create table via RPC, trying direct insert:", createError.message);
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

    return true;
  } catch (e) {
    console.warn("[CRON] Table check failed:", e);
    return false;
  }
}

// Store videos in Supabase
async function storeVideos(videos: ScrapedVideo[]): Promise<number> {
  if (!isSupabaseConfigured || !supabase || videos.length === 0) return 0;

  try {
    const rows = videos.map((v) => ({
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
      category: v.category,
      format: v.format,
      ad_format: v.ad_format,
      creator_presence_score: v.creator_presence_score,
      follower_count: v.follower_count || 0,
      scraped_at: v.scraped_at,
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
        console.warn(`[CRON] Batch insert failed:`, error.message);
      } else {
        stored += data?.length ?? 0;
      }
    }

    return stored;
  } catch (e) {
    console.error("[CRON] Store failed:", e);
    return 0;
  }
}

// Clean old videos (keep only last 14 days)
async function cleanOldVideos(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0;

  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data, error } = await supabase
      .from("trending_videos")
      .delete()
      .lt("scraped_at", fourteenDaysAgo.toISOString())
      .select("video_id");

    if (error) {
      console.warn("[CRON] Cleanup failed:", error.message);
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

    console.log(`[CRON] Data collection started at ${timestamp} (batch: ${validBatch ?? "full"})`);

    // Step 1: Ensure database table exists
    await ensureTable();

    // Step 2: Scrape real TikTok data
    console.log("[CRON] Starting TikTok scraping...");
    const scrapedVideos = validBatch
      ? await scrapeTrendingVideosBatch(validBatch)
      : await scrapeTrendingVideos();
    console.log(`[CRON] Scraped ${scrapedVideos.length} videos`);

    // Step 3: Store in database
    const storedCount = await storeVideos(scrapedVideos);
    console.log(`[CRON] Stored ${storedCount} videos in database`);

    // Step 4: Sadece batch 2'de veya full scrape'de eski kayıtları temizle
    const cleanedCount = (!validBatch || validBatch === 6) ? await cleanOldVideos() : 0;

    const results = {
      timestamp,
      batch: validBatch ?? "full",
      videosScraped: scrapedVideos.length,
      videosStored: storedCount,
      videosCleanedUp: cleanedCount,
      status: scrapedVideos.length > 0 ? "success" : "no_data",
      message: scrapedVideos.length > 0
        ? `Batch ${validBatch ?? "full"}: ${scrapedVideos.length} video çekildi`
        : "Veri çekilemedi. Sonraki döngüde tekrar denenecek.",
    };

    console.log(`[CRON] Collection completed:`, results);

    return NextResponse.json(results);
  } catch (error) {
    console.error("[CRON] Data collection failed:", error);
    return NextResponse.json(
      { error: "Collection failed", status: "error" },
      { status: 500 }
    );
  }
}
