// =============================================================================
// RIIQX — Master Brand & Visual Design Tokens
// One Goal. An AI That Gets It Done.
// =============================================================================

export interface RiiqxBrandConfig {
  name: string;
  tagline: string;
  subheadline: string;
  version: string;
  palette: {
    bg: string;
    surface: string;
    card: string;
    cardElevated: string;
    border: string;
    borderHighlight: string;
    cyan: string;
    blue: string;
    violet: string;
    emerald: string;
    amber: string;
    rose: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  theme?: {
    light: Record<string, string>;
    dark: Record<string, string>;
    accents: Record<string, string>;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const riiqxBrand: RiiqxBrandConfig = {
  name: 'RIIQX',
  tagline: 'A New Perspective on Indian Living',
  subheadline: 'Contemporary Lifestyle Objects, Earthy Luxury & Modern Indian Heritage',
  version: '2.0.0-heritage',
  palette: {
    bg: '#FBF9F5', // Warm Ivory Canvas
    surface: '#F5F2EB', // Alabaster Surface
    card: '#FFFFFF', // Clean White Card
    cardElevated: '#FFFFFF',
    border: '#E6DFD5', // Sandstone Border
    borderHighlight: '#C5A059', // Antique Brass Accent
    cyan: '#606C38', // Muted Olive
    blue: '#283618', // Deep Forest Green
    violet: '#581845', // Royal Burgundy
    emerald: '#606C38', // Muted Olive
    amber: '#C5A059', // Antique Brass
    rose: '#C2593F', // Terracotta
    textPrimary: '#1A1A1A', // Charcoal Text
    textSecondary: '#635B5E', // Sandstone Dark Muted
    textMuted: '#8A8184',
  },
  theme: {
    light: {
      canvas: '#FBF9F5', // Warm Ivory
      canvasSubtle: '#F5F2EB', // Alabaster
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardHover: '#FBF9F5',
      border: '#E6DFD5', // Sandstone
      borderSubtle: '#F0ECE4',
      borderHighlight: '#C5A059', // Antique Brass
      textPrimary: '#1A1A1A', // Charcoal
      textSecondary: '#5A5450',
      textMuted: '#8A817C',
    },
    dark: {
      canvas: '#141414', // Deep Charcoal
      canvasSubtle: '#0D0D0D',
      surface: '#1A1A1A', // Matte Obsidian
      card: '#202020',
      cardHover: '#262626',
      border: '#2E2B27', // Muted Sandstone Dark
      borderSubtle: '#1F1D1A',
      borderHighlight: '#C5A059', // Antique Brass
      textPrimary: '#FBF9F5', // Warm Ivory
      textSecondary: '#B3ACA3',
      textMuted: '#7D766E',
    },
    accents: {
      primary: '#C2593F', // Terracotta
      secondary: '#C5A059', // Antique Brass
      terracotta: '#C2593F',
      brass: '#C5A059',
      olive: '#606C38',
      forest: '#283618',
      burgundy: '#581845',
      sandstone: '#E6DFD5',
      charcoal: '#1A1A1A',
      ivory: '#FBF9F5',
      red: '#C2593F',
      coral: '#D9775F',
      accent: '#C5A059',
      success: '#606C38',
      warning: '#C5A059',
      error: '#C2593F',
      amber: '#C5A059',
      rose: '#C2593F',
      yellow: '#C5A059',
      gradient: 'linear-gradient(135deg, #C2593F 0%, #C5A059 100%)',
      gradientYellow: 'linear-gradient(135deg, #C5A059 0%, #E6DFD5 100%)',
      gradientRed: 'linear-gradient(135deg, #C2593F 0%, #581845 100%)',
    },
  },

  seo: {
    title: 'RIIQX — A New Perspective on Indian Living | Earthy Luxury & Modern Heritage',
    description:
      'RIIQX curates contemporary lifestyle objects, desk essentials, handcrafted living pieces, and conscious design rooted in modern Indian heritage.',
    keywords: [
      'RIIQX',
      'Modern Indian Heritage',
      'Earthy Luxury',
      'Indian D2C Lifestyle',
      'Royal Minimalism',
      'Brass Desk Accessories',
      'Contemporary Indian Living',
      'Conscious Indian Craft',
      'D2C Lifestyle Brand',
    ],
  },
};
