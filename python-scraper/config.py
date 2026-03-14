import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    cron_secret: str = ""
    scrape_interval_hours: int = 4
    max_videos_per_run: int = 500
    data_retention_days: int = 7
    thumbnail_bucket: str = "thumbnails"
    playwright_headless: bool = True
    log_level: str = "INFO"
    port: int = 8000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    @property
    def is_supabase_configured(self) -> bool:
        return (
            bool(self.supabase_url)
            and bool(self.supabase_service_role_key)
            and self.supabase_url.startswith("https://")
            and len(self.supabase_service_role_key) > 20
        )


settings = Settings()
