from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from core.database import Base


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, nullable=False, index=True)
#     password_hash = Column(String, nullable=False)
#     name = Column(String, nullable=False)
#     role = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)

from pydantic import BaseModel


class UserProfileOut(BaseModel):
    id: int
    email: str
    name: str | None = None
    user_type: str

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: str | None = None