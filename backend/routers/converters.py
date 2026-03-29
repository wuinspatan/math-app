"""
routers/converters.py
REST endpoint: POST /convert
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

from core.converters import decimal_to_all, from_base_to_decimal, BASE_MAP

router = APIRouter()


class ConvertRequest(BaseModel):
    value: str        # The number as a string
    from_base: str    # "decimal" | "binary" | "octal" | "hex"

    @field_validator("from_base")
    @classmethod
    def check_base(cls, v: str) -> str:
        if v not in BASE_MAP:
            raise ValueError(f"from_base must be one of: {list(BASE_MAP.keys())}")
        return v


@router.post("")
def convert(req: ConvertRequest):
    """
    Convert a number from any base to all four representations.
    Example body: {"value": "FF", "from_base": "hex"}
    """
    try:
        decimal_int = from_base_to_decimal(req.value.strip(), BASE_MAP[req.from_base])
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail=f"'{req.value}' is not a valid {req.from_base} number.",
        )

    return decimal_to_all(decimal_int)
