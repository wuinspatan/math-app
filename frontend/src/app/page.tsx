"use client";

import { useState } from "react";
import { Hash, Grid3x3, Zap, Github, Activity } from "lucide-react";
import Converter from "@/components/features/Converter";
import MatrixCalculator from "@/components/features/Matrix";
import Calculus from "@/components/features/Calculus";
import Laplace from "@/components/features/Laplace";

type Tab = "converter" | "matrix" | "calculus" | "laplace";

const TABS: { key: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "converter", label: "Converter", icon: <Hash size={16} />, desc: "Base conversion" },
  { key: "matrix", label: "Matrix", icon: <Grid3x3 size={16} />, desc: "Add · Sub · Mul" },
  { key: "calculus", label: "Calculus 1", icon: <Activity size={16} />, desc: "Find dy/dx" },
  { key: "laplace", label: "Laplace", icon: <Zap size={16} />, desc: "Laplace + steps" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("converter");

  return (
    <div className="min-h-screen grid-bg">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center
                            justify-center text-accent font-display font-medium text-sm">
              M
            </div>
            <span className="font-display text-text font-medium tracking-tight">Math Wolfram</span>
            <span className="hidden sm:inline text-muted text-xs font-mono border border-border
                             rounded px-1.5 py-0.5">
              v1.0
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="mb-2">
          <span className="text-xs font-display uppercase tracking-widest text-accent">
            Let's get start!
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-medium text-text leading-tight mb-3">
          Math<span className="text-accent">Wolfram</span>
        </h1>
        <p className="text-dim max-w-lg">
          Number base converter · Matrix calculator · Laplace transforms with step-by-step learning.
          Powered by a FastAPI backend.
        </p>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 border-b border-border">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-display transition-all duration-150
                border-b-2 -mb-px
                ${tab === t.key
                  ? "border-accent text-accent-glow"
                  : "border-transparent text-dim hover:text-text"}
              `}
            >
              {t.icon}
              <span>{t.label}</span>
              <span className="hidden sm:inline text-xs text-muted font-normal">
                — {t.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {tab === "converter" && <Converter />}
        {tab === "matrix" && <MatrixCalculator />}
        {tab === "calculus" && <Calculus />}
        {tab === "laplace" && <Laplace />}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row
                        items-center justify-between gap-2 text-xs text-muted font-mono">
          <span>MathApp · Next.js + FastAPI</span>
          <span>Develop by wuinspatan</span>
          <span>
            Live Frontend: <span className="text-dim">Vercel</span> ·
            Live Backend: <span className="text-dim">Railway</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
