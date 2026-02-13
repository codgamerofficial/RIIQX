"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/shopify/types";
import { StreetwearProductCard } from "@/components/ui/StreetwearProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { BentoGrid, BentoGridItem } from "@/components/shop/BentoGrid";
import { motion } from "framer-motion";

interface CollectionClientProps {
    products: Product[];
    category?: string;
}

export function CollectionClient({ products = [], category = "All Products" }: CollectionClientProps) {
    const searchParams = useSearchParams();
    const [selectedSort, setSelectedSort] = useState("featured");

    // 1. Dynamic Data Extraction
    const { availableTypes, availableSizes, availableColors, priceRange } = useMemo(() => {
        const types = new Set<string>();
        const sizes = new Set<string>();
        const colors = new Set<string>();
        let min = Infinity;
        let max = -Infinity;

        products.forEach(p => {
            // Types & Categories
            if (p.productType) types.add(p.productType);

            // "Smart" Grouping for Accessories
            const lowerType = p.productType?.toLowerCase() || '';
            const lowerTitle = p.title.toLowerCase();
            const isAccessory = ['mug', 'bottle', 'backcover', 'case', 'iphone', 'sticker', 'sock', 'cap', 'hat', 'beanie', 'mask'].some(k =>
                lowerType.includes(k) || lowerTitle.includes(k)
            );
            if (isAccessory) types.add('Accessories');

            // Price
            if (p.priceRange) {
                const pMin = parseFloat(p.priceRange.minVariantPrice.amount);
                const pMax = parseFloat(p.priceRange.maxVariantPrice.amount);
                if (pMin < min) min = pMin;
                if (pMax > max) max = pMax;
            }

            // Options (Size, Color, Specs)
            p.options?.forEach(opt => {
                const name = opt.name.toLowerCase();
                if (name === 'size' || name === 'specs' || name === 'capacity' || name === 'storage') {
                    opt.values.forEach(v => sizes.add(v));
                } else if (name === 'color' || name === 'colorway' || name === 'colour') {
                    opt.values.forEach(v => colors.add(v));
                }
            });
        });

        // Fallback for prices if no products
        if (min === Infinity) min = 0;
        if (max === -Infinity) max = 10000;

        return {
            availableTypes: Array.from(types).sort(),
            availableSizes: Array.from(sizes).sort(),
            availableColors: Array.from(colors).sort(),
            priceRange: { min, max }
        };
    }, [products]);

    // 2. Client-side Filtering Logic (URL Based)
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Read params
        const categoryParam = searchParams.get('category');
        const colorParam = searchParams.get('color');
        const sizeParam = searchParams.get('size');
        const minPriceParam = searchParams.get('min_price');
        const maxPriceParam = searchParams.get('max_price');

        // Category Filter
        if (categoryParam && categoryParam !== 'All') {
            if (categoryParam === 'Accessories') {
                // Smart "Accessories" matching
                result = result.filter(p => {
                    const t = (p.productType || '').toLowerCase();
                    const title = p.title.toLowerCase();
                    const isAccessoryKeyword = ['mug', 'bottle', 'backcover', 'case', 'iphone', 'sticker', 'sock', 'cap', 'hat', 'beanie', 'mask'].some(k =>
                        t.includes(k) || title.includes(k)
                    );
                    return t === 'accessories' || isAccessoryKeyword;
                });
            } else {
                result = result.filter(p => p.productType === categoryParam);
            }
        }

        // Color Filter
        if (colorParam) {
            result = result.filter(p => {
                const colorOption = p.options.find(o =>
                    ['color', 'colorway', 'colour'].includes(o.name.toLowerCase())
                );
                return colorOption?.values.some(v => v.toLowerCase() === colorParam.toLowerCase());
            });
        }

        // Size Filter
        if (sizeParam) {
            result = result.filter(p => {
                const sizeOption = p.options.find(o =>
                    ['size', 'specs', 'capacity', 'storage'].includes(o.name.toLowerCase())
                );
                return sizeOption?.values.some(v => v.toLowerCase() === sizeParam.toLowerCase());
            });
        }

        // Price Filter
        if (minPriceParam) {
            result = result.filter(p => parseFloat(p.priceRange.minVariantPrice.amount) >= parseFloat(minPriceParam));
        }
        if (maxPriceParam) {
            result = result.filter(p => parseFloat(p.priceRange.minVariantPrice.amount) <= parseFloat(maxPriceParam));
        }

        // Sorting
        if (selectedSort === 'price-asc') {
            result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
        } else if (selectedSort === 'price-desc') {
            result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
        }

        return result;
    }, [products, searchParams, selectedSort]);

    const handleClearFilters = () => {
        // ProductFilters handles URL clearing
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black pt-32 pb-40">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* Header */}
            <div className="max-w-[1800px] mx-auto px-6 mb-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 bg-[#B4F000] rounded-full animate-pulse" />
                            <p className="text-xs font-mono text-[#B4F000] uppercase tracking-[0.2em] font-bold">RIIQX / Collection</p>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] font-oswald text-white mix-blend-difference">
                            {category}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm">
                            <span className="text-xs font-mono text-[#B4F000] tracking-widest font-bold">
                                [{filteredProducts.length} ARTIFACTS FOUND]
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-[1800px] mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12">

                {/* Sidebar Filters */}
                <ProductFilters
                    availableTypes={availableTypes}
                    availableSizes={availableSizes}
                    availableColors={availableColors}
                    minPrice={priceRange.min}
                    maxPrice={priceRange.max}
                />

                {/* Product Grid */}
                <div className="flex-1">
                    <BentoGrid>
                        {filteredProducts.map((product, i) => (
                            <BentoGridItem key={product.id} i={i}>
                                <StreetwearProductCard product={product} className="h-full" />
                            </BentoGridItem>
                        ))}
                    </BentoGrid>

                    {filteredProducts.length === 0 && (
                        <div className="w-full text-center py-32 border border-dashed border-white/10 rounded-sm bg-white/[0.02]">
                            <p className="text-white/30 uppercase tracking-widest font-mono text-xs mb-4">No artifacts found matching criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
