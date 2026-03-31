"""
core/calculus.py
Compute derivatives symbolically using SymPy with detailed LaTeX derivations.
"""

import sympy as sp

# Canonical symbol for Calculus-1 (x)
x = sp.Symbol("x")

def _build_steps(expr_str: str, expr: sp.Expr, result: sp.Expr) -> list[str]:
    """Produce a formal mathematical derivation with LaTeX formatting."""
    steps: list[str] = []

    # Initial statement
    steps.append(
        rf"\text{{Goal: Find the derivative of }} f(x) = {sp.latex(expr)} \text{{ with respect to }} x."
    )

    # Specific handling for a^x (as requested in the user's image)
    if expr.is_Pow and not expr.base.has(x) and expr.exp == x:
        a = expr.base
        steps.append(
            rf"\text{{Using the identity: }} {sp.latex(expr)} = e^{{x \ln({sp.latex(a)})}}"
        )
        steps.append(
            rf"\frac{{d}}{{dx}}({sp.latex(expr)}) = \frac{{d}}{{dx}}(e^{{x \ln({sp.latex(a)})}})"
        )
        steps.append(
            rf"= \ln({sp.latex(a)}) \cdot e^{{x \ln({sp.latex(a)})}}"
        )
        steps.append(
            rf"= {sp.latex(result)}"
        )
        return steps

    # General Step-by-Step Logic
    if expr.is_Add:
        steps.append(
            r"\text{Applying the Sum Rule: } \frac{d}{dx}[u + v] = \frac{du}{dx} + \frac{dv}{dx}"
        )
        derivatives = [sp.diff(arg, x) for arg in expr.args]
        derivation = " + ".join([sp.latex(d) for d in derivatives])
        steps.append(rf"\frac{{d}}{{dx}}({sp.latex(expr)}) = {derivation}")
    
    elif expr.is_Mul:
        consts, funcs = expr.as_coeff_Mul()
        if consts != 1:
            steps.append(
                rf"\text{{Constant Multiple Rule: }} \frac{{d}}{{dx}}[{sp.latex(consts)} \cdot u] = {sp.latex(consts)} \cdot \frac{{du}}{{dx}}"
            )
            steps.append(
                rf"\frac{{d}}{{dx}}({sp.latex(expr)}) = {sp.latex(consts)} \cdot \frac{{d}}{{dx}}({sp.latex(funcs)})"
            )
        else:
            # Simple Product Rule hint
            steps.append(
                r"\text{Applying the Product Rule: } (uv)' = u'v + uv'"
            )
    
    elif expr.is_Pow:
        base, exp = expr.as_base_exp()
        if base == x and exp.is_number:
            steps.append(
                rf"\text{{Applying the Power Rule: }} \frac{{d}}{{dx}}[x^n] = n \cdot x^{{n-1}}"
            )
            steps.append(
                rf"\frac{{d}}{{dx}}({sp.latex(expr)}) = {sp.latex(exp)} \cdot x^{{{sp.latex(exp-1)}}}"
            )
        elif base.has(x) and exp.is_number:
            steps.append(
                r"\text{Applying the Chain Rule: } \frac{d}{dx}[u^n] = n \cdot u^{n-1} \cdot \frac{du}{dx}"
            )
            inner_diff = sp.diff(base, x)
            steps.append(
                rf"\frac{{d}}{{dx}}({sp.latex(expr)}) = {sp.latex(exp)} \cdot ({sp.latex(base)})^{{{sp.latex(exp-1)}}} \cdot \frac{{d}}{{dx}}({sp.latex(base)})"
            )
            steps.append(
                rf"= {sp.latex(exp)} \cdot ({sp.latex(base)})^{{{sp.latex(exp-1)}}} \cdot ({sp.latex(inner_diff)})"
            )

    elif expr.has(sp.sin, sp.cos, sp.tan):
        steps.append(r"\text{Using trigonometric differentiation identities...}")

    # Final result banner (always included)
    steps.append(
        rf"\therefore \frac{{d}}{{dx}}({sp.latex(expr)}) = {sp.latex(result)}"
    )
    
    return steps

def compute_diff(expr_str: str) -> dict:
    """
    Parse expression, compute its derivative, and return result + LaTeX steps.
    """
    try:
        # Parse expression with support for common functions
        # Support 'a' as a symbolic constant if not 'x'
        local_ns = {
            "x": x,
            "sin": sp.sin, "cos": sp.cos, "tan": sp.tan,
            "exp": sp.exp, "log": sp.log, "ln": sp.ln,
            "sqrt": sp.sqrt, "pi": sp.pi, "E": sp.E,
        }
        # Allow any single character as a symbol (for a**x etc)
        expr = sp.sympify(expr_str, locals=local_ns)
    except Exception:
        raise ValueError(
            f"Could not parse expression: '{expr_str}'. "
            "Use Python-style math, e.g.  x**2 + 3*x + 5,  sin(x),  a**x"
        )

    try:
        # Compute derivative with respect to x
        result = sp.diff(expr, x)
    except Exception as exc:
        raise ValueError(f"SymPy could not compute the derivative: {exc}")

    return {
        "input":        expr_str,
        "input_latex":  sp.latex(expr),
        "result":       str(result),
        "result_latex": sp.latex(result),
        "steps":        _build_steps(expr_str, expr, result),
    }
