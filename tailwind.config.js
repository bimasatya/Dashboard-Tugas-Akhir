/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        lda: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          400: "#60A5FA",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        bert: {
          50:  "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          400: "#FB923C",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        fomo: {
          50:  "#FEF2F2",
          100: "#FEE2E2",
          600: "#DC2626",
          800: "#991B1B",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Sora'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-up":  "fadeUp 0.6s ease-out forwards",
        "fade-in":  "fadeIn 0.5s ease-out forwards",
        "float":    "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "counter":  "counter 2s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%":      { opacity: 0.7 },
        },
      },
      boxShadow: {
        "card":   "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        "card-lg":"0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        "lda":    "0 4px 20px rgba(37, 99, 235, 0.15)",
        "bert":   "0 4px 20px rgba(234, 88, 12, 0.15)",
        "fomo":   "0 4px 20px rgba(220, 38, 38, 0.15)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #EFF6FF 0%, #FFF7ED 50%, #F5F3FF 100%)",
        "lda-gradient":  "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
        "bert-gradient": "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        "fomo-gradient": "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
      },
    },
  },
  plugins: [],
};
