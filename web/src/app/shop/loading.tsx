"use client";

import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { BentoGrid, BentoGridItem } from "@/components/shop/BentoGrid";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40">
            {/* Header */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-8 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 w-32 bg-white/5 rounded" />
                        <div className="h-20 w-64 md:w-96 bg-white/5 rounded" />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
                <BentoGrid>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <BentoGridItem key={i} i={i}>
                            <div className="h-full w-full bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-end">
                                <ProductCardSkeleton />
                            </div>
                        </BentoGridItem>
                    ))}
                </BentoGrid>
            </div>
        </div>
    );
}
