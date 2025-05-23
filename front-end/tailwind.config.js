/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#121212",
        },
        surface: {
          light: "#f3f4f6",
          dark: "#1E1E1E",
        },
        border: {
          light: "#e5e7eb",
          dark: "#2E2E2E",
        },
        text: {
          light: "#111827",
          dark: "#ffffff",
        },
        "text-secondary": {
          light: "#4b5563",
          dark: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
};
