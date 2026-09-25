import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


resume = {
    "professional_summary": "Computer Engineering student with skills in Python, Machine Learning, and Data Analysis.",
    "skills": [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "SQL"
    ],
    "projects": [
        {
            "name": "Global Air Quality Data Analysis",
            "description": "Analyzed air quality data from multiple cities using Python."
        }
    ]
}


user_instruction = "Make my professional summary more concise and professional."


prompt = f"""
You are an AI resume editor.

The user wants to modify their resume.

Current resume:
{json.dumps(resume, indent=4)}

User's requested change:
{user_instruction}

Rules:
- Apply ONLY the requested change.
- Keep all other resume information unchanged.
- Never invent skills, experience, achievements, education, projects, or numbers.
- Keep the resume professional and ATS-friendly.
- Return ONLY valid JSON.
- Return the complete updated resume using the same structure.
"""

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt
)

print("AI Edited Resume:")
print(response.text)