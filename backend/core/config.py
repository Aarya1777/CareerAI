from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "CareerAI Backend"
    database_url: str = "postgresql://postgres:password@localhost/career_ai"
    jwt_secret: str = "your_secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()