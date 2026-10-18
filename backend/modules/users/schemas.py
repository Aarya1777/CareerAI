from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from core.database import Base
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