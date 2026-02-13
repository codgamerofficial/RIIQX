import { getProducts } from "@/lib/shopify";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Product } from "@/lib/shopify/types";
import { SortSelect } from "@/components/shop/SortSelect";
import { Suspense } from "react";

export const metadata = {
    title: 'Best Sellers | RIIQX',
    description: 'Most wanted gear. Join the movement.',
};

export default async function BestSellersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { sort, min_price, max_price, category, color, size } = searchParams;
    const sortKey = sort === 'price_high' || sort === 'price_low' ? 'PRICE' :
        sort === 'newest' ? 'CREATED_AT' : 'BEST_SELLING';
    const reverse = sort === 'price_low' ? false : true;

    // Fetch products sorted by best selling
    const { products } = await getProducts({ sortKey, reverse, limit: 100 });

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

    const availableTypes = Array.from(new Set(products.map(p => p.productType))).filter(Boolean);
    const availableColors = Array.from(new Set(products.flatMap(p => p.options.find(o => o.name === 'Color')?.values || [])));
    const availableSizes = Array.from(new Set(products.flatMap(p => p.options.find(o => o.name === 'Size')?.values || [])));

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    <ProductFilters
                        availableTypes={availableTypes}
                        availableSizes={availableSizes}
                        availableColors={availableColors}
                    />

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-white/10 pb-6 relative">
                            <div>
                                <h1 className="text-6xl md:text-8xl font-black font-[family-name:var(--font-oswald)] uppercase leading-[0.85] tracking-tighter text-white">
                                    Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white">Sellers</span>
                                </h1>
                                <p className="text-[#B4F000] font-mono text-sm mt-4 uppercase tracking-widest">
                                    // High Demand / Low Stock / Act Fast
                                </p>
                            </div>
                            <div className="mt-8 md:mt-0">
                                <SortSelect />
                            </div>
                            {/* Decorative glow */}
                            <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-[#B4F000] shadow-[0_0_10px_#B4F000]" />
                        </div>

                        <Suspense fallback={<div className="text-white/50 font-mono">Loading data...</div>}>
                            <ProductGrid products={filteredProducts} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
