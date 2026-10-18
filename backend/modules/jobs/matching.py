def match_jobs(resume: dict, jobs: list[dict]) -> list[dict]:
    """
    Aarya's matching function goes here.
    Input:
        resume: dict — the candidate's resume content (skills, experience, etc.)
        jobs: list of dicts, each like {"id": int, "title": str, "description": str}
    Output:
        list of dicts: [{"job_id": int, "match_score": float, "reason": str}, ...]
    """
    # STUB — replace with her real logic
    return [
        {"job_id": job["id"], "match_score": 75.0, "reason": "stub match"}
        for job in jobs
    ]