/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        brand: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
