"""
routers/calculus.py
REST endpoint: POST /calculus/diff
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.calculus import compute_diff, compute_limit

router = APIRouter()


class DiffRequest(BaseModel):
    expression: str   # e.g. "x**2 + 3*x + 5"


class LimitRequest(BaseModel):
    expression: str
    value:      str   # e.g. "0", "oo", "1"


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


@router.post("/limit")
def calculate_limit(req: LimitRequest):
    """
    Compute the limit of f(x) as x approaches some value.
    """
    try:
        return compute_limit(req.expression.strip(), req.value.strip())
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
