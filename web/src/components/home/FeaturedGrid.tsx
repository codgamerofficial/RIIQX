"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StreetwearProductCard } from "@/components/ui/StreetwearProductCard";
import { HypeButton } from "@/components/ui/HypeButton";
import { ArrowRight } from "lucide-react";

import { Product } from "@/lib/shopify/types";

interface FeaturedGridProps {
    products: Product[];
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

export default function FeaturedGrid({ products = [] }: FeaturedGridProps) {
    // Fallback if no products
    if (!products || products.length === 0) return null;

    return (
        <section className="relative bg-[#050505] py-32 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B4F000] rounded-full filter blur-[150px] opacity-5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00F0FF] rounded-full filter blur-[120px] opacity-5 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#B4F000] font-mono text-sm tracking-[0.2em] uppercase mb-2 block">
                            /// New Arrivals
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white font-[family-name:var(--font-oswald)]">
                            Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Drops</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Link href="/shop">
                            <HypeButton variant="outline" className="hidden md:flex">
                                VIEW ALL DROPS <ArrowRight className="w-4 h-4 ml-2" />
                            </HypeButton>
                        </Link>
                    </motion.div>
                </div>

                {/* Product Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                >
                    {products.slice(0, 3).map((product, index) => ( // Show top 3
                        <StreetwearProductCard key={product.id} product={product} />
                    ))}
                </motion.div>

                {/* Mobile View All */}
                <div className="mt-12 flex justify-center md:hidden">
                    <Link href="/shop">
                        <HypeButton variant="outline" className="w-full">
                            VIEW ALL DROPS
                        </HypeButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
