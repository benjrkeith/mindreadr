/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        light_bg_base: '#E9E4DE',
        light_text_base: '#121212',
        dark_bg_lighter: '#414141',
        dark_bg_base: '#121212',
        dark_bg_darker: '#1e2124',
        dark_text_base: '#E9E4DE',
        primary_base: '#149381',
        primary_lighter: '#50b4a5',
        primary_darker: '#0f7664',
        secondary_base: '#a31c31',
        secondary_lighter: '#e13b4c',
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
