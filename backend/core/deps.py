from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import decode_access_token
from models.user import User


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    token = authorization.replace("Bearer ", "")

    try:
        payload = decode_access_token(token)

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(
        User.id == payload["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user