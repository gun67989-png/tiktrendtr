import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";

export const dynamic = "force-dynamic";

interface Hook {
  id: number;
  title: string;
  script: string;
  niche: string;
  viralScore: number;
  usageCount: number;
  example: string;
  source: "trending" | "curated" | "generated";
}

// Curated base hooks (proven templates) - these are always available
const CURATED_HOOKS: Hook[] = [
  { id: 1, title: "Shock Reveal", script: "Bunu deneyene kadar inanmıyordum...", niche: "Kozmetik", viralScore: 0, usageCount: 0, example: "Makyaj öncesi-sonrası", source: "curated" },
  { id: 2, title: "POV Hook", script: "POV: İlk defa [ürün] deniyorsun ve...", niche: "Kozmetik", viralScore: 0, usageCount: 0, example: "Ürün deneyimi", source: "curated" },
  { id: 3, title: "Karşılaştırma", script: "Sol taraf 50 TL, sağ taraf 500 TL. Farkı görebiliyor musun?", niche: "Moda", viralScore: 0, usageCount: 0, example: "Ucuz vs pahalı", source: "curated" },
  { id: 4, title: "Soru Hook", script: "Telefonunu böyle kullanıyorsan yanlış yapıyorsun", niche: "Teknoloji", viralScore: 0, usageCount: 0, example: "Telefon ipuçları", source: "curated" },
  { id: 5, title: "Liste Hook", script: "Bu 3 uygulama hayatını değiştirecek", niche: "Teknoloji", viralScore: 0, usageCount: 0, example: "Uygulama önerileri", source: "curated" },
  { id: 6, title: "Story Hook", script: "Dün müşterimle yaşadığım şeyi anlatmam lazım...", niche: "Finans", viralScore: 0, usageCount: 0, example: "Müşteri hikayesi", source: "curated" },
  { id: 7, title: "Yemek Reveal", script: "Bu tarifi 1M kişi denedi ama kimse [X] eklemeyi düşünmedi", niche: "Yemek", viralScore: 0, usageCount: 0, example: "Tarif videosu", source: "curated" },
  { id: 8, title: "Transformation", script: "30 günde nasıl [X] kg verdim? İşte plan:", niche: "Fitness", viralScore: 0, usageCount: 0, example: "Dönüşüm hikayesi", source: "curated" },
  { id: 9, title: "Eğitim Hook", script: "Okulda öğretmedikleri ama bilmen gereken tek şey:", niche: "Eğitim", viralScore: 0, usageCount: 0, example: "Bilgi videosu", source: "curated" },
  { id: 10, title: "Challenge", script: "Bu trendi denemeden geçme! İşte nasıl:", niche: "Moda", viralScore: 0, usageCount: 0, example: "Trend challenge", source: "curated" },
  { id: 11, title: "Seyahat Reveal", script: "Türkiye'de kimsenin bilmediği bu yer...", niche: "Seyahat", viralScore: 0, usageCount: 0, example: "Gizli mekan keşfi", source: "curated" },
  { id: 12, title: "Oyun İpucu", script: "Bu ayarı açmazsan hep kaybedersin", niche: "Oyun", viralScore: 0, usageCount: 0, example: "Oyun ipucu", source: "curated" },
  // --- 8 new diverse niche hooks ---
  { id: 13, title: "Finans Uyarısı", script: "Maaşını böyle harcıyorsan 5 yıl sonra pişman olacaksın", niche: "Finans", viralScore: 0, usageCount: 0, example: "Bütçe yönetimi", source: "curated" },
  { id: 14, title: "Sağlık Gerçeği", script: "Doktorlar bunu söylemiyor ama her gün yaptığın bu alışkanlık...", niche: "Sağlık", viralScore: 0, usageCount: 0, example: "Sağlık ipucu", source: "curated" },
  { id: 15, title: "Oyun Rankı", script: "Bronzdan Elmas'a çıkmamın tek sebebi bu strateji", niche: "Oyun", viralScore: 0, usageCount: 0, example: "Rank atlama", source: "curated" },
  { id: 16, title: "Dans Challenge", script: "Bu koreografiyi herkes yanlış yapıyor, doğrusu böyle:", niche: "Dans", viralScore: 0, usageCount: 0, example: "Dans öğretici", source: "curated" },
  { id: 17, title: "Vlog Giriş", script: "Bugün benimle bir gün geçirsen neler yaşarsın biliyor musun?", niche: "Vlog", viralScore: 0, usageCount: 0, example: "Günlük vlog", source: "curated" },
  { id: 18, title: "Yatırım Sırrı", script: "1000 TL ile başladım, 6 ayda olan şeye inanamayacaksın", niche: "Finans", viralScore: 0, usageCount: 0, example: "Yatırım hikayesi", source: "curated" },
  { id: 19, title: "Sağlıklı Yaşam", script: "Bu 5 dakikalık rutini sabahlarına ekle, farkı 1 haftada gör", niche: "Sağlık", viralScore: 0, usageCount: 0, example: "Sabah rutini", source: "curated" },
  { id: 20, title: "Vlog Kapanış", script: "Bu anı yakalayacağımı hiç düşünmemiştim...", niche: "Vlog", viralScore: 0, usageCount: 0, example: "Spontan vlog anı", source: "curated" },
];

// Category to niche mapping
const CATEGORY_NICHE_MAP: Record<string, string> = {
  "Yemek": "Yemek",
  "Komedi": "Kozmetik",
  "Moda": "Moda",
  "Güzellik": "Kozmetik",
  "Teknoloji": "Teknoloji",
  "Eğitim": "Eğitim",
  "Spor": "Fitness",
  "Seyahat": "Seyahat",
  "Oyun": "Oyun",
  "Müzik": "Kozmetik",
  "Dans": "Dans",
  "Vlog": "Vlog",
  "Finans": "Finans",
  "Sağlık": "Sağlık",
};

// Niche-specific hook templates for AI generation
const NICHE_HOOK_TEMPLATES: Record<string, string[]> = {
  hashtag: [
    "#{hashtag} trendinde öne çıkmak istiyorsan bunları yapmalısın",
    "#{hashtag} akımını herkes yapıyor ama doğrusu böyle",
    "#{hashtag} ile viral olmak isteyenlere 3 altın kural",
  ],
  format: [
    "Bu {format} formatını denemediysen yarışta geride kalıyorsun",
    "{format} formatında en çok izlenen videoların ortak sırrı",
    "{format} ile içerik üretmenin en etkili yolu budur",
  ],
};

async function fetchHooks(): Promise<{ hooks: Hook[]; source: "live" | "curated" }> {
  if (!isSupabaseConfigured || !supabase) {
    return { hooks: CURATED_HOOKS, source: "curated" };
  }

  try {
    // Fetch top viral videos from last 7 days to extract hook patterns
    const { data: videos, error } = await supabase
      .from("trending_videos")
      .select("caption, category, hashtags, view_count, like_count, comment_count, share_count")
      .gte("view_count", 100000)
      .order("view_count", { ascending: false })
      .limit(100);

    if (error || !videos || videos.length === 0) {
      return { hooks: CURATED_HOOKS, source: "curated" };
    }

    // Enrich curated hooks with real engagement data from matching categories
    const categoryStats: Record<string, { totalViews: number; totalLikes: number; totalComments: number; totalShares: number; count: number; avgEngagement: number }> = {};

    for (const v of videos) {
      const cat = v.category || "Genel";
      if (!categoryStats[cat]) {
        categoryStats[cat] = { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, count: 0, avgEngagement: 0 };
      }
      categoryStats[cat].totalViews += v.view_count || 0;
      categoryStats[cat].totalLikes += v.like_count || 0;
      categoryStats[cat].totalComments += v.comment_count || 0;
      categoryStats[cat].totalShares += v.share_count || 0;
      categoryStats[cat].count += 1;
    }

    // Calculate avg engagement per category
    for (const cat of Object.keys(categoryStats)) {
      const s = categoryStats[cat];
      const totalInteractions = s.totalLikes + s.totalComments + s.totalShares;
      s.avgEngagement = s.totalViews > 0
        ? Math.round((totalInteractions / s.totalViews) * 10000) / 100
        : 0;
    }

    // Enrich curated hooks with real metrics (never random)
    const enrichedHooks: Hook[] = CURATED_HOOKS.map((hook) => {
      const matchingCat = Object.entries(CATEGORY_NICHE_MAP).find(([, niche]) => niche === hook.niche)?.[0];
      const stats = matchingCat ? categoryStats[matchingCat] : null;

      return {
        ...hook,
        viralScore: stats ? Math.round(Math.min(10, stats.avgEngagement * 1.5) * 10) / 10 : 0,
        usageCount: stats ? stats.count * 100 : 0,
      };
    });

    // Extract hooks from actual viral video captions (improved first-sentence extraction)
    const trendingHooks: Hook[] = [];
    let hookId = 200;
    const seenPatterns = new Set<string>();

    for (const v of videos.slice(0, 50)) {
      const caption = (v.caption || "").trim();
      if (!caption || caption.length < 15) continue;

      // Improved first-sentence extraction: split by punctuation and newlines
      const sentences = caption.split(/[.!?\n]+/).map((s: string) => s.trim()).filter(Boolean);
      const firstSentence = sentences[0] || "";

      // Filter out very short, very long, or generic captions
      if (firstSentence.length < 15 || firstSentence.length > 120) continue;

      // Skip captions that are just hashtags or mentions
      if (/^[#@\s]+$/.test(firstSentence)) continue;
      // Skip if more than half the words are hashtags
      const words = firstSentence.split(/\s+/);
      const hashtagWords = words.filter((w: string) => w.startsWith("#"));
      if (hashtagWords.length > words.length / 2) continue;

      // Avoid duplicates using normalized prefix
      const normalized = firstSentence.toLowerCase().replace(/[^a-zçğıöşü0-9\s]/g, "").slice(0, 40);
      if (seenPatterns.has(normalized)) continue;
      seenPatterns.add(normalized);

      const views = v.view_count || 0;
      const likes = v.like_count || 0;
      const comments = v.comment_count || 0;
      const shares = v.share_count || 0;
      const engRate = views > 0 ? ((likes + comments + shares) / views) * 100 : 0;
      const niche = CATEGORY_NICHE_MAP[v.category || ""] || "Kozmetik";

      trendingHooks.push({
        id: hookId++,
        title: `Trend: ${niche}`,
        script: firstSentence,
        niche,
        viralScore: Math.round(Math.min(10, engRate * 1.2) * 10) / 10,
        usageCount: Math.round(views / 1000),
        example: `${(views / 1000000).toFixed(1)}M görüntülenme`,
        source: "trending",
      });

      if (trendingHooks.length >= 15) break;
    }

    // --- Generate niche-specific hooks from trending data ---
    const generatedHooks: Hook[] = [];
    let genId = 500;

    // Extract top hashtags from videos
    const hashtagCounts: Record<string, { count: number; totalViews: number; totalLikes: number; totalComments: number; totalShares: number }> = {};
    for (const v of videos) {
      const tags: string[] = Array.isArray(v.hashtags)
        ? v.hashtags
        : typeof v.hashtags === "string"
          ? v.hashtags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [];
      for (const tag of tags) {
        const clean = tag.replace(/^#/, "").trim().toLowerCase();
        if (!clean || clean.length < 2) continue;
        if (!hashtagCounts[clean]) {
          hashtagCounts[clean] = { count: 0, totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0 };
        }
        hashtagCounts[clean].count++;
        hashtagCounts[clean].totalViews += v.view_count || 0;
        hashtagCounts[clean].totalLikes += v.like_count || 0;
        hashtagCounts[clean].totalComments += v.comment_count || 0;
        hashtagCounts[clean].totalShares += v.share_count || 0;
      }
    }

    // Get top 5 hashtags by count
    const topHashtags = Object.entries(hashtagCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5);

    for (const [hashtag, stats] of topHashtags) {
      const templates = NICHE_HOOK_TEMPLATES.hashtag;
      const template = templates[genId % templates.length];
      const engRate = stats.totalViews > 0
        ? ((stats.totalLikes + stats.totalComments + stats.totalShares) / stats.totalViews) * 100
        : 0;

      generatedHooks.push({
        id: genId++,
        title: `AI: #${hashtag}`,
        script: template.replace("{hashtag}", hashtag),
        niche: "Genel",
        viralScore: Math.round(Math.min(10, engRate * 1.5) * 10) / 10,
        usageCount: stats.count,
        example: `${stats.count} videoda kullanıldı`,
        source: "generated",
      });
    }

    // Generate format-based hooks from top categories
    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3);

    for (const [category, stats] of topCategories) {
      const templates = NICHE_HOOK_TEMPLATES.format;
      const template = templates[genId % templates.length];

      generatedHooks.push({
        id: genId++,
        title: `AI: ${category} Format`,
        script: template.replace("{format}", category),
        niche: CATEGORY_NICHE_MAP[category] || category,
        viralScore: Math.round(Math.min(10, stats.avgEngagement * 1.5) * 10) / 10,
        usageCount: stats.count * 50,
        example: `${category} kategorisinden üretildi`,
        source: "generated",
      });
    }

    const allHooks = [...enrichedHooks, ...trendingHooks, ...generatedHooks].sort((a, b) => b.viralScore - a.viralScore);
    return { hooks: allHooks, source: "live" };
  } catch {
    return { hooks: CURATED_HOOKS, source: "curated" };
  }
}

export async function GET() {
  const key = cacheKey("hooks:library", {});
  const result = await cached(key, fetchHooks, 1800); // 30 min cache
  return NextResponse.json(result);
}
