const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let claudeClient = null;
let openaiClient = null;
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

  if (process.env.OPENAI_API_KEY && !openaiClient) {
    try {
      openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log('[AI] OpenAI client hazir');
    } catch (err) {
      console.warn('[AI] OpenAI client olusturulamadi:', err.message);
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
 * Claude ile yorum analizi: spam, toksik, bot tespiti, sentiment
 */
async function analyzeCommentsWithClaude(comments) {
  if (!claudeClient || comments.length === 0) {
    return comments.map(c => ({
      ...c,
      isSpam: false,
      isToxic: false,
      isBot: false,
      sentiment: 'neutral',
    }));
  }

  try {
    const batches = [];
    for (let i = 0; i < comments.length; i += 50) {
      batches.push(comments.slice(i, i + 50));
    }

    const allResults = [];

    for (const batch of batches) {
      const commentsForAI = batch.map(c => ({
        username: c.username,
        text: c.text,
      }));

      const response = await claudeClient.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `Sen bir TikTok yorum moderatorusun. Sana bir JSON dizisi icinde yorumlar gelecek.
Her yorum icin sunu belirle:
- isSpam: true/false (tanitim, link, anlamsiz tekrar iceriyorsa)
- isToxic: true/false (hakaret, nefret soylemi, tehdit iceriyorsa)
- isBot: true/false (cok kisa ve genel mesajlar, spam kaliplari)
- sentiment: "positive" | "neutral" | "negative"

Sadece JSON dondur. Baska hicbir sey yazma.
Ornek cikti: [{"username": "ali", "isSpam": false, "isToxic": false, "isBot": false, "sentiment": "positive"}]`,
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
          allResults.push({
            ...batch[i],
            isSpam: aiResult.isSpam || false,
            isToxic: aiResult.isToxic || false,
            isBot: aiResult.isBot || false,
            sentiment: aiResult.sentiment || 'neutral',
          });
        }
      } catch {
        allResults.push(...batch.map(c => ({
          ...c,
          isSpam: false,
          isToxic: false,
          isBot: false,
          sentiment: 'neutral',
        })));
      }
    }

    console.log(`[AI/Claude] ${allResults.length} yorum analiz edildi`);
    return allResults;
  } catch (err) {
    console.error('[AI/Claude] Yorum analizi hatasi:', err.message);
    return comments.map(c => ({
      ...c,
      isSpam: false,
      isToxic: false,
      isBot: false,
      sentiment: 'neutral',
    }));
  }
}

/**
 * GPT-4o-mini ile trend ve viral analizi
 */
async function analyzeTrendsWithGPT(videos) {
  if (!openaiClient || videos.length === 0) {
    return {
      videos: videos.map(v => ({
        id: v.id,
        viralPotential: 5,
        audienceType: 'general',
        emergingTrends: [],
      })),
      topTrends: [],
      overallMood: 'neutral',
    };
  }

  try {
    const videosForAI = videos.slice(0, 30).map(v => ({
      id: v.id,
      description: v.description,
      stats: v.stats,
      hashtags: v.hashtags,
    }));

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: `Analyze these TikTok video descriptions and stats.
For each video identify:
- viralPotential: 0-10 score based on engagement rate and view count
- audienceType: "gen-z" | "millenial" | "general" | "niche"
- emergingTrends: array of trend keywords found

Also provide overall analysis:
- topTrends: top 5 emerging trends across all videos
- overallMood: general mood of the content

Return ONLY JSON in this format:
{
  "videos": [{"id": "...", "viralPotential": 8, "audienceType": "gen-z", "emergingTrends": ["dance", "challenge"]}],
  "topTrends": ["trend1", "trend2"],
  "overallMood": "energetic"
}`,
        },
        {
          role: 'user',
          content: JSON.stringify(videosForAI),
        },
      ],
    });

    const text = response.choices[0]?.message?.content || '{}';
    try {
      const parsed = JSON.parse(text);
      console.log(`[AI/GPT] ${(parsed.videos || []).length} video trend analizi yapildi`);
      return parsed;
    } catch {
      console.warn('[AI/GPT] JSON parse hatasi');
      return {
        videos: videos.map(v => ({ id: v.id, viralPotential: 5, audienceType: 'general', emergingTrends: [] })),
        topTrends: [],
        overallMood: 'neutral',
      };
    }
  } catch (err) {
    console.error('[AI/GPT] Trend analizi hatasi:', err.message);
    return {
      videos: videos.map(v => ({ id: v.id, viralPotential: 5, audienceType: 'general', emergingTrends: [] })),
      topTrends: [],
      overallMood: 'neutral',
    };
  }
}

/**
 * Gemini ile hashtag onerisi + cok dilli icerik analizi + stream mood
 */
async function analyzeWithGemini(videos, comments) {
  if (!geminiModel || videos.length === 0) {
    return {
      suggestedHashtags: [],
      contentLanguages: {},
      streamMood: 'neutral',
      categoryBreakdown: {},
      trendPredictions: [],
    };
  }

  try {
    const dataForGemini = {
      videos: videos.slice(0, 25).map(v => ({
        description: v.description,
        hashtags: v.hashtags,
        stats: v.stats,
      })),
      sampleComments: comments.slice(0, 50).map(c => c.text),
    };

    const prompt = `Analyze these TikTok videos and comments data. Return ONLY valid JSON, no other text.

INPUT DATA:
${JSON.stringify(dataForGemini)}

Analyze and return this exact JSON structure:
{
  "suggestedHashtags": ["#hashtag1", "#hashtag2", ...],
  "contentLanguages": {"tr": 60, "en": 30, "other": 10},
  "streamMood": "excited" | "calm" | "funny" | "dramatic" | "educational" | "neutral",
  "categoryBreakdown": {"entertainment": 40, "education": 20, "lifestyle": 15, ...},
  "trendPredictions": [
    {"topic": "topic_name", "confidence": 0.85, "direction": "rising" | "stable" | "falling"}
  ],
  "contentQualityScore": 7.5,
  "bestPostingTimes": ["19:00-21:00", "12:00-14:00"],
  "audienceInsights": {
    "primaryAge": "18-24",
    "interests": ["music", "comedy"],
    "engagementStyle": "passive" | "active" | "creator"
  }
}

Rules:
- suggestedHashtags: Recommend 10 trending hashtags based on content patterns
- contentLanguages: Percentage breakdown of languages detected
- trendPredictions: Top 5 predicted trends with confidence scores
- Be specific to Turkish TikTok market when possible
- Return ONLY the JSON object, nothing else`;

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
      console.log(`[AI/Gemini] Analiz tamamlandi: ${(parsed.suggestedHashtags || []).length} hashtag onerisi, ${(parsed.trendPredictions || []).length} trend tahmini`);
      return parsed;
    } catch {
      console.warn('[AI/Gemini] JSON parse hatasi');
      return {
        suggestedHashtags: [],
        contentLanguages: {},
        streamMood: 'neutral',
        categoryBreakdown: {},
        trendPredictions: [],
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
    };
  }
}

/**
 * Ana isleme fonksiyonu: Claude + GPT + Gemini paralel calistir
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

  // Claude + GPT + Gemini paralel calistir
  console.log('[AI] 3-lu paralel analiz basliyor (Claude + GPT + Gemini)...');
  const [commentResults, trendResults, geminiResults] = await Promise.all([
    analyzeCommentsWithClaude(allComments).catch(err => {
      console.error('[AI] Claude hatasi:', err.message);
      return allComments.map(c => ({ ...c, isSpam: false, isToxic: false, isBot: false, sentiment: 'neutral' }));
    }),
    analyzeTrendsWithGPT(videos).catch(err => {
      console.error('[AI] GPT hatasi:', err.message);
      return { videos: [], topTrends: [], overallMood: 'neutral' };
    }),
    analyzeWithGemini(videos, allComments).catch(err => {
      console.error('[AI] Gemini hatasi:', err.message);
      return { suggestedHashtags: [], contentLanguages: {}, streamMood: 'neutral', categoryBreakdown: {}, trendPredictions: [] };
    }),
  ]);

  // Yorum sonuclarini videolara geri eslestir
  const videoCommentsMap = new Map();
  commentResults.forEach((comment, index) => {
    const videoId = commentVideoMap.get(index);
    if (!videoCommentsMap.has(videoId)) {
      videoCommentsMap.set(videoId, []);
    }
    videoCommentsMap.get(videoId).push(comment);
  });

  // GPT sonuclarini video ID'ye eslestir
  const gptVideoMap = new Map();
  if (trendResults.videos) {
    trendResults.videos.forEach(v => {
      gptVideoMap.set(v.id, v);
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

    const gptData = gptVideoMap.get(video.id) || {};
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
      viralPotential: gptData.viralPotential || calculateViralPotential(video),
      audienceType: gptData.audienceType || 'general',
      topComments: filteredComments.slice(0, 5).map(c => c.text),
      commentSentiment: dominantSentiment,
      spamCommentRatio: videoComments.length > 0 ? spamCount / videoComments.length : 0,
      topTopics: gptData.emergingTrends || [],
    };
  });

  processedVideos.sort((a, b) => b.viralPotential - a.viralPotential);

  // Top hashtag'ler (Gemini onerileriyle zenginlestirilmis)
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
    topTrends: trendResults.topTrends || [],
    overallMood: trendResults.overallMood || 'neutral',
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
    },
  };

  console.log(`[AI] 3-lu analiz tamamlandi: ${processedVideos.length} video, ${topHashtags.length} hashtag, Gemini: ${(geminiResults.suggestedHashtags || []).length} oneri`);
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
