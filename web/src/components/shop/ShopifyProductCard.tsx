"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";

interface ShopifyProductCardProps {
    product: Product;
}

export function ShopifyProductCard({ product }: ShopifyProductCardProps) {
    const mainImage = product.featuredImage?.url || product.images.edges[0]?.node.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";
    const price = product.priceRange.minVariantPrice;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group block h-full"
        >
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col relative">
                {/* Use handle for the link */}
                <Link href={`/shop/${product.handle}`} className="absolute inset-0 z-10" />

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                        src={mainImage}
                        alt={product.featuredImage?.altText || product.title}
                        fill
                        priority={false}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Quick Add Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                        <button className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-primary hover:text-white transition-colors shadow-lg">
                            <ShoppingBag className="w-4 h-4" />
                            <span>View Details</span>
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-grow flex flex-col justify-between pointer-events-none">
                    <div>
                        {/* Use tags or product type equivalent if available, else standard text */}
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                            Shopify Product
                        </p>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {product.title}
                        </h3>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-white">
                            {formatPrice(price.amount, price.currencyCode)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
