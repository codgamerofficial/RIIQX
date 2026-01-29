export type HeroSlideType = 'brand' | 'product' | 'drop' | 'lifestyle';
export type HeroLayout = 'split' | 'center' | 'full';

export interface HeroSlideData {
    id: string;
    type: HeroSlideType;
    image: string;
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink: string;
    price?: string;
    badge?: string;
    layout?: HeroLayout;
    objectPosition?: string; // e.g. "top", "center", "bottom", "left", "right"
    // Chapter data injected during flattening
    chapterId?: string;
    chapterTitle?: string;
}

export interface HeroChapter {
    id: string;
    title: string;
    accent: string; // Hex or tailwind class concept
    slides: HeroSlideData[];
}

export const HERO_CHAPTERS: HeroChapter[] = [
    {
        id: "ipl",
        title: "IPL Fanwear",
        accent: "team",
        slides: [
            {
                id: 'ipl-main',
                type: 'drop',
                image: '/assets/hero/slide-ipl-teams-1.jpg',
                title: 'IPL DRIP SEASON',
                subtitle: 'Rep Your Team. Rule The Streets.',
                badge: 'New Collection',
                ctaText: 'Shop IPL',
                ctaLink: '/collections/ipl',
                layout: 'split'
            },
            {
                id: 'ipl-squad-2',
                type: 'lifestyle',
                image: '/assets/hero/slide-ipl-teams-2.jpg',
                title: 'ALL TEAMS. ONE GAME.',
                subtitle: 'Official Team Gear',
                ctaText: 'View Teams',
                ctaLink: '/collections/ipl',
                layout: 'full',
                objectPosition: 'top'
            }
        ]
    },
    {
        id: "mindset",
        title: "Mindset",
        accent: "#ffffff",
        slides: [
            {
                id: 'mindset-main',
                type: 'brand',
                image: '/assets/hero/slide-mindset-group.jpg',
                title: 'WEAR YOUR MINDSET',
                subtitle: 'Savage. Fearless. Unstoppable.',
                ctaText: 'Shop Statement',
                ctaLink: '/collections/mindset',
                layout: 'center'
            }
        ]
    },
    {
        id: "grunge",
        title: "Grunge Series",
        accent: "#EAB308",
        slides: [
            {
                id: 'grunge-main',
                type: 'lifestyle',
                image: '/assets/hero/slide-grunge-group.jpg',
                title: 'STREET IS A STATEMENT',
                subtitle: 'RIIQX Grunge Series',
                badge: 'Limited Edition',
                ctaText: 'Get The Look',
                ctaLink: '/collections/grunge',
                layout: 'full'
            }
        ]
    },
    {
        id: "pride",
        title: "Indian Pride",
        accent: "#FF9933",
        slides: [
            {
                id: 'pride-csk',
                type: 'lifestyle',
                image: '/assets/hero/slide-csk-dhoni.jpg',
                title: 'MADE FOR INDIAN GRIT',
                subtitle: 'Matchday To Streetday',
                ctaText: 'Explore Collection',
                ctaLink: '/collections/india',
                layout: 'split'
            }
        ]
    },
    {
        id: "minimal",
        title: "Minimal Core",
        accent: "#000000",
        slides: [
            {
                id: 'minimal-black',
                type: 'product',
                image: '/assets/hero/slide-mindset-group.jpg', // Fallback/reuse for now or use previous generic if better
                title: 'BLACK. BOLD. RIIQX.',
                subtitle: 'Everyday Essentials',
                ctaText: 'Shop Core',
                ctaLink: '/collections/core',
                layout: 'center',
                objectPosition: 'center top' // Focus on faces
            }
        ]
    },
    {
        id: "featured",
        title: "Featured",
        accent: "#FF0000",
        slides: [
            {
                id: 'featured-drop',
                type: 'drop',
                image: '/assets/hero/slide-ipl-teams-1.jpg',
                title: 'DON’T MISS THE DROP',
                subtitle: 'Selling Fast',
                badge: 'Trending',
                ctaText: 'Shop Now',
                ctaLink: '/new-arrivals',
                layout: 'split'
            }
        ]
    }
];

// Helper to flatten slides while preserving chapter context
export function getFlattenedSlides(): HeroSlideData[] {
    return HERO_CHAPTERS.flatMap(chapter =>
        chapter.slides.map(slide => ({
            ...slide,
            chapterId: chapter.id,
            chapterTitle: chapter.title
        }))
    );
}
