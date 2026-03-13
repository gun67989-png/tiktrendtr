const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let claudeClient = null;
let geminiModel = null;

function initClients() {
  if (process.env.ANTHROPIC_API_KEY && !claudeClient) {
    try {
      claudeClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      console.log('[AI] Claude client hazir');
    } catch (err) {
      console.warn('[AI] Claude client olusturulamadi:', err.message);
    }
  }

  if (process.env.GOOGLE_AI_KEY && !geminiModel) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
      geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      console.log('[AI] Gemini client hazir');
    } catch (err) {
      console.warn('[AI] Gemini client olusturulamadi:', err.message);
    }
  }
}

/**
 * Claude: Yorum analizi + Video viral potansiyel & kitle tipi
 * (Eski GPT gorevi: viralPotential + audienceType buraya taşındı)
 */
async function analyzeWithClaude(comments, videos) {
  const results = {
    comments: comments.map(c => ({
      ...c,
      isSpam: false,
      isToxic: false,
      isBot: false,
      sentiment: 'neutral',
    })),
    videoScores: [],
  };

  if (!claudeClient) return results;

  // 1. Yorum analizi
  if (comments.length > 0) {
    try {
      const batches = [];
      for (let i = 0; i < comments.length; i += 50) {
        batches.push(comments.slice(i, i + 50));
      }

      const allCommentResults = [];

      for (const batch of batches) {
        const commentsForAI = batch.map(c => ({
          username: c.username,
          text: c.text,
        }));

        const response = await claudeClient.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: `Sen Turkiye'nin en iyi TikTok yorum moderatorusun. Turkce ve Ingilizce yorumlari analiz ediyorsun.

Her yorum icin asagidaki kriterleri DIKKATLI belirle:

1. isSpam: true/false
   - Link, telefon numarasi, "takip et", "bak profilime", "DM at", "linkte" gibi ifadeler → true
   - Rastgele emoji spam, copy-paste tekrar → true
   - Gercek bir fikir/tepki bildiriyorsa → false

2. isToxic: true/false
   - Hakaret, kufur, nefret soylemi, cinsiyet/irk/din ayrımcılığı → true
   - Agresif tehdit ("oldurecegim", "seni bulacagim") → true
   - Sert elestiri ama hakaret icermeyen → false
   - Saka/ironi iceriginde kufur → context'e gore karar ver

3. isBot: true/false
   - "Harika!", "Guzel", "Wow", "❤️❤️❤️" gibi tek kelime/emoji yorumlar → true
   - Ayni kullanicidan ayni kalip → true
   - Kisa ama spesifik bir sey soyluyorsa ("bu tarif cok iyi, kaç dakika pisirdin?") → false

4. sentiment: "positive" | "neutral" | "negative"
   - Begeni, takdir, heyecan → positive
   - Soru, bilgilendirme → neutral
   - Elestiri, sikayet, hayal kirikligi → negative

Sadece JSON array dondur, baska hicbir sey yazma.
Format: [{"username": "ali", "isSpam": false, "isToxic": false, "isBot": false, "sentiment": "positive"}]`,
          messages: [
            {
              role: 'user',
              content: JSON.stringify(commentsForAI),
            },
          ],
        });

        const text = response.content[0]?.text || '[]';
        try {
          const parsed = JSON.parse(text);
          for (let i = 0; i < batch.length; i++) {
            const aiResult = parsed[i] || {};
            allCommentResults.push({
              ...batch[i],
              isSpam: aiResult.isSpam || false,
              isToxic: aiResult.isToxic || false,
              isBot: aiResult.isBot || false,
              sentiment: aiResult.sentiment || 'neutral',
            });
          }
        } catch {
          allCommentResults.push(...batch.map(c => ({
            ...c,
            isSpam: false,
            isToxic: false,
            isBot: false,
            sentiment: 'neutral',
          })));
        }
      }

      results.comments = allCommentResults;
      console.log(`[AI/Claude] ${allCommentResults.length} yorum analiz edildi`);
    } catch (err) {
      console.error('[AI/Claude] Yorum analizi hatasi:', err.message);
    }
  }

  // 2. Video viral potansiyel & kitle tipi analizi (eski GPT gorevi)
  if (videos.length > 0) {
    try {
      const videosForAI = videos.slice(0, 30).map(v => ({
        id: v.id,
        description: v.description,
        stats: v.stats,
        hashtags: v.hashtags,
      }));

      const response = await claudeClient.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `Sen Turkiye TikTok pazarinda uzman bir viral trend analistisin. Sana video verileri gelecek.

Her video icin su kriterleri DETAYLI analiz et:

1. viralPotential (0-10):
   Puanlama kriterleri:
   - Engagement orani (likes+comments+shares / views): yuksek oran = yuksek puan
   - Share/view orani: paylasim en guclu viral sinyali, agirlikli deger
   - Engagement velocity: kisa surede yuksek etkilesim = bonus
   - Surprise factor: takipci sayisina gore beklenmedik performans = bonus
   - Icerik tipi: tutorial, POV, storytime, challenge = dogal viral potansiyel
   - Hashtag kalitesi: trend hashtag sayisi ve cesitliligi

   0-2: Dusuk performans
   3-4: Ortanin altinda
   5-6: Iyi performans
   7-8: Viral potansiyel yuksek
   9-10: Mega viral / trending

2. audienceType:
   - "gen-z": 15-24 yas, dans, challenge, meme, hizli kesim, slang
   - "millenial": 25-35 yas, lifestyle, yemek, cocuk, nostalji, detayli icerik
   - "general": genis kitle, haberler, egitim, komedi, evrensel konular
   - "niche": spesifik ilgi alani (gaming, teknik, hobi, profesyonel)

3. contentCategory (YENİ):
   - "entertainment": eglence, komedi, dans
   - "education": ogretici, bilgilendirici
   - "lifestyle": moda, guzellik, yemek, seyahat
   - "commerce": urun tanitimi, reklam, haul

Sadece JSON dondur, baska hicbir sey yazma.
Format: [{"id": "video_id", "viralPotential": 8, "audienceType": "gen-z", "contentCategory": "entertainment"}]`,
        messages: [
          {
            role: 'user',
            content: JSON.stringify(videosForAI),
          },
        ],
      });

      const text = response.content[0]?.text || '[]';
      try {
        results.videoScores = JSON.parse(text);
        console.log(`[AI/Claude] ${results.videoScores.length} video viral analizi yapildi`);
      } catch {
        console.warn('[AI/Claude] Video analizi JSON parse hatasi');
      }
    } catch (err) {
      console.error('[AI/Claude] Video analizi hatasi:', err.message);
    }
  }

  return results;
}

/**
 * Gemini: Hashtag onerisi + trend analizi + dil & kitle analizi + mood
 * (Eski GPT gorevi: emergingTrends, topTrends, overallMood buraya eklendi)
 */
async function analyzeWithGemini(videos, comments) {
  if (!geminiModel || videos.length === 0) {
    return {
      suggestedHashtags: [],
      contentLanguages: {},
      streamMood: 'neutral',
      categoryBreakdown: {},
      trendPredictions: [],
      emergingTrends: [],
      topTrends: [],
      overallMood: 'neutral',
      viralSounds: [],
      contentGaps: [],
    };
  }

  try {
    const dataForGemini = {
      videos: videos.slice(0, 25).map(v => ({
        id: v.id,
        description: v.description,
        hashtags: v.hashtags,
        stats: v.stats,
      })),
      sampleComments: comments.slice(0, 50).map(c => c.text),
    };

    const prompt = `Sen Turkiye TikTok pazarinin en iyi trend analistisin. Asagidaki video ve yorum verilerini analiz et.

VERI:
${JSON.stringify(dataForGemini)}

ONEMLI KURALLAR:
- Turkiye TikTok pazarina OZEL analiz yap
- Hashtag onerileri TURKCE ve GUNCEL olsun
- Trend tahminlerinde Turkiye'deki kulturel etkinlikleri, tatilleri, gundem konularini dikkate al
- Sadece valid JSON dondur, baska hicbir sey yazma

Asagidaki JSON yapisini dondur:
{
  "suggestedHashtags": ["#hashtag1", "#hashtag2", ...],
  "contentLanguages": {"tr": 60, "en": 30, "other": 10},
  "streamMood": "excited" | "calm" | "funny" | "dramatic" | "educational" | "neutral",
  "categoryBreakdown": {"entertainment": 40, "education": 20, "lifestyle": 15, ...},
  "trendPredictions": [
    {"topic": "konu_adi", "confidence": 0.85, "direction": "rising" | "stable" | "falling", "reason": "neden yukseliyor"}
  ],
  "contentQualityScore": 7.5,
  "bestPostingTimes": ["19:00-21:00", "12:00-14:00"],
  "audienceInsights": {
    "primaryAge": "18-24",
    "interests": ["muzik", "komedi"],
    "engagementStyle": "passive" | "active" | "creator"
  },
  "emergingTrends": [
    {"videoId": "id", "trends": ["dans", "challenge"]}
  ],
  "topTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
  "overallMood": "energetic",
  "viralSounds": [
    {"name": "ses_adi", "usageGrowth": "rising", "category": "music" | "sound" | "original"}
  ],
  "contentGaps": ["az uretilen ama talep olan icerik turleri"]
}

DETAYLI ANALIZ KURALLARI:
- suggestedHashtags: 15 adet, Turkce agirlikli, guncel trendlere uygun
- trendPredictions: En az 7 tahmin, confidence 0-1 arasi, reason ile aciklama
- viralSounds (YENI): Verideki sesleri analiz et, hangileri yukseliyor?
- contentGaps (YENI): Veride eksik olan ama Turkiye'de talep goren icerik turleri
- topTrends: En az 7 trend belirle
- emergingTrends: Her video icin hashtag ve aciklamadan trend cikar
- overallMood: Genel icerik enerjisi

Return ONLY the JSON object, nothing else.`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    // JSON'u ayikla (bazen markdown code block icinde geliyor)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(jsonStr);
      console.log(`[AI/Gemini] Analiz tamamlandi: ${(parsed.suggestedHashtags || []).length} hashtag, ${(parsed.topTrends || []).length} trend, ${(parsed.trendPredictions || []).length} tahmin`);
      return parsed;
    } catch {
      console.warn('[AI/Gemini] JSON parse hatasi');
      return {
        suggestedHashtags: [],
        contentLanguages: {},
        streamMood: 'neutral',
        categoryBreakdown: {},
        trendPredictions: [],
        emergingTrends: [],
        topTrends: [],
        overallMood: 'neutral',
        viralSounds: [],
        contentGaps: [],
      };
    }
  } catch (err) {
    console.error('[AI/Gemini] Analiz hatasi:', err.message);
    return {
      suggestedHashtags: [],
      contentLanguages: {},
      streamMood: 'neutral',
      categoryBreakdown: {},
      trendPredictions: [],
      emergingTrends: [],
      topTrends: [],
      overallMood: 'neutral',
      viralSounds: [],
      contentGaps: [],
    };
  }
}

/**
 * Ana isleme fonksiyonu: Claude + Gemini paralel calistir (GPT devre disi)
 */
async function processData(scrapedData) {
  if (!scrapedData || !scrapedData.videos) {
    return {
      processedAt: Date.now(),
      trendScore: 0,
      topHashtags: [],
      videos: [],
      source: scrapedData?.source || 'unknown',
    };
  }

  initClients();

  const { videos } = scrapedData;

  // Tum yorumlari topla
  const allComments = [];
  const commentVideoMap = new Map();
  for (const video of videos) {
    if (video.comments && video.comments.length > 0) {
      for (const comment of video.comments) {
        commentVideoMap.set(allComments.length, video.id);
        allComments.push(comment);
      }
    }
  }

  // Claude + Gemini paralel calistir
  console.log('[AI] 2-li paralel analiz basliyor (Claude + Gemini)...');
  const [claudeResults, geminiResults] = await Promise.all([
    analyzeWithClaude(allComments, videos).catch(err => {
      console.error('[AI] Claude hatasi:', err.message);
      return {
        comments: allComments.map(c => ({ ...c, isSpam: false, isToxic: false, isBot: false, sentiment: 'neutral' })),
        videoScores: [],
      };
    }),
    analyzeWithGemini(videos, allComments).catch(err => {
      console.error('[AI] Gemini hatasi:', err.message);
      return { suggestedHashtags: [], contentLanguages: {}, streamMood: 'neutral', categoryBreakdown: {}, trendPredictions: [], emergingTrends: [], topTrends: [], overallMood: 'neutral' };
    }),
  ]);

  // Yorum sonuclarini videolara geri eslestir
  const videoCommentsMap = new Map();
  claudeResults.comments.forEach((comment, index) => {
    const videoId = commentVideoMap.get(index);
    if (!videoCommentsMap.has(videoId)) {
      videoCommentsMap.set(videoId, []);
    }
    videoCommentsMap.get(videoId).push(comment);
  });

  // Claude video skorlarini eslestir
  const claudeScoreMap = new Map();
  if (claudeResults.videoScores) {
    claudeResults.videoScores.forEach(v => {
      claudeScoreMap.set(v.id, v);
    });
  }

  // Gemini emerging trends eslestir
  const geminiTrendsMap = new Map();
  if (geminiResults.emergingTrends) {
    geminiResults.emergingTrends.forEach(v => {
      if (v.videoId) geminiTrendsMap.set(v.videoId, v.trends || []);
    });
  }

  // Hashtag sayaci
  const hashtagCounts = new Map();

  // Final video listesi
  const processedVideos = videos.map(video => {
    video.hashtags.forEach(tag => {
      hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
    });

    const videoComments = videoCommentsMap.get(video.id) || [];
    const filteredComments = videoComments.filter(c => !c.isSpam && !c.isToxic);
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    filteredComments.forEach(c => {
      sentimentCounts[c.sentiment] = (sentimentCounts[c.sentiment] || 0) + 1;
    });

    const dominantSentiment = Object.entries(sentimentCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

    const claudeScore = claudeScoreMap.get(video.id) || {};
    const spamCount = videoComments.filter(c => c.isSpam).length;

    return {
      id: video.id,
      url: video.url,
      thumbnail: video.thumbnail,
      description: video.description,
      author: video.author.username,
      authorDisplayName: video.author.displayName,
      authorFollowers: video.author.followers,
      stats: video.stats,
      hashtags: video.hashtags,
      createdAt: video.createdAt,
      viralPotential: claudeScore.viralPotential || calculateViralPotential(video),
      audienceType: claudeScore.audienceType || 'general',
      topComments: filteredComments.slice(0, 5).map(c => c.text),
      commentSentiment: dominantSentiment,
      spamCommentRatio: videoComments.length > 0 ? spamCount / videoComments.length : 0,
      topTopics: geminiTrendsMap.get(video.id) || [],
    };
  });

  processedVideos.sort((a, b) => b.viralPotential - a.viralPotential);

  // Top hashtag'ler
  const topHashtags = Array.from(hashtagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({
      tag,
      videoCount: count,
      trend: count >= 5 ? 'hot' : count >= 3 ? 'rising' : 'stable',
    }));

  const avgViralPotential = processedVideos.reduce((sum, v) => sum + v.viralPotential, 0) / (processedVideos.length || 1);

  const result = {
    processedAt: Date.now(),
    trendScore: Math.round(avgViralPotential * 10) / 10,
    topHashtags,
    topTrends: geminiResults.topTrends || [],
    overallMood: geminiResults.overallMood || 'neutral',
    videos: processedVideos,
    source: scrapedData.source,
    // Gemini verileri
    geminiInsights: {
      suggestedHashtags: geminiResults.suggestedHashtags || [],
      contentLanguages: geminiResults.contentLanguages || {},
      streamMood: geminiResults.streamMood || 'neutral',
      categoryBreakdown: geminiResults.categoryBreakdown || {},
      trendPredictions: geminiResults.trendPredictions || [],
      contentQualityScore: geminiResults.contentQualityScore || 0,
      bestPostingTimes: geminiResults.bestPostingTimes || [],
      audienceInsights: geminiResults.audienceInsights || {},
      viralSounds: geminiResults.viralSounds || [],
      contentGaps: geminiResults.contentGaps || [],
    },
  };

  console.log(`[AI] 2-li analiz tamamlandi: ${processedVideos.length} video, ${topHashtags.length} hashtag, Gemini: ${(geminiResults.suggestedHashtags || []).length} oneri`);
  return result;
}

/**
 * AI olmadan basit viral potential hesapla (fallback)
 */
function calculateViralPotential(video) {
  const { likes, views, comments, shares } = video.stats;
  if (views === 0) return 0;

  const engagementRate = (likes + comments + shares) / views;
  const viewScore = Math.min(views / 1000000, 1) * 4;
  const engScore = Math.min(engagementRate * 100, 1) * 3;
  const shareScore = Math.min(shares / 10000, 1) * 3;

  return Math.round((viewScore + engScore + shareScore) * 10) / 10;
}

module.exports = {
  process: processData,
  initClients,
};
