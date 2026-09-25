import os
import json
import subprocess
import time

import speech_recognition as sr
import sounddevice as sd
import numpy as np

from dotenv import load_dotenv
from google import genai


# ============================================================
# SETUP
# ============================================================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env")
    exit()

client = genai.Client(api_key=api_key)

MODEL = "gemini-3.6-flash"


# ============================================================
# PROFILE
# ============================================================

profile = {
    "target_roles": [],
    "career_goal": "",
    "user_type": "",
    "education": [],
    "skills": [],
    "experience": [],
    "projects": [],
    "certifications": [],
    "achievements": [],
    "leadership": [],
    "languages": [],
    "links": []
}


# ============================================================
# TEXT TO SPEECH
# ============================================================

def speak(text):
    """
    Print and speak CareerAI's message.

    Uses Windows PowerShell SpeechSynthesizer instead of
    pyttsx3 so every question is spoken reliably.
    """

    print("\nCareerAI:")
    print(text)

    # Remove emojis/symbols that can confuse speech synthesis
    clean_text = text.encode("ascii", "ignore").decode()

    if not clean_text.strip():
        return

    # PowerShell script
    powershell_script = f"""
Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.Rate = 0
$speaker.Volume = 100
$speaker.Speak({json.dumps(clean_text)})
$speaker.Dispose()
"""

    try:
        subprocess.run(
            [
                "powershell",
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                powershell_script
            ],
            check=True
        )

    except Exception as e:
        print("\nTTS Error:", e)


# ============================================================
# SPEECH TO TEXT
# ============================================================

recognizer = sr.Recognizer()


def listen():
    """
    Record the user's answer.

    ENTER = start
    ENTER = stop
    """

    input("\nPress ENTER to START recording...")

    print("\n🎙️ Recording...")
    print("Speak your answer.")
    print("When you are finished, press ENTER to STOP.\n")

    sample_rate = 16000
    recorded_audio = []

    def callback(indata, frames, time_info, status):
        if status:
            print("Audio status:", status)

        recorded_audio.append(indata.copy())

    try:

        with sd.InputStream(
            samplerate=sample_rate,
            channels=1,
            dtype="int16",
            callback=callback
        ):
            input()

        print("\n⏹️ Recording stopped.")
        print("Processing your answer...")

        if not recorded_audio:
            print("No audio was recorded.")
            return ""

        audio_data = np.concatenate(
            recorded_audio,
            axis=0
        )

        audio = sr.AudioData(
            audio_data.tobytes(),
            sample_rate,
            2
        )

        try:

            text = recognizer.recognize_google(audio)

            print("\nYou said:")
            print(text)

            return text

        except sr.UnknownValueError:

            print("\nSorry, I couldn't understand your answer.")
            return ""

        except sr.RequestError as e:

            print("\nSpeech recognition service is unavailable.")
            print("Error:", e)
            return ""

        except Exception as e:

            print("\nSpeech recognition error:")
            print(e)
            return ""

    except Exception as e:

        print("\nMicrophone error:")
        print(e)
        return ""


# ============================================================
# GEMINI HELPER
# ============================================================

def call_gemini(prompt, attempts=3):
    """
    Call Gemini with retry handling for temporary 503 errors.
    """

    for attempt in range(1, attempts + 1):

        try:

            response = client.models.generate_content(
                model=MODEL,
                contents=prompt
            )

            if response and response.text:
                return response.text.strip()

            print("\nGemini returned an empty response.")

        except Exception as e:

            print(
                f"\nGemini attempt {attempt}/{attempts} failed:"
            )
            print(e)

            error_text = str(e)

            if "503" in error_text or "UNAVAILABLE" in error_text:

                if attempt < attempts:

                    print(
                        "\nGemini is temporarily busy."
                        " Retrying in 3 seconds..."
                    )

                    time.sleep(3)

                else:

                    print(
                        "\nGemini is still unavailable."
                    )

            else:

                break

    return ""


# ============================================================
# UPDATE PROFILE
# ============================================================

def update_profile(answer):

    global profile

    prompt = f"""
You are the profile extraction engine for CareerAI.

The user is answering an AI resume interview.

Current profile:

{json.dumps(profile, indent=4)}

User's latest answer:

"{answer}"

Update the profile using ONLY information explicitly stated
by the user.

IMPORTANT RULES:

1. Never invent information.

2. Never guess information.

3. Never create fake skills.

4. Never create fake experience.

5. Never create fake projects.

6. Never create fake achievements.

7. Do NOT collect name, email, or phone number here.
   Those are handled separately by signup/backend.

8. Preserve existing information.

9. Add newly provided information.

10. If the user says something is not applicable,
    do not invent anything for that section.

11. For projects, collect whenever available:
    - title/name
    - description
    - technologies
    - contribution
    - result/outcome
    - link

12. For experience, collect whenever available:
    - company
    - role
    - dates/duration
    - responsibilities
    - achievements/results

13. Return ONLY valid JSON.

Use exactly this structure:

{{
    "target_roles": [],
    "career_goal": "",
    "user_type": "",
    "education": [],
    "skills": [],
    "experience": [],
    "projects": [],
    "certifications": [],
    "achievements": [],
    "leadership": [],
    "languages": [],
    "links": []
}}
"""

    result = call_gemini(prompt)

    if not result:
        return

    try:

        cleaned = result

        if "```json" in cleaned:
            cleaned = cleaned.replace("```json", "")

        if "```" in cleaned:
            cleaned = cleaned.replace("```", "")

        cleaned = cleaned.strip()

        updated_profile = json.loads(cleaned)

        if isinstance(updated_profile, dict):

            profile = updated_profile

            print("\nProfile updated successfully.")

    except json.JSONDecodeError:

        print("\nGemini returned invalid JSON.")
        print("Profile was not changed.")

    except Exception as e:

        print("\nProfile update error:")
        print(e)


# ============================================================
# PROFILE CHECK
# ============================================================

def check_profile():

    missing = []

    # Target role
    if not profile["target_roles"]:
        missing.append("target role")

    # User type
    if not profile["user_type"]:
        missing.append("student or working professional")

    # Education
    if not profile["education"]:
        missing.append("education")

    # Skills
    if len(profile["skills"]) < 3:
        missing.append("at least 3 skills")

    user_type = profile["user_type"].lower()

    # --------------------------------------------------------
    # STUDENT / FRESHER
    # --------------------------------------------------------

    if (
        "student" in user_type
        or "fresher" in user_type
        or "college" in user_type
    ):

        if not profile["projects"]:

            missing.append("at least one project")

        else:

            for project in profile["projects"]:

                if not project.get("name"):
                    missing.append("project title")
                    break

                if not project.get("description"):
                    missing.append("project description")
                    break

                if not project.get("technologies"):
                    missing.append("project technologies")
                    break

    # --------------------------------------------------------
    # WORKING PROFESSIONAL
    # --------------------------------------------------------

    else:

        if not profile["experience"]:

            missing.append("work experience")

        else:

            for experience in profile["experience"]:

                if not experience.get("company"):
                    missing.append("company")
                    break

                if not experience.get("role"):
                    missing.append("job role")
                    break

                if not experience.get("duration"):
                    missing.append("experience duration")
                    break

                if not experience.get("responsibilities"):
                    missing.append("responsibilities")
                    break

    return missing


# ============================================================
# SAVE PROFILE
# ============================================================

def save_profile():

    try:

        with open(
            "resume_profile.json",
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                profile,
                file,
                indent=4,
                ensure_ascii=False
            )

        print("\nProfile saved to resume_profile.json")

    except Exception as e:

        print("\nCould not save profile:")
        print(e)


# ============================================================
# ASK NEXT QUESTION
# ============================================================

def ask_next_question():

    missing = check_profile()

    # --------------------------------------------------------
    # Known missing field
    # --------------------------------------------------------

    if missing:

        missing_text = ", ".join(missing)

        prompt = f"""
You are CareerAI conducting a resume interview.

The candidate's current profile is:

{json.dumps(profile, indent=4)}

Information still missing:

{missing_text}

Ask ONE short natural interview question
that helps collect the most important missing information.

Rules:

- Ask only one question.
- Keep it conversational.
- Do not ask for name, email, or phone.
- Do not ask for information already present.
- If asking about a project, collect useful details.
- If asking about experience, collect useful details.
- Do not explain why you are asking.
- Return ONLY the question.
"""

        question = call_gemini(prompt)

        if question:
            return question

    # --------------------------------------------------------
    # Fallback
    # --------------------------------------------------------

    fallback_questions = [

        "What is your target role?",

        "What is your current education or highest qualification?",

        "What technical skills do you have?",

        "Tell me about one of your projects, including what you built and which technologies you used.",

        "What was your contribution to that project?",

        "What was the result or outcome of that project?"

    ]

    for question in fallback_questions:

        return question

    return "Is there anything else important about your background that you would like to include?"


# ============================================================
# MAIN INTERVIEW
# ============================================================

def main():

    print("\n==========================================")
    print("        CareerAI Resume Interview")
    print("==========================================")

    speak(
        "Hello! Welcome to CareerAI. "
        "I will ask you a few questions to build your resume."
    )

    max_questions = 25

    for question_number in range(1, max_questions + 1):

        print(
            f"\n================ Question "
            f"{question_number}/{max_questions} ================"
        )

        # ----------------------------------------------------
        # Generate next question
        # ----------------------------------------------------

        question = ask_next_question()

        if not question:

            print("\nCould not generate the next question.")
            break

        # ----------------------------------------------------
        # THIS IS THE IMPORTANT PART:
        # speak() BOTH PRINTS AND SPEAKS THE QUESTION
        # ----------------------------------------------------

        speak(question)

        # ----------------------------------------------------
        # Listen to user
        # ----------------------------------------------------

        answer = listen()

        if not answer:

            print("\nNo answer detected.")
            continue

        # ----------------------------------------------------
        # Update profile using Gemini
        # ----------------------------------------------------

        update_profile(answer)

        # ----------------------------------------------------
        # Check completeness
        # ----------------------------------------------------

        missing = check_profile()

        print("\nCurrent profile completeness:")

        if not missing:

            print("✅ Required information collected.")

            save_profile()

            print("\n==========================================")
            print("Interview completed.")
            print("==========================================")

            print("\nFinal profile:")

            print(
                json.dumps(
                    profile,
                    indent=4,
                    ensure_ascii=False
                )
            )

            # ------------------------------------------------
            # AUTOMATIC RESUME GENERATION
            # ------------------------------------------------

            print("\nStarting resume generation...")

            try:

                result = subprocess.run(
                    [
                        "python",
                        "resume_generator.py"
                    ],
                    capture_output=False
                )

                if result.returncode == 0:

                    print(
                        "\n✅ Resume generation completed."
                    )

                else:

                    print(
                        "\n⚠️ Resume generator returned an error."
                    )

            except Exception as e:

                print(
                    "\nCould not start resume_generator.py:"
                )

                print(e)

            break

        else:

            print(
                "Still needed:",
                ", ".join(missing)
            )

    else:

        print(
            "\nMaximum interview questions reached."
        )

        save_profile()

        print(
            "\nThe collected profile has been saved."
        )


# ============================================================
# START PROGRAM
# ============================================================

if __name__ == "__main__":
    main()