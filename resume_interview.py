import os
import json
import pyttsx3
import speech_recognition as sr
import sounddevice as sd
import numpy as np
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Gemini API key not found.")
    exit()

client = genai.Client(api_key=api_key)

recognizer = sr.Recognizer()
sample_rate = 16000


# -------------------------
# RESUME PROFILE
# -------------------------

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


# -------------------------
# TTS
# -------------------------

def speak(text):

    print("\n🤖 CareerAI:", text)

    # Remove emojis before TTS
    clean_text = text.encode("ascii", "ignore").decode()

    engine = pyttsx3.init()
    engine.setProperty("rate", 170)
    engine.setProperty("volume", 1.0)

    print("🔊 AI is speaking...")

    engine.say(clean_text)
    engine.runAndWait()
    engine.stop()

    print("✅ AI finished speaking.")


# -------------------------
# STT
# -------------------------

def listen():

    print("\n🎙️ Press ENTER to start speaking...")
    input()

    print("🔴 Recording... Speak now.")
    print("Press ENTER when finished.")

    recorded_audio = []

    def callback(indata, frames, time, status):
        recorded_audio.append(indata.copy())

    with sd.InputStream(
        samplerate=sample_rate,
        channels=1,
        dtype="int16",
        callback=callback
    ):
        input()

    print("⏹️ Recording stopped.")
    print("📝 Converting speech to text...")

    audio_data = np.concatenate(recorded_audio, axis=0)

    audio = sr.AudioData(
        audio_data.tobytes(),
        sample_rate,
        2
    )

    try:

        text = recognizer.recognize_google(audio)

        print("👤 You:", text)

        return text

    except sr.UnknownValueError:

        print("❌ Couldn't understand.")
        return ""

    except sr.RequestError as e:

        print("❌ STT service unavailable:", e)
        return ""


# -------------------------
# UPDATE PROFILE
# -------------------------

def update_profile(answer):

    global profile

    prompt = f"""
You are CareerAI's resume information extractor.

Current resume profile:

{json.dumps(profile, indent=2)}

The user just said:

"{answer}"

Update the profile using ONLY information explicitly provided by the user.

IMPORTANT RULES:

1. Never invent information.
2. Never guess missing information.
3. Keep existing information unless the user corrects it.
4. Do not add name, email, or phone number.
5. Do not create fake projects, experience, skills, achievements, dates,
   numbers or technologies.
6. If the user says they have no internship or work experience,
   keep experience as an empty list.
7. If the user is a student, mark user_type as "student".
8. If the user is a fresher/recent graduate, mark user_type as "fresher".
9. If the user has professional work experience, mark user_type as
   "experienced".
10. If the user mentions multiple possible target roles, store all
    reasonable roles in target_roles.
11. Extract information from natural speech even if the grammar is imperfect.

Return ONLY valid JSON.

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

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        text = response.text.strip()

        # Remove possible markdown JSON formatting
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        new_profile = json.loads(text)

        profile = new_profile

        print("\n📋 PROFILE UPDATED")

    except Exception as e:

        print("\n❌ Profile update error:", e)


# -------------------------
# COMPLETENESS CHECK
# -------------------------

def check_profile():

    missing = []

    # Target role
    if not profile["target_roles"]:
        missing.append("target role")

    # User type
    if not profile["user_type"]:
        missing.append("student/fresher/experienced status")

    # Education
    if not profile["education"]:
        missing.append("education")

    # Skills
    if len(profile["skills"]) < 3:
        missing.append("at least 3 relevant skills")

    # Student / Fresher
    if profile["user_type"].lower() in [
        "student",
        "fresher"
    ]:

        if not profile["projects"]:
            missing.append("at least 1 project")

    # Experienced professional
    elif profile["user_type"].lower() == "experienced":

        if not profile["experience"]:
            missing.append("work experience")

    return missing


# -------------------------
# ASK NEXT QUESTION
# -------------------------

def ask_next_question():

    missing = check_profile()

    question_prompt = f"""
You are CareerAI conducting a professional resume interview.

Current resume profile:

{json.dumps(profile, indent=2)}

Information still required:

{missing}

Ask ONE short question that collects the most important missing
information.

Rules:
- Ask only ONE question.
- Do not ask for name, email or phone number.
- Do not ask for information already present.
- If the user is a student/fresher without experience, focus on
  projects, education, skills, internships, certifications and
  achievements instead of repeatedly asking for work experience.
- Do not use emojis.
- Be professional and conversational.
- Do not generate the resume yet.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=question_prompt
        )

        return response.text.strip()

    except Exception as e:

        print("\n❌ Question generation error:", e)

        return "Could you tell me more about your education, skills, projects, or experience?"


# -------------------------
# START INTERVIEW
# -------------------------

print("\n🚀 CareerAI Resume Interview")
print("--------------------------------")

speak(
    "Hi! I'm CareerAI. "
    "I'll ask you some questions to collect the information needed "
    "for your resume. "
    "Let's start. Are you currently a student, a fresher, or an experienced professional?"
)


# -------------------------
# INTERVIEW LOOP
# -------------------------

while True:

    answer = listen()

    if not answer:
        continue

    if answer.lower().strip() in [
        "stop",
        "exit",
        "quit"
    ]:

        speak("Okay, we'll stop here. Goodbye!")
        break


    # Update profile

    print("\n🧠 Updating your resume profile...")

    update_profile(answer)


    # Check completeness

    missing = check_profile()


    # -------------------------
    # COMPLETE
    # -------------------------

    if not missing:

        print("\n" + "=" * 50)
        print("🟢 RESUME INFORMATION IS SUFFICIENT")
        print("=" * 50)

        print(
            json.dumps(
                profile,
                indent=4
            )
        )

        speak(
            "Great! I have collected enough career information "
            "to move to the next stage."
        )

        break


    # -------------------------
    # STILL MISSING
    # -------------------------

    print("\n🟡 Still required:")

    for item in missing:
        print("-", item)


    next_question = ask_next_question()

    speak(next_question)

