"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { convertNumber, type ConvertResult } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Base = "decimal" | "binary" | "octal" | "hex";

const BASES: { key: Base; label: string; prefix: string; placeholder: string }[] = [
  { key: "decimal", label: "Decimal",     prefix: "d",  placeholder: "255"     },
  { key: "binary",  label: "Binary",      prefix: "0b", placeholder: "11111111"},
  { key: "octal",   label: "Octal",       prefix: "0o", placeholder: "377"     },
  { key: "hex",     label: "Hexadecimal", prefix: "0x", placeholder: "FF"      },
];

const RESULT_LABELS: Record<keyof ConvertResult, string> = {
  decimal: "Decimal (base 10)",
  binary:  "Binary (base 2)",
  octal:   "Octal (base 8)",
  hex:     "Hex (base 16)",
};

export default function Converter() {
  const [value,    setValue]    = useState("");
  const [fromBase, setFromBase] = useState<Base>("decimal");
  const [result,   setResult]   = useState<ConvertResult | null>(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleConvert() {
    if (!value.trim()) { setError("Please enter a value."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await convertNumber(value.trim(), fromBase);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // Allow pressing Enter to convert
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleConvert();
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-display font-medium text-text mb-1">
          Number Converter
        </h2>
        <p className="text-dim text-sm">
          Convert instantly between Decimal, Binary, Octal, and Hexadecimal.
        </p>
      </div>

      <Card>
        {/* Base selector */}
        <div className="mb-4">
          <p className="text-xs text-dim mb-2 font-display uppercase tracking-widest">
            Input base
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BASES.map((b) => (
              <button
                key={b.key}
                onClick={() => { setFromBase(b.key); setResult(null); setError(""); }}
                className={`
                  rounded-lg px-3 py-2 text-sm font-display transition-all duration-150 border
                  ${fromBase === b.key
                    ? "bg-accent/15 border-accent text-accent-glow shadow-glow-sm"
                    : "bg-bg border-border text-dim hover:border-muted hover:text-text"}
                `}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono text-xs pointer-events-none select-none">
              {BASES.find((b) => b.key === fromBase)?.prefix}
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); setResult(null); }}
              onKeyDown={onKeyDown}
              placeholder={BASES.find((b) => b.key === fromBase)?.placeholder}
              className="
                w-full bg-bg border border-border rounded-lg
                pl-8 pr-4 py-3 font-mono text-lg text-text
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
                transition-colors placeholder:text-muted
              "
            />
          </div>
          <Button onClick={handleConvert} loading={loading} size="lg">
            <ArrowLeftRight size={16} />
            Convert
          </Button>
        </div>

        {error && <div className="mt-3"><ErrorMessage message={error} /></div>}
      </Card>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up">
          {(Object.entries(result) as [keyof ConvertResult, string][]).map(([key, val]) => (
            <Card
              key={key}
              glow
              className={`cursor-default ${key === fromBase ? "border-accent/50" : ""}`}
            >
              <p className="text-xs font-display text-dim uppercase tracking-widest mb-1">
                {RESULT_LABELS[key]}
                {key === fromBase && (
                  <span className="ml-2 text-accent text-[10px] normal-case">(input)</span>
                )}
              </p>
              <p className="text-2xl font-mono text-text break-all">{val}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Quick reference table */}
      <Card className="overflow-x-auto">
        <p className="text-xs font-display text-dim uppercase tracking-widest mb-3">
          Quick Reference
        </p>
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border">
              {BASES.map((b) => (
                <th key={b.key} className="text-left text-dim pb-2 pr-4 font-normal">
                  {b.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0,1,2,4,8,10,15,16,255].map((n) => (
              <tr key={n} className="border-b border-border/40 hover:bg-bg/50">
                <td className="py-1.5 pr-4 text-text">{n}</td>
                <td className="py-1.5 pr-4 text-cyan">{n.toString(2)}</td>
                <td className="py-1.5 pr-4 text-green">{n.toString(8)}</td>
                <td className="py-1.5 text-amber">{n.toString(16).toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
