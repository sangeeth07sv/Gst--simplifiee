import logging

from fastapi import APIRouter, Depends, HTTPException, status
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

    # Deliberately same error for "no such user" and "wrong password" —
    # avoids leaking which emails are registered.
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
    """
    NOT WIRED TO A REAL EMAIL PROVIDER YET. This currently only logs the
    reset request server-side. To make this functional:
      1. Generate a signed, short-lived reset token (reuse create_access_token
         with a `purpose: "password_reset"` claim, or a separate table).
      2. Send it via an email provider (SMTP / SendGrid / SES) — see
         backend/.env.example for where credentials would go.
      3. Add POST /auth/reset-password to verify the token and update
         hashed_password.
    Always returns 202 regardless of whether the email exists, to avoid
    leaking account existence.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        logger.info("Password reset requested for user_id=%s (email sending not yet configured)", user.id)
    return {"message": "If that email is registered, a reset link has been sent."}


@router.get("/google/login")
def google_login():
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google Sign-In is not configured yet. Set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in backend/.env.",
        )
    # TODO: redirect to Google's OAuth consent screen once credentials exist.
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented yet")


@router.get("/google/callback")
def google_callback():
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented yet")
