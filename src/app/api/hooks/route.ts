import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Hook pattern types
const HOOK_PATTERNS: Record<string, { label: string; keywords: string[]; description: string }> = {
  question: {
    label: "Soru",
    keywords: ["nasıl", "nasil", "neden", "niye", "ne zaman", "kim", "hangi", "kaç", "kac", "mi?", "mı?", "mu?", "mü?", "biliyormusun", "biliyor musun", "hiç", "hic"],
    description: "Izleyiciye dogrudan soru sorarak merak uyandirma",
  },
  shock: {
    label: "Sok Edici",
    keywords: ["inanamayacaksiniz", "inanamadim", "sok", "şok", "olamaz", "imkansiz", "imkansız", "deli", "cildirdim", "çıldırdım", "absürt", "absurt", "skandal"],
    description: "Sok edici bir ifade ile dikkat cekme",
  },
  story: {
    label: "Hikaye",
    keywords: ["storytime", "hikaye", "başıma", "basima", "bana olan", "yasadigim", "yaşadığım", "geçen gün", "gecen gun", "dün", "dun", "bugün", "bugun"],
    description: "Kisisel bir hikaye ile baslayarak baglanma",
  },
  tutorial: {
    label: "Ogretici",
    keywords: ["nasıl yapılır", "nasil yapilir", "adim adim", "adım adım", "öğret", "ogret", "ipucu", "tüyo", "tuyo", "sır", "sir", "yöntem", "yontem", "trick", "hack"],
    description: "Bir seyler ogretme vaadi ile ilgi cekme",
  },
  list: {
    label: "Liste",
    keywords: ["top 5", "top 10", "en iyi", "en kötü", "en kotu", "3 neden", "5 yol", "sıralama", "siralama", "liste"],
    description: "Numarali liste ile icerik yapisi belirtme",
  },
  challenge: {
    label: "Meydan Okuma",
    keywords: ["challenge", "meydan", "cesaret", "yapabilir misin", "denedim", "dene", "test", "deney"],
    description: "Meydan okuma veya deneme ile katilim saglama",
  },
  urgency: {
    label: "Aciliyet",
    keywords: ["hemen", "acil", "son", "kaçırma", "kacirma", "sınırlı", "sinirli", "bugün son", "bugun son", "sakın", "sakin", "dikkat"],
    description: "Aciliyet hissi yaratarak hemen izlemeye tesvik",
  },
  emotional: {
    label: "Duygusal",
    keywords: ["ağladım", "agladim", "duygulandim", "mutlu", "üzgün", "uzgun", "korkunc", "korkunç", "hayal", "rüya", "ruya", "umut"],
    description: "Duygusal bir ifade ile empati kurma",
  },
};

function extractHook(caption: string): string {
  if (!caption || caption.trim().length === 0) return "";

  // Clean caption: remove hashtags at the end
  let clean = caption.replace(/#[\w\u00C0-\u024F]+/g, "").trim();

  // Get first sentence
  const sentenceEnd = clean.search(/[.!?]\s|[.!?]$/);
  if (sentenceEnd > 0 && sentenceEnd < 100) {
    clean = clean.substring(0, sentenceEnd + 1);
  } else if (clean.length > 80) {
    // Take first 80 chars and cut at last space
    const cutAt = clean.lastIndexOf(" ", 80);
    clean = clean.substring(0, cutAt > 20 ? cutAt : 80) + "...";
  }

  return clean.trim();
}

function detectHookPatterns(hook: string): string[] {
  const text = hook.toLowerCase();
  const detected: string[] = [];

  for (const [key, pattern] of Object.entries(HOOK_PATTERNS)) {
    for (const kw of pattern.keywords) {
      if (text.includes(kw)) {
        detected.push(key);
        break;
      }
    }
  }

  return detected;
}

function calculateHookScore(
  views: number,
  likes: number,
  comments: number,
  shares: number,
  hook: string
): number {
  if (!hook || hook.length < 5) return 0;

  // Base score from engagement
  const engRate = views > 0 ? ((likes + comments + shares) / views) * 100 : 0;
  let score = Math.min(40, engRate * 4);

  // Hook length bonus (20-60 chars is ideal)
  const len = hook.length;
  if (len >= 20 && len <= 60) score += 15;
  else if (len >= 10 && len <= 80) score += 8;

  // Pattern bonus
  const patterns = detectHookPatterns(hook);
  score += Math.min(25, patterns.length * 12);

  // Question mark bonus
  if (hook.includes("?")) score += 10;

  // Emoji presence (simple heuristic - non-ASCII non-Turkish chars)
  const emojiCount = (hook.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []).length;
  if (emojiCount > 0 && emojiCount <= 3) score += 5;

  // View-based quality signal
  if (views >= 1_000_000) score += 10;
  else if (views >= 500_000) score += 7;
  else if (views >= 100_000) score += 4;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  try {
    let hooks: Array<{
      hook: string;
      hookScore: number;
      patterns: string[];
      videoId: string;
      creator: string;
      views: number;
      likes: number;
      comments: number;
      shares: number;
      engagementRate: number;
      format: string;
      category: string;
      thumbnailUrl: string;
      tiktokUrl: string;
    }> = [];

    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from("trending_videos")
        .select("*")
        .order("view_count", { ascending: false })
        .limit(200);

      if (category && category !== "Tümü") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (!error && data) {
        for (const v of data as Record<string, unknown>[]) {
          const caption = (v.caption as string) || "";
          const hook = extractHook(caption);
          if (hook.length < 5) continue;

          const views = (v.view_count as number) || 0;
          const likes = (v.like_count as number) || 0;
          const comments = (v.comment_count as number) || 0;
          const shares = (v.share_count as number) || 0;
          const engRate = views > 0
            ? Math.round(((likes + comments + shares) / views) * 10000) / 100
            : 0;

          hooks.push({
            hook,
            hookScore: calculateHookScore(views, likes, comments, shares, hook),
            patterns: detectHookPatterns(hook),
            videoId: v.video_id as string,
            creator: (v.creator_username as string) || "",
            views,
            likes,
            comments,
            shares,
            engagementRate: engRate,
            format: (v.format as string) || "Kısa Video",
            category: (v.category as string) || "Vlog",
            thumbnailUrl: (v.thumbnail_url as string) || "",
            tiktokUrl: (v.tiktok_url as string) || "",
          });
        }
      }
    }

    // Sort by hook score
    hooks.sort((a, b) => b.hookScore - a.hookScore);
    hooks = hooks.slice(0, limit);

    // Pattern analysis
    const patternStats: Record<string, { count: number; avgScore: number; totalScore: number; avgViews: number; totalViews: number }> = {};

    for (const h of hooks) {
      for (const p of h.patterns) {
        if (!patternStats[p]) {
          patternStats[p] = { count: 0, avgScore: 0, totalScore: 0, avgViews: 0, totalViews: 0 };
        }
        patternStats[p].count++;
        patternStats[p].totalScore += h.hookScore;
        patternStats[p].totalViews += h.views;
      }
    }

    const patternAnalysis = Object.entries(patternStats)
      .map(([key, stats]) => ({
        pattern: key,
        label: HOOK_PATTERNS[key]?.label || key,
        description: HOOK_PATTERNS[key]?.description || "",
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count),
        avgViews: Math.round(stats.totalViews / stats.count),
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    // Overall stats
    const avgHookScore = hooks.length > 0
      ? Math.round(hooks.reduce((s, h) => s + h.hookScore, 0) / hooks.length)
      : 0;

    return NextResponse.json({
      hooks,
      patternAnalysis,
      stats: {
        totalAnalyzed: hooks.length,
        avgHookScore,
        topPattern: patternAnalysis[0]?.label || "Bilinmiyor",
      },
      patterns: Object.fromEntries(
        Object.entries(HOOK_PATTERNS).map(([k, v]) => [k, { label: v.label, description: v.description }])
      ),
    });
  } catch (e) {
    console.error("[HOOKS] Error:", e);
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
