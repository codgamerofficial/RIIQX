"use client";

import { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface NewDropsProps {
    products: Product[];
}

export function NewDrops({ products = [] }: NewDropsProps) {
    if (!products.length) return null;

    return (
        <section className="py-24 bg-[#0B0B0B]">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white font-display">
                            New Drops
                        </h2>
                        <span className="text-accent text-sm font-bold uppercase tracking-[0.2em] mt-2 block">
                            Limited Edition
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/new-arrivals">
                        <button className="px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all group">
                            View All <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
