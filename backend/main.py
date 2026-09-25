
# Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
# .\.venv\Scripts\Activate.ps1
# uvicorn main:app --reload


from fastapi import FastAPI
from core.config import settings

from modules.auth.router import router as auth_router
from modules.users.router import router as users_router
from modules.resumes.router import router as resumes_router
from modules.reports.router import router as reports_router
from modules.applications.router import router as applications_router


app = FastAPI(
    title=settings.app_name,
    version="1.0.0"
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(resumes_router, prefix="/resumes", tags=["resumes"])
app.include_router(reports_router, prefix="/reports", tags=["reports"])
app.include_router(applications_router, prefix="/applications", tags=["applications"])


@app.get("/")
def root():
    return {"message": f"Welcome to {settings.app_name}"}


@app.get("/health")
def health():
    return {"status": "healthy"}