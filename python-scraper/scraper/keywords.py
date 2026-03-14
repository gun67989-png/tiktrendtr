from datetime import datetime

CURRENT_YEAR = datetime.now().year

ALL_KEYWORDS = [
    # General trending & popular hashtags
    {"keyword": "türkiye trend", "category": None},
    {"keyword": "keşfet", "category": None},
    {"keyword": "türk tiktok viral", "category": None},
    {"keyword": "tiktok türkiye", "category": None},
    {"keyword": "popüler video türkiye", "category": None},
    {"keyword": "fyp türk", "category": None},
    {"keyword": "#kesfet", "category": None},
    {"keyword": "#fyp türkiye", "category": None},
    {"keyword": "#viral türk", "category": None},
    {"keyword": f"#trend türkiye {CURRENT_YEAR}", "category": None},
    {"keyword": f"viral tiktok {CURRENT_YEAR}", "category": None},
    {"keyword": f"tiktok trend {CURRENT_YEAR}", "category": None},
    # Yemek (Food)
    {"keyword": "yemek tarifi türk", "category": "Yemek"},
    {"keyword": "kahvaltı tarifi", "category": "Yemek"},
    {"keyword": "tatlı tarifi", "category": "Yemek"},
    {"keyword": "sokak lezzetleri türkiye", "category": "Yemek"},
    {"keyword": "ev yemekleri kolay", "category": "Yemek"},
    {"keyword": "türk mutfağı", "category": "Yemek"},
    {"keyword": "mukbang türk", "category": "Yemek"},
    # Komedi (Comedy)
    {"keyword": "komedi türk", "category": "Komedi"},
    {"keyword": "komik video türkçe", "category": "Komedi"},
    {"keyword": "türk komedisi", "category": "Komedi"},
    {"keyword": "caps komik türk", "category": "Komedi"},
    {"keyword": "sketch türkçe", "category": "Komedi"},
    # Seyahat (Travel)
    {"keyword": "istanbul gezi", "category": "Seyahat"},
    {"keyword": "türkiye gezi rehberi", "category": "Seyahat"},
    {"keyword": "antalya tatil", "category": "Seyahat"},
    {"keyword": "kapadokya vlog", "category": "Seyahat"},
    {"keyword": "bodrum tatil", "category": "Seyahat"},
    # Moda (Fashion)
    {"keyword": "moda kombin", "category": "Moda"},
    {"keyword": "outfit türk", "category": "Moda"},
    {"keyword": "alışveriş haul", "category": "Moda"},
    {"keyword": "grwm türk", "category": "Moda"},
    {"keyword": "vintage moda türkiye", "category": "Moda"},
    # Teknoloji (Tech)
    {"keyword": "teknoloji türkçe", "category": "Teknoloji"},
    {"keyword": "telefon inceleme türk", "category": "Teknoloji"},
    {"keyword": "uygulama önerisi", "category": "Teknoloji"},
    {"keyword": "yapay zeka türkçe", "category": "Teknoloji"},
    # Vlog
    {"keyword": "günlük vlog türk", "category": "Vlog"},
    {"keyword": "bir günüm vlog", "category": "Vlog"},
    {"keyword": "ev turu türk", "category": "Vlog"},
    {"keyword": "sabah rutinim", "category": "Vlog"},
    # Egitim (Education)
    {"keyword": "eğitim türkçe", "category": "Eğitim"},
    {"keyword": "YKS hazırlık", "category": "Eğitim"},
    {"keyword": "ingilizce öğren", "category": "Eğitim"},
    {"keyword": "matematik kolay", "category": "Eğitim"},
    {"keyword": "üniversite hayatı", "category": "Eğitim"},
    # Spor (Sports)
    {"keyword": "spor fitness türk", "category": "Spor"},
    {"keyword": "gym motivasyon türk", "category": "Spor"},
    {"keyword": "futbol türkiye", "category": "Spor"},
    {"keyword": "evde egzersiz", "category": "Spor"},
    # Muzik (Music)
    {"keyword": "türkçe müzik", "category": "Müzik"},
    {"keyword": "cover türkçe şarkı", "category": "Müzik"},
    {"keyword": "rap türk", "category": "Müzik"},
    {"keyword": "akustik cover türk", "category": "Müzik"},
    # Dans (Dance)
    {"keyword": "dans türk", "category": "Dans"},
    {"keyword": "koreografi türk", "category": "Dans"},
    {"keyword": "halay düğün", "category": "Dans"},
    # Guzellik (Beauty)
    {"keyword": "makyaj güzellik", "category": "Güzellik"},
    {"keyword": "cilt bakımı rutin", "category": "Güzellik"},
    {"keyword": "saç modeli", "category": "Güzellik"},
    {"keyword": "kozmetik önerisi türk", "category": "Güzellik"},
    # Oyun (Gaming)
    {"keyword": "oyun gaming türk", "category": "Oyun"},
    {"keyword": "valorant türk", "category": "Oyun"},
    {"keyword": "pubg mobile türk", "category": "Oyun"},
    # Reklam / Urun (Ads & Products)
    {"keyword": "ürün tanıtım türk", "category": None},
    {"keyword": "bunu aldım tiktok", "category": None},
    {"keyword": "unboxing türk", "category": None},
    {"keyword": "ürün inceleme", "category": None},
    {"keyword": "haul türkçe", "category": None},
    {"keyword": "denedim türk", "category": None},
    {"keyword": "trendyol haul", "category": None},
    {"keyword": "hepsiburada inceleme", "category": None},
]

TOTAL_BATCHES = 5  # For memory-constrained runs


def get_keyword_batch(batch_num: int) -> list[dict]:
    """Get a specific batch of keywords (1-indexed)."""
    per_batch = len(ALL_KEYWORDS) // TOTAL_BATCHES + 1
    start = (batch_num - 1) * per_batch
    end = min(start + per_batch, len(ALL_KEYWORDS))
    return ALL_KEYWORDS[start:end]
