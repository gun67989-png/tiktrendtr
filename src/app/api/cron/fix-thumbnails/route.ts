import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cronLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Fix thumbnails — fetches fresh cover URLs from TikWM for each video
 * and caches them to Supabase Storage.
 *
 * Usage: GET /api/cron/fix-thumbnails?batch=1 (processes 50 videos per batch)
 * Authorization: Bearer CRON_SECRET
 */

const BUCKET = "thumbnails";
const BATCH_SIZE = 50; // Videos per API call
const DOWNLOAD_CONCURRENCY = 5;

interface TikWMVideoResponse {
  code: number;
  data?: {
    cover?: string;
    origin_cover?: string;
    id?: string;
  };
}

// Get fresh thumbnail URL from TikWM for a video
async function getFreshThumbnail(videoId: string, username: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const tiktokUrl = `https://www.tiktok.com/@${username}/video/${videoId}`;
    const res = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: `url=${encodeURIComponent(tiktokUrl)}`,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const result = (await res.json()) as TikWMVideoResponse;
    if (result.code !== 0 || !result.data) return null;

    return result.data.origin_cover || result.data.cover || null;
  } catch {
    return null;
  }
}

// Download image from URL
async function downloadImage(url: string): Promise<Uint8Array | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.tiktok.com/",
        "Accept": "image/*,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 1000) return null;

    return new Uint8Array(buffer);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const batchNum = parseInt(searchParams.get("batch") || "1", 10);
  const offset = (batchNum - 1) * BATCH_SIZE;

  try {
    // Ensure bucket exists
    try {
      await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: 500000,
      });
    } catch {
      // Already exists
    }

    // Fetch videos that need thumbnail fixing (not cached in Supabase)
    const { data: videos, error } = await supabase
      .from("trending_videos")
      .select("video_id, creator_username, thumbnail_url")
      .not("thumbnail_url", "like", "%supabase%")
      .order("view_count", { ascending: false })
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json({ message: "No videos need thumbnail fixing", batch: batchNum });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let fixed = 0;
    let failed = 0;

    // Process in batches of DOWNLOAD_CONCURRENCY
    for (let i = 0; i < videos.length; i += DOWNLOAD_CONCURRENCY) {
      const batch = videos.slice(i, i + DOWNLOAD_CONCURRENCY);

      await Promise.allSettled(
        batch.map(async (video) => {
          // Step 1: Get fresh thumbnail URL from TikWM
          const freshUrl = await getFreshThumbnail(video.video_id, video.creator_username);
          if (!freshUrl) {
            failed++;
            return;
          }

          // Step 2: Download the image
          const imageData = await downloadImage(freshUrl);
          if (!imageData) {
            failed++;
            return;
          }

          // Step 3: Upload to Supabase Storage
          const filePath = `${video.video_id}.jpg`;
          const { error: uploadError } = await supabase!.storage
            .from(BUCKET)
            .upload(filePath, imageData, {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (uploadError) {
            failed++;
            return;
          }

          // Step 4: Update video record with permanent URL
          const permanentUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;
          await supabase!
            .from("trending_videos")
            .update({ thumbnail_url: permanentUrl })
            .eq("video_id", video.video_id);

          fixed++;
        })
      );

      // Rate limit TikWM API
      if (i + DOWNLOAD_CONCURRENCY < videos.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({
      batch: batchNum,
      processed: videos.length,
      fixed,
      failed,
      remaining: videos.length === BATCH_SIZE ? "more batches needed" : "done",
    });
  } catch (e) {
    cronLogger.error({ err: e }, "Fix thumbnails error");
    return NextResponse.json({ error: "Fix failed" }, { status: 500 });
  }
}
