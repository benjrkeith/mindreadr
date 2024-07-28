/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        light_bg: '#E9E4DE',
        light_text: '#121212',
        dark_lighter_bg: '#414141',
        dark_bg: '#121212',
        darker_bg: '#1e2124',
        dark_text: '#E9E4DE',
        primary: '#149381',
        primary_light: '#50b4a5',
        primary_dark: '#0f7664',
        secondary: '#a31c31',
        secondary_light: '#e13b4c',
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
