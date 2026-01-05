import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Collections | RIIQX',
    description: 'Explore our curated collections.',
};

const collections = [
    {
        name: "Cyberpunk 2077",
        slug: "cyberpunk",
        image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop",
        desc: "High-tech low-life aesthetics."
    },
    {
        name: "Noir City",
        slug: "noir",
        image: "https://images.unsplash.com/photo-1478720568477-152d02322adb?q=80&w=800&auto=format&fit=crop",
        desc: "Shadows and monochrome vibes."
    },
    {
        name: "Interstellar",
        slug: "interstellar",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
        desc: "Beyond the stars."
    },
    {
        name: "Retro Wave",
        slug: "retro",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
        desc: "80s neon nostalgia."
    }
];

export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tighter">
                    CURATED <span className="text-primary">SERIES.</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {collections.map((c) => (
                        <Link
                            key={c.slug}
                            href={`/shop?q=${c.name}`} // Simplified linking to search for now
                            className="group relative h-[400px] rounded-3xl overflow-hidden border border-white/5"
                        >
                            <Image
                                src={c.image}
                                alt={c.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h2 className="text-3xl font-bold text-white mb-2">{c.name}</h2>
                                <p className="text-white/70">{c.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
