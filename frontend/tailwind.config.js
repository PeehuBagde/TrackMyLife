/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#14121F",
          900: "#1B1830",
          800: "#252140",
          700: "#332C56",
        },
        paper: {
          DEFAULT: "#FBF7F0",
          line: "#E7DCC8",
        },
        amber: {
          DEFAULT: "#E3993B",
          dark: "#C97E2A",
        },
        teal: {
          DEFAULT: "#2F6F6D",
          light: "#E4F0EE",
        },
        coral: {
          DEFAULT: "#D96574",
          light: "#FBEBEC",
        },
        plum: {
          DEFAULT: "#6C4F94",
          light: "#EFE9F5",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        page: "0 1px 2px rgba(20, 18, 31, 0.06), 0 12px 32px -12px rgba(20, 18, 31, 0.25)",
      },
    },
  },
  plugins: [],
}