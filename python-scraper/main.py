"""FastAPI application — TikTok scraper microservice."""

import asyncio
import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import psutil
from fastapi import FastAPI, HTTPException, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Add project root to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import settings
from scheduler.jobs import run_scrape_job, last_run_info, is_running
from storage.supabase_client import get_video_count

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")

# Track uptime
_start_time = time.time()
_scheduler_task: asyncio.Task | None = None


async def _scheduled_loop():
    """Run scrape on interval."""
    interval = settings.scrape_interval_hours * 3600
    # Initial delay
    await asyncio.sleep(60)
    logger.info(f"Scheduler started: every {settings.scrape_interval_hours}h")

    while True:
        try:
            logger.info("Scheduled scrape starting...")
            await run_scrape_job()
        except Exception as e:
            logger.error(f"Scheduled scrape failed: {e}")

        await asyncio.sleep(interval)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _scheduler_task
    logger.info("Starting TikTok scraper microservice...")

    # Install Playwright browsers if needed
    try:
        from playwright.async_api import async_playwright
        pw = await async_playwright().start()
        browser = await pw.chromium.launch(headless=True)
        await browser.close()
        await pw.stop()
        logger.info("Playwright browsers ready")
    except Exception:
        logger.warning("Installing Playwright browsers...")
        os.system("playwright install chromium")

    # Start scheduler
    _scheduler_task = asyncio.create_task(_scheduled_loop())
    logger.info("Microservice ready")

    yield

    # Shutdown
    if _scheduler_task:
        _scheduler_task.cancel()
    logger.info("Microservice stopped")


app = FastAPI(
    title="Valyze TikTok Scraper",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://valyze.vercel.app", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _verify_auth(authorization: str | None):
    """Verify Bearer token matches CRON_SECRET."""
    if not settings.cron_secret:
        return  # No secret configured = no auth required
    if not authorization or authorization != f"Bearer {settings.cron_secret}":
        raise HTTPException(status_code=401, detail="Unauthorized")


# ── Health ──

@app.get("/health")
async def health():
    process = psutil.Process()
    video_count = await get_video_count()

    return {
        "status": "ok",
        "uptime_seconds": round(time.time() - _start_time),
        "video_count": video_count,
        "scraper_running": is_running(),
        "last_run": last_run_info,
        "memory_mb": round(process.memory_info().rss / 1024 / 1024, 1),
        "scheduler_active": _scheduler_task is not None and not _scheduler_task.done(),
        "interval_hours": settings.scrape_interval_hours,
    }


# ── Scrape trigger ──

class ScrapeRequest(BaseModel):
    batch: Optional[int] = None


@app.post("/scrape")
async def trigger_scrape(
    body: ScrapeRequest = ScrapeRequest(),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    authorization: str | None = Header(None),
):
    _verify_auth(authorization)

    if is_running():
        raise HTTPException(status_code=409, detail="Scrape already in progress")

    batch = body.batch
    if batch is not None and (batch < 1 or batch > 5):
        raise HTTPException(status_code=400, detail="Batch must be 1-5")

    # Run in background
    background_tasks.add_task(run_scrape_job, batch)

    return {
        "status": "started",
        "batch": batch or "full",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ── Status ──

@app.get("/status")
async def status(authorization: str | None = Header(None)):
    _verify_auth(authorization)
    video_count = await get_video_count()

    return {
        "last_run": last_run_info,
        "video_count": video_count,
        "scraper_running": is_running(),
        "scheduler_active": _scheduler_task is not None and not _scheduler_task.done(),
    }


# ── Run ──

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=False,
        log_level=settings.log_level.lower(),
    )
