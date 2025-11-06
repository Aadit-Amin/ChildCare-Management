# app/config.py
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL") or "postgresql://postgres:password@localhost:5432/childcare_db"
    SECRET_KEY: str = os.getenv("SECRET_KEY") or "supersecretkey"
    ALGORITHM: str = os.getenv("ALGORITHM") or "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or 60)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL") or "http://localhost:5173"

settings = Settings()
