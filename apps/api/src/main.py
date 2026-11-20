from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

app = FastAPI(
    title="VeriTraceAI API",
    version="1.0.0",
    description="Evidence-Grounded KYB/UBO Compliance Copilot State Machine & API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str

@app.get("/healthz", response_model=HealthResponse)
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
