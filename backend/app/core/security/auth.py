from typing import Final
from fastapi import Depends, HTTPException

from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth

from app.core.security import firebase_admin

AUTH_STATUS: Final[str] = "configured"
bearer_scheme = HTTPBearer(auto_error = False)

def verify_firebase_token(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code = 401,
            detail = "Missing Authorization header",
            headers = {"WWW-Authenticate": "Bearer"}
        )

    token = credentials.credentials

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as exc:
        raise HTTPException(
            status_code = 401,
            detail = "Invalid or expired Firebase ID token",
            headers = {"WWW-Authenticate": "Bearer"},
        ) from exc
