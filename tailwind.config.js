/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",
        surface: "#111827",
        "surface-2": "#1A2440",
        brand: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
          muted: "#1D4ED8",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
