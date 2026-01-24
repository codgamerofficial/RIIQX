
import { getProducts } from "@/lib/shopify";
import DropTimer from "@/components/shared/DropTimer";
import LookbookGrid from "./LookbookGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Archive | Lookbook',
    description: 'Explore the RIIQX visual archive.',
};

export const revalidate = 60;

export default async function LookbookPage() {
    // Fetch all products to populate the archive
    const { products } = await getProducts({ sortKey: 'CREATED_AT', reverse: true, limit: 50 });

    // Calculate dates for next drop (3 days from now) - Keep this purely for display
    const nextDropDate = new Date();
    nextDropDate.setDate(nextDropDate.getDate() + 3);

    return (
        <div className="min-h-screen bg-[#0B0B0B] pt-24 pb-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white uppercase tracking-tighter leading-none">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Archive</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        Curated styles from our latest collections. Explore the looks and shop the pieces that define the RIIQX aesthetic.
                    </p>
                </div>

                {/* Drop Timer Integration */}
                <div className="max-w-2xl mx-auto">
                    <DropTimer targetDate={nextDropDate} label="Next Collection Drop" />
                </div>
            </div>

            {/* Grid */}
            <LookbookGrid products={products} />
        </div>
    );
}
