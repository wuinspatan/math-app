"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { laplaceTransform, type LaplaceResult } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// ── Preset examples ────────────────────────────────────────────────────────────
const EXAMPLES = [
  { label: "t^2",         expr: "t**2",           hint: "Power of t" },
  { label: "e^{-3t}",    expr: "exp(-3*t)",       hint: "Decaying exponential" },
  { label: "sin(2t)",    expr: "sin(2*t)",         hint: "Sine wave" },
  { label: "cos(t)",     expr: "cos(t)",           hint: "Cosine wave" },
  { label: "t \cdot e^{-t}",  expr: "t*exp(-t)",        hint: "Exponential decay × t" },
  { label: "t^3 + 5",     expr: "t**3 + 5",         hint: "Polynomial + constant" },
  { label: "1",          expr: "1",                hint: "Constant (step)" },
  { label: "e^{2t} \sin(t)", expr: "exp(2*t)*sin(t)", hint: "Damped sine" },
];

// ── Transform table component (LaTeX) ──────────────────────────────────────────
function TransformTable({ table }: { table: [string, string, string][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-display
                   text-dim hover:text-text transition-colors bg-surface"
      >
        <span className="flex items-center gap-2"><BookOpen size={14} /> Common Laplace Pairs</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-t border-b border-border bg-bg text-left">
                <th className="px-4 py-2 text-dim font-normal">Type</th>
                <th className="px-4 py-2 text-dim font-normal">f(t)</th>
                <th className="px-4 py-2 text-dim font-normal">F(s) = <InlineMath math="\mathcal{L}\{f(t)\}" /></th>
              </tr>
            </thead>
            <tbody>
              {table.map(([type, ft, Fs], i) => (
                <tr key={i} className="border-t border-border/40 hover:bg-surface/50">
                  <td className="px-4 py-2 text-dim capitalize">{type}</td>
                  <td className="px-4 py-2 text-cyan">
                     <InlineMath math={ft} />
                  </td>
                  <td className="px-4 py-2 text-green">
                     <InlineMath math={Fs} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Step display (LaTeX) ───────────────────────────────────────────────────────
function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li
          key={i}
          className="flex gap-4 items-start animate-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="shrink-0 w-7 h-7 rounded-full bg-accent/20 border border-accent/40
                           text-accent text-xs font-display flex items-center justify-center mt-1">
            {i + 1}
          </span>
          <div className="flex-1 overflow-x-auto">
             <BlockMath math={step} />
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Laplace() {
  const [expr,    setExpr]    = useState("");
  const [result,  setResult]  = useState<LaplaceResult | null>(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function compute(expression: string) {
    if (!expression.trim()) { setError("Please enter an expression."); return; }
    setError(""); setLoading(true);
    try {
      const data = await laplaceTransform(expression.trim());
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
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-display font-medium text-text mb-1 flex items-center gap-2">
          <Sparkles size={20} className="text-accent" />
          Laplace Transform
        </h2>
        <p className="text-dim text-sm">
          Enter any function of <code className="text-cyan bg-surface px-1 rounded">t</code> and
          get the transform with full mathematical notation.
        </p>
      </div>

      {/* Input */}
      <Card className="p-6">
        <label className="text-xs font-display text-dim uppercase tracking-widest mb-2 block">
          f(t) =
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={expr}
            onChange={e => { setExpr(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && compute(expr)}
            placeholder="e.g.  t**2,  exp(-3*t),  sin(2*t)"
            className="
              flex-1 bg-bg border border-border rounded-lg
              px-4 py-3 font-mono text-base text-text
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
              placeholder:text-muted transition-colors
            "
          />
          <Button onClick={() => compute(expr)} loading={loading} size="lg">
            Transform
          </Button>
        </div>

        <p className="text-xs text-muted mt-2">
          Supports <InlineMath math="t^n" />, <InlineMath math="e^{at}" />, <InlineMath math="\sin(at)" />, etc.
        </p>

        {error && <div className="mt-3"><ErrorMessage message={error} /></div>}
      </Card>

      {/* Quick examples */}
      <div>
        <p className="text-xs font-display text-dim uppercase tracking-widest mb-2">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex.expr}
              onClick={() => pickExample(ex)}
              title={ex.hint}
              className="
                px-3 py-1.5 text-sm font-mono rounded-lg border border-border
                bg-surface text-dim hover:border-accent hover:text-accent-glow
                transition-all duration-150
              "
            >
              <InlineMath math={ex.label} />
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Answer banner */}
          <Card glow className="border-accent/40 p-8">
            <p className="text-xs font-display text-dim uppercase tracking-widest mb-4">Result (s-domain)</p>
            <div className="flex flex-col gap-2">
               <div className="opacity-60 text-sm">
                  <InlineMath math={`\\mathcal{L}\\{${result.input_latex}\\}(s) = `} />
               </div>
               <div className="text-3xl text-accent-glow break-all">
                  <BlockMath math={result.result_latex} />
               </div>
            </div>
          </Card>

          {/* Steps */}
          <Card className="p-8">
            <p className="text-xs font-display text-dim uppercase tracking-widest mb-6">
              Step-by-step Explanation
            </p>
            <Steps steps={result.steps} />
          </Card>

          {/* Transform table */}
          <TransformTable table={result.transform_table} />
        </div>
      )}

      {/* Educational block */}
      {!result && (
        <Card className="p-6">
          <p className="text-xs font-display text-dim uppercase tracking-widest mb-4">
             Mathematical Concept
          </p>
          <div className="space-y-4 text-sm text-dim leading-relaxed">
            <p>
              The <span className="text-text">Laplace Transform</span> converts a time-domain 
              function <code className="text-cyan">f(t)</code> into a complex frequency-domain 
              function <code className="text-green">F(s)</code>.
            </p>
            <BlockMath math="\mathcal{L}\{f(t)\} = \int_0^\infty f(t)e^{-st} dt" />
          </div>
        </Card>
      )}
    </div>
  );
}
