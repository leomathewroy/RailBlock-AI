from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "RailBlock AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://railblock:changeme@localhost:5432/railblock_ai"
    DATABASE_URL_SYNC: str = "postgresql://railblock:changeme@localhost:5432/railblock_ai"
    SQLITE_FALLBACK_URL: str = "sqlite+aiosqlite:///./railblock.db"

    # Security & Auth
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    JWT_SECRET: str = "d8a4f910425c2763f044bb7d0a6234bc5e90d8106a77d12f4b39178ad3813958"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Demo credentials
    DEMO_USERNAME: str = "Novaa_x"
    DEMO_PASSWORD: str = "RailBlock@2026"

    # CORS - Allow Netlify and Localhost
    CORS_ORIGINS: Union[str, List[str]] = "*"

    @field_validator("CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.strip() == "*":
                return ["*"]
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # ML & Optimizer
    MODEL_PATH: str = "ml_models/delay_model"
    ENABLE_ML_PREDICTIONS: bool = True

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Frontend
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
