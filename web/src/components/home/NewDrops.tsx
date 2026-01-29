"use client";

import { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TextReveal } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface NewDropsProps {
    products: Product[];
}

export function NewDrops({ products = [] }: NewDropsProps) {
    if (!products.length) return null;

    return (
        <section className="py-32 bg-[#0B0B0B] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-accent fill-accent animate-pulse" />
                            <span className="text-accent text-xs font-black uppercase tracking-widest">Fresh Arrivals</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white font-display italic">
                            <TextReveal direction="up" delay={0.2}>New Drops</TextReveal>
                        </h2>
                    </div>
                    <Link href="/new-arrivals" className="hidden md:block">
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
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-16 text-center md:hidden">
                    <Link href="/new-arrivals">
                        <MagneticButton className="w-full px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all group clip-path-slant-right flex items-center justify-center gap-2">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
