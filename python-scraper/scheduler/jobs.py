"""Scrape job orchestration with APScheduler."""

import asyncio
import logging
import time
from datetime import datetime, timezone
from typing import Optional

from scraper.engine import scrape_keywords
from scraper.keywords import ALL_KEYWORDS, get_keyword_batch, TOTAL_BATCHES
from scraper.parser import parse_items
from storage.supabase_client import cache_thumbnails, cleanup_old_videos, upsert_videos
from config import settings

logger = logging.getLogger(__name__)

# Track last run info
last_run_info: dict = {
    "status": "idle",
    "started_at": None,
    "completed_at": None,
    "videos_scraped": 0,
    "videos_stored": 0,
    "videos_cleaned": 0,
    "duration_seconds": 0,
    "batch": None,
    "error": None,
}

_running = False


async def run_scrape_job(batch_num: Optional[int] = None) -> dict:
    """Main scrape job. Run all keywords or a specific batch."""
    global _running, last_run_info

    if _running:
        logger.warning("Scrape already in progress, skipping")
        return {"status": "already_running"}

    _running = True
    start_time = time.time()
    last_run_info["status"] = "running"
    last_run_info["started_at"] = datetime.now(timezone.utc).isoformat()
    last_run_info["batch"] = batch_num
    last_run_info["error"] = None

    try:
        # Select keywords
        if batch_num and 1 <= batch_num <= TOTAL_BATCHES:
            keywords = get_keyword_batch(batch_num)
            logger.info(f"Batch {batch_num}/{TOTAL_BATCHES}: {len(keywords)} keywords")
        else:
            keywords = ALL_KEYWORDS
            logger.info(f"Full scrape: {len(keywords)} keywords")

        # Step 1: Scrape with Playwright
        logger.info("Starting Playwright scraping...")
        raw_items = await scrape_keywords(
            keywords, headless=settings.playwright_headless
        )

        # Step 2: Parse into DB rows
        videos = parse_items(raw_items, max_age_days=settings.data_retention_days)
        logger.info(f"Parsed {len(videos)} videos")

        # Step 3: Cache thumbnails
        if videos:
            logger.info("Caching thumbnails...")
            videos = await cache_thumbnails(videos)

        # Step 4: Store in Supabase
        stored = await upsert_videos(videos)

        # Step 5: Cleanup old data (only on last batch or full run)
        cleaned = 0
        if not batch_num or batch_num == TOTAL_BATCHES:
            cleaned = await cleanup_old_videos()

        duration = round(time.time() - start_time, 1)

        last_run_info.update({
            "status": "completed",
            "completed_at": datetime.now(timezone.utc).isoformat(),
            "videos_scraped": len(videos),
            "videos_stored": stored,
            "videos_cleaned": cleaned,
            "duration_seconds": duration,
        })

        logger.info(
            f"Scrape completed: {len(videos)} scraped, {stored} stored, "
            f"{cleaned} cleaned, {duration}s"
        )

        return last_run_info.copy()

    except Exception as e:
        logger.error(f"Scrape job failed: {e}", exc_info=True)
        last_run_info.update({
            "status": "error",
            "completed_at": datetime.now(timezone.utc).isoformat(),
            "error": str(e),
            "duration_seconds": round(time.time() - start_time, 1),
        })
        return last_run_info.copy()

    finally:
        _running = False


def is_running() -> bool:
    return _running
