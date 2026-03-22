import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SafePath DC Routing API"
    CORS_ORIGINS: list[str] = ["*"]
    CRIME_CSV_PATH: str = os.environ.get("CRIME_CSV_PATH", "api/Crime_Incidents_-_2026.csv")

settings = Settings()
