from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Placement Agent OS"
    debug: bool = True
    secret_key: str = "changeme_in_production"
    database_url: str = "postgresql://user:password@localhost:5432/placement_os"
    redis_url: str = "redis://localhost:6379"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    hf_api_key: str = ""
    gemini_api_key: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
