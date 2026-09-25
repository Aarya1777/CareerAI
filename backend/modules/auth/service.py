from sqlalchemy.orm import Session
from modules.auth.models import User
from modules.auth.schemas import UserCreate
from core.security import hash_password, verify_password

def create_user(db: Session, user_data: UserCreate) -> User:
    new_user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        user_type=user_data.user_type,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        return None
    return user
