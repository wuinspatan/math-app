"""
core/converters.py
Pure conversion logic – no FastAPI here, just functions.
"""


def decimal_to_all(n: int) -> dict:
    """Convert a decimal integer to binary, octal, and hex."""
    return {
        "decimal": str(n),
        "binary":  bin(n)[2:],   # strip '0b'
        "octal":   oct(n)[2:],   # strip '0o'
        "hex":     hex(n)[2:].upper(),  # strip '0x', uppercase
    }


def from_base_to_decimal(value: str, base: int) -> int:
    """Parse a string in the given base and return a decimal int."""
    return int(value, base)


# Map base names → Python int() base argument
BASE_MAP = {
    "decimal": 10,
    "binary":  2,
    "octal":   8,
    "hex":     16,
}
