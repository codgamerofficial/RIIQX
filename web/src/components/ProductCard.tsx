import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { Star, Eye, ShoppingBag, Zap } from "lucide-react";
import { ScaleButton } from "./ui/ScaleButton";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useState } from "react";
import { QuickViewModal } from "./product/QuickViewModal";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const { handle, title, priceRange, featuredImage, images, availableForSale, variants } = product;
    const price = priceRange.minVariantPrice;
    const compareAtPrice = priceRange.maxVariantPrice.amount > price.amount ? priceRange.maxVariantPrice : null;

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Calculate Discount Percentage
    const discount = compareAtPrice
        ? Math.round(((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) / parseFloat(compareAtPrice.amount)) * 100)
        : 0;

    const secondImage = images?.edges?.[1]?.node || featuredImage;

    const { addItem } = useCartStore();

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if product has variants (more than 1 or explicit options)
        const hasVariants = (variants?.edges?.length || 0) > 1 || (product.options && product.options.some(o => o.values.length > 1));

        if (hasVariants) {
            // If variants exist, open Quick View instead of blindly adding likely wrong item
            setIsQuickViewOpen(true);
            return;
        }

        // Single variant product - Safe to add directly
        const defaultVariant = variants?.edges?.[0]?.node;
        if (!defaultVariant) {
            setIsQuickViewOpen(true); // Fallback
            return;
        }

        addItem({
            id: product.id,
            variantId: defaultVariant.id,
            title: product.title,
            price: parseFloat(price.amount),
            image: featuredImage?.url || "",
            quantity: 1,
        });
        toast.success("Added to cart");
    }

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickViewOpen(true);
    }

    return (
        <>
            <Link href={`/product/${handle}`} className="group block relative">
                {/* 1. Image Container with Hover Effect */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a] border border-white/5">
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 z-20 bg-accent text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                            -{discount}%
                        </div>
                    )}
                    {/* New Drop Badge (Conditional Mock) */}
                    {!discount && (
                        <div className="absolute top-3 left-3 z-20 bg-white text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                            New
                        </div>
                    )}

                    {/* Wishlist Button (Absolute Top Right) */}
                    <button className="absolute top-3 right-3 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                        <Star className="w-3 h-3" />
                    </button>

                    {featuredImage && (
                        <div className="relative h-full w-full">
                            {/* Secondary Image (Visible on Hover) */}
                            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
                                <Image
                                    src={secondImage?.url || featuredImage.url}
                                    alt={secondImage?.altText || title}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                />
                            </div>

                            {/* Main Image */}
                            <Image
                                src={featuredImage.url}
                                alt={featuredImage.altText || title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                priority={priority}
                                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            />
                        </div>
                    )}

                    {/* Quick Action Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex gap-2 w-full">
                            <button
                                className="flex-1 bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2"
                                onClick={handleQuickView}
                            >
                                <Eye className="w-3 h-3" /> Quick View
                            </button>
                            <button
                                className="flex-1 border border-white/20 backdrop-blur-sm text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
                                onClick={handleQuickAdd}
                            >
                                <ShoppingBag className="w-3 h-3" /> Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Product Details */}
                <div className="mt-4 space-y-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-accent transition-colors line-clamp-1">
                            {title}
                        </h3>
                        {/* Mock Rating */}
                        <div className="flex items-center gap-0.5 opacity-50">
                            <Star className="w-3 h-3 fill-white text-white" />
                            <span className="text-[10px] font-medium">4.8</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white/90">
                            {formatPrice(price.amount, price.currencyCode)}
                        </span>
                        {compareAtPrice && (
                            <span className="text-xs text-white/40 line-through">
                                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <QuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={product}
            />
        </>
    );
}

