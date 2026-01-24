"use client";

import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: Product[];
    className?: string;
}

export function ProductGrid({ products, className = "" }: ProductGridProps) {
    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12", className)}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
