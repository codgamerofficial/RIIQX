/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0A0A0A',
        foreground: '#FFFFFF',

        // RIIQX Brand Colors
        brand: {
          DEFAULT: '#B4F000', // RIIQX Neon
          dim: '#B4F00033',   // 20% Opacity
          cyan: '#00F0FF',
          purple: '#7C3AED',
        },

        neon: '#B4F000',

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
