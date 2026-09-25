from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.deps import get_current_user
from modules.auth.models import User
from modules.resumes.service import get_resume_by_id
from modules.reports.schemas import ReportOut
from modules.reports.service import get_reports_for_resume, get_report_by_id

router = APIRouter()


@router.get("/resume/{resume_id}", response_model=list[ReportOut])
def list_reports_for_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_resume_by_id(db, resume_id)
    if not resume or resume.user_id != current_user.id:
        raise HTTPException(404, "Resume not found")
    return get_reports_for_resume(db, resume_id)


@router.get("/{report_id}", response_model=ReportOut)
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = get_report_by_id(db, report_id)
    if not report:
        raise HTTPException(404, "Report not found")
    resume = get_resume_by_id(db, int(report.resume_id))

    if not resume or resume.user_id != current_user.id:
        raise HTTPException(404, "Report not found")
    return report