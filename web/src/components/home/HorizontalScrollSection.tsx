"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Product } from "@/lib/shopify/types";

interface HorizontalScrollSectionProps {
    products: Product[];
}

export function HorizontalScrollSection({ products = [] }: HorizontalScrollSectionProps) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative h-[450px] w-[450px] overflow-hidden rounded-2xl bg-neutral-800 border border-white/10 hover:border-primary/50 transition-colors"
                        >
                            {product.featuredImage && (
                                <div
                                    style={{
                                        backgroundImage: `url(${product.featuredImage.url})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
                                    {product.title}
                                </h3>
                                <p className="text-primary font-medium mt-2">New Collection 2025</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
