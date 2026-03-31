"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Activity } from "lucide-react";
import { differentiate, type CalculusResult } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// ── Preset examples ───────────────────────────────────────────────────────────
const EXAMPLES = [
  { label: "aˣ",         expr: "a**x",         hint: "Exponential (base a)" },
  { label: "x² + 5x",    expr: "x**2 + 5*x",   hint: "Polynomial" },
  { label: "sin(x)",     expr: "sin(x)",       hint: "Trigonometric" },
  { label: "cos(x²)",    expr: "cos(x**2)",    hint: "Chain rule" },
  { label: "e^(2x)",     expr: "exp(2*x)",     hint: "Exponential" },
  { label: "ln(x)",      expr: "log(x)",       hint: "Natural log" },
  { label: "x·sin(x)",   expr: "x*sin(x)",     hint: "Product rule" },
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
export default function Calculus() {
  const [expr,    setExpr]    = useState("");
  const [result,  setResult]  = useState<CalculusResult | null>(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function compute(expression: string) {
    if (!expression.trim()) { setError("Please enter an expression."); return; }
    setError(""); setLoading(true);
    try {
      const data = await differentiate(expression.trim());
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
    setResult(null);
    setError("");
    compute(ex.expr);
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-3xl font-display font-medium text-text mb-2 flex items-center gap-3">
          <Activity size={24} className="text-accent" />
          Calculus 1 – Differentiation
        </h2>
        <p className="text-dim text-sm max-w-2xl leading-relaxed">
          Find the derivative <InlineMath math="\frac{dy}{dx}" /> of any function. 
          See the full derivation steps with formal mathematical notation.
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6">
        <label className="text-xs font-display text-dim uppercase tracking-widest mb-3 block">
          Function to differentiate f(x):
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-serif italic text-lg opacity-60">
              f(x) =
            </span>
            <input
              type="text"
              value={expr}
              onChange={e => { setExpr(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && compute(expr)}
              placeholder="e.g.  a**x,  x**2 + sin(x)"
              className="
                w-full bg-bg border border-border rounded-xl
                pl-16 pr-4 py-4 font-mono text-lg text-text
                focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
                placeholder:text-muted/50 transition-all
                shadow-inner-sm
              "
            />
          </div>
          <Button 
            onClick={() => compute(expr)} 
            loading={loading} 
            size="lg"
            className="shadow-glow hover:shadow-accent/40"
          >
            Compute dy/dx
          </Button>
        </div>

        <p className="text-xs text-muted mt-3 italic">
          Use <code className="text-accent/60">**</code> for power, <code className="text-accent/60">*</code> for mult. 
          Supports <InlineMath math="a^x" />, <InlineMath math="\sin(x)" />, <InlineMath math="\ln(x)" />, etc.
        </p>

        {error && <div className="mt-4"><ErrorMessage message={error} /></div>}
      </Card>

      {/* Examples Palette */}
      <div>
        <p className="text-xs font-display text-dim uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-border"></span>
          Try a classic example
          <span className="w-4 h-px bg-border"></span>
        </p>
        <div className="flex flex-wrap gap-3">
          {EXAMPLES.map(ex => (
            <button
              key={ex.expr}
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
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Activity size={120} />
            </div>
            <p className="text-xs font-display text-accent uppercase tracking-[0.2em] mb-4">Final Result</p>
            <div className="flex flex-col gap-4">
              <div className="text-xl text-dim flex items-center gap-2 font-serif opacity-80">
                <InlineMath math={`\\frac{d}{dx}[${result.input_latex}]`} />
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
              <h3 className="text-xs font-display text-dim uppercase tracking-[0.2em]">Step-by-step Derivation</h3>
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
            <h3 className="text-xl font-display font-medium text-text">Mathematical Calculus Engine</h3>
            <p className="text-dim text-sm leading-relaxed">
              Our symbolic engine uses formal differentiation rules to dissect complex functions. 
              Enter a function above to see the step-by-step process of finding its derivative.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4 w-full">
              <div className="p-3 bg-surface/40 rounded-lg border border-border/40 text-xs">
                <p className="text-accent mb-1 font-display uppercase tracking-widest">Rules</p>
                <p className="text-muted italic">Chain, Product, Quote...</p>
              </div>
              <div className="p-3 bg-surface/40 rounded-lg border border-border/40 text-xs">
                <p className="text-accent mb-1 font-display uppercase tracking-widest">Notation</p>
                <p className="text-muted italic">Formal LaTeX Output</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
