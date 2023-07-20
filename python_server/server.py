# main.py
from fastapi import FastAPI
import random
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:8080",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Random list of job names
job_names = ["Job A", "Job B", "Job C", "Job D", "Job E", "Job F"]

@app.get("/jobs")
def get_jobs():
    return {"jobs": random.sample(job_names, random.randint(0, 6))}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
