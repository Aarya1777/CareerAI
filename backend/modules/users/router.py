
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.deps import get_current_user
from modules.auth.models import User
from modules.users.schemas import UserProfileOut, UserProfileUpdate
from modules.users.service import update_user_profile

router = APIRouter()


@router.get("/me", response_model=UserProfileOut)
def read_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserProfileOut)
def edit_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_user_profile(db, 
                               current_user, 
                               update_data.name
                               )