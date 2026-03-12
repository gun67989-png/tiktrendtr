import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "24": "repeat(24, minmax(0, 1fr))",
      },
      colors: {
        background: "#0c0c14",
        surface: "#13131e",
        "surface-light": "#1c1c2b",
        "surface-lighter": "#252536",
        border: "#2e2e44",
        "neon-red": "#ff4d6a",
        "neon-red-light": "#ff7090",
        "neon-red-dark": "#d93a56",
        teal: "#00e6b8",
        "teal-light": "#40f0d0",
        "teal-dark": "#00b892",
        purple: "#a78bfa",
        "purple-light": "#c4b5fd",
        amber: "#fbbf24",
        "text-primary": "#f0f0f8",
        "text-secondary": "#9494b0",
        "text-muted": "#606080",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
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
