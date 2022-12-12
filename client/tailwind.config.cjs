/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        primary_light: "var(--primary-light)",
        primary_dark: "var(--primary-dark)",
        secondary: "var(--secondary)",
        secondary_light: "var(--secondary-light)",
        secondary_dark: "var(--secondary-dark)",
        link: "var(--link)",
        surface: "var(--surface)",
        gray: "var(--gray)"
       },
       fontFamily: {
        poppins: "Poppins, sans-serif",
       },
       transitionProperty: {
        width: "width",
       },
    },
  },
  plugins: [],
}
