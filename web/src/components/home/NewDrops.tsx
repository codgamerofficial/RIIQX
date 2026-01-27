"use client";

import { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewDropsProps {
    products: Product[];
}

export function NewDrops({ products = [] }: NewDropsProps) {
    if (!products.length) return null;

    return (
        <section className="py-24 bg-[#0B0B0B]">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white font-display">
                            New Drops
                        </h2>
                        <div className="h-1 w-24 bg-accent mt-4"></div>
                    </div>
                    <span className="text-white/40 text-xs font-mono uppercase tracking-[0.2em] mt-4 md:mt-0">
                        Limited Quantities Available
                    </span>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12"
                >
                    {products.slice(0, 4).map((product) => (
                        <motion.div
                            key={product.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                            }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

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
