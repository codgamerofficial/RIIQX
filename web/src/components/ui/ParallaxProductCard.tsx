"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HypeButton } from "@/components/ui/HypeButton";

interface Product {
    id: string;
    title: string;
    handle: string;
    featuredImage: {
        url: string;
        altText: string;
    };
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
}

export function ParallaxProductCard({ product, index }: { product: Product; index: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="perspective-1000"
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="group relative w-full aspect-[4/5] bg-[#0A0A0A] border border-white/5 hover:border-[#B4F000]/50 transition-colors duration-500 rounded-none overflow-hidden"
            >
                {/* ═══ IMAGE LAYER (Depth 1) ═══ */}
                <div
                    className="absolute inset-0 z-0 transform transition-transform duration-500 group-hover:scale-110"
                    style={{ transform: "translateZ(-50px)" }}
                >
                    <Image
                        src={product.featuredImage?.url || "/placeholder.jpg"}
                        alt={product.featuredImage?.altText || product.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                </div>

                {/* ═══ HOLOGRAPHIC OVERLAY (Depth 2) ═══ */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* ═══ CONTENT LAYER (Depth 3) ═══ */}
                <div
                    className="absolute inset-0 z-20 p-6 flex flex-col justify-end transform"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <h3 className="text-xl font-black font-[family-name:var(--font-oswald)] uppercase text-white mb-1 tracking-wider group-hover:text-[#B4F000] transition-colors">
                        {product.title}
                    </h3>
                    <p className="text-sm font-mono text-white/60 mb-4">
                        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                    </p>

                    <div className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/product/${product.handle}`} className="block w-full">
                            <HypeButton size="sm" className="w-full">
                                SECURE DROP
                            </HypeButton>
                        </Link>
                    </div>
                </div>

                {/* ═══ SHINE EFFECT ═══ */}
                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-20 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent transform -translate-x-full group-hover:animate-shimmer" />
            </motion.div>
        </motion.div>
    );
}
