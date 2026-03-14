import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// ── Gemini ──
const geminiKey = process.env.GEMINI_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

async function askGemini(prompt: string): Promise<string | null> {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("[AI/Gemini] Error:", e);
    return null;
  }
}

// ── Claude ──
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const anthropic = anthropicKey ? new Anthropic({ apiKey: anthropicKey }) : null;

async function askClaude(prompt: string): Promise<string | null> {
  if (!anthropic) return null;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text : null;
  } catch (e) {
    console.error("[AI/Claude] Error:", e);
    return null;
  }
}

// ── Public API ──

/**
 * Ask AI (tries Gemini first, falls back to Claude)
 */
export async function askAI(prompt: string): Promise<string> {
  const geminiResult = await askGemini(prompt);
  if (geminiResult) return geminiResult;

  const claudeResult = await askClaude(prompt);
  if (claudeResult) return claudeResult;

  return "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
}

/**
 * Generate viral hooks for a specific niche
 */
export async function generateHooks(niche: string, count: number = 5): Promise<string> {
  const prompt = `Sen bir TikTok viral içerik uzmanısın. ${niche} sektörü için ${count} adet Türkçe viral video giriş cümlesi (hook) üret.

Her hook için:
- Hook cümlesi (ilk 3 saniyede söylenecek)
- Neden viral olabilir (1 cümle)
- Önerilen video formatı

JSON formatında döndür: [{ "hook": "...", "reason": "...", "format": "..." }]
Sadece JSON döndür, başka açıklama ekleme.`;

  return askAI(prompt);
}

/**
 * Analyze sentiment of comments
 */
export async function analyzeSentiment(comments: string[]): Promise<string> {
  const sample = comments.slice(0, 50).join("\n");
  const prompt = `Aşağıdaki TikTok video yorumlarının duygu analizini yap. Türkçe yorumlar.

Yorumlar:
${sample}

Sonucu JSON formatında döndür:
{
  "positive_percent": number,
  "negative_percent": number,
  "neutral_percent": number,
  "summary": "Genel duygu özeti (1-2 cümle)",
  "top_themes": ["tema1", "tema2", "tema3"]
}
Sadece JSON döndür.`;

  return askAI(prompt);
}

/**
 * Predict trend saturation point
 */
export async function predictTrendSaturation(trendData: {
  name: string;
  usageHistory: { date: string; count: number }[];
  currentUsage: number;
}): Promise<string> {
  const history = trendData.usageHistory
    .slice(-14)
    .map((h) => `${h.date}: ${h.count}`)
    .join(", ");

  const prompt = `Bir TikTok trend analisti olarak, "${trendData.name}" trendinin doygunluk noktasını analiz et.

Son 14 günlük kullanım verileri: ${history}
Mevcut günlük kullanım: ${trendData.currentUsage}

JSON olarak döndür:
{
  "saturation_level": "düşük" | "orta" | "yüksek" | "doymuş",
  "estimated_peak_days": number,
  "recommendation": "Bu trende yatırım yapılmalı mı? (1-2 cümle)",
  "confidence": number (0-100)
}
Sadece JSON döndür.`;

  return askAI(prompt);
}

/**
 * Analyze comment statistics and generate AI insights
 */
export async function analyzeCommentStats(stats: {
  totalComments: number;
  totalViews: number;
  avgCommentRate: number;
  videoCount: number;
  categoryStats: { category: string; totalComments: number; avgCommentRate: number; videoCount: number }[];
  topCommented: { comments: number; views: number; rate: number; category: string }[];
}): Promise<string> {
  const catSummary = stats.categoryStats
    .slice(0, 8)
    .map((c) => `${c.category}: ${c.totalComments} yorum, %${c.avgCommentRate} oran, ${c.videoCount} video`)
    .join("\n");

  const topVideos = stats.topCommented
    .slice(0, 5)
    .map((v, i) => `${i + 1}. ${v.category || "Genel"}: ${v.comments} yorum, ${v.views} görüntülenme, %${v.rate} oran`)
    .join("\n");

  const prompt = `Sen bir TikTok yorum analizi uzmanısın. Aşağıdaki Türkiye TikTok trend verilerini analiz et ve Türkçe içgörüler üret.

Genel İstatistikler:
- Toplam yorum: ${stats.totalComments.toLocaleString()}
- Toplam görüntülenme: ${stats.totalViews.toLocaleString()}
- Ortalama yorum oranı: %${stats.avgCommentRate}
- Analiz edilen video: ${stats.videoCount}

Kategori Bazlı Dağılım:
${catSummary}

En Çok Yorum Alan Videolar:
${topVideos}

JSON formatında döndür:
{
  "positive_percent": number (yorum oranı ve etkileşime göre tahmin),
  "negative_percent": number,
  "neutral_percent": number,
  "summary": "Genel yorum trendi analizi (2-3 cümle, Türkçe)",
  "top_themes": [{"topic": "konu adı", "count": tahmini_yorum_sayısı, "sentiment": "positive"|"negative"|"neutral"}],
  "category_sentiments": [{"name": "kategori", "positive": number, "negative": number, "neutral": number}],
  "positive_examples": ["Olası pozitif yorum örneği 1", "örnek 2", "örnek 3"],
  "negative_examples": ["Olası negatif yorum örneği 1", "örnek 2"]
}
Sadece JSON döndür.`;

  return askAI(prompt);
}

export const isAIConfigured = !!(geminiKey || anthropicKey);
