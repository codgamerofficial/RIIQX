
import { getProducts } from "@/lib/shopify";
import DropTimer from "@/components/shared/DropTimer";
import LookbookGrid from "./LookbookGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Highlights | Lookbook',
    description: 'RIIQX Season Highlights.',
};

export const revalidate = 60;

export default async function LookbookPage() {
    // Fetch all products to populate the archive
    const { products } = await getProducts({ sortKey: 'CREATED_AT', reverse: true, limit: 50 });

    // Calculate dates for next drop (3 days from now)
    const nextDropDate = new Date();
    nextDropDate.setDate(nextDropDate.getDate() + 3);

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20">
            {/* Header / Scoreboard Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 space-y-12 text-center">

                <span className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md mb-4 text-white/50">
                    Season 2026 • Replay
                </span>

                <h1 className="text-6xl md:text-9xl font-black font-display text-white uppercase tracking-tighter leading-[0.8]">
                    Highlight <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Reel</span>
                </h1>

                <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed font-mono uppercase tracking-wide">
                    The best plays of the season. Curated styles from our latest drops.
                </p>

                {/* Drop Timer Integration */}
                <div className="max-w-2xl mx-auto bg-[#121212] border border-white/10 rounded-[32px] p-8">
                    <DropTimer targetDate={nextDropDate} label="Next Match Begins In" />
                </div>
            </div>

            {/* Grid */}
            <LookbookGrid products={products} />
        </div>
    );
}
