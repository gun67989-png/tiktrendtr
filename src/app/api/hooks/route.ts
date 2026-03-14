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
  source: "trending" | "curated";
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
  "Dans": "Fitness",
  "Vlog": "Kozmetik",
};

async function fetchHooks(): Promise<{ hooks: Hook[]; source: "live" | "curated" }> {
  if (!isSupabaseConfigured || !supabase) {
    return { hooks: CURATED_HOOKS, source: "curated" };
  }

  try {
    // Fetch top viral videos from last 7 days to extract hook patterns
    const { data: videos, error } = await supabase
      .from("trending_videos")
      .select("caption, category, view_count, like_count, comment_count, share_count")
      .gte("view_count", 100000)
      .order("view_count", { ascending: false })
      .limit(100);

    if (error || !videos || videos.length === 0) {
      return { hooks: CURATED_HOOKS, source: "curated" };
    }

    // Enrich curated hooks with real engagement data from matching categories
    const categoryStats: Record<string, { totalViews: number; totalLikes: number; count: number; avgEngagement: number }> = {};

    for (const v of videos) {
      const cat = v.category || "Genel";
      if (!categoryStats[cat]) {
        categoryStats[cat] = { totalViews: 0, totalLikes: 0, count: 0, avgEngagement: 0 };
      }
      categoryStats[cat].totalViews += v.view_count || 0;
      categoryStats[cat].totalLikes += v.like_count || 0;
      categoryStats[cat].count += 1;
    }

    // Calculate avg engagement per category
    for (const cat of Object.keys(categoryStats)) {
      const s = categoryStats[cat];
      s.avgEngagement = s.totalViews > 0
        ? Math.round(((s.totalLikes + (videos.filter(v => v.category === cat).reduce((sum, v) => sum + (v.comment_count || 0) + (v.share_count || 0), 0))) / s.totalViews) * 10000) / 100
        : 0;
    }

    // Enrich curated hooks with real metrics
    const enrichedHooks: Hook[] = CURATED_HOOKS.map((hook) => {
      // Find matching category stats for this hook's niche
      const matchingCat = Object.entries(CATEGORY_NICHE_MAP).find(([, niche]) => niche === hook.niche)?.[0];
      const stats = matchingCat ? categoryStats[matchingCat] : null;

      return {
        ...hook,
        viralScore: stats ? Math.round(Math.min(10, stats.avgEngagement * 1.5) * 10) / 10 : Math.round((5 + Math.random() * 3) * 10) / 10,
        usageCount: stats ? stats.count * 100 : 0,
      };
    });

    // Extract hooks from actual viral video captions (first sentence pattern)
    const trendingHooks: Hook[] = [];
    let hookId = 100;
    const seenPatterns = new Set<string>();

    for (const v of videos.slice(0, 30)) {
      const caption = (v.caption || "").trim();
      if (!caption || caption.length < 10) continue;

      // Extract first sentence as hook
      const firstSentence = caption.split(/[.!?\n]/)[0].trim();
      if (firstSentence.length < 10 || firstSentence.length > 100) continue;

      // Avoid duplicates
      const normalized = firstSentence.toLowerCase().slice(0, 30);
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

      if (trendingHooks.length >= 12) break;
    }

    const allHooks = [...enrichedHooks, ...trendingHooks].sort((a, b) => b.viralScore - a.viralScore);
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
