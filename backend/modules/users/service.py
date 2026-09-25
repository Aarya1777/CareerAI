from sqlalchemy.orm import Session

from modules.auth.models import User


def update_user_profile(
    db: Session,
    user: User,
    name: str | None = None
):
    if name is not None:
        user.name = name

    db.commit()
    db.refresh(user)

    return user