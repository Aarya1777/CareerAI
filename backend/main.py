from core.config import settings

print("App Name:", settings.app_name)
print("Database URL:", settings.database_url)
print("JWT Secret:", settings.jwt_secret)
print("JWT Algorithm:", settings.jwt_algorithm)
print("Expire Minutes:", settings.access_token_expire_minutes)