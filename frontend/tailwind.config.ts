import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Display: sharp geometric – used for headings
        display: ["'DM Mono'", "monospace"],
        // Body: clean sans
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        // Design system palette
        bg:      "#0a0a0f",       // near-black background
        surface: "#12121a",       // card surfaces
        border:  "#1e1e2e",       // subtle borders
        muted:   "#3a3a5c",       // disabled / placeholder
        text:    "#e2e8f0",       // primary text
        dim:     "#94a3b8",       // secondary text
        accent:  "#7c6af7",       // primary purple accent
        "accent-glow": "#a78bfa", // lighter glow variant
        cyan:    "#22d3ee",       // secondary accent
        green:   "#34d399",       // success
        red:     "#f87171",       // error
        amber:   "#fbbf24",       // warning
      },
      boxShadow: {
        glow:     "0 0 24px rgba(124, 106, 247, 0.25)",
        "glow-sm": "0 0 12px rgba(124, 106, 247, 0.15)",
        card:     "0 4px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.35s ease forwards",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulse2:  { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
