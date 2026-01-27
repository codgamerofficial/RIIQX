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
                primary: '#050505', // Darker Base
                secondary: '#F5F5F5', // Off-White

                // Accents
                accent: {
                    DEFAULT: '#00F0FF', // Electric Cyan
                    purple: '#7C3AED',  // Neon Violet
                    lime: '#CCFF00',    // Electric Lime
                },

                // Functional
                'luxury-black': '#050505',
                'off-white': '#F5F5F5',
                'glass': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['var(--font-roboto)', 'sans-serif'],
                display: ['var(--font-montserrat)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'marquee': 'marquee 25s linear infinite',
                'marquee2': 'marquee2 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                marquee2: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            transitionDuration: {
                'fast': '120ms',
                'normal': '200ms',
                'slow': '280ms',
            },
            transitionTimingFunction: {
                'standard': 'cubic-bezier(0.2, 0, 0, 1)',
                'exit': 'cubic-bezier(0.4, 0, 1, 1)',
            },
        },
    },
    plugins: [],
}