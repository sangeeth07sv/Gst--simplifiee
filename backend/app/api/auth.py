import logging
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.business import Business
from app.models.user import User
from app.schemas.auth import ForgotPasswordRequest, LoginRequest, SignupRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


def _has_business(db: Session, user_id) -> bool:
    return db.query(Business).filter(Business.owner_user_id == user_id).first() is not None


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=token, has_business=False)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
    )
    if not user or not user.hashed_password:
        raise invalid_credentials
    if not verify_password(payload.password, user.hashed_password):
        raise invalid_credentials
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated")
    token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=token, has_business=_has_business(db, user.id))


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        logger.info("Password reset requested for user_id=%s (email sending not yet configured)", user.id)
    return {"message": "If that email is registered, a reset link has been sent."}


@router.get("/google/login")
def google_login():
    if not settings.google_client_id or not settings.google_redirect_uri:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google Sign-In is not configured yet.",
        )
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return RedirectResponse(auth_url)


@router.get("/google/callback")
def google_callback(code: str | None = None, error: str | None = None, db: Session = Depends(get_db)):
    if error or not code:
        return RedirectResponse(f"{settings.frontend_origin}/login?error=google_auth_failed")

    token_res = httpx.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": settings.google_redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )
    if token_res.status_code != 200:
        logger.error("Google token exchange failed: %s", token_res.text)
        return RedirectResponse(f"{settings.frontend_origin}/login?error=google_auth_failed")

    access_token = token_res.json().get("access_token")

    userinfo_res = httpx.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    if userinfo_res.status_code != 200:
        logger.error("Google userinfo fetch failed: %s", userinfo_res.text)
        return RedirectResponse(f"{settings.frontend_origin}/login?error=google_auth_failed")

    info = userinfo_res.json()
    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name") or email

    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
        else:
            user = User(full_name=name, email=email, google_id=google_id, hashed_password=None)
            db.add(user)
    db.commit()
    db.refresh(user)

    jwt_token = create_access_token(subject=str(user.id))
    has_business = "true" if _has_business(db, user.id) else "false"
    return RedirectResponse(
        f"{settings.frontend_origin}/login?token={jwt_token}&has_business={has_business}"
    )
