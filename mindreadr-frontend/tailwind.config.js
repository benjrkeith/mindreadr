/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'grey': '#1e2124'
      }
    },
    screens: {
      'sm': '384px',
      'md': '512px',
      'lg': '1024px',
    },
  },
  plugins: [],
}