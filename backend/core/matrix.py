"""
core/matrix.py
Matrix arithmetic – uses plain Python lists (no numpy dependency).
"""

Matrix = list[list[float]]


def _validate_same_size(a: Matrix, b: Matrix) -> None:
    if len(a) != len(b) or any(len(a[i]) != len(b[i]) for i in range(len(a))):
        raise ValueError("Matrices must have the same dimensions for this operation.")


def _validate_multiply(a: Matrix, b: Matrix) -> None:
    cols_a = len(a[0]) if a else 0
    rows_b = len(b)
    if cols_a != rows_b:
        raise ValueError(
            f"Cannot multiply: columns of A ({cols_a}) ≠ rows of B ({rows_b})."
        )


def add(a: Matrix, b: Matrix) -> Matrix:
    _validate_same_size(a, b)
    return [
        [a[i][j] + b[i][j] for j in range(len(a[i]))]
        for i in range(len(a))
    ]


def subtract(a: Matrix, b: Matrix) -> Matrix:
    _validate_same_size(a, b)
    return [
        [a[i][j] - b[i][j] for j in range(len(a[i]))]
        for i in range(len(a))
    ]


def multiply(a: Matrix, b: Matrix) -> Matrix:
    _validate_multiply(a, b)
    rows_a = len(a)
    cols_b = len(b[0])
    cols_a = len(a[0])
    return [
        [
            sum(a[i][k] * b[k][j] for k in range(cols_a))
            for j in range(cols_b)
        ]
        for i in range(rows_a)
    ]
