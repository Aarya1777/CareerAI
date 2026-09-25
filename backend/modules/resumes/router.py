from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
from core.database import get_db
from core.deps import get_current_user
from modules.auth.models import User
from modules.resumes.schemas import ResumeCreate, ResumeOut
from modules.resumes.service import create_or_update_resume, get_user_resume
from ai.service import extract_resume_from_pdf

router = APIRouter()
UPLOAD_DIR = "uploaded_resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=ResumeOut)
def save_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_or_update_resume(db, current_user.id, resume_data)


@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are supported")

    file_bytes = await file.read()
    file_path = f"{UPLOAD_DIR}/user_{current_user.id}.pdf"
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    extracted_data = extract_resume_from_pdf(file_bytes)
    resume_data = ResumeCreate(source="uploaded", content_json=extracted_data, file_url=file_path)
    return create_or_update_resume(db, current_user.id, resume_data)


@router.get("/", response_model=ResumeOut)
def get_my_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume(db, current_user.id)
    if not resume:
        raise HTTPException(404, "No resume found — create one first")
    return resume