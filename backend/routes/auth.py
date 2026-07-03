from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from backend.config import settings

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    university: str = ""
    department: str = ""

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

@router.post("/register")
def register(req: RegisterRequest):
    hashed = pwd_context.hash(req.password)
    # TODO: Save to DB
    token = create_access_token({"sub": req.email})
    return {"message": "Registered successfully", "access_token": token}

@router.post("/login")
def login(req: LoginRequest):
    # TODO: Verify from DB
    token = create_access_token({"sub": req.email})
    return {"access_token": token, "token_type": "bearer"}
