import { ProductGrid } from "@/components/shop/ProductGrid";
import { getCollectionProducts } from "@/lib/shopify";
import { Suspense } from "react";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { SortSelect } from "@/components/shop/SortSelect";
import { Product } from "@/lib/shopify/types";

export const metadata = {
    title: 'New Arrivals | RIIQX',
    description: 'The latest drops from RIIQX. Be the first to own the future.',
};

export default async function NewArrivalsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { sort, min_price, max_price, category, color, size } = searchParams;
    const sortKey = sort === 'price_high' || sort === 'price_low' ? 'PRICE' :
        sort === 'best_selling' ? 'BEST_SELLING' : 'CREATED';
    const reverse = sort === 'price_low' ? false : true;

    const { products } = await getCollectionProducts({
        handle: 'new-arrivals',
        sortKey,
        reverse
    });

    // Filter Logic
    let filteredProducts = products;

    if (min_price || max_price) {
        const min = min_price ? Number(min_price) : 0;
        const max = max_price ? Number(max_price) : Infinity;
        filteredProducts = filteredProducts.filter(p => {
            const price = Number(p.priceRange.minVariantPrice.amount);
            return price >= min && price <= max;
        });
    }

    if (category && category !== 'All') {
        filteredProducts = filteredProducts.filter(p => p.productType === category);
    }

    if (color) {
        filteredProducts = filteredProducts.filter(p =>
            p.options.find(o => o.name === 'Color')?.values.includes(color as string)
        );
    }

    if (size) {
        filteredProducts = filteredProducts.filter(p =>
            p.options.find(o => o.name === 'Size')?.values.includes(size as string)
        );
    }

    // Extract available filters from ALL products (could be optimized)
    const availableTypes = Array.from(new Set(products.map(p => p.productType))).filter(Boolean);
    const availableColors = Array.from(new Set(products.flatMap(p => p.options.find(o => o.name === 'Color')?.values || [])));
    const availableSizes = Array.from(new Set(products.flatMap(p => p.options.find(o => o.name === 'Size')?.values || [])));


    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <ProductFilters
                        availableTypes={availableTypes}
                        availableSizes={availableSizes}
                        availableColors={availableColors}
                    />

                    <div className="flex-1">
                        {/* Header & Sort */}
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-[#B4F000] pb-6">
                            <div className="relative">
                                {/* Decorator */}
                                <div className="absolute -top-6 -left-2 text-[10px] font-mono text-[#B4F000] uppercase tracking-widest opacity-60">
                                    // Season 2026 // Collection 04
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black font-[family-name:var(--font-oswald)] uppercase leading-[0.85] tracking-tighter italic">
                                    New <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-[#B4F000]/50">Drop</span>
                                </h1>
                                <p className="text-white/40 font-mono text-sm mt-4 max-w-md uppercase tracking-wide">
                                    Refresh your loadout with the latest cyber-spec gear. Limited quantities available per sector.
                                </p>
                            </div>
                            <div className="mt-8 md:mt-0">
                                <SortSelect />
                            </div>
                        </div>

                        <Suspense fallback={
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        }>
                            <ProductGrid products={filteredProducts} />
                        </Suspense>

                        {/* Empty State */}
                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center border border-white/10 bg-white/5">
                                <h3 className="text-2xl font-bold font-[family-name:var(--font-oswald)] uppercase text-white/50">
                                    System Error: No Items Found
                                </h3>
                                <p className="text-white/30 font-mono mt-2">Adjust your filter parameters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
