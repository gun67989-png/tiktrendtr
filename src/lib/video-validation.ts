// Video data validation for the scraping pipeline
// Ensures all stored videos have valid, consistent data

import { z } from "zod";

// Zod schema for scraped video data
export const scrapedVideoSchema = z.object({
  video_id: z.string().min(1),
  creator_username: z.string().min(1).max(200),
  creator_nickname: z.string().max(200).default(""),
  caption: z.string().max(5000).default(""),
  hashtags: z.array(z.string()).default([]),
  view_count: z.number().int().min(0),
  like_count: z.number().int().min(0),
  comment_count: z.number().int().min(0),
  share_count: z.number().int().min(0),
  follower_count: z.number().int().min(0).default(0),
  thumbnail_url: z.string().default(""),
  duration: z.number().int().min(0).default(0),
  sound_name: z.string().max(500).default("Original Sound"),
  sound_creator: z.string().max(200).default(""),
  sound_type: z.enum(["music", "sound", "original"]).default("sound"),
  category: z.string().default("Vlog"),
  format: z.string().default("Kısa Video"),
  ad_format: z.string().nullable().default(null),
  creator_presence_score: z.number().int().min(0).max(100).default(50),
  published_at: z.string(), // TikTok publish time (from create_time)
  collected_at: z.string(), // When we scraped it
});

export type ValidatedVideo = z.infer<typeof scrapedVideoSchema>;

/**
 * Validate a scraped video's data integrity.
 * Returns validated video or null if data is invalid.
 */
export function validateVideo(raw: Record<string, unknown>): ValidatedVideo | null {
  // Parse with zod
  const result = scrapedVideoSchema.safeParse(raw);
  if (!result.success) {
    return null;
  }

  const video = result.data;

  // Business rule validations:

  // 1. Likes should not exceed views by more than 2x (API glitch protection)
  if (video.view_count > 0 && video.like_count > video.view_count * 2) {
    return null;
  }

  // 2. Comments should not exceed views
  if (video.view_count > 0 && video.comment_count > video.view_count) {
    return null;
  }

  // 3. Shares should not exceed views
  if (video.view_count > 0 && video.share_count > video.view_count) {
    return null;
  }

  // 4. If all engagement metrics are 0 AND views are 0, likely invalid
  if (video.view_count === 0 && video.like_count === 0 && video.comment_count === 0) {
    return null;
  }

  return video;
}

/**
 * Validate a batch of videos. Returns only valid ones + count of rejected.
 */
export function validateVideoBatch(videos: Record<string, unknown>[]): {
  valid: ValidatedVideo[];
  rejected: number;
} {
  const valid: ValidatedVideo[] = [];
  let rejected = 0;

  for (const raw of videos) {
    const result = validateVideo(raw);
    if (result) {
      valid.push(result);
    } else {
      rejected++;
    }
  }

  return { valid, rejected };
}
