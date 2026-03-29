"""
routers/matrix.py
REST endpoints:
  POST /matrix/add
  POST /matrix/subtract
  POST /matrix/multiply
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from core.matrix import add, subtract, multiply, Matrix

router = APIRouter()


class MatrixRequest(BaseModel):
    a: Matrix   # List of rows, each row is a list of floats
    b: Matrix


def _handle(op, req: MatrixRequest):
    try:
        result = op(req.a, req.b)
        return {"result": result}
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@router.post("/add")
def matrix_add(req: MatrixRequest):
    """Add two matrices of the same size."""
    return _handle(add, req)


@router.post("/subtract")
def matrix_subtract(req: MatrixRequest):
    """Subtract matrix B from matrix A (same size)."""
    return _handle(subtract, req)


@router.post("/multiply")
def matrix_multiply(req: MatrixRequest):
    """Multiply matrix A × B (A cols must equal B rows)."""
    return _handle(multiply, req)
