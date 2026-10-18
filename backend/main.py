import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

from modules.auth.router import router as auth_router
from modules.users.router import router as users_router
from modules.resumes.router import router as resumes_router
from modules.reports.router import router as reports_router
from modules.applications.router import router as applications_router
from modules.interview.router import router as interview_router
from modules.interview.router import speech_router


app = FastAPI(
    title=settings.app_name,
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ],


    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(resumes_router, prefix="/resumes", tags=["resumes"])
app.include_router(reports_router, prefix="/reports", tags=["reports"])
app.include_router(applications_router, prefix="/applications", tags=["applications"])
app.include_router(interview_router, prefix="/interview", tags=["interview"])
app.include_router(speech_router, tags=["speech"])


@app.get("/jobs")
def get_jobs():
    from sqlalchemy import text
    from core.database import engine

    query = text("""
        SELECT id, title, company, location, required_skills,
               description, job_url, source, fetched_at
FROM jobs
WHERE title NOT ILIKE ANY (ARRAY[
'%senior%', '%AVP%', '%vice president%', '%director%',
'%principal%', '%staff engineer%', '%team lead%',
'%technical lead%', '%architect%', '%engineering manager%'
])
ORDER BY fetched_at DESC NULLS LAST, id DESC
LIMIT 20
    """)

    with engine.connect() as conn:
        rows = conn.execute(query).mappings().all()

    jobs = []
    for row in rows:
        job = dict(row)
        job["job_title"] = job.pop("title")
        job["job_description"] = job.pop("description")
        job["required skills"] = job.pop("required_skills") or []
        job["salary"] = "Not specified"
        jobs.append(job)

    return {"jobs": jobs}


@app.get("/")
def root():
    return {"message": f"Welcome to {settings.app_name}"}


@app.get("/health")
def health():
    return {"status": "healthy"}


