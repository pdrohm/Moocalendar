/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFE1E1',
          blue: '#E1F5FF',
          green: '#E1FFE1',
          yellow: '#FFF9E1',
          purple: '#F0E1FF',
          orange: '#FFE8E1',
        }
      }
    },
  },
  plugins: [],
}