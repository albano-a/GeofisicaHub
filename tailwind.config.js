/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/**/*.css", // Updated to include all CSS files in src folder
  ],
  theme: {
    extend: {
      animation: {
        gradient: "gradient 4s ease infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      colors: {
        geo: {
          primary: "#1077bc",
          secondary: "#BC6B10",
          accent: "#10BC77",
          darkprimary: "#53a6e8",
          darksecondary: "#E39C4B",
          darkaccent: "#4BE8A8",
          lightbg: "#F4F4F5",
          darkbg: "#14161a",
        },
      },
      fontFamily: {
        sans: ["Poppins"],
        serif: ["Libre Baskerville"],
        mono: ["JetBrains Mono"],
      },
    },
  },
  plugins: [],
};
