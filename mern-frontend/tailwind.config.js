/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Prilagodi po strukturi tvog projekta
  ],
  theme: {
    extend: {
      colors: {
        primary: {
        DEFAULT: "#9435B0",
        hover: "#7d2b96", // tamnija ljubičasta za hover
        },       // Ljubičasta — npr. bg-primary, text-primary
        accent: {
        DEFAULT: "#82E786",
        hover: "#6ad96f", // tamnija/svetlija zelena za hover
        },        // Svetla zelena — npr. border-accent, text-accent
        background: "#F8FAF8",    // Svetla pozadina — npr. bg-background
        dark: "#3A413E",          // Tamna za tekst ili footer — npr. bg-dark, text-dark
      },
    },
  },
  plugins: [],
};
