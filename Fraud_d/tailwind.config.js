/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",         // Fix here: should point to root index.html, NOT inside src
    "./src/**/*.{js,ts,jsx,tsx}"  // This is correct
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
