from pydantic import BaseModel


class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str | None
    job_url: str
    description: str | None

    class Config:
        from_attributes = True

class MatchedJobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str | None
    job_url: str
    match_score: float
   