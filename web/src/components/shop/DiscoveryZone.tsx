"use client";

import { useState } from "react";
import { HoloProductCard } from "./HoloProductCard";
import { ProductOverlay } from "./ProductOverlay";
import { AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    category: 'fashion' | 'electronics';
}

interface DiscoveryZoneProps {
    products: readonly Product[];
    className?: string; // To allow passing grid classes
}

export function DiscoveryZone({ products, className }: DiscoveryZoneProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedProduct = products.find(p => p.id === selectedId);

    return (
        <>
            <div className={className}>
                {products.map((p, i) => (
                    <HoloProductCard
                        key={p.id}
                        product={p}
                        index={i}
                        onClick={() => setSelectedId(p.id)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {selectedId && selectedProduct && (
                    <ProductOverlay
                        product={selectedProduct}
                        onClose={() => setSelectedId(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
