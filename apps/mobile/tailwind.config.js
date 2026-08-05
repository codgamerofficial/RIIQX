/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: "#0C0B0A",
          void: "#060605",
        },
        charcoal: {
          matte: "#141312",
          elevated: "#1C1B18",
          hover: "#24221E",
        },
        gold: {
          primary: "#D4AF37",
          light: "#F3E5AB",
          dark: "#8B7321",
        },
        accent: {
          gold: {
            DEFAULT: "#D4AF37",
            glow: "rgba(212, 175, 55, 0.35)",
          },
          champagne: {
            DEFAULT: "#F3E5AB",
            glow: "rgba(243, 229, 171, 0.35)",
          },
          crimson: {
            DEFAULT: "#FF003C",
            glow: "rgba(255, 0, 60, 0.35)",
          },
          cyan: {
            DEFAULT: "#00F0FF",
            glow: "rgba(0, 240, 255, 0.30)",
          },
        },
        riiqxText: {
          primary: "#F7F7F7",
          secondary: "#D4D0C8",
          muted: "#9E9A93",
          disabled: "#4A4742",
          accent: "#D4AF37",
          gold: "#D4AF37",
        },
      },
    },
  },
  plugins: [],
};
