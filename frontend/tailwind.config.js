/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        light_bg_base: '#E9E4DE',
        light_text: '#000000',
        dark_bg_base: '#121212',
        dark_bg_1dp: '#202020',
        dark_bg_2dp: '#282828',
        dark_bg_lighter: '#363636',
        dark_text: '#FFFFFF',
        primary_base: '#BB86FC',
        primary_darker: '#8e44ea',
        secondary_base: '#03dac4',
        secondary_darker: '#00a885',
        error: '#cf6679',
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
