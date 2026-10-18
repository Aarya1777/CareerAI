from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    app_name: str = "CareerAI"
    database_url: str = "postgresql://postgres:Ananya%4027@localhost:5432/CareerAI"
    jwt_secret: str = "secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    gemini_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        extra="ignore"
    )

settings = Settings()

