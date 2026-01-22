/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#000000', // Deep Black
        foreground: '#FFFFFF',
        cherry: {
          DEFAULT: '#E31C79', // Cherry Red
          50: '#FCE4EE',
          100: '#FAC8DE',
          200: '#F591BE',
          300: '#F05A9D',
          400: '#EB237D',
          500: '#E31C79',
          600: '#B61661',
          700: '#881149',
          800: '#5B0B30',
          900: '#2D0618',
        },
        gold: {
          DEFAULT: '#FFB800', // Gold Accent
          light: '#FFD466',
          dark: '#CC9300',
        },
        black: {
          DEFAULT: '#000000',
          rich: '#0A0A0A',
          soft: '#1A1A1A',
        },
      },
      fontFamily: {
        gilroy: ['System'], // Placeholder for Gilroy
        inter: ['System'],  // Placeholder for Inter
      }
    },
  },
  plugins: [],
}
