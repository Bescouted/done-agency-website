/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'void-black': '#050505',
        'neon-red': '#FF0033',
        'electric-blue': '#00F0FF',
        'grid-line': '#333333',
      }
    },
  },
  plugins: [],
}
