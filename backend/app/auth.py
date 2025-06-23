# app/auth.py
from fastapi import Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
from passlib.context import CryptContext
import os
from app.models import Settings

# Mock user store (replace with DB in prod)
USER_DB = {
    "alice": {"username": "alice", "password": CryptContext(schemes=["bcrypt"]).hash("secret")}
}

pwd_ctx = CryptContext(schemes=["bcrypt"])

@AuthJWT.load_config
def get_config():
    return Settings()