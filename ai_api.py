from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import tempfile
import os
import speech_recognition as sr

import resume_interview


app = FastAPI(title="CareerAI AI API")


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Request model
# ---------------------------------------------------------

class AnswerRequest(BaseModel):
    answer: str


# ---------------------------------------------------------
# Home
# ---------------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "CareerAI AI API is running"
    }


# ---------------------------------------------------------
# Start interview
# ---------------------------------------------------------

@app.post("/interview/start")
def start_interview():

    question = resume_interview.ask_next_question()

    return {
        "success": True,
        "question": question
    }


# ---------------------------------------------------------
# Process interview answer
# ---------------------------------------------------------

@app.post("/interview/answer")
def process_answer(request: AnswerRequest):

    answer = request.answer.strip()

    if not answer:

        return {
            "success": False,
            "message": "Answer cannot be empty."
        }


    print("\n==========================================")
    print("Answer received from frontend:")
    print(answer)
    print("==========================================")


    # -----------------------------------------------------
    # Send answer to the ORIGINAL AI profile logic
    # -----------------------------------------------------

    resume_interview.update_profile(answer)


    # -----------------------------------------------------
    # Safety fallback for target role
    #
    # This does NOT replace the existing AI logic.
    # It only prevents the API integration from losing
    # a clearly stated target role.
    # -----------------------------------------------------

    profile = resume_interview.profile

    if not profile.get("target_roles"):

        answer_lower = answer.lower()

        possible_roles = [
            "ai engineer",
            "artificial intelligence engineer",
            "machine learning engineer",
            "ml engineer",
            "software engineer",
            "software developer",
            "python developer",
            "web developer",
            "data scientist",
            "data analyst",
            "backend developer",
            "frontend developer",
            "full stack developer",
            "full-stack developer",
            "devops engineer",
            "cloud engineer",
            "cybersecurity engineer",
            "cyber security engineer"
        ]


        found_roles = []

        for role in possible_roles:

            if role in answer_lower:

                found_roles.append(role)


        if found_roles:

            profile["target_roles"] = found_roles

            print(
                "\nTarget role captured by API:",
                found_roles
            )


    # -----------------------------------------------------
    # Check missing information
    # -----------------------------------------------------

    missing = resume_interview.check_profile()


    print("\nInformation still missing:")

    if missing:

        print(", ".join(missing))

    else:

        print("Nothing missing.")


    # -----------------------------------------------------
    # Interview completed
    # -----------------------------------------------------

    if not missing:

        resume_interview.save_profile()

        return {

            "success": True,

            "completed": True,

            "missing": [],

            "message":
                "Interview completed. Resume profile saved."
        }


    # -----------------------------------------------------
    # Generate next question
    # -----------------------------------------------------

    next_question = resume_interview.ask_next_question()


    return {

        "success": True,

        "completed": False,

        "missing": missing,

        "next_question": next_question
    }


# ---------------------------------------------------------
# Speech transcription
#
# Browser sends recorded WAV audio here.
# Python SpeechRecognition converts it to text.
# ---------------------------------------------------------

@app.post("/speech/transcribe")
async def transcribe_speech(request: Request):

    audio_bytes = await request.body()


    if not audio_bytes:

        return {

            "success": False,

            "message":
                "No audio received."
        }


    temp_file = None


    try:

        # Create temporary WAV file

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav"
        ) as f:

            f.write(audio_bytes)

            temp_file = f.name


        recognizer = sr.Recognizer()


        # Read WAV file

        with sr.AudioFile(temp_file) as source:

            audio = recognizer.record(source)


        # Convert speech to text

        text = recognizer.recognize_google(audio)


        print("\nSpeech recognized:")
        print(text)


        return {

            "success": True,

            "text": text
        }


    except sr.UnknownValueError:

        return {

            "success": False,

            "message":
                "I could not understand the audio. Please try again."
        }


    except sr.RequestError as e:

        return {

            "success": False,

            "message":
                f"Speech recognition service error: {e}"
        }


    except Exception as e:

        return {

            "success": False,

            "message": str(e)
        }


    finally:

        # Delete temporary audio file

        if temp_file and os.path.exists(temp_file):

            try:

                os.remove(temp_file)

            except Exception:

                pass