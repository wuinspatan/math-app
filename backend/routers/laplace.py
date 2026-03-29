"""
routers/laplace.py
REST endpoint: POST /laplace
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.laplace import compute

router = APIRouter()


class LaplaceRequest(BaseModel):
    expression: str   # e.g. "t**2", "exp(-3*t)", "sin(2*t)"


@router.post("")
def laplace_transform(req: LaplaceRequest):
    """
    Compute the Laplace transform of a function of t.
    Returns the result and step-by-step explanation.
    """
    try:
        return compute(req.expression.strip())
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
