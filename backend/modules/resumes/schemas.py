from pydantic import BaseModel
from typing import Any
from datetime import datetime


class ResumeCreate(BaseModel):
    source: str
    content_json: dict[str, Any] | None = None
    file_url: str | None = None


class ResumeOut(BaseModel):
    id: int
    source: str
    content_json: dict[str, Any] | None
    file_url: str | None
    created_at: datetime

    class Config:
        from_attributes = True