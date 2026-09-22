from typing import Final
from fastapi import Header, HTTPException

from firebase_admin import auth
from app.core.security import firebase_admin

AUTH_STATUS: Final[str] = "configured"

def verify_firebase_token(authorization: str | None = Header(default = None)) -> dict:
    if not authorization:
        raise HTTPException(
            status_code = 401,
            detail = "Missing Authorization header"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code = 401,
            detail = "Invalid Authorization header"
        )

    token = authorization.split("Bearer ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code = 401,
            detail = "Missing Firebase ID token"
        )

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as exc:
        raise HTTPException(
            status_code = 401,
            detail = "Invalid or expired Firebase ID token"
        ) from exc