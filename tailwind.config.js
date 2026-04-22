/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8b1a1a",
          deep: "#5c0f0f",
          soft: "#fdf2f2",
        },
        gold: {
          DEFAULT: "#c9a227",
          soft: "#fef3c7",
        },
        intake: {
          fill: "#f5f5f4",
          stroke: "#78716c",
          ink: "#1c1917",
        },
        process: {
          fill: "#ccfbf1",
          stroke: "#0f766e",
          ink: "#134e4a",
        },
        final: {
          fill: "#fef3c7",
          stroke: "#b45309",
          ink: "#78350f",
        },
        warn: {
          fill: "#fee2e2",
          stroke: "#b91c1c",
          ink: "#7f1d1d",
        },
        ink: {
          strong: "#1c1917",
          muted: "#57534e",
          subtle: "#a8a29e",
        },
        bg: {
          base: "#fafaf9",
          panel: "#ffffff",
          elevated: "#f5f5f4",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        h1: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        h3: ["16px", { lineHeight: "1.5", fontWeight: "600" }],
      },
      boxShadow: {
        panel: "0 20px 60px -15px rgba(28, 25, 23, 0.25)",
      },
    },
  },
  plugins: [],
};
