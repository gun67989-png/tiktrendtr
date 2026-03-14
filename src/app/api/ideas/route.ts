import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cached, cacheKey } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// Map frontend niche IDs to DB categories
const NICHE_CATEGORY_MAP: Record<string, string[]> = {
  yemek: ["Yemek", "Food", "Cooking"],
  komedi: ["Komedi", "Comedy", "Entertainment"],
  seyahat: ["Seyahat", "Travel", "Vlog"],
  moda: ["Moda", "Fashion", "Güzellik", "Beauty"],
  eğitim: ["Eğitim", "Education", "Bilgi"],
  teknoloji: ["Teknoloji", "Technology", "Tech"],
  fitness: ["Fitness", "Spor", "Sport", "Health"],
  müzik: ["Müzik", "Music", "Dans", "Dance"],
  oyun: ["Oyun", "Gaming", "Game"],
};

// Content format templates per niche
const FORMAT_TEMPLATES: Record<string, Array<{ format: string; titleTemplate: string; hookTemplate: string }>> = {
  yemek: [
    { format: "Hızlı Tarif", titleTemplate: "30 Saniyede {hashtag} Tarifi", hookTemplate: "Bu tarifi denemeyen pişman olur..." },
    { format: "ASMR Yemek", titleTemplate: "{hashtag} ile ASMR Yemek Videosu", hookTemplate: "Bu sesleri duymadan geçme..." },
    { format: "Mutfak Hack", titleTemplate: "Kimsenin Bilmediği {hashtag} Hilesi", hookTemplate: "Bu hileyi öğrenince hayatınız değişecek..." },
    { format: "Before/After", titleTemplate: "{hashtag} Dönüşümü - Öncesi ve Sonrası", hookTemplate: "Bu dönüşüme inanamayacaksınız..." },
    { format: "Top 3 Liste", titleTemplate: "En İyi 3 {hashtag} Tarifi", hookTemplate: "3. sıradaki sizi çok şaşırtacak..." },
  ],
  komedi: [
    { format: "Skeç", titleTemplate: "{hashtag} Durumları - Skeç", hookTemplate: "Herkesin yaşadığı ama kimsenin konuşmadığı an..." },
    { format: "POV", titleTemplate: "POV: {hashtag} Anı", hookTemplate: "POV: Bu durumu herkes yaşamıştır..." },
    { format: "Günlük Komedi", titleTemplate: "{hashtag} ile Günlük Komedi", hookTemplate: "Bugün başıma geleni anlatayım..." },
    { format: "Dubbing", titleTemplate: "{hashtag} Dublaj Videosu", hookTemplate: "Bir de böyle düşünün..." },
    { format: "Reaction", titleTemplate: "{hashtag} Reaction - İlk Tepki", hookTemplate: "İlk defa görüyorum ve..." },
  ],
  seyahat: [
    { format: "Gizli Mekan", titleTemplate: "{hashtag} - Kimsenin Bilmediği Yer", hookTemplate: "Bu yeri Google Maps'te bulamazsınız..." },
    { format: "Bütçe Rehber", titleTemplate: "{hashtag} Bütçe Dostu Gezi Rehberi", hookTemplate: "Sadece 500 TL ile bir hafta sonu kaçamağı..." },
    { format: "Vlog", titleTemplate: "{hashtag} Günlük Vlog", hookTemplate: "Hayatımın en iyi günlerinden biri..." },
    { format: "Drone Çekim", titleTemplate: "{hashtag} Drone ile Keşfet", hookTemplate: "Yukarıdan bakınca her şey farklı..." },
    { format: "Karşılaştırma", titleTemplate: "{hashtag} vs. Alternatif - Hangisi Daha İyi?", hookTemplate: "Herkes birincisini biliyor ama ikincisi..." },
  ],
  moda: [
    { format: "OOTD", titleTemplate: "{hashtag} Günün Kombini", hookTemplate: "Bu kombini herkes soruyor..." },
    { format: "Get Ready", titleTemplate: "{hashtag} ile GRWM", hookTemplate: "Benimle hazırlanın..." },
    { format: "Uygun Fiyat", titleTemplate: "{hashtag} - Uygun Fiyat Alternatifleri", hookTemplate: "Lüks görünüm, bütçe dostu fiyat..." },
    { format: "Gardırop Düzen", titleTemplate: "{hashtag} Gardırop Düzenleme", hookTemplate: "Gardırobunuzda bu varsa şanslısınız..." },
    { format: "Trend Alert", titleTemplate: "{hashtag} Trend Uyarısı!", hookTemplate: "Bu trend çok hızlı yayılıyor..." },
  ],
  eğitim: [
    { format: "3 Bilgi", titleTemplate: "{hashtag} Hakkında 3 Şey", hookTemplate: "Bunları bilmiyorsanız öğrenme zamanı..." },
    { format: "Nasıl Yapılır", titleTemplate: "{hashtag} Nasıl Yapılır? - Adım Adım", hookTemplate: "Herkes soruyor, ben anlatıyorum..." },
    { format: "Mit vs Gerçek", titleTemplate: "{hashtag} - Doğru Bilinen Yanlışlar", hookTemplate: "Yıllardır yanlış biliyormuşuz..." },
    { format: "Günlük Bilgi", titleTemplate: "Günün Bilgisi: {hashtag}", hookTemplate: "Bunu kaç kişi biliyordu?" },
    { format: "Mini Ders", titleTemplate: "{hashtag} Mini Ders Serisi", hookTemplate: "60 saniyede öğreneceksiniz..." },
  ],
  teknoloji: [
    { format: "Unboxing", titleTemplate: "{hashtag} Kutu Açılımı ve İlk İzlenim", hookTemplate: "Beklediğimden çok farklı çıktı..." },
    { format: "İpucu", titleTemplate: "{hashtag} Gizli Özellik ve İpuçları", hookTemplate: "Bu özelliği kullananların %1'i biliyor..." },
    { format: "Karşılaştırma", titleTemplate: "{hashtag} vs. Rakip - Hangisini Almalı?", hookTemplate: "Paramı hangisine harcamalıyım..." },
    { format: "Setup Tour", titleTemplate: "{hashtag} Setup Turu", hookTemplate: "Masaüstü setupımı merak edenler için..." },
    { format: "Hack", titleTemplate: "{hashtag} Teknoloji Hilesi", hookTemplate: "Bu hileyi öğrenince telefonu farklı kullanacaksınız..." },
  ],
  fitness: [
    { format: "Egzersiz Rutini", titleTemplate: "{hashtag} Ev Egzersiz Rutini", hookTemplate: "7 günde fark göreceksiniz..." },
    { format: "Transformation", titleTemplate: "{hashtag} Dönüşüm Hikayesi", hookTemplate: "30 günde neler değişti bir bakın..." },
    { format: "Beslenme İpucu", titleTemplate: "{hashtag} Beslenme Rehberi", hookTemplate: "Bu besinleri tüketmeden spor yapmayın..." },
    { format: "Challenge", titleTemplate: "{hashtag} Fitness Challenge", hookTemplate: "Bu challenge'ı yapabilen var mı?" },
    { format: "Hatalar", titleTemplate: "{hashtag} En Sık Yapılan Hatalar", hookTemplate: "Herkesin yaptığı ama kimsenin fark etmediği hata..." },
  ],
  müzik: [
    { format: "Cover", titleTemplate: "{hashtag} Cover Performansı", hookTemplate: "Bu şarkıyı böyle duymadınız..." },
    { format: "Remix", titleTemplate: "{hashtag} Remix / Yeni Versiyon", hookTemplate: "Orijinalinden daha mı iyi?" },
    { format: "Reaction", titleTemplate: "{hashtag} İlk Tepki / Reaction", hookTemplate: "Bu şarkıyı ilk defa dinliyorum ve..." },
    { format: "Behind the Beat", titleTemplate: "{hashtag} Müzik Yapım Süreci", hookTemplate: "Bu beati nasıl yaptım adım adım..." },
    { format: "Dans Challenge", titleTemplate: "{hashtag} Dans Challenge", hookTemplate: "Bu koreografiyi öğrenmeniz lazım..." },
  ],
  oyun: [
    { format: "Epic Moment", titleTemplate: "{hashtag} En İyi Anlar", hookTemplate: "Bu an tarihe geçti..." },
    { format: "İpucu & Trick", titleTemplate: "{hashtag} Gizli Hileler ve İpuçları", hookTemplate: "Bu hileyi bilen çok az kişi var..." },
    { format: "Yeni Oyun", titleTemplate: "{hashtag} İlk Bakış - Değer mi?", hookTemplate: "Bu oyunu almalı mısınız? İşte cevap..." },
    { format: "Karşılaştırma", titleTemplate: "{hashtag} vs. Rakip - Hangisi Daha İyi?", hookTemplate: "Hangisi daha iyi tartışmasına son nokta..." },
    { format: "Fail/Win Derleme", titleTemplate: "{hashtag} Fail & Win Derlemesi", hookTemplate: "Bu anları görmeden geçmeyin..." },
  ],
};

// Fallback templates for unmapped niches
const DEFAULT_TEMPLATES = [
  { format: "Trend Video", titleTemplate: "{hashtag} ile Trend İçerik", hookTemplate: "Bu trendi kaçırmayın..." },
  { format: "Top 5", titleTemplate: "{hashtag} En İyi 5 Örnek", hookTemplate: "Son sıradaki sizi çok şaşırtacak..." },
  { format: "Behind the Scenes", titleTemplate: "{hashtag} Kamera Arkası", hookTemplate: "Kimsenin görmediği taraf..." },
  { format: "Derleme", titleTemplate: "{hashtag} En İyi Anlar Derlemesi", hookTemplate: "Bu anları bir araya getirdim..." },
  { format: "Story Time", titleTemplate: "{hashtag} ile Hikaye Zamanı", hookTemplate: "Size bir şey anlatmam lazım..." },
];

interface GeneratedIdea {
  title: string;
  format: string;
  hook: string;
  caption: string;
  hashtags: string[];
  sound: string;
  estimatedViews: string;
}

async function generateIdeasFromData(niche: string): Promise<GeneratedIdea[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const categories = NICHE_CATEGORY_MAP[niche] || [];

  // Fetch trending videos — prefer niche-matching but also get general trends
  let query = supabase
    .from("trending_videos")
    .select("hashtags, caption, sound_name, category, format, view_count, like_count, comment_count, share_count, duration")
    .order("view_count", { ascending: false })
    .limit(500);

  const { data: allVideos } = await query;
  if (!allVideos || allVideos.length === 0) return [];

  // Filter niche-relevant videos
  const nicheVideos = categories.length > 0
    ? allVideos.filter((v) => categories.some((c) => (v.category || "").toLowerCase() === c.toLowerCase()))
    : allVideos;

  const sourceVideos = nicheVideos.length >= 10 ? nicheVideos : allVideos;

  // Extract top hashtags (by frequency + total views)
  const hashtagStats = new Map<string, { count: number; views: number }>();
  for (const v of sourceVideos) {
    if (!v.hashtags || !Array.isArray(v.hashtags)) continue;
    for (const rawTag of v.hashtags) {
      const tag = rawTag.toLowerCase().replace(/^#/, "").trim();
      if (!tag || tag.length < 3 || tag === "fyp" || tag === "foryou" || tag === "viral" || tag === "keşfet" || tag === "tiktok") continue;
      const agg = hashtagStats.get(tag) || { count: 0, views: 0 };
      agg.count++;
      agg.views += v.view_count || 0;
      hashtagStats.set(tag, agg);
    }
  }

  const topHashtags = Array.from(hashtagStats.entries())
    .filter(([, s]) => s.count >= 2)
    .sort((a, b) => b[1].views - a[1].views)
    .slice(0, 20)
    .map(([tag]) => tag);

  // Extract top sounds
  const soundStats = new Map<string, { count: number; views: number }>();
  for (const v of sourceVideos) {
    if (!v.sound_name) continue;
    const sound = v.sound_name.trim();
    if (sound.length < 3) continue;
    const agg = soundStats.get(sound) || { count: 0, views: 0 };
    agg.count++;
    agg.views += v.view_count || 0;
    soundStats.set(sound, agg);
  }

  const topSounds = Array.from(soundStats.entries())
    .sort((a, b) => b[1].views - a[1].views)
    .slice(0, 10)
    .map(([sound]) => sound);

  // Calculate avg engagement for view estimates
  const avgViews = sourceVideos.reduce((s, v) => s + (v.view_count || 0), 0) / sourceVideos.length;

  // Get templates for this niche
  const templates = FORMAT_TEMPLATES[niche] || DEFAULT_TEMPLATES;

  // Generate ideas by combining templates with real trending data
  const ideas: GeneratedIdea[] = [];
  const usedTemplates = new Set<number>();

  for (let i = 0; i < Math.min(6, templates.length); i++) {
    // Pick a random unused template
    let templateIdx: number;
    do {
      templateIdx = Math.floor(Math.random() * templates.length);
    } while (usedTemplates.has(templateIdx) && usedTemplates.size < templates.length);
    usedTemplates.add(templateIdx);

    const template = templates[templateIdx];
    const mainHashtag = topHashtags[i % topHashtags.length] || niche;
    const displayTag = mainHashtag.charAt(0).toUpperCase() + mainHashtag.slice(1);

    // Pick 4-6 hashtags for this idea
    const ideaHashtags = [`#${mainHashtag}`];
    const shuffled = [...topHashtags].sort(() => Math.random() - 0.5);
    for (const tag of shuffled) {
      if (ideaHashtags.length >= 5) break;
      if (tag !== mainHashtag) ideaHashtags.push(`#${tag}`);
    }
    // Always add generic viral tags
    ideaHashtags.push("#keşfet", "#fyp");

    // Pick a sound
    const sound = topSounds[i % Math.max(topSounds.length, 1)] || "Trend ses kullanın";

    // Estimate views based on average
    const viewMultiplier = 0.5 + Math.random() * 1.5;
    const estViews = Math.round(avgViews * viewMultiplier);
    const estimatedViews = estViews >= 1_000_000
      ? `${(estViews / 1_000_000).toFixed(1)}M+`
      : estViews >= 1_000
        ? `${(estViews / 1_000).toFixed(0)}K+`
        : `${estViews}+`;

    // Build caption
    const caption = `${template.hookTemplate} ${ideaHashtags.slice(0, 4).join(" ")}`;

    ideas.push({
      title: template.titleTemplate.replace("{hashtag}", displayTag),
      format: template.format,
      hook: template.hookTemplate,
      caption,
      hashtags: ideaHashtags,
      sound,
      estimatedViews,
    });
  }

  return ideas;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const niche = searchParams.get("niche") || "komedi";

    const key = cacheKey("ideas", { niche });

    const result = await cached(
      key,
      async () => {
        const ideas = await generateIdeasFromData(niche);

        if (ideas.length > 0) {
          return { ideas, source: "live" as const };
        }

        return { ideas: [], source: "no_data" as const };
      },
      1800 // 30 minutes cache
    );

    return NextResponse.json(result);
  } catch (e) {
    apiLogger.error({ err: e }, "Ideas API error");
    return NextResponse.json({ ideas: [], source: "no_data" }, { status: 500 });
  }
}
