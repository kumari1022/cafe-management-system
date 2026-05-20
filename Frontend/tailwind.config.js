/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cafe: {
          bg: "#f8f5f2",
          sidebar: "#ede0d4",
          primary: "#9c6644",
          secondary: "#b08968",
          btn: "#7f5539",
          hover: "#ddb892",
          card: "#fffaf5",
          text: "#3e2723",
          beige: "#f5f5dc",
          cream: "#fffdd0",
          dark: {
            bg: "#1a120b",
            sidebar: "#2c1810",
            card: "#3e2723",
            text: "#f8f5f2",
          },
        },
      },
      fontFamily: {
        display: ["Poppins", "Georgia", "Cambria", "serif"],
        sans: ["Poppins", "Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        cafe: "0 10px 30px rgba(62, 39, 35, 0.08)",
        "cafe-lg": "0 20px 50px rgba(62, 39, 35, 0.12)",
      },
    },
  },
  plugins: [],
};
