/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)', // #0B0B0B
                foreground: 'var(--foreground)', // #F5F5F5

                // Brand Colors
                primary: '#0B0B0B', // Matte Black
                secondary: '#F5F5F5', // Off-White

                // Accents
                accent: {
                    DEFAULT: '#7C3AED', // Neon Violet
                    lime: '#CCFF00',    // Electric Lime
                    cyan: '#00FFFF',    // Cyber Cyan
                },

                // Functional
                'luxury-black': '#0B0B0B',
                'off-white': '#F5F5F5',
                'glass': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'], // Inter
                display: ['var(--font-display)', 'sans-serif'], // Oswald/Grotesk
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}