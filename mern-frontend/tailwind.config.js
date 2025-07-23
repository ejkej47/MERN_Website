/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Prilagodi po strukturi tvog projekta
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9435B0",       // Ljubičasta — npr. bg-primary, text-primary
        accent: "#82E786",        // Svetla zelena — npr. border-accent, text-accent
        background: "#F8FFF8",    // Svetla pozadina — npr. bg-background
        dark: "#3A413E",          // Tamna za tekst ili footer — npr. bg-dark, text-dark
      },
    },
  },
  plugins: [],
};
