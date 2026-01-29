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
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'glow': 'glow 2s ease-in-out infinite',
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
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(124, 58, 237, 0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.8), 0 0 30px rgba(124, 58, 237, 0.6)' },
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
                'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
        },
    },
    plugins: [],
}