/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1", // indigo-500
          light: "#818cf8",
          dark: "#4f46e5",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // purple-500
          light: "#a78bfa",
          dark: "#7c3aed",
        },
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          700: "#374151",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
  darkMode: false, // ❌ Disable since you're on a white theme
};





