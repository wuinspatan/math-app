"""
core/laplace.py
Compute Laplace transforms symbolically using SymPy.
Returns both the result and a step-by-step explanation list.
"""

import sympy as sp

# Canonical symbols used throughout
t = sp.Symbol("t", positive=True)
s = sp.Symbol("s")


# ── Known transform table for step-by-step hints ──────────────────────────────
KNOWN_FORMS: list[tuple[str, str, str]] = [
    # (pattern name, mathexpr, transform)
    ("constant",    "c",         "c/s"),
    ("power",       "t^n",       "n!/s^(n+1)"),
    ("exponential", "e^(at)",    "1/(s-a)"),
    ("sine",        "sin(at)",   "a/(s²+a²)"),
    ("cosine",      "cos(at)",   "s/(s²+a²)"),
    ("step",        "u(t)",      "1/s"),
    ("delta",       "δ(t)",      "1"),
]


def _build_steps(expr_str: str, expr: sp.Expr, result: sp.Expr) -> list[str]:
    """Produce a beginner-friendly explanation list."""
    steps: list[str] = []

    steps.append(
        f"Step 1: We want to find the Laplace transform of f(t) = {expr_str}"
    )
    steps.append(
        "Step 2: The Laplace transform is defined as: L{f(t)} = ∫₀^∞ f(t)·e^(−st) dt"
    )

    # Detect common patterns and give contextual hints
    if expr.is_number:
        steps.append(
            f"Step 3: f(t) = {expr_str} is a constant. "
            "Using the rule L{c} = c/s"
        )
    elif expr.is_Pow and expr.args[0] == t:
        n = expr.args[1]
        steps.append(
            f"Step 3: f(t) = t^{n} is a power of t. "
            f"Using the rule L{{t^n}} = n!/s^(n+1) -> L{{t^{n}}} = {n}!/s^({n}+1)"
        )
    elif expr.has(sp.exp):
        steps.append(
            "Step 3: The function contains an exponential e^(at). "
            "Using the first shifting theorem: L{e^(at)·f(t)} = F(s-a)"
        )
    elif expr.has(sp.sin):
        steps.append(
            "Step 3: The function contains sin(at). "
            "Using the rule: L{sin(at)} = a/(s²+a²)"
        )
    elif expr.has(sp.cos):
        steps.append(
            "Step 3: The function contains cos(at). "
            "Using the rule: L{cos(at)} = s/(s²+a²)"
        )
    else:
        steps.append(
            "Step 3: Applying the integral definition and standard transform table..."
        )

    steps.append("Step 4: SymPy computes the integral symbolically...")
    steps.append(
        f"Step 5: Result: L{{f(t)}} = {sp.latex(result)}"
    )
    steps.append(
        "Step 6: Tip: The variable 's' in the result is the complex frequency domain variable."
    )

    return steps


def compute(expr_str: str) -> dict:
    """
    Parse expr_str (in terms of 't'), compute its Laplace transform,
    and return result + explanation steps.
    """
    try:
        # Parse – allow common math functions
        local_ns = {
            "t": t, "s": s,
            "sin": sp.sin, "cos": sp.cos, "exp": sp.exp,
            "sqrt": sp.sqrt, "pi": sp.pi, "E": sp.E,
        }
        expr = sp.sympify(expr_str, locals=local_ns)
    except Exception:
        raise ValueError(
            f"Could not parse expression: '{expr_str}'. "
            "Use Python-style math, e.g.  t**2,  exp(-3*t),  sin(2*t)"
        )

    try:
        result = sp.laplace_transform(expr, t, s, noconds=True)
    except Exception as exc:
        raise ValueError(f"SymPy could not compute the transform: {exc}")

    return {
        "input":      expr_str,
        "result":     str(result),
        "result_latex": sp.latex(result),
        "steps":      _build_steps(expr_str, expr, result),
        "transform_table": KNOWN_FORMS,
    }
