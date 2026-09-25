import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

resume_text = """
Computer Engineering student with skills in Python, Machine Learning,
Data Analysis, and SQL.

Projects:
- Global Air Quality Data Analysis using Python and Data Analysis.
- Built a machine learning project using Python.

Education:
Computer Engineering, Second Year
"""

job_description = """
We are looking for a Machine Learning Intern.

Requirements:
- Python
- Machine Learning
- Data Analysis
- SQL
- Statistics
- Pandas
- NumPy
- Scikit-learn
"""


prompt = f"""
You are an ATS resume analyzer.

Analyze the resume against the job description.

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY valid JSON in this exact structure:

{{
    "ats_score": 0,
    "matched_keywords": [],
    "missing_keywords": [],
    "suggestions": []
}}

Rules:
- ats_score must be a number from 0 to 100.
- matched_keywords should contain skills or keywords present in both.
- missing_keywords should contain important job-related keywords missing from the resume.
- suggestions should contain practical ways to improve the resume.
- Do not invent experience or skills for the candidate.
"""

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt
)

print(response.text)