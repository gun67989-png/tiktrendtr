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
    const videoCreator = creators[Math.floor(Math.random() * creators.length)];
    const videoTiktokId = Math.random().toString(36).slice(2, 12);

    return {
      id: `hv-${tag}-${i}`,
      tiktokId: videoTiktokId,
      description: `${cleanTag} ile ilgili viral video #kesfet #trend`,
      creator: videoCreator,
      thumbnailUrl: `https://picsum.photos/seed/${tag}${i}/400/700`,
      tiktokUrl: `https://www.tiktok.com/@${videoCreator}/video/${videoTiktokId}`,
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
    const videoCreator = creators[Math.floor(Math.random() * creators.length)];
    const videoTiktokId = Math.random().toString(36).slice(2, 12);

    return {
      id: `sv-${soundId}-${i}`,
      tiktokId: videoTiktokId,
      description: `${sound.name} sesini kullanan viral video`,
      creator: videoCreator,
      thumbnailUrl: `https://picsum.photos/seed/sound${soundId}${i}/400/700`,
      tiktokUrl: `https://www.tiktok.com/@${videoCreator}/video/${videoTiktokId}`,
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

  // Pick a category, then use its coherent profile for all metadata
  const categories = CATEGORIES;
  const catIdx = Math.floor(rng(5) * categories.length);
  const cat = categories[catIdx];
  const profile = CATEGORY_PROFILES[cat];

  const views = Math.round(100000 + rng(1) * 5000000);
  const likes = Math.round(views * (0.03 + rng(2) * 0.12));
  const comments = Math.round(likes * (0.05 + rng(3) * 0.15));
  const shares = Math.round(likes * (0.02 + rng(4) * 0.08));
  const engRate = ((likes + comments + shares) / views) * 100;
  const pubDate = new Date();
  pubDate.setDate(pubDate.getDate() - Math.floor(rng(9) * 14));

  // Use category-specific hashtags
  const hashtags = ["#kesfet", "#trend"];
  if (profile) {
    const shuffled = [...profile.hashtags].sort(() => rng(15) - 0.5);
    hashtags.push(...shuffled.slice(0, 3));
  }

  // Use category-specific creator, format, sound
  const creator = profile
    ? profile.creators[Math.floor(rng(6) * profile.creators.length)]
    : "content_creator";
  const format = profile
    ? profile.formats[Math.floor(rng(7) * profile.formats.length)]
    : "Tutorial";
  const soundEntry = profile
    ? profile.sounds[Math.floor(rng(8) * profile.sounds.length)]
    : { name: "Original Sound - Turkish Remix", creator: "djturk_official" };

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

  // Use category-specific description
  const descText = profile
    ? profile.descriptions[Math.floor(rng(11) * profile.descriptions.length)]
    : `Bu harika ${cat.toLowerCase()} icerigi ile trend oldum!`;

  return {
    id: videoId,
    tiktokId: `tt_${videoId}`,
    description: `${descText} ${hashtags.join(" ")}`,
    creator,
    thumbnailUrl: `https://picsum.photos/seed/vid${videoId}/400/700`,
    tiktokUrl: `https://www.tiktok.com/@${creator}/video/${Date.now()}`,
    views,
    likes,
    comments,
    shares,
    engagementRate: Math.round(engRate * 100) / 100,
    viralScore: Math.round((engRate * 0.4 + (views / 5000000) * 60) * 10) / 10,
    duration: 15 + Math.floor(rng(7) * 50),
    format,
    category: cat,
    publishedAt: pubDate.toISOString(),
    soundName: soundEntry.name,
    soundCreator: soundEntry.creator,
    soundId: `s-${Math.floor(rng(8) * 8)}`,
    hashtags,
    viewsOverTime,
    engagementOverTime,
    nicheAvgEngagement,
    nicheAvgViews,
    growthSpeed,
    bestPostingHour: 19 + Math.floor(rng(60) * 4),
  };
}

// Content type classification - prioritize active creator content
export type ContentType = "creator_oncam" | "tutorial" | "storytelling" | "comedy_skit" | "challenge" | "duet";

// Category profiles: each category gets its own coherent set of creators, formats, sounds, hashtags, and descriptions
// This ensures that when a user selects a category, every video truly belongs to that topic
const CATEGORY_PROFILES: Record<string, {
  creators: string[];
  formats: string[];
  sounds: { name: string; creator: string }[];
  hashtags: string[];
  descriptions: string[];
  contentTypes: ContentType[];
}> = {
  Yemek: {
    creators: ["yemek_ustasi", "chef_istanbul", "sokak_lezzet", "gurme_anne", "tarif_dunyasi", "mutfak_sirlari", "asci_basi_tr", "lezzet_duragi", "ev_yemekleri", "pasta_sanatcisi"],
    formats: ["Tutorial", "Mukbang", "Hikaye Anlatimi", "Once/Sonra", "POV"],
    sounds: [
      { name: "Street Food Beat", creator: "beatmaker_ist" },
      { name: "Kahvalti Vibes", creator: "morning_tr" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
      { name: "Nostalji 90lar", creator: "retro_tr" },
    ],
    hashtags: ["#yemektarifi", "#turkmutfagi", "#lezzet", "#tarif", "#yemek", "#kahvalti", "#tatli", "#sofrasi"],
    descriptions: [
      "Bu tarifi denemeyen kalmasin! Adim adim anlatiyorum",
      "En kolay ve lezzetli tarif burada, hadi mutfaga!",
      "Sokak lezzetleri turu - bu tadi baska yerde bulamazsiniz",
      "Babaannemin gizli tarifi, nesiller boyu aktarilan lezzet",
      "5 dakikada hazirlanan pratik tarif geldi!",
      "Bu yemegi yapinca herkes sasirdi, cok lezzetli!",
      "Evde restoran kalitesinde yemek yapmak bu kadar kolay",
      "Kahvalti sofraniz icin mukemmel tarif onerisi",
    ],
    contentTypes: ["creator_oncam", "tutorial", "storytelling"],
  },
  Komedi: {
    creators: ["komedi_krali", "comedy_king", "mizahsor_tr", "gulme_krizi", "espri_ustasi", "parodi_tr", "sketch_master", "capsci_official", "kahkaha_club", "sahne_tr"],
    formats: ["POV", "Hikaye Anlatimi", "Duet", "Challenge"],
    sounds: [
      { name: "Komedi Sound Effect", creator: "soundfx_tr" },
      { name: "Turkish Drill Beat", creator: "drill_ankara" },
      { name: "Anlatamam", creator: "tarkan" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
    ],
    hashtags: ["#komedi", "#mizah", "#caps", "#eglence", "#gulumseten", "#turkkomedin", "#sketch", "#parodi"],
    descriptions: [
      "Herkesin basina gelmistir, cok komik durum!",
      "Turk ailelerinde gercekler - anneler vs babalar",
      "Bu duruma dusen tek ben miyim? Yorumlara yazin!",
      "Turk annesi olmanin zorluklari, herkes bilir!",
      "Yurt hayatinin kimsenin anlatmadigi gercekleri",
      "Sinif ortaminda yasananlar, hepimiz oradaydik",
      "Turk dugunlerinde yasanan klasik anlar",
      "Patronla calisan arasindaki gercekler",
    ],
    contentTypes: ["comedy_skit", "creator_oncam", "storytelling"],
  },
  Seyahat: {
    creators: ["gezgin_tr", "travel_antalya", "anadolu_gezgini", "rota_tr", "kesfet_turkiye", "yolcu_vlog", "tatilci_rehber", "mekan_onerir", "gezi_rehberi", "macera_tr"],
    formats: ["POV", "Hikaye Anlatimi", "Tutorial", "Once/Sonra"],
    sounds: [
      { name: "Istanbul Nights", creator: "dj_deep_tr" },
      { name: "Anadolu Rock", creator: "rocktr" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
      { name: "Ela Gozlum", creator: "emircan_igan" },
    ],
    hashtags: ["#seyahat", "#turkiye", "#gezi", "#tatil", "#kesfet", "#travel", "#istanbul", "#kapadokya"],
    descriptions: [
      "Turkiye'nin gizli cenneti - bu mekan inanilmaz!",
      "Bu yeri mutlaka gormelisiniz, rehber videom geldi",
      "Kapadokya'da unutulmaz anlar, nasil gidilir anlatiyorum",
      "100 TL ile bir gun gezisi, butce dostu seyahat",
      "Istanbul'un bilinmeyen sokaklari, yerel rehber",
      "Bu rotayi bilen cok az, gizli cennet buldum",
      "Antalya tatil rehberi - en iyi mekanlar",
      "24 saatte sehir turu, hadi benimle gelin!",
    ],
    contentTypes: ["creator_oncam", "storytelling", "tutorial"],
  },
  Moda: {
    creators: ["moda_guru", "style_icon", "kombin_tr", "ootd_queen", "sokak_modasi", "trend_setter_tr", "vintage_lover", "butik_tr", "stilist_maya", "gardrob_tr"],
    formats: ["Get Ready With Me", "Once/Sonra", "Tutorial", "POV"],
    sounds: [
      { name: "Gece Gunduz", creator: "edis" },
      { name: "Nostalji 90lar", creator: "retro_tr" },
      { name: "Turkish Drill Beat", creator: "drill_ankara" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
    ],
    hashtags: ["#moda", "#kombin", "#ootd", "#stil", "#trend", "#sokakmodasi", "#vintage", "#grwm"],
    descriptions: [
      "Bu sezonda herkes bunu giyecek, trend alarm!",
      "Uygun fiyatli kombin onerileri, butce dostu sikilik",
      "Sokak modasi trendleri - kameraya yakalandim!",
      "Okul kombini 7 gun challenge, hangisi en iyi?",
      "Vintage vs modern kombin karsilastirmasi",
      "50 TL ile sik kombin mumkun mu? Ispatliyorum!",
      "Bu sezonun en trend parcalari, hepsi uzerinde",
      "GRWM - is icin hazirlaniyor, kombin onerisi",
    ],
    contentTypes: ["creator_oncam", "tutorial", "challenge"],
  },
  Teknoloji: {
    creators: ["tech_master", "code_wizard", "dijital_tr", "yazilimci_ali", "gadget_guru_tr", "teknoloji_tr", "app_review_tr", "oyun_pc", "yapay_zeka_tr", "siber_guvenlik"],
    formats: ["Tutorial", "Hikaye Anlatimi", "POV", "Once/Sonra"],
    sounds: [
      { name: "Gaming Hype", creator: "gamer_sounds" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
      { name: "Turkish Drill Beat", creator: "drill_ankara" },
      { name: "Istanbul Nights", creator: "dj_deep_tr" },
    ],
    hashtags: ["#teknoloji", "#tech", "#iphone", "#yapayZeka", "#yazilim", "#gadget", "#bilisim", "#uygulama"],
    descriptions: [
      "Bu ozelligi biliyor muydunuz? Gizli iPhone hileleri",
      "En iyi teknoloji urunleri, detayli inceleme",
      "Yapay zeka ile neler yapilabilir, gosterdim!",
      "Bu uygulamayi herkes indirmeli, hayat kurtariyor",
      "Telefon almadan once bilmeniz gereken 5 sey",
      "Yazilimci olarak bir gunum nasil geciyor",
      "En iyi butce telefon incelemesi, sok olacaksiniz",
      "Bu teknoloji hilesi hayatinizi degistirecek",
    ],
    contentTypes: ["creator_oncam", "tutorial", "storytelling"],
  },
  Vlog: {
    creators: ["vlog_turkey", "gunluk_hayat", "rutin_tr", "ev_turu_tr", "istanbul_vlog", "ogrenci_vlog", "cift_vlog", "anne_vlog", "yasam_kocu", "minimalist_tr"],
    formats: ["Hikaye Anlatimi", "POV", "Get Ready With Me", "Tutorial"],
    sounds: [
      { name: "Kahvalti Vibes", creator: "morning_tr" },
      { name: "Slow Turkish", creator: "slowmusic_tr" },
      { name: "Nostalji 90lar", creator: "retro_tr" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
    ],
    hashtags: ["#vlog", "#gunluk", "#rutin", "#hayat", "#evturu", "#sabahrutini", "#yasam", "#birgunumhayat"],
    descriptions: [
      "Bir gunum nasil geciyor? Sabahtan aksama kadar",
      "Sabah rutinimde degisiklik, yeni duzenim",
      "Ev turumu gormelisiniz, yeni dekorasyon",
      "Universite ogrencisi olarak bir gunum",
      "Hafta sonu rutinim, benimle bir gun gecirin",
      "Yeni evimize tasindik! Ev turu geldi",
      "Calisan bir annenin gunluk rutini",
      "Minimalist yasam deneyi, 30 gunluk sonuclar",
    ],
    contentTypes: ["creator_oncam", "storytelling", "tutorial"],
  },
  "Eğitim": {
    creators: ["egitim_plus", "diy_master", "hoca_online", "matematik_tr", "ingilizce_ogret", "bilim_tr", "universite_rehber", "sinav_kocu", "tarih_anlat", "ogretmen_can"],
    formats: ["Tutorial", "Hikaye Anlatimi", "POV", "Once/Sonra"],
    sounds: [
      { name: "Motivasyon Konusmasi", creator: "motivasyon_tr" },
      { name: "Slow Turkish", creator: "slowmusic_tr" },
      { name: "Kahvalti Vibes", creator: "morning_tr" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
    ],
    hashtags: ["#egitim", "#ogren", "#yks", "#sinav", "#matematik", "#ingilizce", "#universite", "#ogrenci"],
    descriptions: [
      "Sinavda cikacak konular, mutlaka izleyin!",
      "5 dakikada ogrenin, en kolay anlatim",
      "Kimsenin anlatmadigi gercekler, egitim serisi",
      "YKS matematik hilesi, 10 soru daha fazla coz!",
      "Ingilizce ogrenmenin en kolay yolu, 3 ayda ogren",
      "Universite hayatta kalma rehberi, yeni baslayanlara",
      "Bu konuyu boyle anlatsalar herkes anlar!",
      "Calisma teknikleri, verimli ders calismak icin",
    ],
    contentTypes: ["creator_oncam", "tutorial", "storytelling"],
  },
  Spor: {
    creators: ["spor_kocu", "fitness_coach", "fit_yasam", "gym_turkiye", "personal_trainer_tr", "saglikli_yasam", "kosu_tr", "pilates_tr", "beslenme_kocu", "antrenor_murat"],
    formats: ["Tutorial", "Once/Sonra", "Challenge", "POV"],
    sounds: [
      { name: "Spor Motivasyon", creator: "gym_sounds" },
      { name: "Turkish Drill Beat", creator: "drill_ankara" },
      { name: "Motivasyon Konusmasi", creator: "motivasyon_tr" },
      { name: "Gaming Hype", creator: "gamer_sounds" },
    ],
    hashtags: ["#spor", "#fitness", "#antrenman", "#saglik", "#gym", "#egzersiz", "#donusum", "#motivasyon"],
    descriptions: [
      "30 gunluk donusum, once ve sonra sonuclari",
      "Evde yapilabilecek egzersizler, ekipmansiz",
      "Protein takviyesi rehberi, dogru beslenme",
      "Karin kasi programi, 4 haftalik plan",
      "Sabah antrenmanim, benimle birlikte yapin!",
      "Bu egzersizi yapmayanlar cok sey kaybediyor",
      "Yeni baslayanlar icin fitness rehberi",
      "Beslenme ve antrenman programim, detayli anlatim",
    ],
    contentTypes: ["creator_oncam", "tutorial", "challenge"],
  },
  "Müzik": {
    creators: ["muzik_tr", "gitar_dersi", "ses_sanati", "cover_krali", "sokak_muzisyen", "piyano_tr", "sarkici_deniz", "beatbox_tr", "akustik_sahne", "turkce_pop"],
    formats: ["Duet", "Challenge", "Hikaye Anlatimi", "Tutorial"],
    sounds: [
      { name: "Anlatamam", creator: "tarkan" },
      { name: "Ela Gozlum", creator: "emircan_igan" },
      { name: "Halay Remix 2024", creator: "halay_king" },
      { name: "Anadolu Rock", creator: "rocktr" },
    ],
    hashtags: ["#muzik", "#sarki", "#cover", "#gitar", "#piyano", "#turkpop", "#akustik", "#ses"],
    descriptions: [
      "Cover challenge kabul edildi! Bu sarki cok ozel",
      "Bu sarki cok farkli oldu, akustik versiyon",
      "Sokak muzisyeni performansi, inanilmaz yetenek",
      "Gitar dersi - bu akorlari hemen ogrenin",
      "Yeni sarkim cikageldi, ilk kez burada!",
      "Bu sarknin hikayesini biliyor muydunuz?",
      "Piyano ile Turk pop klasikleri, canli performans",
      "Duet challenge, sesinizi duymak istiyorum!",
    ],
    contentTypes: ["creator_oncam", "duet", "tutorial"],
  },
  Dans: {
    creators: ["dans_queen", "dans_atolye", "koreografi_tr", "zeybek_modern", "hip_hop_tr", "salsa_istanbul", "balet_tr", "dans_hocasi", "ritim_tr", "dans_okulu"],
    formats: ["Tutorial", "Challenge", "Duet", "POV"],
    sounds: [
      { name: "Halay Remix 2024", creator: "halay_king" },
      { name: "Turkish Drill Beat", creator: "drill_ankara" },
      { name: "Gece Gunduz", creator: "edis" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
    ],
    hashtags: ["#dans", "#dance", "#koreografi", "#challenge", "#halay", "#zeybek", "#dansdersi", "#ritim"],
    descriptions: [
      "Yeni koreografi geldi! Adim adim ogretiyorum",
      "Bu dansi herkes yapiyor, sen de dene!",
      "Tutorial ile adim adim dans dersi",
      "Halay challenge - kim daha iyi yapiyor?",
      "Bu koreografiyi ogrenmen lazim, trend oldu!",
      "Dans hocasi ile ders, baslangic seviyesi",
      "Zeybek modern yorumuyla karsinizda",
      "Dans challenge kabul edildi, sonuc inanilmaz!",
    ],
    contentTypes: ["creator_oncam", "tutorial", "challenge"],
  },
  "Güzellik": {
    creators: ["guzellik_tr", "makyaj_ustasi", "cilt_bakim_tr", "kozmetik_tr", "beauty_guru_ist", "sac_stilleri", "tirnak_sanati", "doktor_cilt", "parfum_rehber", "dogal_bakim"],
    formats: ["Get Ready With Me", "Tutorial", "Once/Sonra", "POV"],
    sounds: [
      { name: "Gece Gunduz", creator: "edis" },
      { name: "Slow Turkish", creator: "slowmusic_tr" },
      { name: "Nostalji 90lar", creator: "retro_tr" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
    ],
    hashtags: ["#guzellik", "#makyaj", "#ciltbakim", "#skincare", "#grwm", "#kozmetik", "#beauty", "#sacbakim"],
    descriptions: [
      "10 dakikada makyaj, hizli ve pratik teknikler",
      "Cilt bakim rutinim, sabah ve aksam adimlari",
      "Bu urun hayatimi degistirdi, detayli inceleme",
      "GRWM - ozel bir gece icin hazirlaniyor",
      "Makyaj donusumu, once ve sonra inanilmaz fark",
      "Butce dostu cilt bakim urunleri, hepsi ise yariyor",
      "Sac bakim rutinim ve onerilerim",
      "Doktorun onerileri ile dogru cilt bakimi",
    ],
    contentTypes: ["creator_oncam", "tutorial", "storytelling"],
  },
  Oyun: {
    creators: ["oyuncu_pro", "gamer_tr", "esports_ist", "minecraft_tr", "valorant_king", "mobile_gamer", "retro_oyuncu", "strateji_tr", "cosplay_tr", "oyun_inceleme"],
    formats: ["POV", "Challenge", "Hikaye Anlatimi", "Tutorial"],
    sounds: [
      { name: "Gaming Hype", creator: "gamer_sounds" },
      { name: "Turkish Drill Beat", creator: "drill_ankara" },
      { name: "Original Sound - Turkish Remix", creator: "djturk_official" },
      { name: "Komedi Sound Effect", creator: "soundfx_tr" },
    ],
    hashtags: ["#gaming", "#oyun", "#gamer", "#esports", "#valorant", "#minecraft", "#mobiloyun", "#gameplay"],
    descriptions: [
      "Bu oyunu oynamalisiniz! Detayli inceleme",
      "En iyi gaming anlari, efsane oynanis",
      "Efsane clutch ani, inanilmaz geri donus!",
      "Yeni cikan oyun incelemesi, almali mi?",
      "Bu taktik ile her maçi kazanirsiniz",
      "Gaming setup turu, butce dostu kurulum",
      "Turnuva finali, son an geri donus!",
      "Oyun hileleri ve ipuclari, pro gibi oyna",
    ],
    contentTypes: ["creator_oncam", "tutorial", "challenge"],
  },
};

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
  contentType: ContentType;
  creatorPresenceScore: number;
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

  const srng = (seed: number, off: number) => {
    const x = Math.sin(seed + off) * 10000;
    return x - Math.floor(x);
  };

  const allVideos: VideoListItem[] = [];
  // Generate 10 videos per category to ensure even distribution
  const videosPerCategory = 10;

  for (let catIdx = 0; catIdx < CATEGORIES.length; catIdx++) {
    const cat = CATEGORIES[catIdx];
    const profile = CATEGORY_PROFILES[cat];
    if (!profile) continue;

    for (let j = 0; j < videosPerCategory; j++) {
      const i = catIdx * videosPerCategory + j;
      const seed = i * 137 + 42;

      // Pick creator, format, sound, description FROM the category's own pool
      const creator = profile.creators[Math.floor(srng(seed, 2) * profile.creators.length)];
      const format = profile.formats[Math.floor(srng(seed, 3) * profile.formats.length)];
      const soundEntry = profile.sounds[Math.floor(srng(seed, 4) * profile.sounds.length)];
      const contentType = profile.contentTypes[Math.floor(srng(seed, 13) * profile.contentTypes.length)];

      const views = Math.round(50000 + srng(seed, 5) * 5000000);
      const likes = Math.round(views * (0.03 + srng(seed, 6) * 0.12));
      const comments = Math.round(likes * (0.05 + srng(seed, 7) * 0.15));
      const shares = Math.round(likes * (0.02 + srng(seed, 8) * 0.08));
      const engRate = Math.round(((likes + comments + shares) / views) * 10000) / 100;
      const pubDate = new Date();
      pubDate.setDate(pubDate.getDate() - Math.floor(srng(seed, 9) * 21));
      const duration = 15 + Math.floor(srng(seed, 10) * 50);

      // Build hashtags from the category's own pool + generic tags
      const hashtags = ["#kesfet", "#trend"];
      const numCatHashtags = 2 + Math.floor(srng(seed, 14) * 3);
      const shuffled = [...profile.hashtags].sort(() => srng(seed, 15) - 0.5);
      hashtags.push(...shuffled.slice(0, numCatHashtags));

      // Description from the category's own pool
      const desc = profile.descriptions[Math.floor(srng(seed, 11) * profile.descriptions.length)] + " " + hashtags.join(" ");

      // Creator Presence Score for generated data
      const catPresenceMap: Record<string, number> = {
        Komedi: 90, Vlog: 85, "Eğitim": 80, "Güzellik": 80, Moda: 75,
        Spor: 70, Yemek: 65, "Müzik": 65, Dans: 60, Teknoloji: 55,
        Seyahat: 40, Oyun: 25,
      };
      const fmtPresenceMap: Record<string, number> = {
        "Get Ready With Me": 95, "POV": 90, "Hikaye Anlatimi": 85,
        "Mukbang": 80, "Challenge": 75, "Tutorial": 70, "Duet": 65,
        "Önce/Sonra": 60, "Kısa Video": 50,
      };
      const creatorPresenceScore = Math.max(0, Math.min(100, Math.round(
        (catPresenceMap[cat] ?? 50) * 0.45 +
        (fmtPresenceMap[format] ?? 50) * 0.40 +
        (30 + srng(seed, 16) * 40) * 0.15
      )));

      const presenceBoost = creatorPresenceScore / 100;
      const viralScore = Math.round(
        (engRate / 15 * 0.30 + (views / 5000000) * 0.25 + presenceBoost * 0.25 + Math.max(0, 1 - Math.floor(srng(seed, 9) * 21) / 21) * 0.20) * 100
      ) / 10;

      allVideos.push({
        id: `v-${i}`,
        tiktokId: `tt_${1000000 + i}`,
        description: desc,
        creator,
        creatorAvatar: null,
        thumbnailUrl: `https://picsum.photos/seed/vid${i}/400/700`,
        videoUrl: `https://www.tiktok.com/@${creator}/video/${1000000 + i}`,
        tiktokUrl: `https://www.tiktok.com/@${creator}/video/${1000000 + i}`,
        views,
        likes,
        comments,
        shares,
        engagementRate: engRate,
        viralScore: Math.min(10, Math.max(0.1, viralScore)),
        duration,
        format,
        category: cat,
        contentType,
        creatorPresenceScore,
        soundId: `s-${Math.floor(srng(seed, 4) * 8)}`,
        soundName: soundEntry.name,
        soundCreator: soundEntry.creator,
        publishedAt: pubDate.toISOString(),
        hashtags,
      });
    }
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
