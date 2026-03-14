"""Parse raw TikTok API JSON into trending_videos row format."""

import logging
import time
from datetime import datetime, timezone

from scraper.classifier import (
    categorize_video,
    classify_sound_type,
    calculate_creator_presence,
    detect_ad_format,
    detect_format,
    extract_hashtags,
)

logger = logging.getLogger(__name__)


def parse_items(raw_items: list[dict], max_age_days: int = 30) -> list[dict]:
    """Convert raw TikTok API items into DB-ready rows. Deduplicates and filters."""
    seen_ids: set[str] = set()
    videos: list[dict] = []
    now_ts = time.time()
    cutoff_ts = now_ts - (max_age_days * 86400)
    now_iso = datetime.now(timezone.utc).isoformat()

    for item in raw_items:
        try:
            video = _parse_one(item, cutoff_ts, now_iso)
            if video and video["video_id"] not in seen_ids:
                seen_ids.add(video["video_id"])
                videos.append(video)
        except Exception as e:
            logger.debug(f"Parse error: {e}")
            continue

    logger.info(f"Parsed {len(videos)} unique videos from {len(raw_items)} raw items")
    return videos


def _parse_one(item: dict, cutoff_ts: float, now_iso: str) -> dict | None:
    """Parse a single TikTok API item into a DB row."""
    # Extract video_id
    video_id = str(item.get("id", "") or item.get("video_id", ""))
    if not video_id:
        return None

    # Extract author info
    author = item.get("author", {})
    if isinstance(author, dict):
        creator_username = author.get("uniqueId", "") or author.get("unique_id", "")
        creator_nickname = author.get("nickname", "") or creator_username
        follower_count = author.get("followerCount", 0) or author.get("follower_count", 0)
    else:
        return None

    if not creator_username:
        return None

    # Check freshness
    create_time = item.get("createTime", 0) or item.get("create_time", 0)
    if isinstance(create_time, str):
        try:
            create_time = int(create_time)
        except ValueError:
            create_time = 0

    if create_time and create_time < cutoff_ts:
        return None

    # Extract caption and hashtags
    caption = item.get("desc", "") or item.get("title", "") or ""
    hashtags = extract_hashtags(caption)

    # Merge challenges into hashtags
    challenges = item.get("challenges", [])
    if isinstance(challenges, list):
        for ch in challenges:
            if isinstance(ch, dict):
                tag = "#" + (ch.get("title", "") or "").lower()
                if tag != "#" and tag not in hashtags:
                    hashtags.append(tag)

    # Extract stats
    stats = item.get("stats", {})
    if isinstance(stats, dict):
        view_count = stats.get("playCount", 0) or stats.get("play_count", 0) or 0
        like_count = stats.get("diggCount", 0) or stats.get("digg_count", 0) or 0
        comment_count = stats.get("commentCount", 0) or stats.get("comment_count", 0) or 0
        share_count = stats.get("shareCount", 0) or stats.get("share_count", 0) or 0
    else:
        view_count = item.get("play_count", 0) or 0
        like_count = item.get("digg_count", 0) or 0
        comment_count = item.get("comment_count", 0) or 0
        share_count = item.get("share_count", 0) or 0

    # Extract video info
    video_info = item.get("video", {})
    if isinstance(video_info, dict):
        thumbnail_url = (
            video_info.get("originCover", "")
            or video_info.get("origin_cover", "")
            or video_info.get("cover", "")
            or ""
        )
        duration = video_info.get("duration", 0) or 0
    else:
        thumbnail_url = item.get("origin_cover", "") or item.get("cover", "") or ""
        duration = item.get("duration", 0) or 0

    # Extract music/sound info
    music = item.get("music", {})
    if isinstance(music, dict):
        sound_name = music.get("title", "") or "Original Sound"
        sound_creator = music.get("authorName", "") or music.get("author", "") or creator_username
    else:
        sound_name = item.get("music_info", {}).get("title", "Original Sound") if isinstance(item.get("music_info"), dict) else "Original Sound"
        sound_creator = item.get("music_info", {}).get("author", creator_username) if isinstance(item.get("music_info"), dict) else creator_username

    # Apply classifiers
    forced_category = item.get("_forced_category")
    category = forced_category or categorize_video(caption, hashtags)
    fmt = detect_format(caption)
    ad_format = detect_ad_format(caption, hashtags)
    sound_type = classify_sound_type(sound_name, sound_creator, creator_username)
    presence_score = calculate_creator_presence(
        caption, hashtags, category, fmt, duration,
        sound_name, sound_creator, creator_username,
    )

    # Build scraped_at from createTime or use now
    if create_time:
        scraped_at = datetime.fromtimestamp(create_time, tz=timezone.utc).isoformat()
    else:
        scraped_at = now_iso

    tiktok_url = f"https://www.tiktok.com/@{creator_username}/video/{video_id}"

    return {
        "video_id": video_id,
        "creator_username": creator_username,
        "creator_nickname": creator_nickname,
        "caption": caption,
        "hashtags": hashtags,
        "view_count": int(view_count),
        "like_count": int(like_count),
        "comment_count": int(comment_count),
        "share_count": int(share_count),
        "follower_count": int(follower_count),
        "thumbnail_url": thumbnail_url,
        "duration": int(duration),
        "sound_name": sound_name,
        "sound_creator": sound_creator,
        "sound_type": sound_type,
        "category": category,
        "format": fmt,
        "ad_format": ad_format,
        "creator_presence_score": presence_score,
        "tiktok_url": tiktok_url,
        "scraped_at": scraped_at,
    }
