from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from core.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, nullable=False)
    keyword_match_score = Column(Float, nullable=True)
    formatting_score = Column(Float, nullable=True)
    missing_keywords = Column(JSONB, nullable=True)
    corrections = Column(JSONB, nullable=True)
    strengths = Column(JSONB, nullable=True)
    summary_text = Column(Text, nullable=True)
    raw_llm_response = Column(JSONB, nullable=True)
    model_used = Column(String, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())