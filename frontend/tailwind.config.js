/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg1: '#18181b',
        bg2: '#1e2124',
        fg1: '#7289da',
        fg2: '#EEEEEE',
      },
    },
    screens: {
      sm: '384px',
      md: '512px',
      lg: '1024px',
    },
  },
  plugins: [],
}
