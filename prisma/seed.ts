import Database from "better-sqlite3";
import path from "path";
import { randomUUID } from "crypto";

const dbPath = path.resolve(__dirname, "dev.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Sound (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    creator TEXT NOT NULL,
    usageCount INTEGER DEFAULT 0,
    growthRate REAL DEFAULT 0,
    bpm INTEGER DEFAULT 0,
    duration TEXT,
    genre TEXT,
    viralScore REAL DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS Hashtag (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    totalUses INTEGER DEFAULT 0,
    weeklyGrowth REAL DEFAULT 0,
    category TEXT,
    viralScore REAL DEFAULT 0,
    isEmerging INTEGER DEFAULT 0,
    trend TEXT DEFAULT '[]',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS Video (
    id TEXT PRIMARY KEY,
    tiktokId TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    creator TEXT NOT NULL,
    creatorAvatar TEXT,
    thumbnailUrl TEXT NOT NULL,
    videoUrl TEXT NOT NULL,
    tiktokUrl TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagementRate REAL DEFAULT 0,
    viralScore REAL DEFAULT 0,
    duration INTEGER DEFAULT 0,
    format TEXT,
    category TEXT,
    soundId TEXT REFERENCES Sound(id),
    publishedAt TEXT DEFAULT (datetime('now')),
    collectedAt TEXT DEFAULT (datetime('now')),
    createdAt TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS VideoHashtag (
    videoId TEXT NOT NULL REFERENCES Video(id) ON DELETE CASCADE,
    hashtagId TEXT NOT NULL REFERENCES Hashtag(id) ON DELETE CASCADE,
    PRIMARY KEY (videoId, hashtagId)
  );
  CREATE INDEX IF NOT EXISTS idx_video_viralScore ON Video(viralScore);
  CREATE INDEX IF NOT EXISTS idx_video_views ON Video(views);
  CREATE INDEX IF NOT EXISTS idx_video_publishedAt ON Video(publishedAt);
  CREATE INDEX IF NOT EXISTS idx_video_category ON Video(category);
  CREATE INDEX IF NOT EXISTS idx_hashtag_viralScore ON Hashtag(viralScore);
  CREATE INDEX IF NOT EXISTS idx_sound_viralScore ON Sound(viralScore);
`);

const SOUNDS = [
  { name: "Original Sound - Turkish Remix", creator: "djturk_official", genre: "Pop", bpm: 128, duration: "30s" },
  { name: "Anlatamam", creator: "tarkan", genre: "Pop", bpm: 120, duration: "45s" },
  { name: "Ela Gözlüm", creator: "emircan_igan", genre: "Arabesk", bpm: 95, duration: "30s" },
  { name: "Bi Tek Ben Anlarım", creator: "murat_boz", genre: "Pop", bpm: 115, duration: "60s" },
  { name: "Street Food Beat", creator: "beatmaker_ist", genre: "Hip-Hop", bpm: 140, duration: "15s" },
  { name: "Komedi Sound Effect", creator: "soundfx_tr", genre: "Efekt", bpm: 0, duration: "15s" },
  { name: "Istanbul Nights", creator: "dj_deep_tr", genre: "Elektronik", bpm: 132, duration: "30s" },
  { name: "Turkish Drill Beat", creator: "drill_ankara", genre: "Drill", bpm: 145, duration: "30s" },
  { name: "Romantik Piano", creator: "pianotr", genre: "Klasik", bpm: 75, duration: "60s" },
  { name: "Motivasyon Konuşması", creator: "motivasyon_tr", genre: "Konuşma", bpm: 0, duration: "45s" },
  { name: "Halay Remix 2024", creator: "halay_king", genre: "Folk", bpm: 130, duration: "30s" },
  { name: "Gece Gündüz", creator: "edis", genre: "Pop", bpm: 118, duration: "45s" },
  { name: "Turkish Trap Mix", creator: "trap_istanbul", genre: "Trap", bpm: 150, duration: "30s" },
  { name: "Anadolu Rock", creator: "rocktr", genre: "Rock", bpm: 135, duration: "30s" },
  { name: "Slow Turkish", creator: "slowmusic_tr", genre: "Slow", bpm: 80, duration: "60s" },
  { name: "Zeybek Modern", creator: "folkmodern", genre: "Folk", bpm: 90, duration: "45s" },
  { name: "Gaming Hype", creator: "gamer_sounds", genre: "Elektronik", bpm: 160, duration: "15s" },
  { name: "Kahvaltı Vibes", creator: "morning_tr", genre: "Lo-fi", bpm: 85, duration: "30s" },
  { name: "Spor Motivasyon", creator: "gym_tr", genre: "EDM", bpm: 140, duration: "30s" },
  { name: "Nostalji 90lar", creator: "retro_tr", genre: "Retro", bpm: 110, duration: "45s" },
];

const HASHTAG_DATA = [
  { name: "#kesfet", category: "Genel", base: 15000000 },
  { name: "#türkiye", category: "Genel", base: 8500000 },
  { name: "#istanbul", category: "Seyahat", base: 6200000 },
  { name: "#yemektarifi", category: "Yemek", base: 4800000 },
  { name: "#komedi", category: "Komedi", base: 4200000 },
  { name: "#trend", category: "Genel", base: 3900000 },
  { name: "#günaydın", category: "Vlog", base: 3500000 },
  { name: "#dans", category: "Dans", base: 3200000 },
  { name: "#makyaj", category: "Güzellik", base: 2800000 },
  { name: "#futbol", category: "Spor", base: 2600000 },
  { name: "#ankara", category: "Seyahat", base: 2400000 },
  { name: "#eğitim", category: "Eğitim", base: 2100000 },
  { name: "#moda", category: "Moda", base: 1900000 },
  { name: "#müzik", category: "Müzik", base: 1800000 },
  { name: "#teknoloji", category: "Teknoloji", base: 1600000 },
  { name: "#kahvaltı", category: "Yemek", base: 1500000 },
  { name: "#workout", category: "Spor", base: 1400000 },
  { name: "#gaming", category: "Oyun", base: 1300000 },
  { name: "#cats", category: "Komedi", base: 1200000 },
  { name: "#diy", category: "Eğitim", base: 1100000 },
  { name: "#skincare", category: "Güzellik", base: 1050000 },
  { name: "#travel", category: "Seyahat", base: 980000 },
  { name: "#tatlıtarifi", category: "Yemek", base: 920000 },
  { name: "#motivation", category: "Vlog", base: 870000 },
  { name: "#streetfood", category: "Yemek", base: 830000 },
  { name: "#öğrenci", category: "Eğitim", base: 780000 },
  { name: "#antalya", category: "Seyahat", base: 750000 },
  { name: "#arabesk", category: "Müzik", base: 720000 },
  { name: "#ev", category: "Vlog", base: 680000 },
  { name: "#aşk", category: "Genel", base: 650000 },
  { name: "#köpek", category: "Komedi", base: 600000 },
  { name: "#türkmutfağı", category: "Yemek", base: 580000 },
  { name: "#galatasaray", category: "Spor", base: 550000 },
  { name: "#fenerbahçe", category: "Spor", base: 530000 },
  { name: "#beşiktaş", category: "Spor", base: 510000 },
  { name: "#izmir", category: "Seyahat", base: 490000 },
  { name: "#python", category: "Teknoloji", base: 460000 },
  { name: "#üniversite", category: "Eğitim", base: 440000 },
  { name: "#vintage", category: "Moda", base: 420000 },
  { name: "#karadeniz", category: "Seyahat", base: 400000 },
];

const CREATORS = [
  "yemek_masters", "komedi_krali", "istanbul_gezgin", "moda_queen",
  "tech_ali", "vlog_ayse", "fitness_mert", "dans_zeynep",
  "guzellik_ela", "oyuncu_can", "chef_mehmet", "travel_deniz",
  "muzik_sena", "egitim_prof", "sokak_lezzet", "diy_usta",
  "spor_guru", "araba_fan", "kedi_anne", "motivasyon_kocu",
  "uni_hayat", "ankara_life", "izmir_vibes", "antalya_sun",
  "street_style", "skincare_nur", "rock_fan_tr", "retro_koleksiyoner",
  "drill_emre", "lofi_beats_tr", "halay_usta", "piano_dersi",
];

const FORMATS = ["Storytime", "POV", "Tutorial", "Önce/Sonra", "GRWM", "Mukbang", "Reaction", "Street Interview", "Before/After", "Duet"];
const CATEGORIES = ["Yemek", "Komedi", "Seyahat", "Moda", "Teknoloji", "Vlog", "Eğitim", "Spor", "Müzik", "Dans", "Güzellik", "Oyun"];

const VIDEO_DESCRIPTIONS = [
  "Bu tarifi denemeden geçmeyin! 🍳", "Bunu beklemiyordunuz 😂",
  "İstanbul'un gizli köşeleri 🌉", "Bugünkü kombin nasıl olmuş? 👗",
  "Bu özelliği biliyor muydunuz? 📱", "Bir günüm vlog 📹",
  "Bu egzersizi her gün yapın 💪", "Dans challenge kabul! 💃",
  "Cilt bakım rutinim ✨", "Yeni oyun inceleme 🎮",
  "Babaannemin tarifiyle yapıyoruz 👵", "Türkiye'nin en güzel yeri 🏔️",
  "Bu şarkıyı duydunuz mu? 🎵", "5 dakikada öğrenin 📚",
  "Sokak lezzetleri turu 🌯", "Evde kendin yap projesi 🔨",
  "Antrenman rutini #fitness 🏋️", "Kedim bugün çok tatlı 🐱",
  "Sabah motivasyon konuşması 🌅", "Üniversite hayatı gerçekleri 🎓",
  "POV: Türk annesi sabah 6da 😅", "Tutorial: Fotoğraf düzenleme 📸",
  "Sokak röportajı: Gençlere sorduk 🎤", "GRWM: İş yerinde ilk gün 💼",
  "Önce/Sonra: Ev dekorasyonu 🏠", "3 malzemeyle harika tatlı 🍰",
];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

console.log("Seeding database...");

db.exec("DELETE FROM VideoHashtag");
db.exec("DELETE FROM Video");
db.exec("DELETE FROM Hashtag");
db.exec("DELETE FROM Sound");

const insertSound = db.prepare(`INSERT INTO Sound (id, name, creator, usageCount, growthRate, bpm, duration, genre, viralScore, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);
const soundIds: string[] = [];
for (const s of SOUNDS) {
  const id = randomUUID();
  insertSound.run(id, s.name, s.creator, rand(10000, 500000), Math.round((Math.random() * 200 - 30) * 10) / 10, s.bpm, s.duration, s.genre, Math.round((Math.random() * 60 + 30) * 100) / 100);
  soundIds.push(id);
}
console.log(`Created ${soundIds.length} sounds`);

const insertHashtag = db.prepare(`INSERT INTO Hashtag (id, name, totalUses, weeklyGrowth, category, viralScore, isEmerging, trend, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);
const hashtagIds: string[] = [];
for (const h of HASHTAG_DATA) {
  const id = randomUUID();
  const wg = Math.round((Math.random() * 180 - 20) * 10) / 10;
  const trend = JSON.stringify(Array.from({ length: 7 }, () => Math.round(h.base * (0.8 + Math.random() * 0.4) / 10000)));
  insertHashtag.run(id, h.name, h.base + rand(0, 500000), wg, h.category, Math.round((Math.random() * 60 + 30) * 100) / 100, wg > 80 ? 1 : 0, trend);
  hashtagIds.push(id);
}
console.log(`Created ${hashtagIds.length} hashtags`);

const insertVideo = db.prepare(`INSERT INTO Video (id, tiktokId, description, creator, creatorAvatar, thumbnailUrl, videoUrl, tiktokUrl, views, likes, comments, shares, engagementRate, viralScore, duration, format, category, soundId, publishedAt, collectedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`);
const insertVH = db.prepare("INSERT INTO VideoHashtag (videoId, hashtagId) VALUES (?, ?)");

const seedVideos = db.transaction(() => {
  for (let i = 0; i < 60; i++) {
    const id = randomUUID();
    const views = rand(10000, 5000000);
    const likes = rand(Math.floor(views * 0.02), Math.floor(views * 0.15));
    const comments = rand(Math.floor(likes * 0.01), Math.floor(likes * 0.1));
    const shares = rand(Math.floor(likes * 0.005), Math.floor(likes * 0.05));
    const engRate = views > 0 ? Math.round(((likes + comments + shares) / views) * 10000) / 100 : 0;
    const viralScore = Math.round((Math.random() * 60 + 30) * 100) / 100;
    const creator = pick(CREATORS);
    const tiktokId = `tt_${Date.now()}_${rand(10000, 99999)}`;
    const daysAgo = rand(0, 14);
    const publishedAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const tiktokUrl = `https://www.tiktok.com/@${creator}/video/${tiktokId}`;
    const thumbnailUrl = `https://picsum.photos/seed/${tiktokId}/400/720`;

    insertVideo.run(id, tiktokId, pick(VIDEO_DESCRIPTIONS), creator, null, thumbnailUrl, tiktokUrl, tiktokUrl, views, likes, comments, shares, engRate, viralScore, rand(10, 180), pick(FORMATS), pick(CATEGORIES), pick(soundIds), publishedAt);

    const shuffled = [...hashtagIds].sort(() => Math.random() - 0.5);
    for (let j = 0; j < rand(2, 4); j++) insertVH.run(id, shuffled[j]);
  }
});
seedVideos();
console.log("Created 60 videos");
console.log("Seeding complete!");
db.close();
