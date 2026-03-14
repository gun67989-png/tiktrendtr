"""Classification functions ported from src/lib/tiktok-scraper.ts"""

import re
from typing import Optional

# ── Category detection ──

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "Yemek": ["yemek", "tarif", "yemektarifi", "mutfak", "kahvalti", "lezzet", "tatli", "food", "recipe", "mukbang", "asci", "chef", "sofra", "pilav", "corba", "kebap", "baklava", "turkishdishes"],
    "Komedi": ["komedi", "comedy", "mizah", "caps", "eglence", "komik", "gulme", "sketch", "parodi", "funny", "humor", "espri"],
    "Seyahat": ["seyahat", "travel", "gezi", "tatil", "istanbul", "antalya", "kapadokya", "turkiye", "turkey", "wanderlust", "kesfet"],
    "Moda": ["moda", "fashion", "kombin", "ootd", "stil", "style", "grwm", "vintage", "trend", "kiyafet", "giyim"],
    "Teknoloji": ["teknoloji", "tech", "iphone", "android", "samsung", "apple", "yazilim", "coding", "ai", "yapayzeka", "gadget"],
    "Vlog": ["vlog", "gunluk", "rutin", "hayat", "life", "dailyroutine", "morningroutine", "dayinmylife", "evturu"],
    "Eğitim": ["egitim", "education", "ogren", "yks", "sinav", "matematik", "ingilizce", "universite", "ders", "study"],
    "Spor": ["spor", "fitness", "gym", "workout", "antrenman", "exercise", "futbol", "basketbol", "health", "saglik"],
    "Müzik": ["muzik", "music", "sarki", "song", "cover", "gitar", "piano", "singing", "rap", "pop", "akustik"],
    "Dans": ["dans", "dance", "koreografi", "choreography", "hiphop", "twerk", "salsa", "halay", "zeybek"],
    "Güzellik": ["guzellik", "beauty", "makyaj", "makeup", "skincare", "ciltbakim", "sac", "hair", "nail", "kozmetik"],
    "Oyun": ["oyun", "game", "gaming", "gamer", "pubg", "valorant", "lol", "minecraft", "fortnite", "ps5", "xbox"],
}


def categorize_video(caption: str, hashtags: list[str]) -> str:
    text = (caption + " " + " ".join(hashtags)).lower().replace("#", "").replace("_", "")
    best_category = "Vlog"
    best_score = 0

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > best_score:
            best_score = score
            best_category = category

    return best_category


# ── Format detection ──

def detect_format(caption: str) -> str:
    text = caption.lower()
    if "tutorial" in text or "nasil" in text or "rehber" in text or "adim adim" in text:
        return "Tutorial"
    if "pov" in text:
        return "POV"
    if "grwm" in text or "get ready" in text:
        return "Get Ready With Me"
    if ("once" in text and "sonra" in text) or "dönüşüm" in text or "donusum" in text or "değişim" in text or "degisim" in text or "transformation" in text:
        return "Önce/Sonra"
    if "mukbang" in text:
        return "Mukbang"
    if "challenge" in text:
        return "Challenge"
    if "duet" in text:
        return "Duet"
    if "reaction" in text or "reaksiyon" in text or "tepki" in text or "izledim ve" in text:
        return "Reaksiyon"
    if "sketch" in text or "skeç" in text or "skec" in text or "parodi" in text or "canlandırma" in text or "canlandirma" in text:
        return "Komedi Skeçi"
    if "röportaj" in text or "roportaj" in text or "sorduk" in text or "mikrofon" in text or "sokakta sorduk" in text:
        return "Sokak Röportajı"
    if "top 5" in text or "top 10" in text or "en iyi 10" in text or "en iyi 5" in text or "sıralama" in text or "siralama" in text or ("liste" in text and "playlist" not in text):
        return "Liste"
    if "storytime" in text or "hikaye" in text or "hikayem" in text or "başıma gelen" in text or "basima gelen" in text:
        return "Hikaye Anlatımı"
    return "Kısa Video"


# ── Ad format detection ──

AD_KEYWORDS = [
    "ürün", "urun", "aldım", "aldim", "satin", "satın", "sipariş", "siparis",
    "bunu aldım", "bunu denedim", "haul", "unboxing", "kutu açılımı", "kutu acilimi",
    "inceleme", "review", "tavsiye", "öneri", "oneri", "denedim", "test ettim",
    "favorilerim", "favori ürünlerim",
    "reklam", "sponsor", "işbirliği", "isbirligi", "tanıtım", "tanitim",
    "ad", "sponsored", "collab",
    "indirim", "kampanya", "fırsat", "firsat", "alışveriş", "alisveris",
    "link", "linkte", "bioda", "bio'da",
    "sonuç", "sonuc", "etkisi", "kullanım", "kullanim",
]


def detect_ad_format(caption: str, hashtags: list[str]) -> Optional[str]:
    text = (caption + " " + " ".join(hashtags)).lower().replace("#", "").replace("_", " ")
    ad_score = sum(1 for kw in AD_KEYWORDS if kw in text)
    if ad_score == 0:
        return None

    if "haul" in text or "alışveriş" in text or "alisveris" in text:
        return "Haul"
    if "unboxing" in text or "kutu açılımı" in text or "kutu acilimi" in text:
        return "Unboxing"
    if "inceleme" in text or "review" in text or "test ettim" in text:
        return "Ürün İnceleme"
    if ("önce" in text or "once" in text) and ("sonra" in text or "sonuc" in text):
        return "Önce/Sonra"
    if "denedim" in text or "bunu aldım" in text or "bunu aldim" in text:
        return "Ürün Deneyimi"
    if "reklam" in text or "sponsor" in text or "işbirliği" in text or "isbirligi" in text:
        return "Sponsorlu"
    if "tavsiye" in text or "öneri" in text or "oneri" in text or "favorilerim" in text:
        return "Tavsiye"
    if "indirim" in text or "kampanya" in text or "fırsat" in text or "firsat" in text:
        return "Kampanya"
    return "UGC Reklam"


# ── Sound type classification ──

MUSIC_INDICATORS = [
    "remix", "beat", "song", "şarkı", "sarki", "müzik", "muzik", "cover",
    "acoustic", "akustik", "piano", "gitar", "guitar", "bass", "drum",
    "pop", "rap", "hip hop", "rock", "jazz", "r&b", "edm", "trap",
    "drill", "folk", "arabesk", "slow", "dance mix", "dj", "feat",
    "ft.", "prod", "instrumental", "karaoke", "halay", "zeybek",
]

SOUND_INDICATORS = [
    "sound", "ses", "efekt", "effect", "voiceover", "seslendirme",
    "konuşma", "konusma", "motivasyon", "komedi", "funny", "trend ses",
    "viral ses", "viral sound", "asmr", "whisper", "scream", "reaction",
    "reaksiyon", "tepki", "pov", "storytime", "anlatım", "monolog",
    "dialog", "skit", "parodi", "taklit", "dubbing", "dublaj",
]


def classify_sound_type(sound_name: str, sound_creator: str, creator_username: str) -> str:
    sn = sound_name.lower()

    if "original sound" in sn or "orijinal ses" in sn or "ses -" in sn:
        if sound_creator.lower() == creator_username.lower():
            return "original"
        return "sound"

    for ind in MUSIC_INDICATORS:
        if ind in sn:
            return "music"

    for ind in SOUND_INDICATORS:
        if ind in sn:
            return "sound"

    if " - " in sn and "original" not in sn:
        return "music"

    if sound_creator.lower() != creator_username.lower():
        return "music"

    return "sound"


# ── Creator presence score ──

CATEGORY_PRESENCE: dict[str, int] = {
    "Komedi": 90, "Vlog": 85, "Eğitim": 80, "Güzellik": 80,
    "Moda": 75, "Spor": 70, "Yemek": 65, "Müzik": 65,
    "Dans": 60, "Teknoloji": 55, "Seyahat": 40, "Oyun": 25,
}

FORMAT_PRESENCE: dict[str, int] = {
    "Get Ready With Me": 95, "Sokak Röportajı": 95, "Komedi Skeçi": 92,
    "POV": 90, "Reaksiyon": 88, "Hikaye Anlatımı": 85,
    "Mukbang": 80, "Challenge": 75, "Tutorial": 70,
    "Duet": 65, "Önce/Sonra": 60, "Liste": 55, "Kısa Video": 50,
}

HIGH_PRESENCE_KEYWORDS = [
    "anlatiyorum", "anlatıyorum", "gosteriyorum", "gösteriyorum",
    "soyluyorum", "söylüyorum", "ogretiyorum", "öğretiyorum",
    "paylasiyorum", "paylaşıyorum",
    "benim", "benimle", "hayatim", "hayatım", "gunum", "günüm", "rutinim",
    "izleyin", "dinleyin", "bakin", "bakın", "deneyin",
    "takip edin", "yorumlara yazin", "yorumlara yazın",
    "grwm", "get ready", "hazirlaniyorum", "hazırlanıyorum",
    "kameraya", "kamerada", "canli", "canlı",
    "vlog", "storytime", "hikayem",
    "soyledim", "söyledim", "okudum", "seslendirdim",
    "performans", "cover", "konustum", "konuştum",
    "sketch", "parodi", "canlandirma", "canlandırma",
    "rol", "oynadim", "oynadım", "taklit",
    "donusum", "dönüşüm", "degisim", "değişim",
    "reaksiyon", "reaction", "tepki",
]

LOW_PRESENCE_KEYWORDS = [
    "manzara", "drone", "doga", "doğa", "gokyuzu", "gökyüzü",
    "timelapse", "time lapse",
    "infografik", "grafik", "istatistik", "haber",
    "gameplay", "screen recording", "ekran kaydi", "ekran kaydı",
    "derleme", "compilation",
    "kedi", "kopek", "köpek", "hayvan",
]


def _calc_caption_presence(caption: str, hashtags: list[str]) -> int:
    text = (caption + " " + " ".join(hashtags)).lower().replace("#", "").replace("_", " ")
    score = 50
    for kw in HIGH_PRESENCE_KEYWORDS:
        if kw in text:
            score += 12
    for kw in LOW_PRESENCE_KEYWORDS:
        if kw in text:
            score -= 15
    return max(0, min(100, score))


def _calc_sound_presence(sound_name: str, sound_creator: str, creator_username: str) -> int:
    sn = sound_name.lower()
    sc = sound_creator.lower()
    cu = creator_username.lower()

    if sc == cu or "original sound" in sn or "orijinal ses" in sn:
        return 90
    if "konuşma" in sn or "konusma" in sn or "motivasyon" in sn:
        return 75
    if "sound effect" in sn or "efekt" in sn:
        return 70
    return 35


def _calc_duration_presence(duration: int) -> int:
    if duration <= 5:
        return 15
    if duration <= 10:
        return 30
    if duration <= 15:
        return 50
    if duration <= 30:
        return 70
    if duration <= 60:
        return 80
    if duration <= 90:
        return 75
    if duration <= 120:
        return 60
    if duration <= 180:
        return 45
    return 30


def calculate_creator_presence(
    caption: str,
    hashtags: list[str],
    category: str,
    fmt: str,
    duration: int,
    sound_name: str,
    sound_creator: str,
    creator_username: str,
) -> int:
    category_signal = CATEGORY_PRESENCE.get(category, 50)
    format_signal = FORMAT_PRESENCE.get(fmt, 50)
    caption_signal = _calc_caption_presence(caption, hashtags)
    sound_signal = _calc_sound_presence(sound_name, sound_creator, creator_username)
    duration_signal = _calc_duration_presence(duration)

    score = round(
        format_signal * 0.30
        + category_signal * 0.25
        + caption_signal * 0.20
        + sound_signal * 0.15
        + duration_signal * 0.10
    )
    return max(0, min(100, score))


# ── Hashtag extraction ──

HASHTAG_RE = re.compile(r"#[\w\u00C0-\u024F\u0400-\u04FF\u00e7\u011f\u0131\u00f6\u015f\u00fc\u00c7\u011e\u0130\u00d6\u015e\u00dc]+")


def extract_hashtags(text: str) -> list[str]:
    return [m.lower() for m in HASHTAG_RE.findall(text)]
