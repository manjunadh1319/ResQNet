"""
Application configuration loaded from environment variables.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


class Settings:
    APP_NAME: str = "ResQNet - AI Disaster Response System"
    APP_VERSION: str = "1.0.0"

    # Groq / LLM
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", f"sqlite:///{BASE_DIR / 'resqnet.db'}"
    )

    # CORS
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")

    # Datasets
    DATASETS_DIR: Path = BASE_DIR / "datasets"
    HOSPITALS_CSV: Path = DATASETS_DIR / "hospitals.csv"
    RESCUE_TEAMS_CSV: Path = DATASETS_DIR / "rescue_teams.csv"
    RELIEF_RESOURCES_CSV: Path = DATASETS_DIR / "relief_resources.csv"
    SHELTERS_CSV: Path = DATASETS_DIR / "shelters.csv"


settings = Settings()
