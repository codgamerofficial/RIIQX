"use client";

import { Product } from "@/lib/shopify/types";
import { ProductCardFuture } from "@/components/ProductCardFuture";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface NewDropsProps {
    products: Product[];
}

export function NewDrops({ products = [] }: NewDropsProps) {
    if (!products.length) return null;

    return (
        <section className="py-32 bg-[#0B0B0B] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 halftone-bg pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF0033]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-[#CCFF00] fill-[#CCFF00] animate-pulse" />
                            <span className="text-[#CCFF00] text-xs font-black uppercase tracking-widest">Fresh From The Upside Down</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white font-display italic">
                            <span className="glitch-text" data-text="NEW DROPS">NEW DROPS</span>
                        </h2>
                    </div>
                    <Link href="/collections/new" className="hidden md:block">
                        <MagneticButton className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all group clip-path-slant-right flex items-center gap-2">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                    </Link>
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
                    className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-16"
                >
                    {products.slice(0, 4).map((product) => (
                        <motion.div
                            key={product.id}
                            variants={{
                                hidden: { opacity: 0, y: 50, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: { type: "spring", stiffness: 100, damping: 20 }
                                }
                            }}
                        >
                            <ProductCardFuture product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-16 text-center md:hidden">
                    <Link href="/collections/new">
                        <MagneticButton className="w-full px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all group clip-path-slant-right flex items-center justify-center gap-2">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
