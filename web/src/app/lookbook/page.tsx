import Image from 'next/image';
import Link from 'next/link';

// Mock data for Lookbook - reusing the premium design assets
const LOOKS = [
    {
        id: 1,
        image: "/assets/marketing/hero-future.png",
        title: "Future Ready",
        season: "Summer '26"
    },
    {
        id: 2,
        image: "/assets/marketing/design-02.png",
        title: "Street Ops",
        season: "Core"
    },
    {
        id: 3,
        image: "/assets/marketing/hero-bold.png",
        title: "Bold Edition",
        season: "Essentials"
    },
    {
        id: 4,
        image: "/assets/marketing/design-01.png",
        title: "Wear Your Story",
        season: "Campaign"
    },
    {
        id: 5,
        image: "/assets/marketing/design-03.png",
        title: "New Arrivals",
        season: "Drops"
    },
    {
        id: 6,
        image: "/assets/marketing/design-04.png",
        title: "Fearless",
        season: "Promo"
    },
];

export default function LookbookPage() {
    return (
        <main className="min-h-screen bg-black pt-24 pb-12">
            <div className="container mx-auto px-4">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4">
                        Look<span className="text-[#D9F99D]">Book</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
                        A visual journey through our latest collections. Season 2026.
                    </p>
                </header>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {LOOKS.map((look, index) => (
                        <div key={look.id} className="relative break-inside-avoid group overflow-hidden rounded-2xl">
                            <div className="relative w-full aspect-[3/4] md:aspect-auto">
                                <Image
                                    src={look.image}
                                    alt={look.title}
                                    width={800}
                                    height={1000}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-[#D9F99D] text-xs font-bold uppercase tracking-widest mb-1">{look.season}</span>
                                <h3 className="text-white text-2xl font-bold uppercase">{look.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <Link href="/shop" className="inline-block px-12 py-4 bg-white text-black font-bold uppercase text-lg tracking-wider hover:bg-[#D9F99D] transition-colors rounded-full">
                        Shop The Look
                    </Link>
                </div>
            </div>
        </main>
    );
}
