# modules/resumes/service.py
from sqlalchemy.orm import Session
from modules.resumes.models import Resume, ResumeHistory
from modules.resumes.schemas import ResumeCreate
from modules.reports.service import create_report_for_resume
from ai.service import generate_ats_report


def create_or_update_resume(db: Session, user_id: int, resume_data: ResumeCreate) -> Resume:
    existing = db.query(Resume).filter(Resume.user_id == user_id).first()

    if existing:
        db.add(ResumeHistory(
            user_id=user_id,
            source=existing.source,
            content_json=existing.content_json,
            file_url=existing.file_url,
        ))
        existing.source = resume_data.source
        existing.content_json = resume_data.content_json
        existing.file_url = resume_data.file_url
        db.commit()
        db.refresh(existing)
        resume = existing
    else:
        resume = Resume(
            user_id=user_id,
            source=resume_data.source,
            content_json=resume_data.content_json,
            file_url=resume_data.file_url,
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

    ai_result = generate_ats_report(resume.content_json or {})
    create_report_for_resume(db, resume.id, ai_result)
    return resume


def get_user_resume(db: Session, user_id: int) -> Resume | None:
    return db.query(Resume).filter(Resume.user_id == user_id).first()


def get_resume_by_id(db: Session, resume_id: int) -> Resume | None:
    return db.query(Resume).filter(Resume.id == resume_id).first()