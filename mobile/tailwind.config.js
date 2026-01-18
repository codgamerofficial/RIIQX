/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        primary: '#D9F99D', // Neon
        secondary: '#ffffff',
        muted: '#1A1A1A',
      },
      fontFamily: {
        // We will stick to system fonts first to avoid complexity with asset loading, or verify later
        sans: ['System'],
      }
    },
  },
  plugins: [],
}
