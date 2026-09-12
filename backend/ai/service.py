def extract_resume_from_pdf(file_bytes: bytes) -> dict:
    """
    STUB — replace with real implementation.
    Takes raw PDF bytes, returns structured resume data.
    """
    return {
        "name": "Sample Name",
        "skills": ["Python", "SQL"],
        "experience": [],
        "education": [],
    }


def generate_ats_report(resume_content: dict) -> dict:
    """
    STUB — replace with real implementation.
    Takes structured resume content, returns ATS analysis.
    """
    return {
        "overall_score": 72.5,
        "keyword_match_score": 65.0,
        "formatting_score": 80.0,
        "missing_keywords": ["Docker", "CI/CD"],
        "corrections": [
            {"section": "experience", "issue": "no quantified results", "suggestion": "add a metric to bullet 2"}
        ],
        "strengths": ["strong action verbs", "clear structure"],
        "summary_text": "Solid resume with good structure; add more measurable achievements.",
        "model_used": "stub-v1",
    }
