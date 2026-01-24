import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const { handle, title, priceRange, featuredImage } = product;
    const price = priceRange.minVariantPrice;

    return (
        <Link href={`/product/${handle}`} className="group block relative overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
                {featuredImage && (
                    <motion.div
                        className="h-full w-full"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Image
                            src={featuredImage.url}
                            alt={featuredImage.altText || title}
                            width={featuredImage.width || 800}
                            height={featuredImage.height || 1000}
                            className="h-full w-full object-cover transition-opacity duration-300"
                            priority={priority}
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        />
                    </motion.div>
                )}

                {/* Optional: Badge or Status overlay could go here */}
            </div>

            {/* Content - Fade Up on Group Hover */}
            <div className="mt-4 space-y-1">
                <motion.h3
                    className="text-sm font-bold uppercase tracking-widest text-white"
                >
                    {title}
                </motion.h3>

                <motion.div
                    initial={{ opacity: 0.6, y: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                >
                    <span className="text-sm text-white/70 group-hover:text-accent transition-colors">
                        {formatPrice(price.amount, price.currencyCode)}
                    </span>
                </motion.div>

                {/* Text Reveal / Call to Action Effect */}
                <span className="absolute bottom-4 left-0 text-[10px] font-black uppercase tracking-widest text-white opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    View Product
                </span>
            </div>
        </Link>
    );
}
