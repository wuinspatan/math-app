"""
MathApp – FastAPI Backend
Entry point: configures CORS and registers all routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import converters, matrix, laplace, calculus

load_dotenv()

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="MathApp API",
    description="Number Converter, Matrix Calculator, and Laplace Transform engine",
    version="1.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
# In development, allow everything.
# In production, set ALLOWED_ORIGINS in your environment variables.
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = (
    [o.strip() for o in allowed_origins_raw.split(",")]
    if allowed_origins_raw != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(converters.router, prefix="/convert", tags=["Converter"])
app.include_router(matrix.router, prefix="/matrix", tags=["Matrix"])
app.include_router(laplace.router, prefix="/laplace", tags=["Laplace"])
app.include_router(calculus.router, prefix="/calculus", tags=["Calculus"])


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "MathApp API is running"}
