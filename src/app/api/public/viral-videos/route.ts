import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  generateVideos,
  calcViralScore,
  VIRAL_THRESHOLDS,
  type ViralTier,
} from "@/lib/data";
import { buildTiktokUrl } from "@/lib/tiktok-scraper";

export const dynamic = "force-dynamic";

interface PublicVideo {
  id: string;
  creator: string;
  description: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followerCount: number;
  engagementRate: number;
  viralScore: number;
  surpriseFactor: number;
  engagementVelocity: number;
  discoveryScore: number;
  tier: ViralTier;
  format: string;
  category: string;
  hashtags: string[];
  publishedAt: string;
}

// Fetch filtered viral videos from Supabase
async function fetchViralFromDB(minViews: number, minLikes: number): Promise<PublicVideo[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from("trending_videos")
      .select("*")
      .gte("view_count", minViews)
      .gte("like_count", minLikes)
      .order("view_count", { ascending: false })
      .limit(30);

    if (error || !data || data.length === 0) return null;

    const videos: PublicVideo[] = data
      .map((v: Record<string, unknown>) => {
        const views = (v.view_count as number) || 0;
        const likes = (v.like_count as number) || 0;
        const comments = (v.comment_count as number) || 0;
        const shares = (v.share_count as number) || 0;
        const followerCount = (v.follower_count as number) || 0;
        const engRate = views > 0
          ? Math.round(((likes + comments + shares) / views) * 10000) / 100
          : 0;

        const scoreResult = calcViralScore({
          views,
          likes,
          comments,
          shares,
          followerCount,
          creatorPresenceScore: (v.creator_presence_score as number) ?? 50,
          publishedAt: (v.scraped_at as string) || new Date().toISOString(),
        });

        return {
          id: v.video_id as string,
          creator: v.creator_username as string,
          description: ((v.caption as string) || "").substring(0, 100),
          thumbnailUrl: (v.thumbnail_url as string) || `https://picsum.photos/seed/${((v.video_id as string) || "").slice(-6)}/400/700`,
          tiktokUrl: buildTiktokUrl(v.creator_username as string, v.video_id as string),
          views,
          likes,
          comments,
          shares,
          followerCount,
          engagementRate: engRate,
          viralScore: scoreResult.viralScore,
          surpriseFactor: scoreResult.surpriseFactor,
          engagementVelocity: scoreResult.engagementVelocity,
          discoveryScore: scoreResult.discoveryScore,
          tier: scoreResult.tier,
          format: (v.format as string) || "Kisa Video",
          category: (v.category as string) || "Vlog",
          hashtags: (v.hashtags as string[]) || [],
          publishedAt: v.scraped_at as string,
        };
      })
      .filter((v) => v.engagementRate >= VIRAL_THRESHOLDS.MIN_ENGAGEMENT);

    return videos.length > 0 ? videos : null;
  } catch {
    return null;
  }
}

export async function GET() {
  // Step 1: Try strict thresholds (500K views, 50K likes)
  let videos = await fetchViralFromDB(
    VIRAL_THRESHOLDS.MIN_VIEWS,
    VIRAL_THRESHOLDS.MIN_LIKES
  );

  if (videos && videos.length >= 10) {
    return NextResponse.json({ videos, source: "live" });
  }

  // Step 2: Relaxed thresholds if strict produced <10 results
  if (!videos || videos.length < 10) {
    const relaxed = await fetchViralFromDB(
      VIRAL_THRESHOLDS.RELAXED_MIN_VIEWS,
      VIRAL_THRESHOLDS.RELAXED_MIN_LIKES
    );
    if (relaxed && relaxed.length >= 10) {
      return NextResponse.json({ videos: relaxed, source: "live" });
    }
    // Use whatever we got (relaxed or original)
    if (relaxed && relaxed.length > (videos?.length ?? 0)) {
      videos = relaxed;
    }
  }

  // Step 3: If we have some DB data but not enough, supplement with high-surprise fallback
  if (videos && videos.length > 0) {
    // Try fetching high-surprise videos (small accounts, big engagement)
    if (videos.length < 10) {
      const risingVideos = await fetchViralFromDB(100_000, 10_000);
      if (risingVideos) {
        const risingFiltered = risingVideos
          .filter((v) => v.surpriseFactor >= 2.0 && !videos!.some((ev) => ev.id === v.id))
          .slice(0, 10 - videos.length);
        videos = [...videos, ...risingFiltered];
      }
    }
    return NextResponse.json({ videos, source: "live" });
  }

  // Step 4: Fallback to generated mock data (already produces 500K+ views)
  const { videos: mockVideos } = generateVideos({
    limit: 60,
    sortBy: "viralScore",
    order: "desc",
  });

  const filteredMock = mockVideos
    .filter((v) => v.views >= VIRAL_THRESHOLDS.MIN_VIEWS && v.likes >= VIRAL_THRESHOLDS.MIN_LIKES)
    .slice(0, 30);

  return NextResponse.json({
    videos: filteredMock.map((v) => ({
      id: v.id,
      creator: v.creator,
      description: v.description.substring(0, 100),
      thumbnailUrl: v.thumbnailUrl,
      tiktokUrl: v.tiktokUrl,
      views: v.views,
      likes: v.likes,
      comments: v.comments,
      shares: v.shares,
      followerCount: v.followerCount,
      engagementRate: v.engagementRate,
      viralScore: v.viralScore,
      surpriseFactor: v.surpriseFactor,
      engagementVelocity: v.engagementVelocity,
      discoveryScore: v.discoveryScore,
      tier: v.tier,
      format: v.format,
      category: v.category,
      hashtags: v.hashtags,
      publishedAt: v.publishedAt,
    })),
    source: "generated",
  });
}
