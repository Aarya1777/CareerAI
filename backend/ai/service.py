import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import types


# Load environment files.
# backend/.env is preferred; root .env is used as a fallback for missing values.
BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BACKEND_DIR.parent

load_dotenv(BACKEND_DIR / ".env")
load_dotenv(PROJECT_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.6-flash")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured. "
        "Add it to backend/.env or the project root .env."
    )

client = genai.Client(api_key=GEMINI_API_KEY)

GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY2")

if not GEMINI_API_KEY_2:
    raise RuntimeError("GEMINI_API_KEY2 is not configured.")

job_matching_client = genai.Client(api_key=GEMINI_API_KEY_2)


def _parse_json_response(text: str) -> dict[str, Any]:
    """Parse Gemini JSON output, including responses wrapped in code fences."""
    if not text:
        raise RuntimeError("Gemini returned an empty response.")

    cleaned = text.strip()

    if cleaned.startswith("```"):
        lines = cleaned.splitlines()

        if lines and lines[0].startswith("```"):
            lines = lines[1:]

        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]

        cleaned = "\n".join(lines).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Gemini returned invalid JSON: {cleaned[:500]}"
        ) from exc

    if not isinstance(parsed, dict):
        raise RuntimeError("Gemini response must be a JSON object.")

    return parsed


def _clamp_score(value: Any, default: float = 0.0) -> float:
    """Convert a value to a safe score between 0 and 100."""
    try:
        number = float(value)
    except (TypeError, ValueError):
        number = default

    return max(0.0, min(100.0, number))


def _as_list(value: Any) -> list:
    """Return a value as a list, or an empty list when invalid."""
    return value if isinstance(value, list) else []


def extract_resume_from_pdf(file_bytes: bytes) -> dict:
    """
    Extract structured resume information from a PDF using Gemini.
    """
    if not file_bytes:
        raise ValueError("The uploaded PDF is empty.")

    prompt = """
You are a resume extraction system.

Read the attached PDF resume and extract only information that is actually
present in the document.

Return ONLY valid JSON in exactly this structure:

{
  "name": "",
  "email": "",
  "phone": "",
  "summary": "",
  "skills": [],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": []
}

Rules:
- Do not invent information.
- Use empty strings when a field is not present.
- Use empty arrays when a section is not present.
- Preserve important details such as titles, companies, dates, technologies,
  degrees, institutions, and project descriptions.
- Keep the result concise but complete.
"""

    pdf_part = types.Part.from_bytes(
        data=file_bytes,
        mime_type="application/pdf",
    )

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[prompt, pdf_part],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
    except Exception as exc:
        error_text = str(exc)

        if "503" not in error_text and "UNAVAILABLE" not in error_text:
            raise

        response = client.models.generate_content(
            model=FALLBACK_MODEL,
            contents=[prompt, pdf_part],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
    data = _parse_json_response(response.text)

    return {
        "name": str(data.get("name", "") or ""),
        "email": str(data.get("email", "") or ""),
        "phone": str(data.get("phone", "") or ""),
        "summary": str(data.get("summary", "") or ""),
        "skills": _as_list(data.get("skills")),
        "experience": _as_list(data.get("experience")),
        "education": _as_list(data.get("education")),
        "projects": _as_list(data.get("projects")),
        "certifications": _as_list(data.get("certifications")),
    }


def generate_ats_report(
    resume_content: dict,
    job_description: str | None = None,
) -> dict:
    """
    Generate a real ATS analysis using Gemini.

    job_description is optional so the existing backend API remains compatible.
    """

    resume_json = json.dumps(
        resume_content or {},
        ensure_ascii=False,
        indent=2,
    )

    if job_description:
        target_section = f"""
Target Job Description:
{job_description}
"""
    else:
        target_section = """
No target job description was supplied.

In this case:
- infer relevant professional keywords only from the resume itself,
- evaluate ATS readiness, completeness, clarity, consistency, and
  keyword coverage conservatively,
- do not pretend there is a job-specific keyword match.
"""

    prompt = f"""
You are an ATS resume analyzer.

Analyze the candidate resume.

Resume:
{resume_json}

{target_section}

Return ONLY valid JSON in exactly this structure:

{{
  "overall_score": 0,
  "keyword_match_score": 0,
  "formatting_score": 0,
  "missing_keywords": [],
  "corrections": [],
  "strengths": [],
  "summary_text": ""
}}

Rules:
- Every score must be a number from 0 to 100.
- Do not invent experience, skills, education, projects, or certifications.
- missing_keywords should contain only useful keywords or resume elements
  that are reasonably missing based on the available information.
- corrections must be an array of objects with:
  {{
    "section": "",
    "issue": "",
    "suggestion": ""
  }}
- strengths should contain concrete strengths visible in the resume.
- summary_text should be a concise overall assessment.
- Be conservative when information is missing.
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    data = _parse_json_response(response.text)

    return {
        "overall_score": _clamp_score(data.get("overall_score")),
        "keyword_match_score": _clamp_score(
            data.get("keyword_match_score")
        ),
        "formatting_score": _clamp_score(
            data.get("formatting_score")
        ),
        "missing_keywords": _as_list(data.get("missing_keywords")),
        "corrections": _as_list(data.get("corrections")),
        "strengths": _as_list(data.get("strengths")),
        "summary_text": str(data.get("summary_text", "") or ""),
        "model_used": MODEL,
    }

def match_candidate_to_job(
    resume_content: dict,
    job_description: str,
    job_title: str | None = None,
) -> dict:
    """
    Compare a candidate resume against a job description using Gemini.
    """

    if not resume_content:
        raise ValueError("Resume content is required.")

    if not job_description or not job_description.strip():
        raise ValueError("Job description is required.")

    resume_json = json.dumps(
        resume_content,
        ensure_ascii=False,
        indent=2,
    )

    title_section = ""
    if job_title and job_title.strip():
        title_section = f"""
Job Title:
{job_title.strip()}
"""

    prompt = f"""
You are the AI matching engine for a hiring platform.

Compare the candidate's resume against the job description.

Candidate Resume:
{resume_json}

{title_section}

Job Description:
{job_description}

Return ONLY valid JSON in exactly this structure:

{{
  "match_score": 0,
  "matched_skills": [],
  "missing_skills": [],
  "strengths": [],
  "concerns": [],
  "recommendation": "",
  "summary": ""
}}

Rules:
- match_score must be a number from 0 to 100.
- matched_skills must contain skills or qualifications supported by the
  resume and relevant to the job.
- missing_skills must contain important job requirements that are not
  supported by the resume.
- Do not invent candidate experience, skills, education, or certifications.
- strengths must describe genuine reasons the candidate fits the job.
- concerns must describe genuine gaps or risks visible from the comparison.
- recommendation must be exactly one of:
  "strong_match",
  "good_match",
  "possible_match",
  "weak_match"
- summary must be concise and explain the overall fit.
- Be conservative when evidence is missing.
"""

    try:
        response = job_matching_client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    except Exception as exc:
        error_text = str(exc)

        if "503" not in error_text and "UNAVAILABLE" not in error_text:
            raise

        response = job_matching_client.models.generate_content(
            model=FALLBACK_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )

    data = _parse_json_response(response.text)

    score = _clamp_score(data.get("match_score"))

    recommendation = str(
        data.get("recommendation", "") or ""
    )

    allowed = {
        "strong_match",
        "good_match",
        "possible_match",
        "weak_match",
    }

    if recommendation not in allowed:
        if score >= 80:
            recommendation = "strong_match"
        elif score >= 65:
            recommendation = "good_match"
        elif score >= 45:
            recommendation = "possible_match"
        else:
            recommendation = "weak_match"

    return {
        "match_score": score,
        "matched_skills": _as_list(data.get("matched_skills")),
        "missing_skills": _as_list(data.get("missing_skills")),
        "strengths": _as_list(data.get("strengths")),
        "concerns": _as_list(data.get("concerns")),
        "recommendation": recommendation,
        "summary": str(data.get("summary", "") or ""),
        "model_used": MODEL,
    }

