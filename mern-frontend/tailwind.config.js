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

      /* Bitno: sve boje idu preko CSS varijabli */
      colors: {
        background: "var(--bg)",
        surface:   "var(--surface)",

        text:      "var(--text)",
        muted:     "var(--muted)",
        mutedSoft: "var(--muted-soft)",

        primary:   { DEFAULT: "var(--primary)", hover: "var(--primary-h)" },
        accent:    { DEFAULT: "var(--accent)",  hover: "var(--accent-h)"  },

        border:      "var(--border)",
        borderSoft:  "var(--border-soft)",

        /* fallback */
        white: "#FFFFFF",
        black: "#000000",
      },

      /* Suptilniji glow za light temu */
      boxShadow: {
        glow: "0 0 0 3px color-mix(in oklab, var(--primary) 25%, white), 0 0 40px color-mix(in oklab, var(--accent) 15%, white)"
      }
    },
  },
  plugins: [],
};
