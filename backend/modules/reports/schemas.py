from pydantic import BaseModel
from typing import Any
from datetime import datetime


class ReportOut(BaseModel):
    id: int
    resume_id: int
    overall_score: float
    keyword_match_score: float | None
    formatting_score: float | None
    missing_keywords: list[Any] | None
    corrections: list[Any] | None
    strengths: list[Any] | None
    summary_text: str | None
    generated_at: datetime

    class Config:
        from_attributes = True