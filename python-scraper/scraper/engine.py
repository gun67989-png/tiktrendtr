"""Playwright-based TikTok scraper engine with API intercept."""

import asyncio
import json
import logging
import random
from typing import Any

from playwright.async_api import async_playwright, Browser, BrowserContext, Page, Route

logger = logging.getLogger(__name__)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
]

_ua_index = 0


def _next_ua() -> str:
    global _ua_index
    ua = USER_AGENTS[_ua_index % len(USER_AGENTS)]
    _ua_index += 1
    return ua


class TikTokEngine:
    """Manages Playwright browser and scrapes TikTok via API intercept."""

    def __init__(self, headless: bool = True):
        self.headless = headless
        self._pw = None
        self._browser: Browser | None = None
        self._semaphore = asyncio.Semaphore(2)  # Max 2 concurrent pages

    @staticmethod
    def _has_system_chrome() -> bool:
        """Check if Chrome is installed on Windows."""
        import os
        paths = [
            os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
            os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
            os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe"),
        ]
        return any(os.path.exists(p) for p in paths)

    async def start(self):
        self._pw = await async_playwright().start()
        # Use system Chrome when available (bundled Chromium may have sandbox issues)
        # On Railway/Docker, channel=None uses the bundled Chromium from the Playwright image
        import shutil
        use_channel = "chrome" if shutil.which("chrome") or shutil.which("google-chrome") or self._has_system_chrome() else None

        self._browser = await self._pw.chromium.launch(
            headless=self.headless,
            channel=use_channel,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        )
        logger.info("Playwright browser started")

    async def stop(self):
        if self._browser:
            await self._browser.close()
        if self._pw:
            await self._pw.stop()
        logger.info("Playwright browser stopped")

    async def scrape_keyword(self, keyword: str) -> list[dict]:
        """Scrape TikTok search results for a keyword. Returns raw item dicts."""
        if not self._browser:
            raise RuntimeError("Engine not started")

        async with self._semaphore:
            return await self._scrape_with_intercept(keyword)

    @staticmethod
    def _extract_items(body: dict) -> list[dict]:
        """Extract video items from various TikTok API response formats."""
        results = []

        # Format 1: body.data = [{type, item, common}, ...]
        data = body.get("data", [])
        if isinstance(data, list):
            for entry in data:
                if isinstance(entry, dict) and "item" in entry:
                    results.append(entry["item"])
                elif isinstance(entry, dict) and "id" in entry:
                    results.append(entry)

        # Format 2: body.data = {itemList: [...]}
        if isinstance(data, dict):
            for key in ["itemList", "item_list"]:
                if key in data and isinstance(data[key], list):
                    results.extend(data[key])
                    break

        # Format 3: body.itemList = [...]
        for key in ["itemList", "item_list"]:
            if key in body and isinstance(body[key], list):
                results.extend(body[key])
                break

        return results

    async def _scrape_with_intercept(self, keyword: str) -> list[dict]:
        """Navigate to TikTok search page and intercept API responses."""
        items: list[dict] = []
        context: BrowserContext | None = None

        try:
            context = await self._browser.new_context(
                user_agent=_next_ua(),
                locale="tr-TR",
                timezone_id="Europe/Istanbul",
                viewport={"width": 1280, "height": 720},
                extra_http_headers={
                    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                },
            )

            page = await context.new_page()

            # Set up API response interceptor
            async def handle_response(response):
                url = response.url
                if any(
                    pattern in url
                    for pattern in [
                        "/api/search/general",
                        "/api/recommend/item_list",
                        "/api/search/item",
                        "/api/challenge/item_list",
                    ]
                ):
                    try:
                        body = await response.json()
                        found = self._extract_items(body)
                        items.extend(found)
                    except Exception:
                        pass

            page.on("response", handle_response)

            # Navigate to search page
            search_url = f"https://www.tiktok.com/search?q={keyword}&t=video"
            try:
                await page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
            except Exception as e:
                logger.warning(f"Navigation timeout for '{keyword}': {e}")
                # Try alternative: hashtag page
                tag = keyword.replace("#", "").replace(" ", "").lower()
                try:
                    await page.goto(
                        f"https://www.tiktok.com/tag/{tag}",
                        wait_until="domcontentloaded",
                        timeout=15000,
                    )
                except Exception:
                    return items

            # Wait for initial content to load
            await asyncio.sleep(2 + random.random() * 2)

            # Scroll to trigger more API calls
            for scroll_i in range(5):
                await page.evaluate("window.scrollBy(0, window.innerHeight * 2)")
                await asyncio.sleep(1.5 + random.random() * 1.5)

            # If intercept got nothing, try DOM fallback
            if not items:
                items = await self._dom_fallback(page, keyword)

            logger.info(f"Scraped {len(items)} items for keyword '{keyword}'")

        except Exception as e:
            logger.error(f"Scrape failed for '{keyword}': {e}")
        finally:
            if context:
                await context.close()

        return items

    async def _dom_fallback(self, page: Page, keyword: str) -> list[dict]:
        """Extract video data from DOM when API intercept fails."""
        items = []
        try:
            # Try to extract from video cards in the search results
            video_elements = await page.query_selector_all(
                '[data-e2e="search-card-container"], [class*="DivItemContainerV2"], [class*="VideoCard"]'
            )

            for elem in video_elements[:30]:  # Limit to 30
                try:
                    # Try to get the link
                    link = await elem.query_selector("a[href*='/video/']")
                    if not link:
                        continue

                    href = await link.get_attribute("href") or ""
                    # Extract video_id and username from URL
                    parts = href.split("/")
                    video_id = ""
                    username = ""
                    for idx, part in enumerate(parts):
                        if part == "video" and idx + 1 < len(parts):
                            video_id = parts[idx + 1].split("?")[0]
                        if part.startswith("@"):
                            username = part[1:]

                    if not video_id:
                        continue

                    # Try to get description
                    desc_elem = await elem.query_selector(
                        '[data-e2e="search-card-desc"], [class*="caption"], [class*="desc"]'
                    )
                    desc = await desc_elem.inner_text() if desc_elem else ""

                    # Try to get stats
                    stats_text = await elem.inner_text()

                    items.append({
                        "id": video_id,
                        "desc": desc,
                        "author": {
                            "uniqueId": username,
                            "nickname": username,
                            "followerCount": 0,
                        },
                        "stats": {
                            "playCount": 0,
                            "diggCount": 0,
                            "commentCount": 0,
                            "shareCount": 0,
                        },
                        "video": {
                            "cover": "",
                            "originCover": "",
                            "duration": 0,
                        },
                        "music": {"title": "Original Sound", "authorName": username},
                        "createTime": 0,
                        "challenges": [],
                        "_source": "dom",
                    })
                except Exception:
                    continue

            if items:
                logger.info(f"DOM fallback got {len(items)} items for '{keyword}'")

        except Exception as e:
            logger.warning(f"DOM fallback failed for '{keyword}': {e}")

        return items


async def scrape_keywords(
    keywords: list[dict],
    headless: bool = True,
    delay_range: tuple[float, float] = (3.0, 8.0),
) -> list[dict]:
    """Scrape multiple keywords and return all raw items. Main entry point."""
    engine = TikTokEngine(headless=headless)
    all_items: list[dict] = []

    try:
        await engine.start()

        for i, kw_entry in enumerate(keywords):
            keyword = kw_entry["keyword"]
            category = kw_entry.get("category")

            try:
                items = await engine.scrape_keyword(keyword)
                # Tag items with forced category if keyword has one
                if category:
                    for item in items:
                        item["_forced_category"] = category

                all_items.extend(items)
            except Exception as e:
                logger.error(f"Failed to scrape '{keyword}': {e}")

            # Rate limiting delay between keywords
            if i < len(keywords) - 1:
                delay = random.uniform(*delay_range)
                await asyncio.sleep(delay)

    finally:
        await engine.stop()

    logger.info(f"Total raw items scraped: {len(all_items)}")
    return all_items
