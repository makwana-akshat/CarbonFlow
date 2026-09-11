from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Carbon Capture-to-Product Marketplace"
    API_V1_STR: str = "/api/v1"
    
    # We will add database and auth settings here later
    
    class Config:
        case_sensitive = True

settings = Settings()
