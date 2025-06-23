# app/main.py
from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from asyncpg import Record
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from passlib.context import CryptContext
from pydantic import BaseModel
import os

from app.db import init_pg, close_pg
from app.models import GenerateRequest, EpisodeResponse
from app.queries import insert_episode_sql, select_episodes_sql
from app.groq import client  # AsyncGroq SDK for Groq chat
from app.models import GenerateRequest, EpisodeResponse, Settings, LoginRequest
from app.auth import USER_DB, pwd_ctx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup/shutdown database
@app.on_event("startup")
async def startup():
    await init_pg(app)


@app.on_event("shutdown")
async def shutdown():
    await close_pg(app)


# Handle auth errors
@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return Response(status_code=exc.status_code, content=exc.message)


def rec_to_dict(rec: Record) -> dict:
    return dict(rec)


### Auth Endpoints ###


@app.post("/api/auth/login")
def login(req: LoginRequest, Authorize: AuthJWT = Depends()):
    user = USER_DB.get(req.username)
    if not user or not pwd_ctx.verify(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Bad username or password")
    access_token = Authorize.create_access_token(subject=req.username)
    Authorize.set_access_cookies(access_token)
    return {"msg": "Successfully logged in"}


@app.post("/api/auth/logout")
def logout(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    Authorize.unset_jwt_cookies()
    return {"msg": "Successfully logged out"}


@app.get("/api/auth/me")
def me(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    return {"username": Authorize.get_jwt_subject()}


### Podcast Endpoints ###


@app.post("/api/generate", response_model=EpisodeResponse)
async def create_episode(req: GenerateRequest, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": f"You are {req.persona}, a lively podcast host.",
            },
            {
                "role": "user",
                "content": f"Create a short podcast script about: {req.topic}",
            },
        ],
    )
    transcript = response.choices[0].message.content
    sql = insert_episode_sql()
    async with app.state.db.acquire() as conn:
        rec = await conn.fetchrow(sql, req.topic, req.persona, transcript)
    if not rec:
        raise HTTPException(status_code=500, detail="Failed to insert episode")
    return EpisodeResponse(**rec_to_dict(rec))


@app.get("/api/episodes", response_model=list[EpisodeResponse])
async def list_episodes(limit: int = 20, Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    sql = select_episodes_sql(limit).get_sql()
    async with app.state.db.acquire() as conn:
        rows = await conn.fetch(sql)
    return [EpisodeResponse(**rec_to_dict(r)) for r in rows]
