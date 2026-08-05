import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Base obsidian & matte charcoal backgrounds */
        obsidian: {
          base: 'var(--riiqx-color-obsidian-base, #0C0B0A)',
          void: 'var(--riiqx-color-obsidian-void, #060605)',
        },
        charcoal: {
          matte: 'var(--riiqx-color-charcoal-matte, #141312)',
          elevated: 'var(--riiqx-color-charcoal-elevated, #1C1B18)',
          hover: 'var(--riiqx-color-surface-hover, #24221E)',
        },

        /* Golden Mode Accent Palette */
        gold: {
          primary: '#D4AF37',
          light: '#F3E5AB',
          dark: '#8B7321',
          glow: 'rgba(212, 175, 55, 0.30)',
        },

        /* Primary Accent Highlights */
        accent: {
          gold: {
            DEFAULT: 'var(--riiqx-color-gold-primary, #D4AF37)',
            glow: 'var(--riiqx-color-gold-glow, rgba(212, 175, 55, 0.30))',
          },
          champagne: {
            DEFAULT: 'var(--riiqx-color-gold-light, #F3E5AB)',
            glow: 'var(--riiqx-color-gold-light-glow, rgba(243, 229, 171, 0.35))',
          },
          crimson: {
            DEFAULT: '#ff003c',
            glow: 'rgba(255, 0, 60, 0.35)',
          },
          cyan: {
            DEFAULT: '#00f0ff',
            glow: 'rgba(0, 240, 255, 0.30)',
          },
        },

        /* Glass Surface & Borders */
        glass: {
          surface: 'rgba(20, 19, 18, 0.70)',
          elevated: 'rgba(28, 27, 24, 0.60)',
          border: {
            subtle: 'rgba(212, 175, 55, 0.12)',
            medium: 'rgba(212, 175, 55, 0.25)',
            active: 'rgba(212, 175, 55, 0.45)',
            accent: 'rgba(212, 175, 55, 0.70)',
          },
        },

        /* Text / Foreground Colors */
        riiqxText: {
          primary: '#F7F7F7',
          secondary: '#D4D0C8',
          muted: '#9E9A93',
          disabled: '#4A4742',
          accent: '#D4AF37',
          gold: '#D4AF37',
        },

        /* Functional / Status Colors */
        status: {
          success: '#D4AF37',
          error: '#E53935',
          warning: '#F5A623',
          info: '#F3E5AB',
        },
      },

      fontFamily: {
        display: ['var(--riiqx-font-display)', 'Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['var(--riiqx-font-sans)', 'Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['var(--riiqx-font-mono)', 'JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.0rem', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.02em' }],
        'base': ['1.0rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2.0rem', letterSpacing: '-0.02em' }],
        '3xl': ['2.0rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '4xl': ['2.75rem', { lineHeight: '3.25rem', letterSpacing: '-0.04em' }],
        '5xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.04em' }],
        '6xl': ['4.75rem', { lineHeight: '5.0rem', letterSpacing: '-0.05em' }],
      },

      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '16px',
        'full': '9999px',
      },

      boxShadow: {
        'glass-sm': '0 2px 10px -2px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(212, 175, 55, 0.15)',
        'glass-md': '0 8px 30px -4px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(212, 175, 55, 0.20)',
        'glass-lg': '0 20px 50px -10px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(212, 175, 55, 0.25)',
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.35), 0 0 50px rgba(212, 175, 55, 0.12)',
        'glow-champagne': '0 0 25px rgba(243, 229, 171, 0.35)',
      },

      backdropBlur: {
        subtle: '12px',
        medium: '20px',
        heavy: '40px',
      },

      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
