# app/utils.py
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
from .config import settings

MAX_BCRYPT_LENGTH = 72

def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.
    Truncate to 72 characters to avoid bcrypt limitation.
    Returns the hash as a UTF-8 string.
    """
    safe_password = password[:MAX_BCRYPT_LENGTH].encode("utf-8")
    hashed = bcrypt.hashpw(safe_password, bcrypt.gensalt())
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    safe_password = plain_password[:MAX_BCRYPT_LENGTH].encode("utf-8")
    return bcrypt.checkpw(safe_password, hashed_password.encode("utf-8"))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    """
    Decode a JWT token.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
