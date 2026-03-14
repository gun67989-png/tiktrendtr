// Viral Reason AI - Explains WHY a video went viral
// Analyzes caption, metrics, format, and sound to determine viral factors

import { askAI } from "@/lib/ai";
import { cached } from "@/lib/cache";

export interface ViralReason {
  hookType: string;
  emotionTrigger: string;
  format: string;
  storytelling: string;
  viralFactors: string[];
  summary: string;
}

/**
 * Analyze why a video went viral using AI.
 * Results are cached for 24 hours per video.
 */
export async function analyzeViralReason(video: {
  video_id: string;
  caption: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  format: string;
  category: string;
  sound_name: string;
  hashtags: string[];
  duration: number;
}): Promise<ViralReason> {
  const cacheKey = `viral-reason:${video.video_id}`;

  return cached(cacheKey, async () => {
    const engagementRate = video.view_count > 0
      ? ((video.like_count + video.comment_count + video.share_count) / video.view_count * 100).toFixed(2)
      : "0";

    const shareRate = video.view_count > 0
      ? (video.share_count / video.view_count * 100).toFixed(3)
      : "0";

    const prompt = `Sen bir TikTok viral içerik analiz uzmanısın. Aşağıdaki videoyu analiz et ve NEDEN viral olduğunu açıkla.

Video Bilgileri:
- Açıklama: "${video.caption}"
- Kategori: ${video.category}
- Format: ${video.format}
- Ses: ${video.sound_name}
- Hashtag'ler: ${video.hashtags.join(", ")}
- Süre: ${video.duration} saniye
- Görüntülenme: ${video.view_count.toLocaleString()}
- Beğeni: ${video.like_count.toLocaleString()}
- Yorum: ${video.comment_count.toLocaleString()}
- Paylaşım: ${video.share_count.toLocaleString()}
- Etkileşim Oranı: %${engagementRate}
- Paylaşım Oranı: %${shareRate}

Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir şey yazma:
{
  "hookType": "merak kancası | şok kancası | aciliyet kancası | soru kancası | görsel kanca | duygu kancası",
  "emotionTrigger": "şaşkınlık | merak | eğlence | nostalji | korku | sevgi | öfke | umut",
  "format": "video formatı açıklaması",
  "storytelling": "hikaye anlatım tekniği açıklaması",
  "viralFactors": ["faktör 1", "faktör 2", "faktör 3"],
  "summary": "Bu video neden viral oldu - 1-2 cümle özet"
}`;

    try {
      const response = await askAI(prompt);

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          hookType: parsed.hookType || detectHookType(video.caption),
          emotionTrigger: parsed.emotionTrigger || "merak",
          format: parsed.format || video.format,
          storytelling: parsed.storytelling || "Doğrudan anlatım",
          viralFactors: Array.isArray(parsed.viralFactors) ? parsed.viralFactors : [],
          summary: parsed.summary || "",
        };
      }
    } catch {
      // AI failed, use rule-based detection
    }

    // Fallback: Rule-based viral reason detection
    return {
      hookType: detectHookType(video.caption),
      emotionTrigger: detectEmotion(video.caption, video.category),
      format: video.format,
      storytelling: detectStorytelling(video.caption),
      viralFactors: detectViralFactors(video),
      summary: generateSummary(video),
    };
  }, 86400); // Cache 24 hours
}

// Rule-based hook type detection from caption
function detectHookType(caption: string): string {
  const text = caption.toLowerCase();
  if (text.includes("?") || text.includes("nasıl") || text.includes("neden") || text.includes("biliyor muydunuz")) return "soru kancası";
  if (text.includes("şok") || text.includes("inanamayacak") || text.includes("imkansız") || text.includes("olamaz")) return "şok kancası";
  if (text.includes("acil") || text.includes("son gün") || text.includes("kaçırma") || text.includes("hemen")) return "aciliyet kancası";
  if (text.includes("gizli") || text.includes("hiç kimse") || text.includes("merak") || text.includes("kimse bilmiyor")) return "merak kancası";
  if (text.includes("izle") || text.includes("bekle") || text.includes("sona kadar") || text.includes("sonuna kadar")) return "görsel kanca";
  return "merak kancası";
}

function detectEmotion(caption: string, category: string): string {
  const text = caption.toLowerCase();
  if (text.includes("komik") || text.includes("güldür") || text.includes("😂")) return "eğlence";
  if (text.includes("ağla") || text.includes("duygu") || text.includes("❤️") || text.includes("💔")) return "nostalji";
  if (text.includes("şaşırt") || text.includes("inanamadı") || text.includes("🤯")) return "şaşkınlık";
  if (category === "Komedi") return "eğlence";
  if (category === "Yemek") return "merak";
  if (category === "Seyahat") return "umut";
  return "merak";
}

function detectStorytelling(caption: string): string {
  const text = caption.toLowerCase();
  if (text.includes("hikaye") || text.includes("storytime") || text.includes("başıma gelen")) return "Kişisel hikaye anlatımı";
  if (text.includes("tutorial") || text.includes("nasıl") || text.includes("adım")) return "Adım adım rehber";
  if (text.includes("önce") && text.includes("sonra")) return "Dönüşüm anlatımı (önce/sonra)";
  if (text.includes("pov")) return "Bakış açısı (POV) anlatımı";
  if (text.includes("top") || text.includes("en iyi") || text.includes("liste")) return "Liste formatı";
  return "Doğrudan anlatım";
}

function detectViralFactors(video: { view_count: number; share_count: number; comment_count: number; like_count: number; category: string; format: string }): string[] {
  const factors: string[] = [];
  const engRate = video.view_count > 0 ? (video.like_count + video.comment_count + video.share_count) / video.view_count : 0;
  const shareRate = video.view_count > 0 ? video.share_count / video.view_count : 0;
  const commentRate = video.view_count > 0 ? video.comment_count / video.view_count : 0;

  if (engRate > 0.10) factors.push("Çok yüksek etkileşim oranı");
  if (shareRate > 0.01) factors.push("Yüksek paylaşım oranı — kullanıcılar aktif paylaşıyor");
  if (commentRate > 0.015) factors.push("Yoğun yorum aktivitesi — tartışma yaratan içerik");
  if (video.view_count > 1_000_000) factors.push("Milyonluk görüntülenme — algoritma desteği");
  if (video.format === "POV" || video.format === "Hikaye Anlatımı") factors.push("Hikaye odaklı format — izleyiciyi çeken yapı");
  if (factors.length === 0) factors.push("Trend kategori ve zamanlama uyumu");

  return factors;
}

function generateSummary(video: { view_count: number; category: string; format: string }): string {
  return `${video.category} kategorisinde ${video.format} formatıyla ${video.view_count > 1_000_000 ? "milyonlarca" : "yüz binlerce"} kişiye ulaşan bu video, algoritma tarafından öne çıkarılmış.`;
}
