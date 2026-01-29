/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#121212',
        foreground: '#FFFFFF',

        // RIIQX Brand Colors
        brand: {
          DEFAULT: '#CCFF00', // Bewakoof Yellow / Neon
          cyan: '#22d3ee',
          pink: '#f472b6',
        },

        // Utility
        muted: '#A1A1AA',
        border: '#FFFFFF1A', // white/10
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        display: ['Oswald_700Bold'],
        mono: ['Geist_Mono'],
      }
    },
  },
  plugins: [],
}
