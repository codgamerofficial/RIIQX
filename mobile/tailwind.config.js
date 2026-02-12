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
          DEFAULT: '#CCFF00', // Electric Lime
          cyan: '#00F0FF',    // Electric Cyan
          purple: '#7C3AED',  // Neon Violet
          pink: '#f472b6',
          ipl: {
            mi: '#0057E7',
            rcb: '#D71920',
            csk: '#F2CB05',
            pitch: '#00FF7F'
          }
        },

        // Utility
        muted: '#A1A1AA',
        border: '#FFFFFF1A', // white/10
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        display: ['Oswald_700Bold'],
        broadcast: ['Rajdhani_600SemiBold'],
        mono: ['Geist_Mono'],
      }
    },
  },
  plugins: [],
}
