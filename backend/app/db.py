import os, asyncpg
from fastapi import FastAPI
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

async def init_pg(app: FastAPI):
    app.state.db = await asyncpg.create_pool(DB_URL)
    async with app.state.db.acquire() as conn:
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS episodes (
                id SERIAL PRIMARY KEY,
                topic TEXT NOT NULL,
                persona TEXT NOT NULL,
                transcript TEXT NOT NULL,
                audio_url TEXT NOT NULL DEFAULT '/fake-audio.mp3',
                timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        """
        )

async def close_pg(app: FastAPI):
    await app.state.db.close()
