"use client";

import { useState, useCallback } from "react";
import { Plus, Minus, X, RefreshCw, ChevronDown } from "lucide-react";
import { matrixOp } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Op = "add" | "subtract" | "multiply";

const OP_CONFIG: { key: Op; label: string; symbol: string; icon: React.ReactNode }[] = [
  { key: "add",      label: "Add",      symbol: "+", icon: <Plus  size={14} /> },
  { key: "subtract", label: "Subtract", symbol: "−", icon: <Minus size={14} /> },
  { key: "multiply", label: "Multiply", symbol: "×", icon: <X     size={14} /> },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function makeMatrix(rows: number, cols: number, fill = 0): number[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

function parseCell(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function formatCell(n: number): string {
  // Show up to 4 decimal places, stripping trailing zeros
  return parseFloat(n.toFixed(4)).toString();
}

// ── Matrix Grid sub-component ──────────────────────────────────────────────────
function MatrixGrid({
  label,
  data,
  onChange,
}: {
  label: string;
  data: string[][];
  onChange: (r: number, c: number, val: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-display text-dim uppercase tracking-widest mb-2">
        Matrix {label}
      </p>
      <div
        className="inline-grid gap-1"
        style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 1}, minmax(0,1fr))` }}
      >
        {data.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              type="number"
              value={cell}
              onChange={(e) => onChange(r, c, e.target.value)}
              className="matrix-cell"
              style={{ width: 56, height: 44 }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Result Grid (read-only) ────────────────────────────────────────────────────
function ResultGrid({ data }: { data: number[][] }) {
  return (
    <div
      className="inline-grid gap-1"
      style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 1}, minmax(0,1fr))` }}
    >
      {data.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="flex items-center justify-center rounded-sm text-sm font-mono
                       bg-accent/10 border border-accent/30 text-accent-glow"
            style={{ width: 56, height: 44 }}
          >
            {formatCell(cell)}
          </div>
        ))
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MatrixCalculator() {
  const [rows, setRows]   = useState(2);
  const [cols, setCols]   = useState(2);
  const [op, setOp]       = useState<Op>("add");

  // Store matrices as string[][] so inputs can hold partial typing like "-"
  const [matA, setMatA] = useState<string[][]>(() => makeMatrix(2,2).map(r => r.map(String)));
  const [matB, setMatB] = useState<string[][]>(() => makeMatrix(2,2).map(r => r.map(String)));

  const [result,  setResult]  = useState<number[][] | null>(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Resize matrices when dimension inputs change
  function resize(newRows: number, newCols: number) {
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const r = clamp(newRows, 1, 6);
    const c = clamp(newCols, 1, 6);
    setRows(r); setCols(c);
    setMatA(prev => Array.from({ length: r }, (_, i) =>
      Array.from({ length: c }, (_, j) => prev[i]?.[j] ?? "0")
    ));
    setMatB(prev => Array.from({ length: r }, (_, i) =>
      Array.from({ length: c }, (_, j) => prev[i]?.[j] ?? "0")
    ));
    setResult(null);
  }

  const updateA = useCallback((r: number, c: number, v: string) => {
    setMatA(prev => prev.map((row, ri) => row.map((cell, ci) => ri===r && ci===c ? v : cell)));
  }, []);

  const updateB = useCallback((r: number, c: number, v: string) => {
    setMatB(prev => prev.map((row, ri) => row.map((cell, ci) => ri===r && ci===c ? v : cell)));
  }, []);

  function reset() {
    setMatA(makeMatrix(rows,cols).map(r=>r.map(String)));
    setMatB(makeMatrix(rows,cols).map(r=>r.map(String)));
    setResult(null); setError("");
  }

  async function calculate() {
    setError(""); setLoading(true);
    try {
      const a = matA.map(row => row.map(parseCell));
      const b = matB.map(row => row.map(parseCell));
      const data = await matrixOp(op, a, b);
      setResult(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Calculation failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const currentOp = OP_CONFIG.find(o => o.key === op)!;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-display font-medium text-text mb-1">
          Matrix Calculator
        </h2>
        <p className="text-dim text-sm">
          Edit cells directly. Supports Add, Subtract, and Multiply.
        </p>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Size selectors */}
          <div>
            <p className="text-xs text-dim font-display uppercase tracking-widest mb-1.5">
              Size (max 6×6)
            </p>
            <div className="flex items-center gap-2">
              <SizeSelect value={rows} onChange={v => resize(v, cols)} label="Rows" />
              <span className="text-muted font-mono">×</span>
              <SizeSelect value={cols} onChange={v => resize(rows, v)} label="Cols" />
            </div>
          </div>

          {/* Operation selector */}
          <div>
            <p className="text-xs text-dim font-display uppercase tracking-widest mb-1.5">
              Operation
            </p>
            <div className="flex gap-1.5">
              {OP_CONFIG.map(o => (
                <button
                  key={o.key}
                  onClick={() => { setOp(o.key); setResult(null); setError(""); }}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-display border transition-all
                    ${op === o.key
                      ? "bg-accent/15 border-accent text-accent-glow"
                      : "bg-bg border-border text-dim hover:border-muted hover:text-text"}
                  `}
                >
                  {o.icon} {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" size="md" onClick={reset}>
              <RefreshCw size={14} /> Reset
            </Button>
            <Button onClick={calculate} loading={loading} size="md">
              Calculate
            </Button>
          </div>
        </div>
      </Card>

      {/* Matrix inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        <Card>
          <MatrixGrid label="A" data={matA} onChange={updateA} />
        </Card>

        <div className="flex items-center justify-center lg:pt-12">
          <span className="text-3xl font-display text-accent-glow bg-accent/10 rounded-xl
                           w-12 h-12 flex items-center justify-center border border-accent/30">
            {currentOp.symbol}
          </span>
        </div>

        <Card>
          <MatrixGrid label="B" data={matB} onChange={updateB} />
        </Card>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Result */}
      {result && (
        <Card glow className="animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-display text-dim uppercase tracking-widest">Result</p>
            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
              {rows}×{result[0]?.length ?? cols} matrix
            </span>
          </div>
          <ResultGrid data={result} />
        </Card>
      )}

      {/* Formula reference */}
      <Card>
        <p className="text-xs font-display text-dim uppercase tracking-widest mb-3">
          Operation Rules
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { op: "Add / Subtract", rule: "Matrices must be the same size (same rows and columns)." },
            { op: "Multiply A×B",   rule: "Columns of A must equal rows of B. Result is (rows A) × (cols B)." },
            { op: "Cell formula",   rule: "C[i][j] = Σ A[i][k] × B[k][j]  (dot product of row i and column j)" },
          ].map(item => (
            <div key={item.op} className="bg-bg rounded-lg p-3 border border-border">
              <p className="font-display text-accent-glow mb-1">{item.op}</p>
              <p className="text-dim text-xs leading-relaxed">{item.rule}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Size dropdown ──────────────────────────────────────────────────────────────
function SizeSelect({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="appearance-none bg-bg border border-border rounded-lg px-3 py-2 pr-7
                   text-sm font-mono text-text focus:outline-none focus:border-accent
                   transition-colors cursor-pointer"
        aria-label={label}
      >
        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    </div>
  );
}
