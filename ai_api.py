from fastapi import FastAPI
from pydantic import BaseModel

import resume_interview

app = FastAPI(title="CareerAI AI API")


class AnswerRequest(BaseModel):
    answer: str


@app.get("/")
def home():
    return {"message": "CareerAI AI API is running"}


@app.post("/interview/start")
def start_interview():

    question = resume_interview.ask_next_question()

    return {
        "success": True,
        "question": question
    }


@app.post("/interview/answer")
def process_answer(request: AnswerRequest):

    answer = request.answer.strip()

    if not answer:
        return {
            "success": False,
            "message": "Answer cannot be empty."
        }

    resume_interview.update_profile(answer)

    missing = resume_interview.check_profile()

    if not missing:
        resume_interview.save_profile()

        return {
            "success": True,
            "completed": True,
            "missing": [],
            "message": "Interview completed. Resume profile saved."
        }

    next_question = resume_interview.ask_next_question()

    return {
        "success": True,
        "completed": False,
        "missing": missing,
        "next_question": next_question
    }