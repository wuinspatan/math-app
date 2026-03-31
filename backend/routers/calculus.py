"""
routers/calculus.py
REST endpoint: POST /calculus/diff
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.calculus import compute_diff

router = APIRouter()


class DiffRequest(BaseModel):
    expression: str   # e.g. "x**2 + 3*x + 5"


@router.post("/diff")
def differentiate(req: DiffRequest):
    """
    Compute the derivative of a function of x.
    Returns the result and step-by-step explanation.
    """
    try:
        return compute_diff(req.expression.strip())
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
