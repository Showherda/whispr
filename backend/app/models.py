from pydantic import BaseModel
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class GenerateRequest(BaseModel):
    topic: str
    persona: str

class EpisodeResponse(BaseModel):
    id: int
    topic: str
    persona: str
    transcript: str
    audio_url: str
    timestamp: datetime

class Settings(BaseModel):
    authjwt_secret_key: str = os.getenv("JWT_SECRET")
    authjwt_token_location: set = {"cookies"}
    authjwt_cookie_csrf_protect: bool = False  # enable in production

class LoginRequest(BaseModel):
    username: str
    password: str
