/**
 * lib/api.ts
 * Central API client. All fetch calls go through here.
 * The base URL is read from the environment variable set in .env.local
 */

const envBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const BASE = envBase.endsWith("/") ? envBase.slice(0, -1) : envBase;

// ─── Generic helper ────────────────────────────────────────────────────────────
async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // FastAPI returns { detail: "..." } for validation errors
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

// ─── Types ─────────────────────────────────────────────────────────────────────
export type ConvertResult = {
  decimal: string;
  binary:  string;
  octal:   string;
  hex:     string;
};

export type MatrixResult = { result: number[][] };

export type LaplaceResult = {
  input:           string;
  input_latex:     string;
  result:          string;
  result_latex:    string;
  steps:           string[];
  transform_table:  [string, string, string][];
};

export type CalculusResult = {
  input:         string;
  input_latex:   string;
  target_value?: string; // only for limits
  result:        string;
  result_latex:  string;
  steps:         string[];
};

// ─── Converter ─────────────────────────────────────────────────────────────────
export function convertNumber(value: string, from_base: string) {
  return post<ConvertResult>("/convert", { value, from_base });
}

// ─── Matrix ────────────────────────────────────────────────────────────────────
type MatrixOp = "add" | "subtract" | "multiply";

export function matrixOp(op: MatrixOp, a: number[][], b: number[][]) {
  return post<MatrixResult>(`/matrix/${op}`, { a, b });
}

// ─── Laplace ───────────────────────────────────────────────────────────────────
export function laplaceTransform(expression: string) {
  return post<LaplaceResult>("/laplace", { expression });
}

// ─── Calculus ──────────────────────────────────────────────────────────────────
export function differentiate(expression: string) {
  return post<CalculusResult>("/calculus/diff", { expression });
}

export function calculateLimit(expression: string, value: string) {
  return post<CalculusResult>("/calculus/limit", { expression, value });
}
