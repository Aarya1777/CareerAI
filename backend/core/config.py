from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "CareerAI"
    database_url: str = "postgresql://postgres:Ananya%4027@localhost:5432/CareerAI"
    jwt_secret: str = "secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()