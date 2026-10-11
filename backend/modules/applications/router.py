from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from modules.auth.models import User

from modules.applications.schemas import (
    ApplicationCreate,
    ApplicationOut,
    JobMatchRequest,
    JobMatchOut,
)

from modules.applications.service import (
    create_application,
    get_user_applications,
)

from modules.resumes.service import get_user_resume
from ai.service import match_candidate_to_job


router = APIRouter()


@router.post("/match", response_model=JobMatchOut)
def match_candidate(
    match_data: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume(db, current_user.id)

    if not resume or not resume.content_json:
        raise HTTPException(
            status_code=404,
            detail="No resume found — upload or save a resume first",
        )

    try:
        return match_candidate_to_job(
            resume_content=resume.content_json,
            job_description=match_data.job_description,
            job_title=match_data.job_title,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )


@router.post("/apply", response_model=ApplicationOut)
def apply_to_job(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_application(db, current_user.id, app_data)


@router.get("/", response_model=list[ApplicationOut])
def list_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_applications(db, current_user.id)
