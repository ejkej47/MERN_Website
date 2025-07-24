/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      maxWidth: {
        '7xl': '80rem', // 1280px
      },
      padding: {
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
      },
      colors: {
        primary: {
          DEFAULT: "#9435B0",
          hover: "#7d2b96",
        },
        accent: {
          DEFAULT: "#82E786",
          hover: "#6ad96f",
        },
        background: "#F8FAF8",
        dark: "#3A413E",
      },
    },
  },
  plugins: [],
};
