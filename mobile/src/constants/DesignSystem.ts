export const COLORS = {
    cherry: {
        DEFAULT: '#E31C79', // Cherry Red from brand guide
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
        rich: '#0A0A0A', // Deep black for backgrounds
        soft: '#1A1A1A', // Card backgrounds
    },
    white: {
        DEFAULT: '#FFFFFF',
        off: '#F5F5F5',
    },
    gray: {
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    }
} as const;

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
} as const;

export const RADIUS = {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    full: 9999,
} as const;

export const FONTS = {
    // Mapping to system fonts for now, replaced by real font files later
    bold: 'System',
    medium: 'System',
    regular: 'System',
} as const;
