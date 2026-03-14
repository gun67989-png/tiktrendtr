"""Supabase storage layer — upsert videos, cache thumbnails, cleanup old data."""

import asyncio
import logging
from datetime import datetime, timedelta, timezone

import httpx
from supabase import create_client, Client

from config import settings

logger = logging.getLogger(__name__)

_client: Client | None = None


def get_client() -> Client | None:
    global _client
    if not settings.is_supabase_configured:
        logger.warning("Supabase not configured")
        return None
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _client


async def upsert_videos(videos: list[dict]) -> int:
    """Upsert videos in batches of 50. Returns count of stored rows."""
    client = get_client()
    if not client or not videos:
        return 0

    stored = 0
    batch_size = 50

    # Columns that exist in the table — exclude any that haven't been migrated yet
    safe_columns = {
        "video_id", "creator_username", "creator_nickname", "caption", "hashtags",
        "view_count", "like_count", "comment_count", "share_count",
        "tiktok_url", "thumbnail_url", "duration", "sound_name", "sound_creator",
        "sound_type", "category", "format", "ad_format", "creator_presence_score",
        "scraped_at", "follower_count",
    }

    import re

    for i in range(0, len(videos), batch_size):
        batch = [{k: v for k, v in row.items() if k in safe_columns} for row in videos[i : i + batch_size]]

        # Retry up to 5 times removing missing columns each time
        for attempt in range(5):
            try:
                result = client.table("trending_videos").upsert(
                    batch, on_conflict="video_id"
                ).execute()
                stored += len(result.data) if result.data else 0
                break
            except Exception as e:
                err_msg = str(e)
                match = re.search(r"'(\w+)' column", err_msg)
                if match and match.group(1) in safe_columns:
                    col = match.group(1)
                    logger.warning(f"Column '{col}' not in DB, removing")
                    safe_columns.discard(col)
                    batch = [{k: v for k, v in row.items() if k in safe_columns} for row in videos[i : i + batch_size]]
                else:
                    logger.error(f"Batch upsert failed: {e}")
                    break

    logger.info(f"Stored {stored}/{len(videos)} videos in Supabase")
    return stored


async def cache_thumbnails(videos: list[dict]) -> list[dict]:
    """Download thumbnails and upload to Supabase Storage. Returns videos with updated URLs."""
    client = get_client()
    if not client:
        return videos

    bucket = settings.thumbnail_bucket

    # Ensure bucket exists
    try:
        client.storage.create_bucket(
            bucket, options={"public": True, "file_size_limit": 500000}
        )
    except Exception:
        pass  # Already exists

    cached = 0
    batch_size = 5

    async with httpx.AsyncClient(timeout=8.0) as http:
        for i in range(0, len(videos), batch_size):
            batch = videos[i : i + batch_size]
            tasks = []

            for video in batch:
                url = video.get("thumbnail_url", "")
                if not url or "supabase" in url:
                    continue
                tasks.append(_cache_one_thumbnail(http, client, bucket, video))

            if tasks:
                results = await asyncio.gather(*tasks, return_exceptions=True)
                cached += sum(1 for r in results if r is True)

            # Small delay between batches
            if i + batch_size < len(videos):
                await asyncio.sleep(0.3)

    logger.info(f"Cached {cached}/{len(videos)} thumbnails to Supabase Storage")
    return videos


async def _cache_one_thumbnail(
    http: httpx.AsyncClient,
    client: Client,
    bucket: str,
    video: dict,
) -> bool:
    """Download one thumbnail and upload to storage. Returns True on success."""
    original_url = video.get("thumbnail_url", "")
    video_id = video.get("video_id", "")
    if not original_url or not video_id:
        return False

    try:
        response = await http.get(
            original_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.tiktok.com/",
            },
        )
        if response.status_code != 200:
            return False

        data = response.content
        if len(data) < 1000:
            return False

        file_path = f"{video_id}.jpg"
        client.storage.from_(bucket).upload(
            file_path, data, {"content-type": "image/jpeg", "upsert": "true"}
        )

        video["thumbnail_url"] = (
            f"{settings.supabase_url}/storage/v1/object/public/{bucket}/{file_path}"
        )
        return True
    except Exception:
        return False


async def cleanup_old_videos(days: int | None = None) -> int:
    """Delete videos older than retention period. Returns deleted count."""
    client = get_client()
    if not client:
        return 0

    retention = days or settings.data_retention_days
    cutoff = datetime.now(timezone.utc) - timedelta(days=retention)

    try:
        result = (
            client.table("trending_videos")
            .delete()
            .lt("scraped_at", cutoff.isoformat())
            .execute()
        )
        deleted = len(result.data) if result.data else 0
        logger.info(f"Cleaned up {deleted} videos older than {retention} days")
        return deleted
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
        return 0


async def get_video_count() -> int:
    """Get total video count for health check."""
    client = get_client()
    if not client:
        return 0
    try:
        result = client.table("trending_videos").select("video_id", count="exact").execute()
        return result.count or 0
    except Exception:
        return 0
