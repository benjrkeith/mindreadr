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
        fg3: '#4162d9',
      },
    },
    screens: {
      sm: '400px',
      md: '580px',
      lg: '720px',
      xl: '960px',
    },
  },
  plugins: [],
}
