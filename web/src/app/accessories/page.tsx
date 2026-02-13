import { ProductGrid } from "@/components/shop/ProductGrid";
import { getCollectionProducts } from "@/lib/shopify";
import { Suspense } from "react";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { SortSelect } from "@/components/shop/SortSelect";
import { Product } from "@/lib/shopify/types";

export const metadata = {
    title: 'Accessories | RIIQX',
    description: 'Cybernetic enhancements and storage modules.',
};

export default async function AccessoriesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { sort, min_price, max_price, category, color, size } = searchParams;
    const sortKey = sort === 'price_high' || sort === 'price_low' ? 'PRICE' :
        sort === 'best_selling' ? 'BEST_SELLING' : 'CREATED';
    const reverse = sort === 'price_low' ? false : true;

    const { products } = await getCollectionProducts({
        handle: 'accessories',
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
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 relative overflow-hidden">
                            {/* Background Text */}
                            <span className="absolute -top-10 -right-10 text-[150px] font-black text-white/5 pointer-events-none select-none">
                                ACCS
                            </span>

                            <div className="relative z-10">
                                <h1 className="text-6xl md:text-8xl font-black font-[family-name:var(--font-oswald)] uppercase leading-[0.85] tracking-tighter">
                                    Accessories<span className="text-[#B4F000]">.</span>
                                </h1>
                                <p className="text-white/40 font-mono text-sm mt-4 max-w-md uppercase tracking-wide">
                                    Cybernetic enhancements and storage modules. Upgrade your daily carrying capacity.
                                </p>
                            </div>
                            <div className="mt-8 md:mt-0 relative z-10">
                                <SortSelect />
                            </div>
                        </div>

                        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading module...</div>}>
                            <ProductGrid products={filteredProducts} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
