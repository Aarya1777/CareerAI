from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.deps import get_current_user
from modules.auth.models import User
from modules.applications.schemas import ApplicationCreate, ApplicationOut
from modules.applications.service import create_application, get_user_applications

router = APIRouter()

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