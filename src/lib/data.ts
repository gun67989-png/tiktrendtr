// Types
export interface Hashtag {
  id: string;
  name: string;
  totalUses: number;
  weeklyGrowth: number;
  category: string;
  viralScore: number;
  isEmerging: boolean;
  trend: number[];
}

export interface Sound {
  id: string;
  name: string;
  creator: string;
  usageCount: number;
  growthRate: number;
  bpm: number;
  duration: string;
  genre: string;
  viralScore: number;
}

export interface TrendOverview {
  totalVideosAnalyzed: number;
  activeTrends: number;
  avgEngagement: number;
  bestPostingTime: string;
  trendingNiches: { name: string; count: number; growth: number }[];
  trendingCities: { name: string; percentage: number }[];
  viralFormats: { name: string; count: number; description: string }[];
  dailyStats: { date: string; videos: number; engagement: number }[];
}

export interface PostingTimeData {
  hour: number;
  day: string;
  engagement: number;
}

export interface ContentIdea {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  sound: string;
  format: string;
  estimatedViews: string;
}

export interface GrowthStage {
  range: string;
  title: string;
  postingFrequency: string;
  contentFormats: string[];
  algorithmTips: string[];
  engagementStrategy: string[];
  duration: string;
}

// Viral Score Calculation
export function calculateViralScore(
  engagementRate: number,
  growthRate: number,
  videoVolume: number,
  recency: number
): number {
  return Math.round(
    (engagementRate * 0.35 +
      growthRate * 0.25 +
      videoVolume * 0.2 +
      recency * 0.2) *
      100
  ) / 100;
}

// Turkish TikTok Categories
export const CATEGORIES = [
  "Yemek",
  "Komedi",
  "Seyahat",
  "Moda",
  "Teknoloji",
  "Vlog",
  "Eğitim",
  "Spor",
  "Müzik",
  "Dans",
  "Güzellik",
  "Oyun",
];

export const TURKISH_CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Antalya",
  "Bursa",
  "Adana",
  "Trabzon",
  "Gaziantep",
  "Konya",
  "Mersin",
];

// Generate mock hashtag data
export function generateHashtags(): Hashtag[] {
  const hashtags = [
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

  return hashtags.map((h, i) => {
    const weeklyGrowth = Math.round((Math.random() * 180 - 20) * 10) / 10;
    const engRate = Math.random() * 0.8 + 0.1;
    const growRate = Math.max(0, weeklyGrowth / 100);
    const vol = Math.min(1, h.base / 15000000);
    const rec = Math.max(0, 1 - i * 0.02);
    const viralScore = calculateViralScore(engRate, growRate, vol, rec);

    const trend = Array.from({ length: 7 }, () =>
      Math.round(h.base * (0.8 + Math.random() * 0.4) / 10000)
    );

    return {
      id: `h-${i}`,
      name: h.name,
      totalUses: h.base + Math.round(Math.random() * 500000),
      weeklyGrowth,
      category: h.category,
      viralScore: Math.round(viralScore * 100) / 100,
      isEmerging: weeklyGrowth > 80,
      trend,
    };
  }).sort((a, b) => b.viralScore - a.viralScore);
}

// Generate mock sound data
export function generateSounds(): Sound[] {
  const sounds = [
    { name: "Original Sound - Turkish Remix", creator: "djturk_official", genre: "Pop", bpm: 128 },
    { name: "Anlatamam", creator: "tarkan", genre: "Pop", bpm: 120 },
    { name: "Ela Gözlüm", creator: "emircan_igan", genre: "Arabesk", bpm: 95 },
    { name: "Bi Tek Ben Anlarım", creator: "murat_boz", genre: "Pop", bpm: 115 },
    { name: "Street Food Beat", creator: "beatmaker_ist", genre: "Hip-Hop", bpm: 140 },
    { name: "Komedi Sound Effect", creator: "soundfx_tr", genre: "Efekt", bpm: 0 },
    { name: "Istanbul Nights", creator: "dj_deep_tr", genre: "Elektronik", bpm: 132 },
    { name: "Turkish Drill Beat", creator: "drill_ankara", genre: "Drill", bpm: 145 },
    { name: "Romantik Piano", creator: "pianotr", genre: "Klasik", bpm: 75 },
    { name: "Motivasyon Konuşması", creator: "motivasyon_tr", genre: "Konuşma", bpm: 0 },
    { name: "Halay Remix 2024", creator: "halay_king", genre: "Folk", bpm: 130 },
    { name: "Gece Gündüz", creator: "edis", genre: "Pop", bpm: 118 },
    { name: "Turkish Trap Mix", creator: "trap_istanbul", genre: "Trap", bpm: 150 },
    { name: "Anadolu Rock", creator: "rocktr", genre: "Rock", bpm: 135 },
    { name: "Slow Turkish", creator: "slowmusic_tr", genre: "Slow", bpm: 80 },
    { name: "Zeybek Modern", creator: "folkmodern", genre: "Folk", bpm: 90 },
    { name: "Gaming Hype", creator: "gamer_sounds", genre: "Elektronik", bpm: 160 },
    { name: "Kahvaltı Vibes", creator: "morning_tr", genre: "Lo-fi", bpm: 85 },
    { name: "Spor Motivasyon", creator: "gym_tr", genre: "EDM", bpm: 140 },
    { name: "Nostalji 90lar", creator: "retro_tr", genre: "Retro", bpm: 110 },
  ];

  return sounds.map((s, i) => {
    const usageCount = Math.round(Math.random() * 500000 + 10000);
    const growthRate = Math.round((Math.random() * 200 - 30) * 10) / 10;
    const durations = ["15s", "30s", "45s", "60s", "90s"];
    const engRate = Math.random() * 0.9 + 0.1;
    const growRate = Math.max(0, growthRate / 100);
    const vol = Math.min(1, usageCount / 500000);
    const rec = Math.max(0, 1 - i * 0.04);

    return {
      id: `s-${i}`,
      name: s.name,
      creator: s.creator,
      usageCount,
      growthRate,
      bpm: s.bpm,
      duration: durations[Math.floor(Math.random() * durations.length)],
      genre: s.genre,
      viralScore: Math.round(calculateViralScore(engRate, growRate, vol, rec) * 100) / 100,
    };
  }).sort((a, b) => b.viralScore - a.viralScore);
}

// Generate overview data
export function generateOverview(): TrendOverview {
  const dailyStats = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split("T")[0],
      videos: Math.round(Math.random() * 5000 + 8000),
      engagement: Math.round((Math.random() * 5 + 3) * 100) / 100,
    };
  });

  return {
    totalVideosAnalyzed: 1247832,
    activeTrends: 342,
    avgEngagement: 6.8,
    bestPostingTime: "19:00 - 22:00",
    trendingNiches: [
      { name: "Yemek", count: 45200, growth: 23.5 },
      { name: "Komedi", count: 38900, growth: 18.2 },
      { name: "Dans", count: 32100, growth: 31.7 },
      { name: "Moda", count: 28400, growth: 15.8 },
      { name: "Seyahat", count: 24600, growth: 42.1 },
      { name: "Eğitim", count: 21300, growth: 28.9 },
      { name: "Teknoloji", count: 18700, growth: 35.4 },
      { name: "Spor", count: 16200, growth: 12.3 },
    ],
    trendingCities: [
      { name: "İstanbul", percentage: 35 },
      { name: "Ankara", percentage: 18 },
      { name: "İzmir", percentage: 12 },
      { name: "Antalya", percentage: 8 },
      { name: "Bursa", percentage: 6 },
      { name: "Adana", percentage: 5 },
      { name: "Trabzon", percentage: 4 },
      { name: "Gaziantep", percentage: 4 },
      { name: "Konya", percentage: 4 },
      { name: "Mersin", percentage: 4 },
    ],
    viralFormats: [
      { name: "Hikaye Anlatımı", count: 82400, description: "Storytime format with personal anecdotes" },
      { name: "Önce/Sonra", count: 65200, description: "Before/After transformation videos" },
      { name: "Tutorial", count: 58100, description: "Step-by-step how-to videos" },
      { name: "POV", count: 51300, description: "Point-of-view storytelling" },
      { name: "Get Ready With Me", count: 43700, description: "GRWM daily routine videos" },
      { name: "Mukbang", count: 38500, description: "Eating and food review videos" },
    ],
    dailyStats,
  };
}

// Generate posting time heatmap data
export function generatePostingTimes(): PostingTimeData[] {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const data: PostingTimeData[] = [];

  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      let engagement: number;

      // Turkish audience patterns
      if (hour >= 7 && hour <= 9) {
        engagement = 40 + Math.random() * 25; // morning commute
      } else if (hour >= 12 && hour <= 14) {
        engagement = 55 + Math.random() * 20; // lunch break
      } else if (hour >= 19 && hour <= 23) {
        engagement = 70 + Math.random() * 30; // prime time
      } else if (hour >= 0 && hour <= 2) {
        engagement = 35 + Math.random() * 20; // late night
      } else if (hour >= 3 && hour <= 6) {
        engagement = 5 + Math.random() * 15; // sleeping
      } else {
        engagement = 25 + Math.random() * 25; // daytime
      }

      // Weekend boost
      if (day === "Cumartesi" || day === "Pazar") {
        engagement *= 1.15;
      }

      // Friday evening boost
      if (day === "Cuma" && hour >= 17) {
        engagement *= 1.2;
      }

      data.push({
        hour,
        day,
        engagement: Math.round(engagement),
      });
    }
  }

  return data;
}

// Generate content ideas
export function generateContentIdeas(niche: string): ContentIdea[] {
  const ideas: Record<string, ContentIdea[]> = {
    yemek: [
      {
        title: "1 TL ile Akşam Yemeği Challenge",
        hook: "Sadece 1 TL ile akşam yemeği yaptım ve sonuç inanılmaz!",
        caption: "Bütçe dostu tarif serisi geldi! 🍳 Bu tarifi denemeden geçmeyin",
        hashtags: ["#yemektarifi", "#bütçedostutatif", "#kesfet", "#türkmutfağı", "#1tlchallenge"],
        sound: "Street Food Beat - beatmaker_ist",
        format: "Tutorial",
        estimatedViews: "100K-500K",
      },
      {
        title: "Babaannemin Gizli Tarifi",
        hook: "Babaannem bu tarifi 50 yıldır kimseye söylemedi, ta ki bugüne kadar...",
        caption: "Nesilden nesile aktarılan gizli tarif sonunda burada 👵🏻❤️",
        hashtags: ["#babaannetarifi", "#gelenekseltarif", "#yemek", "#kesfet", "#türkyemekleri"],
        sound: "Nostalji 90lar - retro_tr",
        format: "Hikaye Anlatımı",
        estimatedViews: "200K-1M",
      },
      {
        title: "Sokak Lezzetleri Turu - İstanbul",
        hook: "İstanbul'un en gizli sokak lezzetini buldum!",
        caption: "Bu tadı başka hiçbir yerde bulamazsınız 🌯 Adres yorumlarda!",
        hashtags: ["#streetfood", "#istanbul", "#sokaklezzetleri", "#kesfet", "#yemek"],
        sound: "Istanbul Nights - dj_deep_tr",
        format: "POV",
        estimatedViews: "150K-750K",
      },
    ],
    komedi: [
      {
        title: "Türk Anneleri vs Normal Anneler",
        hook: "Normal anneler çocuğu okula gönderirken vs Türk anneleri...",
        caption: "Herkesin annesi böyle mi yoksa sadece benimki mi? 😂",
        hashtags: ["#komedi", "#türkannesi", "#kesfet", "#mizah", "#aile"],
        sound: "Komedi Sound Effect - soundfx_tr",
        format: "POV",
        estimatedViews: "500K-2M",
      },
      {
        title: "Yurt Hayatı Gerçekleri",
        hook: "Yurtta yaşamanın kimsenin anlatmadığı gerçekleri...",
        caption: "Yurt hayatını yaşayan herkes bu videoyu bilir 🏢😅",
        hashtags: ["#üniversite", "#yurthayatı", "#komedi", "#öğrenci", "#kesfet"],
        sound: "Turkish Trap Mix - trap_istanbul",
        format: "Hikaye Anlatımı",
        estimatedViews: "300K-1.5M",
      },
      {
        title: "Türkçe İngilizce Karışımı Konuşmak",
        hook: "Literally dün very important bir meeting'e gittim...",
        caption: "Bu şekilde konuşan birini mutlaka tanıyorsunuz 😂🇹🇷🇬🇧",
        hashtags: ["#komedi", "#ingilizce", "#türkçe", "#kesfet", "#mizah"],
        sound: "Komedi Sound Effect - soundfx_tr",
        format: "POV",
        estimatedViews: "400K-2M",
      },
    ],
    seyahat: [
      {
        title: "Türkiye'nin Bilinmeyen Cenneti",
        hook: "Türkiye'de böyle bir yer olduğunu biliyor muydunuz?",
        caption: "Bu cennet köşesini keşfetmek için 8 saat yol gittim 🏔️",
        hashtags: ["#seyahat", "#türkiye", "#kesfet", "#gizlicennet", "#travel"],
        sound: "Anadolu Rock - rocktr",
        format: "Önce/Sonra",
        estimatedViews: "200K-1M",
      },
      {
        title: "100 TL ile Kapadokya Günü",
        hook: "Kapadokya'yı sadece 100 TL ile gezdim, nasıl mı?",
        caption: "Bütçe dostu seyahat rehberi geldi! ✈️💰",
        hashtags: ["#kapadokya", "#bütçeseyahat", "#türkiye", "#seyahat", "#kesfet"],
        sound: "Motivasyon Konuşması - motivasyon_tr",
        format: "Tutorial",
        estimatedViews: "150K-800K",
      },
      {
        title: "İstanbul 24 Saat Challenge",
        hook: "24 saatte İstanbul'da neler yapabilirsiniz?",
        caption: "Bir günde İstanbul'un en iyi 10 mekanı! 🌉",
        hashtags: ["#istanbul", "#24saatchallenge", "#seyahat", "#kesfet", "#travel"],
        sound: "Istanbul Nights - dj_deep_tr",
        format: "POV",
        estimatedViews: "300K-1.5M",
      },
    ],
    moda: [
      {
        title: "Okul Kombini 7 Gün Challenge",
        hook: "Bir hafta boyunca her gün farklı okul kombini!",
        caption: "Hangi gün en iyi? Yorumlarda söyleyin! 👗",
        hashtags: ["#moda", "#okul", "#kombin", "#kesfet", "#ootd"],
        sound: "Gece Gündüz - edis",
        format: "Get Ready With Me",
        estimatedViews: "200K-900K",
      },
      {
        title: "Vintage vs Modern Kombin",
        hook: "Anneannemin dolabından vintage parçalar + modern kombinler...",
        caption: "Vintage hiç bu kadar trend olmamıştı! 🕰️✨",
        hashtags: ["#vintage", "#moda", "#kombin", "#kesfet", "#thrift"],
        sound: "Nostalji 90lar - retro_tr",
        format: "Önce/Sonra",
        estimatedViews: "150K-700K",
      },
      {
        title: "50 TL ile Kombin Challenge",
        hook: "50 TL ile şık bir kombin mümkün mü?",
        caption: "Bütçe dostu şıklık rehberi geldi! 💅💰",
        hashtags: ["#moda", "#bütçedostu", "#kombin", "#kesfet", "#challenge"],
        sound: "Turkish Drill Beat - drill_ankara",
        format: "Tutorial",
        estimatedViews: "250K-1M",
      },
    ],
    egitim: [
      {
        title: "5 Dakikada YKS Matematik Hilesi",
        hook: "Bu hileyi bilseydiniz sınavda 10 soru daha fazla çözerdiniz!",
        caption: "Matematik aslında bu kadar kolay! 📐✨",
        hashtags: ["#yks", "#matematik", "#eğitim", "#sınav", "#kesfet"],
        sound: "Motivasyon Konuşması - motivasyon_tr",
        format: "Tutorial",
        estimatedViews: "300K-1.5M",
      },
      {
        title: "İngilizce Öğrenmenin En Kolay Yolu",
        hook: "3 ayda İngilizce öğrendim ve yöntemim çok basit...",
        caption: "Bu yöntemle herkes İngilizce öğrenebilir! 🇬🇧",
        hashtags: ["#ingilizce", "#eğitim", "#dil", "#kesfet", "#öğren"],
        sound: "Slow Turkish - slowmusic_tr",
        format: "Hikaye Anlatımı",
        estimatedViews: "200K-1M",
      },
      {
        title: "Üniversite Hayatta Kalma Rehberi",
        hook: "Keşke üniversiteye başlamadan önce bunları bilseydim...",
        caption: "Tüm üniversite öğrencilerine gelsin! 🎓",
        hashtags: ["#üniversite", "#öğrenci", "#eğitim", "#kesfet", "#tavsiye"],
        sound: "Kahvaltı Vibes - morning_tr",
        format: "Tutorial",
        estimatedViews: "250K-1.2M",
      },
    ],
    teknoloji: [
      {
        title: "iPhone Bilmediğiniz 5 Gizli Özellik",
        hook: "iPhone'unuzda bu gizli özellikleri biliyor muydunuz?",
        caption: "Bu özellikleri keşfettiğimde şok oldum! 📱",
        hashtags: ["#teknoloji", "#iphone", "#gizliözellik", "#kesfet", "#tech"],
        sound: "Gaming Hype - gamer_sounds",
        format: "Tutorial",
        estimatedViews: "400K-2M",
      },
      {
        title: "Yapay Zeka ile Para Kazanma",
        hook: "AI kullanarak ayda 10.000 TL kazanıyorum, işte nasıl...",
        caption: "Yapay zeka ile para kazanmanın 5 yolu! 🤖💰",
        hashtags: ["#yapayZeka", "#teknoloji", "#parakazanma", "#kesfet", "#ai"],
        sound: "Motivasyon Konuşması - motivasyon_tr",
        format: "Tutorial",
        estimatedViews: "500K-2.5M",
      },
      {
        title: "En İyi Bütçe Telefon 2024",
        hook: "2000 TL altı en iyi telefonu buldum!",
        caption: "Bu fiyata bu özellikler inanılmaz! 📱🔥",
        hashtags: ["#teknoloji", "#telefon", "#bütçe", "#kesfet", "#review"],
        sound: "Turkish Drill Beat - drill_ankara",
        format: "Önce/Sonra",
        estimatedViews: "300K-1.5M",
      },
    ],
  };

  const nicheKey = niche.toLowerCase().replace("ı", "i");
  return ideas[nicheKey] || ideas["komedi"];
}

// Growth strategy stages
export function getGrowthStages(): GrowthStage[] {
  return [
    {
      range: "0 → 1K",
      title: "Başlangıç Aşaması",
      postingFrequency: "Günde 3-5 video",
      duration: "2-4 hafta",
      contentFormats: [
        "Trend sesleri kullanarak kısa videolar (15-30sn)",
        "POV formatında günlük hayat videoları",
        "Popüler challenge'lara katılım",
        "Duet ve Stitch videoları",
      ],
      algorithmTips: [
        "İlk 1 saat içinde 200+ izlenme hedefle",
        "Video açıklamalarına 3-5 hashtag ekle",
        "Videoları 19:00-22:00 arası paylaş",
        "İlk 3 saniye çok önemli - güçlü hook kullan",
        "Trending sesleri mutlaka kullan",
        "Video süresini kısa tut (15-30 saniye)",
      ],
      engagementStrategy: [
        "Her yoruma cevap ver",
        "Niş'indeki 50 hesabı takip et ve etkileşim kur",
        "Diğer videoları yorumla (ilk 1 saat önemli)",
        "Canlı yayın aç (en az haftada 2 kez)",
        "Takipçilerden video fikirlerini sor",
      ],
    },
    {
      range: "1K → 10K",
      title: "Büyüme Aşaması",
      postingFrequency: "Günde 2-3 video",
      duration: "1-3 ay",
      contentFormats: [
        "Seri içerikler oluştur (Bölüm 1, 2, 3...)",
        "Tutorial ve eğitim videoları",
        "Hikaye anlatımı (Storytime)",
        "Önce/Sonra dönüşüm videoları",
        "Trend adaptasyonları (kendi tarzında)",
      ],
      algorithmTips: [
        "Watch time'ı artır - videoyu sonuna kadar izletecek yapı kur",
        "Loop videoları dene (başa dönen videolar)",
        "CTA (Call-to-Action) ekle: 'Devamı için takip et!'",
        "Carousel post'ları dene",
        "SEO için açıklamalara anahtar kelimeler ekle",
        "Kendi orijinal seslerini oluştur",
      ],
      engagementStrategy: [
        "Topluluk oluşturmaya başla",
        "Haftalık canlı yayın rutini kur",
        "Takipçilerle anket ve soru-cevap yap",
        "Küçük creator'larla işbirliği yap",
        "E-posta listesi oluşturmaya başla",
      ],
    },
    {
      range: "10K → 100K",
      title: "Ölçeklendirme Aşaması",
      postingFrequency: "Günde 1-2 kaliteli video",
      duration: "3-6 ay",
      contentFormats: [
        "Uzun form içerikler (1-3 dakika)",
        "Mini belgesel tarzı videolar",
        "İşbirliği videoları",
        "Marka ortaklıkları için portfolio videoları",
        "Behind-the-scenes içerikler",
        "Eğitim serileri",
      ],
      algorithmTips: [
        "Kaliteyi artır - iyi ışık, ses ve kurgu",
        "Niche'inde otorite ol",
        "Cross-platform paylaşım yap (Instagram Reels, YouTube Shorts)",
        "Analytics'i düzenli takip et",
        "A/B testing yap - farklı hook'lar dene",
        "Viral olan içerikleri analiz et ve tekrarla",
      ],
      engagementStrategy: [
        "Marka işbirlikleri için DM'lere açık ol",
        "Creator Fund'a başvur",
        "Büyük creator'larla işbirliği yap",
        "Topluluk etkinlikleri düzenle",
        "Fan sayfalarını destekle",
        "Merchandise düşünmeye başla",
      ],
    },
  ];
}

// Hashtag detail data
export interface HashtagDetail {
  name: string;
  totalUses: number;
  totalViews: number;
  weeklyGrowth: number;
  engagementRate: number;
  viralScore: number;
  category: string;
  isEmerging: boolean;
  dailyGrowth: { date: string; uses: number; views: number }[];
  engagementHistory: { date: string; rate: number }[];
  trendUsage: { date: string; videos: number }[];
  topVideos: HashtagVideo[];
}

export interface HashtagVideo {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  viralScore: number;
  duration: number;
  format: string | null;
  publishedAt: string;
  soundName: string | null;
}

export function generateHashtagDetail(tag: string): HashtagDetail | null {
  const hashtags = generateHashtags();
  const cleanTag = tag.startsWith("#") ? tag : `#${tag}`;
  const hashtag = hashtags.find(
    (h) => h.name.toLowerCase() === cleanTag.toLowerCase()
  );
  if (!hashtag) return null;

  const dailyGrowth = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const baseUses = hashtag.totalUses / 30;
    const growth = 1 + (i / 30) * (hashtag.weeklyGrowth / 100);
    return {
      date: date.toISOString().split("T")[0],
      uses: Math.round(baseUses * growth * (0.8 + Math.random() * 0.4)),
      views: Math.round(baseUses * growth * (0.8 + Math.random() * 0.4) * 25),
    };
  });

  const engagementHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split("T")[0],
      rate: Math.round((3 + Math.random() * 8) * 100) / 100,
    };
  });

  const trendUsage = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toISOString().split("T")[0],
      videos: Math.round(200 + Math.random() * 1800),
    };
  });

  const creators = [
    "yemek_ustasi", "komedi_krali", "gezgin_tr", "moda_guru",
    "tech_master", "vlog_turkey", "egitim_plus", "spor_kocu",
    "muzik_tr", "dans_atolye", "guzellik_tr", "gamer_pro",
    "sokak_lezzet", "fit_yasam", "diy_turkiye", "anadolu_gezgini",
  ];
  const formats = ["Hikaye Anlatimi", "Tutorial", "POV", "Once/Sonra", "Get Ready With Me", "Mukbang", null];
  const sounds = ["Original Sound - Turkish Remix", "Anlatamam", "Ela Gozlum", "Street Food Beat", "Istanbul Nights", "Turkish Drill Beat", null];

  const topVideos: HashtagVideo[] = Array.from({ length: 12 }, (_, i) => {
    const views = Math.round(50000 + Math.random() * 5000000);
    const likes = Math.round(views * (0.03 + Math.random() * 0.12));
    const comments = Math.round(likes * (0.05 + Math.random() * 0.15));
    const shares = Math.round(likes * (0.02 + Math.random() * 0.08));
    const engRate = ((likes + comments + shares) / views) * 100;
    const pubDate = new Date();
    pubDate.setDate(pubDate.getDate() - Math.floor(Math.random() * 14));

    return {
      id: `hv-${tag}-${i}`,
      tiktokId: `${Math.random().toString(36).slice(2, 12)}`,
      description: `${cleanTag} ile ilgili viral video #kesfet #trend`,
      creator: creators[Math.floor(Math.random() * creators.length)],
      thumbnailUrl: `https://picsum.photos/seed/${tag}${i}/400/700`,
      tiktokUrl: `https://www.tiktok.com/@user/video/${Date.now() + i}`,
      views,
      likes,
      comments,
      shares,
      engagementRate: Math.round(engRate * 100) / 100,
      viralScore: Math.round((engRate * 0.4 + (views / 5000000) * 60) * 10) / 10,
      duration: 15 + Math.floor(Math.random() * 50),
      format: formats[Math.floor(Math.random() * formats.length)],
      publishedAt: pubDate.toISOString(),
      soundName: sounds[Math.floor(Math.random() * sounds.length)],
    };
  }).sort((a, b) => b.viralScore - a.viralScore);

  const totalViews = dailyGrowth.reduce((sum, d) => sum + d.views, 0);
  const avgEngagement = engagementHistory.reduce((sum, d) => sum + d.rate, 0) / engagementHistory.length;

  return {
    name: hashtag.name,
    totalUses: hashtag.totalUses,
    totalViews,
    weeklyGrowth: hashtag.weeklyGrowth,
    engagementRate: Math.round(avgEngagement * 100) / 100,
    viralScore: hashtag.viralScore,
    category: hashtag.category,
    isEmerging: hashtag.isEmerging,
    dailyGrowth,
    engagementHistory,
    trendUsage,
    topVideos,
  };
}

// Sound detail data
export interface SoundDetail {
  id: string;
  name: string;
  creator: string;
  usageCount: number;
  growthRate: number;
  bpm: number;
  duration: string;
  genre: string;
  viralScore: number;
  usageHistory: { date: string; count: number }[];
  topVideos: HashtagVideo[];
}

export function generateSoundDetail(soundId: string): SoundDetail | null {
  const sounds = generateSounds();
  const sound = sounds.find((s) => s.id === soundId);
  if (!sound) return null;

  const usageHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const base = sound.usageCount / 30;
    const growth = 1 + (i / 30) * (sound.growthRate / 100);
    return {
      date: date.toISOString().split("T")[0],
      count: Math.round(base * growth * (0.7 + Math.random() * 0.6)),
    };
  });

  const creators = [
    "yemek_ustasi", "komedi_krali", "gezgin_tr", "moda_guru",
    "tech_master", "vlog_turkey", "dans_atolye", "muzik_tr",
  ];
  const formats = ["Hikaye Anlatimi", "Tutorial", "POV", "Once/Sonra", "Get Ready With Me", null];

  const topVideos: HashtagVideo[] = Array.from({ length: 12 }, (_, i) => {
    const views = Math.round(80000 + Math.random() * 4000000);
    const likes = Math.round(views * (0.04 + Math.random() * 0.1));
    const comments = Math.round(likes * (0.05 + Math.random() * 0.12));
    const shares = Math.round(likes * (0.02 + Math.random() * 0.06));
    const engRate = ((likes + comments + shares) / views) * 100;
    const pubDate = new Date();
    pubDate.setDate(pubDate.getDate() - Math.floor(Math.random() * 14));

    return {
      id: `sv-${soundId}-${i}`,
      tiktokId: `${Math.random().toString(36).slice(2, 12)}`,
      description: `${sound.name} sesini kullanan viral video`,
      creator: creators[Math.floor(Math.random() * creators.length)],
      thumbnailUrl: `https://picsum.photos/seed/sound${soundId}${i}/400/700`,
      tiktokUrl: `https://www.tiktok.com/@user/video/${Date.now() + i}`,
      views,
      likes,
      comments,
      shares,
      engagementRate: Math.round(engRate * 100) / 100,
      viralScore: Math.round((engRate * 0.4 + (views / 4000000) * 60) * 10) / 10,
      duration: 15 + Math.floor(Math.random() * 45),
      format: formats[Math.floor(Math.random() * formats.length)],
      publishedAt: pubDate.toISOString(),
      soundName: sound.name,
    };
  }).sort((a, b) => b.viralScore - a.viralScore);

  return {
    ...sound,
    usageHistory,
    topVideos,
  };
}

// Video analytics detail
export interface VideoAnalytics {
  id: string;
  tiktokId: string;
  description: string;
  creator: string;
  thumbnailUrl: string;
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
  publishedAt: string;
  soundName: string | null;
  soundCreator: string | null;
  soundId: string | null;
  hashtags: string[];
  viewsOverTime: { date: string; views: number }[];
  engagementOverTime: { date: string; rate: number }[];
  nicheAvgEngagement: number;
  nicheAvgViews: number;
  growthSpeed: string;
  bestPostingHour: number;
}

export function generateVideoAnalytics(videoId: string): VideoAnalytics | null {
  // Generate a consistent video based on the id
  const seed = videoId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const creators = [
    "yemek_ustasi", "komedi_krali", "gezgin_tr", "moda_guru",
    "tech_master", "vlog_turkey", "egitim_plus", "spor_kocu",
  ];
  const categories = CATEGORIES;
  const formats = ["Hikaye Anlatimi", "Tutorial", "POV", "Once/Sonra", "Get Ready With Me", "Mukbang"];
  const soundNames = ["Original Sound - Turkish Remix", "Anlatamam", "Ela Gozlum", "Street Food Beat", "Istanbul Nights"];
  const soundCreators = ["djturk_official", "tarkan", "emircan_igan", "beatmaker_ist", "dj_deep_tr"];

  const views = Math.round(100000 + rng(1) * 5000000);
  const likes = Math.round(views * (0.03 + rng(2) * 0.12));
  const comments = Math.round(likes * (0.05 + rng(3) * 0.15));
  const shares = Math.round(likes * (0.02 + rng(4) * 0.08));
  const engRate = ((likes + comments + shares) / views) * 100;
  const catIdx = Math.floor(rng(5) * categories.length);
  const soundIdx = Math.floor(rng(8) * soundNames.length);
  const pubDate = new Date();
  pubDate.setDate(pubDate.getDate() - Math.floor(rng(9) * 14));

  const hashtags = ["#kesfet", "#trend"];
  const catHashtags: Record<string, string[]> = {
    Yemek: ["#yemektarifi", "#türkmutfağı"],
    Komedi: ["#komedi", "#mizah"],
    Seyahat: ["#seyahat", "#türkiye"],
    Moda: ["#moda", "#kombin"],
    Teknoloji: ["#teknoloji", "#tech"],
    Dans: ["#dans", "#dance"],
    Eğitim: ["#eğitim", "#öğren"],
    Spor: ["#spor", "#fitness"],
  };
  const cat = categories[catIdx];
  if (catHashtags[cat]) hashtags.push(...catHashtags[cat]);

  const viewsOverTime = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(pubDate);
    date.setDate(date.getDate() + i);
    if (date > new Date()) return null;
    const dayViews = Math.round(views * (0.3 * Math.exp(-i * 0.15) + 0.01) * (0.7 + rng(10 + i) * 0.6));
    return { date: date.toISOString().split("T")[0], views: dayViews };
  }).filter(Boolean) as { date: string; views: number }[];

  const engagementOverTime = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(pubDate);
    date.setDate(date.getDate() + i);
    if (date > new Date()) return null;
    return {
      date: date.toISOString().split("T")[0],
      rate: Math.round((engRate * (0.7 + rng(30 + i) * 0.6)) * 100) / 100,
    };
  }).filter(Boolean) as { date: string; rate: number }[];

  const nicheAvgEngagement = Math.round((3 + rng(50) * 4) * 100) / 100;
  const nicheAvgViews = Math.round(200000 + rng(51) * 800000);

  let growthSpeed = "Normal";
  if (views > 2000000) growthSpeed = "Cok Hizli";
  else if (views > 1000000) growthSpeed = "Hizli";
  else if (views < 200000) growthSpeed = "Yavas";

  return {
    id: videoId,
    tiktokId: `tt_${videoId}`,
    description: `Bu harika ${cat.toLowerCase()} icerigi ile trend oldum! ${hashtags.join(" ")}`,
    creator: creators[Math.floor(rng(6) * creators.length)],
    thumbnailUrl: `https://picsum.photos/seed/vid${videoId}/400/700`,
    tiktokUrl: `https://www.tiktok.com/@user/video/${Date.now()}`,
    views,
    likes,
    comments,
    shares,
    engagementRate: Math.round(engRate * 100) / 100,
    viralScore: Math.round((engRate * 0.4 + (views / 5000000) * 60) * 10) / 10,
    duration: 15 + Math.floor(rng(7) * 50),
    format: formats[Math.floor(rng(7) * formats.length)],
    category: cat,
    publishedAt: pubDate.toISOString(),
    soundName: soundNames[soundIdx],
    soundCreator: soundCreators[soundIdx],
    soundId: `s-${soundIdx}`,
    hashtags,
    viewsOverTime,
    engagementOverTime,
    nicheAvgEngagement,
    nicheAvgViews,
    growthSpeed,
    bestPostingHour: 19 + Math.floor(rng(60) * 4),
  };
}

// Generate mock video list for trending videos page
export interface VideoListItem {
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
  soundName: string | null;
  soundCreator: string | null;
  publishedAt: string;
  hashtags: string[];
}

export function generateVideos(options: {
  limit?: number;
  offset?: number;
  category?: string;
  sortBy?: "viralScore" | "views" | "engagementRate" | "publishedAt";
  order?: "asc" | "desc";
} = {}): { videos: VideoListItem[]; total: number } {
  const { limit = 20, offset = 0, category, sortBy = "viralScore", order = "desc" } = options;

  const creators = [
    "yemek_ustasi", "komedi_krali", "gezgin_tr", "moda_guru",
    "tech_master", "vlog_turkey", "egitim_plus", "spor_kocu",
    "dans_queen", "guzellik_tr", "oyuncu_pro", "muzik_tr",
    "chef_istanbul", "travel_antalya", "fitness_coach", "diy_master",
    "comedy_king", "style_icon", "code_wizard", "nature_lover",
  ];
  const formats = ["Hikaye Anlatimi", "Tutorial", "POV", "Once/Sonra", "Get Ready With Me", "Mukbang", "Duet", "Challenge"];
  const soundNames = ["Original Sound - Turkish Remix", "Anlatamam", "Ela Gozlum", "Street Food Beat", "Istanbul Nights", "Komedi Sound Effect", "Turkish Drill Beat", "Halay Remix 2024"];
  const soundCreators = ["djturk_official", "tarkan", "emircan_igan", "beatmaker_ist", "dj_deep_tr", "soundfx_tr", "drill_ankara", "halay_king"];

  const catHashtags: Record<string, string[]> = {
    Yemek: ["#yemektarifi", "#turkmutfagi"],
    Komedi: ["#komedi", "#mizah"],
    Seyahat: ["#seyahat", "#turkiye"],
    Moda: ["#moda", "#kombin"],
    Teknoloji: ["#teknoloji", "#tech"],
    Vlog: ["#vlog", "#gunluk"],
    Egitim: ["#egitim", "#ogren"],
    Spor: ["#spor", "#fitness"],
    Muzik: ["#muzik", "#sarki"],
    Dans: ["#dans", "#dance"],
    Guzellik: ["#guzellik", "#makyaj"],
    Oyun: ["#gaming", "#oyun"],
  };

  const descriptions: Record<string, string[]> = {
    Yemek: ["Bu tarifi denemeyen kalmasin!", "En kolay ve lezzetli tarif burada", "Sokak lezzetleri turu"],
    Komedi: ["Herkesin basina gelmistir", "Turk ailelerinde gercekler", "Bu duruma dusen tek ben miyim?"],
    Seyahat: ["Turkiye'nin gizli cenneti!", "Bu yeri mutlaka gormelisiniz", "Kapadokya'da unutulmaz anlar"],
    Moda: ["Bu sezonda herkes bunu giyecek", "Uygun fiyatli kombin onerileri", "Sokak modasi trendleri"],
    Teknoloji: ["Bu ozelligi biliyor muydunuz?", "En iyi teknoloji urunleri", "Yapay zeka ile neler yapilabilir"],
    Vlog: ["Bir gunum nasil geciyor?", "Sabah rutinimde degisiklik", "Ev turumu gormelisiniz"],
    Egitim: ["Sinavda cikacak konular", "5 dakikada ogrenin", "Kimsenin anlatmadigi gercekler"],
    Spor: ["30 gunluk donusum", "Evde yapilabilecek egzersizler", "Protein takviyesi rehberi"],
    Muzik: ["Cover challenge kabul edildi!", "Bu sarki cok farkli oldu", "Sokak muzisyeni performansi"],
    Dans: ["Yeni koreografi geldi!", "Bu dansi herkes yapiyor", "Tutorial ile adim adim"],
    Guzellik: ["10 dakikada makyaj", "Cilt bakim rutinim", "Bu urun hayatimi degistirdi"],
    Oyun: ["Bu oyunu oynamalisiniz!", "En iyi gaming anlari", "Efsane clutch ani"],
  };

  const srng = (seed: number, off: number) => {
    const x = Math.sin(seed + off) * 10000;
    return x - Math.floor(x);
  };

  const allVideos: VideoListItem[] = [];
  const totalCount = 120;

  for (let i = 0; i < totalCount; i++) {
    const seed = i * 137 + 42;
    const catIdx = Math.floor(srng(seed, 1) * CATEGORIES.length);
    const cat = CATEGORIES[catIdx];
    const creatorIdx = Math.floor(srng(seed, 2) * creators.length);
    const formatIdx = Math.floor(srng(seed, 3) * formats.length);
    const soundIdx = Math.floor(srng(seed, 4) * soundNames.length);
    const views = Math.round(50000 + srng(seed, 5) * 5000000);
    const likes = Math.round(views * (0.03 + srng(seed, 6) * 0.12));
    const comments = Math.round(likes * (0.05 + srng(seed, 7) * 0.15));
    const shares = Math.round(likes * (0.02 + srng(seed, 8) * 0.08));
    const engRate = Math.round(((likes + comments + shares) / views) * 10000) / 100;
    const pubDate = new Date();
    pubDate.setDate(pubDate.getDate() - Math.floor(srng(seed, 9) * 21));
    const duration = 15 + Math.floor(srng(seed, 10) * 50);

    const hashtags = ["#kesfet", "#trend"];
    if (catHashtags[cat]) hashtags.push(...catHashtags[cat]);

    const catDescs = descriptions[cat] || ["Harika bir icerik!"];
    const desc = catDescs[Math.floor(srng(seed, 11) * catDescs.length)] + " " + hashtags.join(" ");

    const viralScore = Math.round(
      (engRate / 15 * 0.35 + (views / 5000000) * 0.25 + srng(seed, 12) * 0.2 + Math.max(0, 1 - Math.floor(srng(seed, 9) * 21) / 21) * 0.2) * 100
    ) / 10;

    allVideos.push({
      id: `v-${i}`,
      tiktokId: `tt_${1000000 + i}`,
      description: desc,
      creator: creators[creatorIdx],
      creatorAvatar: null,
      thumbnailUrl: `https://picsum.photos/seed/vid${i}/400/700`,
      videoUrl: `https://www.tiktok.com/@${creators[creatorIdx]}/video/${1000000 + i}`,
      tiktokUrl: `https://www.tiktok.com/@${creators[creatorIdx]}/video/${1000000 + i}`,
      views,
      likes,
      comments,
      shares,
      engagementRate: engRate,
      viralScore: Math.min(10, Math.max(0.1, viralScore)),
      duration,
      format: formats[formatIdx],
      category: cat,
      soundId: `s-${soundIdx}`,
      soundName: soundNames[soundIdx],
      soundCreator: soundCreators[soundIdx],
      publishedAt: pubDate.toISOString(),
      hashtags,
    });
  }

  const filtered = category ? allVideos.filter((v) => v.category === category) : [...allVideos];

  filtered.sort((a, b) => {
    const aVal = a[sortBy] as number | string;
    const bVal = b[sortBy] as number | string;
    if (typeof aVal === "string") return order === "desc" ? bVal.toString().localeCompare(aVal.toString()) : aVal.toString().localeCompare(bVal.toString());
    return order === "desc" ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
  });

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return { videos: paged, total };
}

// Emerging trends detection
export interface EmergingTrend {
  id: string;
  type: "hashtag" | "sound" | "format";
  name: string;
  signal: string;
  growthRate: number;
  detectedAt: string;
  confidence: number;
  category: string;
}

export function generateEmergingTrends(): EmergingTrend[] {
  return [
    {
      id: "et-1",
      type: "hashtag",
      name: "#yapayzekaresim",
      signal: "24 saatte %340 artış",
      growthRate: 340,
      detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      confidence: 92,
      category: "Teknoloji",
    },
    {
      id: "et-2",
      type: "sound",
      name: "Yeni Akım Remix - DJ TR",
      signal: "6 saatte 50K+ kullanım",
      growthRate: 280,
      detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      confidence: 88,
      category: "Müzik",
    },
    {
      id: "et-3",
      type: "format",
      name: "3 Saniye Hikaye",
      signal: "Yeni format, hızla yayılıyor",
      growthRate: 195,
      detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      confidence: 76,
      category: "Genel",
    },
    {
      id: "et-4",
      type: "hashtag",
      name: "#evdekal",
      signal: "12 saatte %180 artış",
      growthRate: 180,
      detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      confidence: 82,
      category: "Vlog",
    },
    {
      id: "et-5",
      type: "sound",
      name: "Nostalgic Turkish Pop",
      signal: "Organik büyüme trendi",
      growthRate: 156,
      detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      confidence: 71,
      category: "Müzik",
    },
    {
      id: "et-6",
      type: "hashtag",
      name: "#minimalist",
      signal: "Steady growth, yükselen niş",
      growthRate: 134,
      detectedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      confidence: 68,
      category: "Moda",
    },
  ];
}
