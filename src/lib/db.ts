import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "prisma", "dev.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
  }
  return _db;
}

// Types
export interface VideoRow {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  creatorAvatar: string | null;
  thumbnailUrl: string;
  videoUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  viralScore: number;
  duration: number;
  format: string | null;
  category: string | null;
  soundId: string | null;
  publishedAt: string;
  collectedAt: string;
  createdAt: string;
}

export interface VideoWithDetails extends VideoRow {
  soundName: string | null;
  soundCreator: string | null;
  hashtags: string[];
}

export interface HashtagRow {
  id: string;
  name: string;
  totalUses: number;
  weeklyGrowth: number;
  category: string | null;
  viralScore: number;
  isEmerging: number;
  trend: string;
  createdAt: string;
  updatedAt: string;
}

export interface SoundRow {
  id: string;
  name: string;
  creator: string;
  usageCount: number;
  growthRate: number;
  bpm: number;
  duration: string | null;
  genre: string | null;
  viralScore: number;
  createdAt: string;
  updatedAt: string;
}

// Query helpers
export function getVideos(options: {
  limit?: number;
  offset?: number;
  category?: string;
  sortBy?: "viralScore" | "views" | "engagementRate" | "publishedAt";
  order?: "asc" | "desc";
} = {}): VideoWithDetails[] {
  const db = getDb();
  const {
    limit = 20,
    offset = 0,
    category,
    sortBy = "viralScore",
    order = "desc",
  } = options;

  const allowedSort = ["viralScore", "views", "engagementRate", "publishedAt"];
  const safeSort = allowedSort.includes(sortBy) ? sortBy : "viralScore";
  const safeOrder = order === "asc" ? "ASC" : "DESC";

  let query = `
    SELECT v.*, s.name as soundName, s.creator as soundCreator
    FROM Video v
    LEFT JOIN Sound s ON v.soundId = s.id
  `;
  const params: string[] = [];

  if (category) {
    query += ` WHERE v.category = ?`;
    params.push(category);
  }

  query += ` ORDER BY v.${safeSort} ${safeOrder} LIMIT ? OFFSET ?`;

  const videos = db.prepare(query).all(...params, limit, offset) as (VideoRow & { soundName: string | null; soundCreator: string | null })[];

  // Get hashtags for each video
  const hashtagStmt = db.prepare(`
    SELECT h.name FROM Hashtag h
    JOIN VideoHashtag vh ON vh.hashtagId = h.id
    WHERE vh.videoId = ?
  `);

  return videos.map((v) => ({
    ...v,
    hashtags: (hashtagStmt.all(v.id) as { name: string }[]).map((h) => h.name),
  }));
}

export function getVideoCount(category?: string): number {
  const db = getDb();
  if (category) {
    return (db.prepare("SELECT COUNT(*) as count FROM Video WHERE category = ?").get(category) as { count: number }).count;
  }
  return (db.prepare("SELECT COUNT(*) as count FROM Video").get() as { count: number }).count;
}

export function getVideoById(id: string): VideoWithDetails | null {
  const db = getDb();
  const video = db.prepare(`
    SELECT v.*, s.name as soundName, s.creator as soundCreator
    FROM Video v
    LEFT JOIN Sound s ON v.soundId = s.id
    WHERE v.id = ?
  `).get(id) as (VideoRow & { soundName: string | null; soundCreator: string | null }) | undefined;

  if (!video) return null;

  const hashtags = (db.prepare(`
    SELECT h.name FROM Hashtag h
    JOIN VideoHashtag vh ON vh.hashtagId = h.id
    WHERE vh.videoId = ?
  `).all(video.id) as { name: string }[]).map((h) => h.name);

  return { ...video, hashtags };
}
