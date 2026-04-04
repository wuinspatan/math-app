"use client";

import { useState } from "react";
import { Activity, ArrowRight } from "lucide-react";
import { calculateLimit, type CalculusResult } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// ── Preset examples ───────────────────────────────────────────────────────────
const EXAMPLES = [
  { label: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x}", expr: "sin(x)/x", value: "0", hint: "Fundamental limit" },
  { label: "\\lim_{x \\to \\infty} \\frac{1}{x}",  expr: "1/x",      value: "oo", hint: "Infinite limit" },
  { label: "\\lim_{x \\to 2} x^2+3",               expr: "x**2+3",   value: "2",  hint: "Direct substitution" },
  { label: "\\lim_{x \\to 0} e^x",                  expr: "exp(x)",   value: "0",  hint: "Exponential limit" },
];

// ── Step display (LaTeX) ───────────────────────────────────────────────────────
function Steps({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-6">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex gap-4 items-start animate-slide-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="shrink-0 w-8 h-8 rounded-full bg-accent/20 border border-accent/40
                           text-accent text-xs font-display flex items-center justify-center mt-1 shadow-glow-sm">
            {i + 1}
          </span>
          <div className="flex-1 overflow-x-auto py-1">
             <BlockMath math={step} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Limit() {
  const [expr,       setExpr]       = useState("");
  const [limitVal,   setLimitVal]   = useState("0");
  const [result,     setResult]     = useState<CalculusResult | null>(null);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);

  async function compute(expression: string, val?: string) {
    if (!expression.trim()) { setError("Please enter an expression."); return; }
    setError(""); setLoading(true);
    try {
      const data = await calculateLimit(expression.trim(), (val ?? limitVal).trim());
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Computation failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function pickExample(ex: typeof EXAMPLES[0]) {
    setExpr(ex.expr);
    setLimitVal(ex.value);
    setResult(null);
    setError("");
    compute(ex.expr, ex.value);
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-3xl font-display font-medium text-text mb-2 flex items-center gap-3">
          <Activity size={24} className="text-accent" />
          Limits
        </h2>
        <p className="text-dim text-sm max-w-2xl leading-relaxed">
          Evaluate the limit of $f(x)$ as $x$ approaches a value.
          See the full derivation steps with formal mathematical notation.
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-[2]">
              <label className="text-xs font-display text-dim uppercase tracking-widest mb-2 block">
                Function f(x)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-serif italic text-lg opacity-60">
                  f(x) =
                </span>
                <input
                  type="text"
                  value={expr}
                  onChange={e => { setExpr(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && compute(expr)}
                  placeholder="e.g.  sin(x)/x, 1/x"
                  className="
                    w-full bg-bg border border-border rounded-xl
                    pl-16 pr-4 py-4 font-mono text-lg text-text
                    focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                    placeholder:text-muted/50 transition-all shadow-inner-sm
                  "
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-display text-dim uppercase tracking-widest block">
                  Value (x → c)
                </label>
                <div className="flex gap-2 items-center">
                  {[
                    { label: "\\infty", value: "∞" },
                    { label: "-\\infty", value: "-∞" },
                    { label: "0", value: "0" }
                  ].map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => { setLimitVal(s.value); setError(""); }}
                      className="
                        px-2 py-0.5 text-xs rounded border border-border/60 
                        bg-surface/20 text-dim hover:border-accent/60 hover:text-accent 
                        hover:bg-accent/5 transition-all duration-200
                      "
                    >
                      <InlineMath math={s.label} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent opacity-60">
                  <ArrowRight size={18} />
                </span>
                <input
                  type="text"
                  value={limitVal}
                  onChange={e => { setLimitVal(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && compute(expr)}
                  placeholder="e.g. 0, ∞, 1"
                  className="
                    w-full bg-bg border border-border rounded-xl
                    pl-12 pr-4 py-4 font-mono text-lg text-text
                    focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                    placeholder:text-muted/50 transition-all shadow-inner-sm
                  "
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted italic">
              Use <code className="text-accent/60">∞</code> or <code className="text-accent/60">oo</code> for infinity. Supports <InlineMath math="\lim_{x \to c} f(x)" />.
            </div>
            <Button 
              onClick={() => compute(expr)} 
              loading={loading} 
              size="lg"
              className="shadow-glow hover:shadow-accent/40 min-w-[140px]"
            >
              Evaluate Limit
            </Button>
          </div>
        </div>

        {error && <div className="mt-4"><ErrorMessage message={error} /></div>}
      </Card>

      {/* Examples Palette */}
      <div>
        <p className="text-xs font-display text-dim uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-border"></span>
          Try an example
          <span className="w-4 h-px bg-border"></span>
        </p>
        <div className="flex flex-wrap gap-3">
          {EXAMPLES.map(ex => (
            <button
              key={ex.expr + ex.value}
              onClick={() => pickExample(ex)}
              title={ex.hint}
              className="
                px-4 py-2 text-sm font-serif rounded-full border border-border
                bg-surface/40 backdrop-blur-sm text-dim hover:border-accent 
                hover:text-accent-glow hover:bg-surface/80
                transition-all duration-200 hover:-translate-y-0.5
              "
            >
              <InlineMath math={ex.label} />
            </button>
          ))}
        </div>
      </div>

      {/* Results & Derivations */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Main Answer Display */}
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 relative overflow-hidden group shadow-glow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Activity size={120} />
            </div>
            <p className="text-xs font-display text-accent uppercase tracking-[0.2em] mb-4">Final Result</p>
            <div className="flex flex-col gap-4">
              <div className="text-xl text-dim flex items-center gap-2 font-serif opacity-80">
                <InlineMath math={`\\lim_{{x \\to ${result.target_value ?? 'c'}}} ${result.input_latex}`} />
                <span>=</span>
              </div>
              <div className="text-4xl sm:text-5xl font-serif text-white tracking-tight break-words">
                <BlockMath math={result.result_latex} />
              </div>
            </div>
          </div>

          {/* Derivation Steps */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-display text-dim uppercase tracking-[0.2em]">Step-by-step Process</h3>
              <div className="h-px flex-1 bg-border/40 mx-4"></div>
            </div>
            <Steps steps={result.steps} />
          </Card>
        </div>
      )}

      {/* Educational Intro */}
      {!result && !loading && (
        <Card className="p-8 border-dashed border-border/60 bg-transparent">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-accent">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-display font-medium text-text">Limit Calculus Engine</h3>
            <p className="text-dim text-sm leading-relaxed">
              Evaluate limits at any point, including infinity. Supports indeterminate forms and complex algebraic simplifications.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
