from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    required_skills = Column(JSONB, nullable=True)
    description = Column(Text, nullable=True)
    job_url = Column(String, nullable=False)
    source = Column(String, nullable=True)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())