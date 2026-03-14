// ============================================================
// Comment Analysis Utility
// Analyzes video engagement patterns based on comment metrics
// ============================================================

export interface CommentAnalysis {
  commentToViewRatio: number;       // % of viewers who comment
  commentToLikeRatio: number;       // comments per like
  engagementDepth: "düşük" | "orta" | "yüksek" | "çok yüksek";
  audienceActivity: string;         // description of audience behavior
  sentimentEstimate: "pozitif" | "nötr" | "karma" | "tartışmalı" | "düşük etkileşim";
  discussionPotential: number;      // 0-100 score
  controversyScore: number;         // 0-100 how controversial/debate-sparking
  viralCommentPotential: boolean;   // whether comments themselves are driving virality
  recommendations: string[];
  analysisMethod: string;
}

/**
 * Analyze comment engagement patterns for a video.
 * Since we don't have actual comment text, we derive insights from
 * numerical patterns (comment count vs views, likes, shares).
 */
export function analyzeComments(params: {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  category?: string;
  followerCount?: number;
}): CommentAnalysis {
  const { views, likes, comments, shares, duration, category, followerCount } = params;

  // Ratios
  const commentToViewRatio = views > 0 ? Math.round((comments / views) * 10000) / 100 : 0;
  const commentToLikeRatio = likes > 0 ? Math.round((comments / likes) * 100) / 100 : 0;
  const shareToCommentRatio = comments > 0 ? Math.round((shares / comments) * 100) / 100 : 0;

  // Engagement depth: how deeply the audience is engaging
  let engagementDepth: CommentAnalysis["engagementDepth"] = "düşük";
  if (commentToViewRatio >= 2) engagementDepth = "çok yüksek";
  else if (commentToViewRatio >= 0.8) engagementDepth = "yüksek";
  else if (commentToViewRatio >= 0.3) engagementDepth = "orta";

  // Discussion potential (0-100)
  // High comments/view ratio + high comments/like ratio = high discussion
  const cvScore = Math.min(commentToViewRatio / 2, 1) * 40;
  const clScore = Math.min(commentToLikeRatio / 0.5, 1) * 30;
  const volumeScore = Math.min(comments / 1000, 1) * 20;
  const durationBonus = duration > 30 ? 10 : duration > 15 ? 5 : 0;
  const discussionPotential = Math.round(Math.min(cvScore + clScore + volumeScore + durationBonus, 100));

  // Sentiment estimate based on multiple engagement signal patterns
  let sentimentEstimate: CommentAnalysis["sentimentEstimate"] = "nötr";
  const likeToViewRatio = views > 0 ? likes / views : 0;
  const commentToViewPct = commentToViewRatio / 100; // as decimal for comparison

  if (likeToViewRatio < 0.01 && commentToViewPct < 0.001) {
    // Very low engagement overall
    sentimentEstimate = "düşük etkileşim";
  } else if (commentToViewPct > 0.01 && likeToViewRatio < 0.03) {
    // High comment/view ratio with LOW like/view = controversial debate content
    sentimentEstimate = "tartışmalı";
  } else if (commentToViewPct > 0.01 && likeToViewRatio > 0.05) {
    // High comment/view ratio with high like/view = active engaged positive audience
    sentimentEstimate = "pozitif";
  } else if (likeToViewRatio > 0.08 && commentToViewPct < 0.005) {
    // Very high like/view ratio with low comments = audience loves it silently
    sentimentEstimate = "pozitif";
  } else if (commentToLikeRatio > 0.5 && likeToViewRatio < 0.03) {
    // Fallback: high comments relative to likes with low like ratio = mixed
    sentimentEstimate = "karma";
  }

  // Controversy score (0-100): measures how debate-sparking a video is
  // High comments relative to likes = more controversial
  // High shares relative to likes = divisive content people want others to see
  const clControversy = Math.min(commentToLikeRatio / 0.8, 1) * 50;
  const shareToLikeRatio = likes > 0 ? shares / likes : 0;
  const slControversy = Math.min(shareToLikeRatio / 0.5, 1) * 30;
  const lowLikeBonus = likeToViewRatio < 0.03 ? 20 : likeToViewRatio < 0.05 ? 10 : 0;
  const controversyScore = Math.round(Math.min(clControversy + slControversy + lowLikeBonus, 100));

  // Viral comment potential: estimate whether comments themselves are driving virality
  // Signals: very high comment-to-view ratio, high discussion potential,
  // comments outpacing likes (people come to debate, not just consume)
  const viralCommentPotential =
    commentToViewPct > 0.015 &&
    commentToLikeRatio > 0.3 &&
    comments > 500 &&
    (controversyScore > 50 || (shareToCommentRatio > 0.8 && commentToViewPct > 0.01));

  // Audience activity description
  let audienceActivity: string;
  if (commentToViewRatio >= 2) {
    audienceActivity = "Çok aktif bir kitle — yorum oranı ortalamanın çok üstünde. Video tartışma yaratan bir içerik.";
  } else if (commentToViewRatio >= 0.8) {
    audienceActivity = "Aktif bir kitle — izleyiciler yorum yapmaya meyilli. İçerik etkileşim yaratıyor.";
  } else if (commentToViewRatio >= 0.3) {
    audienceActivity = "Ortalama bir etkileşim düzeyi — izleyicilerin bir kısmı yorum bırakıyor.";
  } else if (commentToViewRatio >= 0.1) {
    audienceActivity = "Düşük yorum oranı — izleyiciler daha çok pasif izliyor.";
  } else {
    audienceActivity = "Çok düşük yorum etkileşimi — izleyiciler beğeniyor ama yorum yapmıyor.";
  }

  // Category-specific context and recommendations
  const categoryContext: Record<string, string[]> = {
    "Komedi": [
      "Komedi içerikleri genellikle etiketleme yorumları alır.",
      "Arkadaş etiketleme oranını artırmak için videonun sonunda 'Bu kim?' tarzı sorular sorun.",
      "Komedi serisi oluşturmak yorum sadakatini artırır — takipçiler devamını ister.",
    ],
    "Eğitim": [
      "Eğitim içerikleri soru-cevap yorumları çeker.",
      "Yorumlarda gelen soruları bir sonraki videoda yanıtlayarak topluluk oluşturun.",
      "Eğitim videolarında 'Bunu biliyor muydunuz?' formatı yorum oranını artırır.",
    ],
    "Dans": [
      "Dans videolarında yorumlar genellikle beğeni niteliğindedir.",
      "Challenge başlatarak takipçilerin kendi videolarını paylaşmasını sağlayın.",
      "Koreografi öğretici içerik eklemek yorum etkileşimini artırabilir.",
    ],
    "Müzik": [
      "Müzik videolarında şarkı sözü ve duygusal yorumlar yaygındır.",
      "Cover veya remix içeriklerde orijinal sanatçıyı etiketlemek keşfedilebilirliği artırır.",
      "'Bu şarkıyı dinleyince ne hissediyorsunuz?' gibi sorular duygusal bağ kurar.",
    ],
    "Moda": [
      "Moda içeriklerinde ürün soruları sık görülür.",
      "Ürün linklerini bio'ya ekleyip yorumlarda yönlendirme yaparak etkileşimi artırın.",
      "'Hangisini tercih edersiniz?' formatı A/B tercih yorumları çeker.",
    ],
    "Yemek": [
      "Yemek videolarında tarif soruları ve deneyim paylaşımları yaygındır.",
      "Tarifi yorumlarda paylaşmak hem etkileşim hem güven oluşturur.",
      "'Bu tarifi denediniz mi?' sorusu deneyim paylaşımlarını teşvik eder.",
    ],
    "Spor": [
      "Spor videolarında taraftar tartışmaları yoğun yorum çeker.",
      "Tahmin soruları (örn: 'Sizce kim kazanır?') yorum katılımını artırır.",
      "Antrenman videolarında ilerleme paylaşımı isteyin — topluluk motivasyonu yükselir.",
    ],
    "Teknoloji": [
      "Teknoloji incelemelerinde kullanıcılar kendi deneyimlerini paylaşır.",
      "'Siz hangi cihazı kullanıyorsunuz?' sorusu karşılaştırma yorumları çeker.",
      "Hata ve çözüm paylaşımları eğitim değerini artırarak tekrar ziyaret sağlar.",
    ],
    "Günlük Yaşam": [
      "Vlog içeriklerde kişisel bağ kurmak yorum oranını doğrudan etkiler.",
      "Takipçilere ismiyle hitap etmek ve yorumlarını yanıtlamak bağlılığı artırır.",
      "Günlük rutininizle ilgili anket tarzı sorular yorum çeşitliliğini artırır.",
    ],
    "Güzellik": [
      "Güzellik içeriklerinde ürün önerileri ve cilt tipi soruları yaygındır.",
      "'Cilt tipinize göre hangisini önerirsiniz?' sorusu kişisel deneyim paylaşımı çeker.",
      "Öncesi-sonrası formatı yorum ve kaydetme oranını artırır.",
    ],
  };

  // Recommendations
  const recommendations: string[] = [];

  if (commentToViewRatio < 0.3) {
    recommendations.push("Yorumlarda soru sorarak etkileşimi artırabilirsiniz (örn: 'Siz ne düşünüyorsunuz?')");
  }
  if (commentToViewRatio >= 0.8 && shareToCommentRatio < 0.5) {
    recommendations.push("Yorum oranı yüksek ama paylaşım düşük — tartışma yaratan ama paylaşılmayan içerik. CTA ekleyerek paylaşımı teşvik edin.");
  }
  if (commentToLikeRatio > 0.4) {
    recommendations.push("Yorum/beğeni oranı yüksek — içerik tartışma yaratıyor. Bu tarz içeriklere devam edin.");
  }
  if (sentimentEstimate === "tartışmalı") {
    recommendations.push("İçerik tartışmalı bir konu — yorumlarda moderasyon yaparak olumsuz algıyı kontrol edin.");
    recommendations.push("Tartışmalı içerikler keşfet algoritmasında öne çıkabilir, ancak marka güvenliğine dikkat edin.");
  }
  if (sentimentEstimate === "düşük etkileşim") {
    recommendations.push("Etkileşim çok düşük — hedef kitleyi daha iyi analiz edin ve içerik formatını değiştirmeyi deneyin.");
  }
  if (viralCommentPotential) {
    recommendations.push("Yorumlar viralitenin ana kaynağı olabilir — yorum bölümünü aktif tutun ve öne çıkan yorumları sabitleyin.");
  }
  if (controversyScore > 70) {
    recommendations.push("Tartışma skoru çok yüksek — bu içerik güçlü tepkiler çekiyor. Topluluk yönetimini güçlendirin.");
  }
  if (duration < 15 && commentToViewRatio < 0.2) {
    recommendations.push("Kısa videolarda yorum oranı düşük olabilir. Videonun sonuna soru ekleyerek yorum almayı deneyin.");
  }
  if (engagementDepth === "çok yüksek") {
    recommendations.push("Bu içerik çok yüksek tartışma potansiyeline sahip — benzer konularda seri yapın.");
  }
  if (followerCount && followerCount > 0 && views > followerCount * 3) {
    recommendations.push("Video takipçi sayısının çok üstünde görüntülenme almış — keşfet algoritmasında başarılı.");
  }

  if (category && categoryContext[category]) {
    for (const tip of categoryContext[category]) {
      recommendations.push(tip);
    }
  }

  // Ensure at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push("Yorum bölümünde aktif olun — izleyici yorumlarına cevap vermek etkileşimi artırır.");
  }

  return {
    commentToViewRatio,
    commentToLikeRatio,
    engagementDepth,
    audienceActivity,
    sentimentEstimate,
    discussionPotential,
    controversyScore,
    viralCommentPotential,
    recommendations,
    analysisMethod: "Etkileşim metrikleri üzerinden tahmini analiz (yorum sayısı, beğeni oranı, paylaşım oranı). Gerçek yorum metni analiz edilmemektedir.",
  };
}

/**
 * Analyze comment patterns across multiple videos for a creator
 */
export function analyzeCreatorCommentPatterns(videos: Array<{
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  category?: string;
}>): {
  avgCommentRate: number;
  bestCommentVideo: number;
  worstCommentVideo: number;
  commentTrend: "artıyor" | "azalıyor" | "sabit";
  overallDepth: CommentAnalysis["engagementDepth"];
  insights: string[];
} {
  if (videos.length === 0) {
    return {
      avgCommentRate: 0,
      bestCommentVideo: 0,
      worstCommentVideo: 0,
      commentTrend: "sabit",
      overallDepth: "düşük",
      insights: [],
    };
  }

  const rates = videos.map((v) => v.views > 0 ? (v.comments / v.views) * 100 : 0);
  const avgCommentRate = Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 100) / 100;
  const bestCommentVideo = Math.max(...rates);
  const worstCommentVideo = Math.min(...rates);

  // Trend: compare first half vs second half
  const mid = Math.floor(rates.length / 2);
  const firstHalf = rates.slice(0, mid);
  const secondHalf = rates.slice(mid);
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / (firstHalf.length || 1);
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / (secondHalf.length || 1);

  let commentTrend: "artıyor" | "azalıyor" | "sabit" = "sabit";
  if (secondAvg > firstAvg * 1.2) commentTrend = "artıyor";
  else if (secondAvg < firstAvg * 0.8) commentTrend = "azalıyor";

  let overallDepth: CommentAnalysis["engagementDepth"] = "düşük";
  if (avgCommentRate >= 2) overallDepth = "çok yüksek";
  else if (avgCommentRate >= 0.8) overallDepth = "yüksek";
  else if (avgCommentRate >= 0.3) overallDepth = "orta";

  const insights: string[] = [];
  if (commentTrend === "artıyor") {
    insights.push("Yorum oranınız son videolarda artış gösteriyor — içerik stratejiniz etkili.");
  } else if (commentTrend === "azalıyor") {
    insights.push("Yorum oranınız düşüyor — içerik formatınızı yeniden değerlendirin.");
  }

  if (bestCommentVideo > avgCommentRate * 3) {
    insights.push("Bazı videolarınız ortalamanın çok üstünde yorum alıyor — bu videoların ortak özelliklerini inceleyin.");
  }

  // Category insight
  const catComments: Record<string, number[]> = {};
  for (const v of videos) {
    const cat = v.category || "Genel";
    if (!catComments[cat]) catComments[cat] = [];
    catComments[cat].push(v.views > 0 ? (v.comments / v.views) * 100 : 0);
  }

  const catAvgs = Object.entries(catComments).map(([cat, rates]) => ({
    cat,
    avg: rates.reduce((a, b) => a + b, 0) / rates.length,
  })).sort((a, b) => b.avg - a.avg);

  if (catAvgs.length > 1) {
    insights.push(`En çok yorum alan kategori: ${catAvgs[0].cat} (ort. %${catAvgs[0].avg.toFixed(2)})`);
  }

  return {
    avgCommentRate,
    bestCommentVideo,
    worstCommentVideo,
    commentTrend,
    overallDepth,
    insights,
  };
}
