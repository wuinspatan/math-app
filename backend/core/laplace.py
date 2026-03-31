"""
core/laplace.py
Compute Laplace transforms symbolically using SymPy.
Returns both the result and a step-by-step LaTeX explanation list.
"""

import sympy as sp

# Canonical symbols used throughout
t = sp.Symbol("t", positive=True)
s = sp.Symbol("s")


# ── Known transform table for step-by-step hints ──────────────────────────────
KNOWN_FORMS: list[tuple[str, str, str]] = [
    # (pattern name, mathexpr, transform)
    ("constant",    "c",         "c/s"),
    ("power",       "t^n",       "n!/s^{n+1}"),
    ("exponential", "e^{at}",    "1/(s-a)"),
    ("sine",        "sin(at)",   "a/(s^2+a^2)"),
    ("cosine",      "cos(at)",   "s/(s^2+a^2)"),
    ("step",        "u(t)",      "1/s"),
    ("delta",       "δ(t)",      "1"),
]


def _build_steps(expr_str: str, expr: sp.Expr, result: sp.Expr) -> list[str]:
    """Produce a formal mathematical explanation list using LaTeX."""
    steps: list[str] = []

    steps.append(
        rf"\text{{Goal: Find the Laplace transform of }} f(t) = {sp.latex(expr)}"
    )
    steps.append(
        r"\text{The Laplace transform is defined as: } \mathcal{L}\{f(t)\} = \int_0^\infty f(t) \cdot e^{-st} dt"
    )

    # Detect common patterns and give contextual hints
    if expr.is_number:
        steps.append(
            rf"\text{{f(t) = {sp.latex(expr)} is a constant.}} \text{{ Using the rule }} \mathcal{{L}}\{{c\}} = \frac{{c}}{{s}}"
        )
    elif expr.is_Pow and expr.args[0] == t:
        n = expr.args[1]
        steps.append(
            rf"\text{{f(t) = t^{{{sp.latex(n)}}} is a power of t.}} \text{{ Using the rule }} \mathcal{{L}}\{{t^n\}} = \frac{{n!}}{{s^{{n+1}}}}"
        )
    elif expr.has(sp.exp):
        steps.append(
            r"\text{The function contains an exponential } e^{at}. \text{ Using the first shifting theorem: } \mathcal{L}\{e^{at}f(t)\} = F(s-a)"
        )
    elif expr.has(sp.sin):
        steps.append(
            r"\text{The function contains sin(at).} \text{ Using the rule: } \mathcal{L}\{\sin(at)\} = \frac{a}{s^2+a^2}"
        )
    elif expr.has(sp.cos):
        steps.append(
            r"\text{The function contains cos(at).} \text{ Using the rule: } \mathcal{L}\{\cos(at)\} = \frac{s}{s^2+a^2}"
        )
    else:
        steps.append(
            r"\text{Applying the integral definition and standard transform table...}"
        )

    steps.append(
        rf"\therefore \mathcal{{L}}\{{f(t)\}} = {sp.latex(result)}"
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
        "input":       expr_str,
        "input_latex": sp.latex(expr),
        "result":      str(result),
        "result_latex": sp.latex(result),
        "steps":       _build_steps(expr_str, expr, result),
        "transform_table": KNOWN_FORMS,
    }
