import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        autobot: {
          red: "#B11226",
          blue: "#003399",
          navy: "#001a4d",
          cyan: "#00ffff",
          core: "#00e5ff",
          amber: "#ff9900",
          steel: "#1a1d20",
          chrome: "#e0e0e0"
        }
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
        sans: ["var(--font-geist-sans)", "sans-serif"]
      },
      boxShadow: {
        "cyan-glow": "0 0 25px rgba(0, 255, 255, 0.4)",
        "red-glow": "0 0 25px rgba(177, 18, 38, 0.5)",
        "core-pulse": "0 0 40px rgba(0, 229, 255, 0.6)"
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanline 8s linear infinite"
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
