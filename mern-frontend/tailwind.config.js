/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      maxWidth: { '7xl': '80rem' },
      colors: {
        background: "#0B0B0F",     // glavna tamna
        surface: "#12131A",        // kartice/sekcije
        primary: { DEFAULT: "#9435B0", hover: "#7d2b96" }, // ljubičasta
        accent:  { DEFAULT: "#82E786", hover: "#6ad96f" }, // zelena
        muted:   "#98A2B3",        // prigušen tekst
        white:   "#FFFFFF",
        dark:    "#3A413E"         // ostavljeno zbog kompatibilnosti stare teme
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(146,55,176,0.25), 0 0 40px rgba(130,231,134,0.15)"
      }
    },
  },
  plugins: [],
};
