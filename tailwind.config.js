/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050505",
        carbon: "#0a0a0a",
        slate: "#111111",
        steel: "#1a1a1a",
        concrete: "#2a2a2a",
        bone: "#ede8df",
        "bone-dim": "#c8c3ba",
        ash: "#6e6a64",
        gold: "#c89c4a",
        "gold-bright": "#e2bd6f",
        signal: "#ff4a16"
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: []
};
