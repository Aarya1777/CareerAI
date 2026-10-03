from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.deps import get_current_user
from modules.auth.models import User
from modules.resumes.service import get_user_resume
from modules.jobs.schemas import JobOut, MatchedJobOut
from modules.jobs.service import fetch_and_store_jobs, get_recent_jobs, get_matched_jobs

router = APIRouter()


@router.post("/fetch")
def fetch_jobs(search_query: str = "developer", db: Session = Depends(get_db)):
    jobs = fetch_and_store_jobs(db, search_query)
    return {"fetched": len(jobs)}


@router.get("/listings", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return get_recent_jobs(db)


@router.get("/matches", response_model=list[MatchedJobOut])
def get_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume(db, current_user.id)
    if not resume:
        raise HTTPException(404, "No resume found — create one first")

    jobs = get_recent_jobs(db)
    if not jobs:
        raise HTTPException(404, "No jobs available — fetch jobs first")

    return get_matched_jobs(resume.content_json or {}, jobs)