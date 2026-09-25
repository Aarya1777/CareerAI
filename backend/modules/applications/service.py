from sqlalchemy.orm import Session
from modules.applications.models import Application
from modules.applications.schemas import ApplicationCreate
from modules.resumes.service import get_user_resume


def create_application(db: Session, user_id: int, app_data: ApplicationCreate) -> Application:
    resume = get_user_resume(db, user_id)
    new_application = Application(
        user_id=user_id,
        resume_id=resume.id if resume else None,
        job_title=app_data.job_title,
        company_name=app_data.company_name,
        job_url=app_data.job_url,
        external_job_id=app_data.external_job_id,
        match_score=app_data.match_score,
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


def get_user_applications(db: Session, user_id: int) -> list[Application]:
    return (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.applied_at.desc())
        .all()
    )