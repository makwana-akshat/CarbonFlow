from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CarbonFlow"
    API_V1_STR: str = "/api/v1"
    
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""
    
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # LLM Settings
    LLM_API_KEY: str | None = None
    LLM_MODEL: str | None = "qwen/qwen3.8-27b"
    LLM_BASE_URL: str | None = "https://api.groq.com/openai/v1"
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
