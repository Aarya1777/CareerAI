from pydantic import BaseModel
from datetime import datetime


class ApplicationCreate(BaseModel):
    job_title: str
    company_name: str
    job_url: str
    external_job_id: str | None = None
    match_score: float | None = None


class ApplicationOut(BaseModel):
    id: int
    job_title: str
    company_name: str
    job_url: str
    match_score: float | None
    current_status: str
    applied_at: datetime
    last_updated_at: datetime | None

    class Config:
        from_attributes = True