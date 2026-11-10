from pathlib import Path
from typing import List
from pydantic import computed_field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Locate the root .env regardless of whether the command is run from root or backend/
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENV_PATH = ROOT_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(ENV_PATH), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App Info
    PROJECT_NAME: str = "Restaurant Direct Ordering & KDS"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False

    # Database (Render compatible auto-normalization)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/restaurant_db"
    DATABASE_URL_SYNC: str = ""

    # Security
    SECRET_KEY: str = "nawaabs_biryani_kds_super_secure_jwt_secret_key_2026_hyderabad"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # CORS
    CORS_ORIGINS: str = "*"

    @computed_field
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @model_validator(mode="after")
    def normalize_database_urls(self) -> "Settings":
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            self.DATABASE_URL = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            self.DATABASE_URL = url.replace("postgresql://", "postgresql+asyncpg://", 1)

        if not self.DATABASE_URL_SYNC:
            sync_url = self.DATABASE_URL
            if sync_url.startswith("postgresql+asyncpg://"):
                self.DATABASE_URL_SYNC = sync_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)
            elif sync_url.startswith("postgres://"):
                self.DATABASE_URL_SYNC = sync_url.replace("postgres://", "postgresql+psycopg2://", 1)
            elif sync_url.startswith("postgresql://"):
                self.DATABASE_URL_SYNC = sync_url.replace("postgresql://", "postgresql+psycopg2://", 1)
            else:
                self.DATABASE_URL_SYNC = sync_url
        else:
            if self.DATABASE_URL_SYNC.startswith("postgres://"):
                self.DATABASE_URL_SYNC = self.DATABASE_URL_SYNC.replace("postgres://", "postgresql+psycopg2://", 1)
            elif self.DATABASE_URL_SYNC.startswith("postgresql+asyncpg://"):
                self.DATABASE_URL_SYNC = self.DATABASE_URL_SYNC.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)

        return self


settings = Settings()