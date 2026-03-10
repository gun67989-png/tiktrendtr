import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080c",
        surface: "#111118",
        "surface-light": "#1a1a24",
        "surface-lighter": "#222230",
        border: "#2a2a3a",
        "neon-red": "#ff3b5c",
        "neon-red-light": "#ff5c7a",
        "neon-red-dark": "#cc2f4a",
        teal: "#00d4aa",
        "teal-light": "#33e0be",
        "teal-dark": "#00a885",
        "text-primary": "#f0f0f5",
        "text-secondary": "#8888a0",
        "text-muted": "#555570",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-teal": "glowTeal 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 59, 92, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 59, 92, 0.4)" },
        },
        glowTeal: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 170, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 212, 170, 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
