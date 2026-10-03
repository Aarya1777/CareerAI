import requests
from sqlalchemy.orm import Session
from core.config import settings
from modules.jobs.models import Job
from modules.jobs.matching import match_jobs

EXTERNAL_JOB_API_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1"


def fetch_and_store_jobs(db: Session, search_query: str = "developer") -> list[Job]:
    params = {
        "app_id": settings.adzuna_app_id,
        "app_key": settings.adzuna_app_key,
        "what": search_query,
        "results_per_page": 20,
    }
    response = requests.get(EXTERNAL_JOB_API_URL, params=params, timeout=15)
    response.raise_for_status()
    results = response.json().get("results", [])

    stored_jobs = []
    for item in results:
        job = Job(
            title=item.get("title", ""),
            company=item.get("company", {}).get("display_name", ""),
            location=item.get("location", {}).get("display_name", ""),
            description=item.get("description", ""),
            job_url=item.get("redirect_url", ""),
            source="adzuna",
        )
        db.add(job)
        stored_jobs.append(job)
    db.commit()
    return stored_jobs


def get_recent_jobs(db: Session, limit: int = 50) -> list[Job]:
    return db.query(Job).order_by(Job.fetched_at.desc()).limit(limit).all()


def get_matched_jobs(resume_content: dict, jobs: list[Job]) -> list[dict]:
    jobs_payload = [{"id": j.id, "title": j.title, "description": j.description} for j in jobs]
    match_results = match_jobs(resume_content, jobs_payload)

    job_map = {j.id: j for j in jobs}
    merged = []
    for match in match_results:
        job = job_map.get(match["job_id"])
        if job:
            merged.append({
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "job_url": job.job_url,
                "match_score": match["match_score"],
                "reason": match.get("reason"),
            })

    return sorted(merged, key=lambda x: x["match_score"], reverse=True)