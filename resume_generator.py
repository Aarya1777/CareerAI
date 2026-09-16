import os
import json
from dotenv import load_dotenv
from google import genai


# -------------------------
# LOAD API KEY
# -------------------------

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Gemini API key not found.")
    exit()


client = genai.Client(api_key=api_key)


# -------------------------
# RESUME PROFILE
# -------------------------

# Temporary test profile.
# Later, we will connect this with resume_interview.py.

profile = {
    "target_roles": [
        "AI Intern",
        "Machine Learning Intern",
        "Data Analytics Intern"
    ],

    "career_goal": "Looking for an internship opportunity in AI, Machine Learning or Data Analytics.",

    "user_type": "student",

    "education": [
        "Second-year Computer Engineering student"
    ],

    "skills": [
        "Python",
        "Data Analysis",
        "Machine Learning"
    ],

    "experience": [],

    "projects": [
        {
            "name": "Global Air Quality Data Analysis",
            "description": "Analyzed air quality data from multiple cities over 150 days."
        }
    ],

    "certifications": [],

    "achievements": [],

    "leadership": [],

    "languages": [],

    "links": []
}


# -------------------------
# GENERATE RESUME
# -------------------------

def generate_resume(profile):

    prompt = f"""
You are CareerAI, an expert professional resume writer.

Create a professional, ATS-friendly resume from the user's
structured information below.

USER INFORMATION:

{json.dumps(profile, indent=4)}

IMPORTANT RULES:

1. Use ONLY information provided in the profile.
2. NEVER invent companies, internships, jobs, projects,
   technologies, achievements, dates, numbers or results.
3. Do not exaggerate the user's experience.
4. Do not create fake metrics or accomplishments.
5. Do not add name, email or phone number because those
   will be provided separately by the website.
6. Use professional and concise language.
7. Optimize wording for ATS systems without keyword stuffing.
8. Use standard resume section names.
9. For a student/fresher, emphasize education, skills,
   projects, certifications and achievements when available.
10. Do not create an experience section if there is no experience.
11. Do not create empty sections.
12. Do not add information that is not present.
13. Keep project descriptions factual.
14. Use strong action verbs only when they accurately describe
    the information provided.
15. Do not claim results unless the user provided those results.
16. Do not add technologies that were not explicitly provided.
17. Do not add responsibilities that were not explicitly provided.
18. Do not create fake dates or durations.
19. Keep the resume suitable for the user's target roles.
20. If information is insufficient for a section, leave that
    section empty rather than inventing information.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "professional_summary": "",
    "skills": [],
    "education": [],
    "experience": [],
    "projects": [],
    "certifications": [],
    "achievements": [],
    "leadership": [],
    "languages": [],
    "links": []
}}

For projects, use this structure:

{{
    "name": "",
    "description": ""
}}

For experience, use this structure:

{{
    "company": "",
    "role": "",
    "duration": "",
    "responsibilities": []
}}

For education, use this structure:

{{
    "degree": "",
    "institution": "",
    "duration": ""
}}

For certifications, achievements, leadership, languages and links,
use simple strings.

Do not include any explanation outside the JSON.
"""


    # -------------------------
    # GEMINI REQUEST
    # -------------------------

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        text = response.text.strip()


        # -------------------------
        # CLEAN JSON RESPONSE
        # -------------------------

        if text.startswith("```"):

            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()


        # -------------------------
        # CONVERT TO JSON
        # -------------------------

        resume = json.loads(text)

        return resume


    except json.JSONDecodeError:

        print("\n❌ Gemini returned invalid JSON.")

        print("\nGemini response:")
        print(text)

        return None


    except Exception as e:

        print("\n❌ Resume generation error:")
        print(e)

        return None


# -------------------------
# MAIN
# -------------------------

print("\n🚀 CareerAI Resume Generator")
print("--------------------------------")

print("🧠 Generating your resume...")


resume = generate_resume(profile)


# -------------------------
# DISPLAY RESULT
# -------------------------

if resume:

    print("\n" + "=" * 60)

    print("📄 GENERATED RESUME")

    print("=" * 60)


    print(
        json.dumps(
            resume,
            indent=4,
            ensure_ascii=False
        )
    )


    # -------------------------
    # SAVE RESUME
    # -------------------------

    with open(
        "generated_resume.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            resume,
            file,
            indent=4,
            ensure_ascii=False
        )


    print("\n✅ Resume generated successfully!")

    print("📁 Saved as: generated_resume.json")


else:

    print("\n❌ Resume generation failed.")

