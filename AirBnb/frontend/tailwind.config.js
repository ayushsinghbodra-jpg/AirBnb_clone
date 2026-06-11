/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{html,ejs}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5A5F",
        secondary: "#484848",
      },
      fontFamily: {
        sans: ["Circular", "sans-serif"],
      },
    },
  },
  plugins: [],
}
