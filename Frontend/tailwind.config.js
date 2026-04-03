/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f8ff",
          100: "#eef0ff",
          500: "#7c83ff",
          600: "#6366f1",
        },
      },
    },
  },
  plugins: [],
};
