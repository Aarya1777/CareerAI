from sqlalchemy.orm import Session
from modules.reports.models import Report


def create_report_for_resume(db: Session, resume_id: int, ai_result: dict) -> Report:
    new_report = Report(
        resume_id=resume_id,
        overall_score=ai_result["overall_score"],
        keyword_match_score=ai_result.get("keyword_match_score"),
        formatting_score=ai_result.get("formatting_score"),
        missing_keywords=ai_result.get("missing_keywords"),
        corrections=ai_result.get("corrections"),
        strengths=ai_result.get("strengths"),
        summary_text=ai_result.get("summary_text"),
        raw_llm_response=ai_result,
        model_used=ai_result.get("model_used"),
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


def get_reports_for_resume(db: Session, resume_id: int) -> list[Report]:
    return db.query(Report).filter(Report.resume_id == resume_id).order_by(Report.generated_at.desc()).all()


def get_report_by_id(db: Session, report_id: int) -> Report | None:
    return db.query(Report).filter(Report.id == report_id).first()