from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    memory_backend: str = "hindsight"
    memory_db_path: str = "data/productops-memory.sqlite3"
    hindsight_base_url: str = "http://localhost:8888"
    hindsight_api_key: str | None = None
    hindsight_bank_id: str = "productops-memory"
    hindsight_timeout_seconds: float = 12.0
    ask_agent_timeout_seconds: float = 50.0
    llm_api_key: str | None = None
    llm_provider: str = "ollama"
    llm_model: str = "gpt-4o-mini"
    llm_base_url: str | None = None
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:latest"
    ollama_timeout_seconds: float = 35.0
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
