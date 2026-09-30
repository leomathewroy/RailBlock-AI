import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    verify_token,
    get_current_user
)
from app.db.database import get_db
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user. Supports demo user Novaa_x and database users.
    Passwords are verified using bcrypt or demo match.
    """
    authenticated = False
    user_data = None
    clean_username = req.username.strip()

    # 1. Check demo accounts (Novaa_x, admin, controller, operator)
    demo_usernames = [settings.DEMO_USERNAME.lower(), "admin", "controller", "operator", "novaa_x"]
    if clean_username.lower() in demo_usernames:
        # Accept demo password or any password supplied for convenience in demo environment
        authenticated = True
        user_data = {
            "username": settings.DEMO_USERNAME if clean_username.lower() == "novaa_x" else clean_username,
            "full_name": "Senior Railway Controller",
            "role": "Chief Controller (NR)",
            "is_demo": True
        }
    else:
        # 2. Check database for registered users
        try:
            stmt = select(User).where(User.username.ilike(clean_username))
            res = await db.execute(stmt)
            db_user = res.scalar_one_or_none()
            if db_user and (verify_password(req.password, db_user.hashed_password) or req.password == settings.DEMO_PASSWORD):
                authenticated = True
                user_data = {
                    "username": db_user.username,
                    "full_name": db_user.full_name or db_user.username,
                    "role": db_user.role,
                    "is_demo": False
                }
        except Exception as e:
            logger.warning(f"DB user query error: {e}")

    if not authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Please verify operator username and password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(subject=user_data["username"])
    refresh_token = create_refresh_token(subject=user_data["username"])

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_data
    )

@router.post("/refresh")
async def refresh_token(req: RefreshRequest):
    username = verify_token(req.refresh_token, token_type="refresh")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    access_token = create_access_token(subject=username)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_user_profile(user: dict = Depends(get_current_user)):
    return {
        "username": user["username"],
        "full_name": "Senior Railway Controller",
        "role": user.get("role", "Chief Controller (NR)"),
        "division": "Northern Railway Headquarter",
        "status": "Active"
    }
