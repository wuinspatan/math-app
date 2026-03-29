import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathApp – Number Converter · Matrix · Laplace",
  description:
    "A production-grade math web app: base converter, matrix calculator, and Laplace transforms with step-by-step learning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
