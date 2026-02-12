"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/shopify/types";
import { StreetwearProductCard } from "@/components/ui/StreetwearProductCard";
import { FloatingFilterBar } from "@/components/shop/FloatingFilterBar";
import { BentoGrid, BentoGridItem } from "@/components/shop/BentoGrid";
import { motion } from "framer-motion";

interface CollectionClientProps {
    products: Product[];
    category?: string;
}

export function CollectionClient({ products = [], category = "All Products" }: CollectionClientProps) {
    const [selectedSort, setSelectedSort] = useState("featured");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    // 1. Define Filter Options (Mock for now, could be dynamic)
    const filters = [
        {
            id: 'category',
            label: 'Category',
            options: [
                { label: 'Tops', value: 'tops' },
                { label: 'Bottoms', value: 'bottoms' },
                { label: 'Outerwear', value: 'outerwear' },
                { label: 'Accessories', value: 'accessories' }
            ]
        },
        {
            id: 'size',
            label: 'Size',
            options: [
                { label: 'S', value: 'S' },
                { label: 'M', value: 'M' },
                { label: 'L', value: 'L' },
                { label: 'XL', value: 'XL' }
            ]
        }
    ];

    // 2. Client-side Filtering Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Apply filters
        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key].length > 0) {
                // Simplified filtering: check if product type or tags match
                // In a real app, you'd check product.variants or tags specifically
                result = result.filter(p => {
                    const tags = p.tags || [];
                    return activeFilters[key].some(val =>
                        tags.includes(val) || p.productType?.toLowerCase() === val.toLowerCase()
                    );
                });
            }
        });

        // Apply sorting
        if (selectedSort === 'price-asc') {
            result.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
        } else if (selectedSort === 'price-desc') {
            result.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
        }
        // 'featured' relies on initial order (usually CREATED_AT from Shopify)

        return result;
    }, [products, activeFilters, selectedSort]);

    const handleFilterChange = (groupId: string, value: string) => {
        setActiveFilters(prev => {
            const group = prev[groupId] || [];
            if (group.includes(value)) {
                return { ...prev, [groupId]: group.filter(v => v !== value) };
            } else {
                return { ...prev, [groupId]: [...group, value] };
            }
        });
    };

    const handleClearFilters = () => setActiveFilters({});

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40">
            {/* Header */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8"
                >
                    <div>
                        <p className="text-sm font-mono text-white/50 mb-2 uppercase tracking-widest">RIIQX / Collection</p>
                        <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] text-white">
                            {category}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-[#B4F000] tracking-widest">
                            [{filteredProducts.length} ARTIFACTS FOUND]
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Bento Grid */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
                <BentoGrid>
                    {filteredProducts.map((product, i) => (
                        <BentoGridItem key={product.id} i={i}>
                            <StreetwearProductCard product={product} className="h-full" />
                        </BentoGridItem>
                    ))}
                </BentoGrid>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/30 uppercase tracking-widest">No artifacts found matching criteria.</p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 text-[#B4F000] underline"
                        >
                            Reset Protocol
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Filters */}
            <FloatingFilterBar
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                currentSort={selectedSort}
                onSortChange={setSelectedSort}
            />
        </div>
    );
}
