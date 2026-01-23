"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Shield, Plus, Minus, Check } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";
import { ReviewSection } from "./ReviewSection";
import { ProductActivity } from "./ProductActivity";
import { LowStockWarning } from "./LowStockWarning";
import { RelatedProducts } from "./RelatedProducts";

interface ProductDetailClientProps {
    product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"details" | "size" | "reviews">("details");
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const router = useRouter();

    const { addItem } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    const images = product.images?.edges?.map(edge => edge.node) || [];
    const mainImage = images[selectedImage] || product.featuredImage;
    const price = product.priceRange.minVariantPrice;
    const comparePrice = product.priceRange.maxVariantPrice;

    // Calculate discount percentage
    const hasDiscount = parseFloat(comparePrice.amount) > parseFloat(price.amount);
    const discountPercent = hasDiscount
        ? Math.round(((parseFloat(comparePrice.amount) - parseFloat(price.amount)) / parseFloat(comparePrice.amount)) * 100)
        : 0;

    // Extract sizes from product options
    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
    const sizes = sizeOption?.values || [];

    // Generate deterministic rating
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    const rating = 4.2 + (hashCode(product.id) % 8) / 10;
    const reviewCount = 50 + (hashCode(product.id) % 200);

    const handleAddToCart = () => {
        if (!selectedSize && sizes.length > 0) {
            alert("Please select a size");
            return;
        }

        const variant = product.variants?.edges?.[0]?.node;
        addItem({
            id: product.id,
            variantId: variant?.id,
            title: product.title,
            price: parseFloat(price.amount),
            image: mainImage?.url || "",
            quantity,
            size: selectedSize || undefined,
        });
    };

    const handleBuyNow = () => {
        if (!selectedSize && sizes.length > 0) {
            alert("Please select a size");
            return;
        }

        const variant = product.variants?.edges?.[0]?.node;
        addItem({
            id: product.id,
            variantId: variant?.id,
            title: product.title,
            price: parseFloat(price.amount),
            image: mainImage?.url || "",
            quantity,
            size: selectedSize || undefined,
        });
        router.push("/checkout");
    };

    const handleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="min-h-screen bg-rich-black pt-24 pb-24 text-white">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-rich-black/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-white font-bold tracking-tighter">RIIQX</Link>
                    <h1 className="text-sm font-bold text-white/70 truncate uppercase tracking-widest">{product.title}</h1>
                    <div className="w-8"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Sticky Image Carousel */}
                    <div className="sticky top-24 h-fit">
                        {/* Image Carousel */}
                        <div className="relative aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden mb-6 border border-white/5">
                            <Image
                                src={mainImage?.url || ""}
                                alt={mainImage?.altText || product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Navigation Dots */}
                            {images.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                selectedImage === idx ? "bg-cherry-red scale-125" : "bg-white/30 hover:bg-white/50"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "relative w-24 h-24 rounded-xl border-2 flex-shrink-0 overflow-hidden transition-all",
                                            selectedImage === idx ? "border-gold shadow-[0_0_15px_rgba(245,197,24,0.3)]" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.altText || `Product image ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-10 py-4">
                        <ProductActivity productId={product.id} initialViews={Math.floor(Math.random() * 50) + 120} />
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black font-display text-white mb-4 uppercase tracking-tighter leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-3.5 h-3.5",
                                                i < Math.floor(rating) ? "fill-gold text-gold" : "text-white/20"
                                            )}
                                        />
                                    ))}
                                    <span className="text-white font-bold ml-2 text-sm">{rating.toFixed(1)}</span>
                                </div>
                                <span className="text-white/40 text-sm font-medium tracking-wide">({reviewCount} Verified Reviews)</span>
                            </div>
                        </div>

                        {/* Price & Badges */}
                        <div className="flex items-baseline gap-6 pb-8 border-b border-white/10">
                            <span className="text-4xl font-black text-cherry-red tracking-tight">
                                {formatPrice(price.amount, price.currencyCode)}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-xl text-white/30 line-through font-medium">
                                        {formatPrice(comparePrice.amount, comparePrice.currencyCode)}
                                    </span>
                                    <span className="bg-gold text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                                        {discountPercent}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Controls Container */}
                        <div className="space-y-8">
                            {/* Color Selector */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Select Color</h3>
                                <div className="flex gap-3">
                                    <button className="w-12 h-12 bg-[#000000] rounded-full border-2 border-white/20 hover:border-white transition-all shadow-lg"></button>
                                    <button className="w-12 h-12 bg-[#ffffff] rounded-full border-2 border-white/20 hover:border-white transition-all shadow-lg"></button>
                                    <button className="w-12 h-12 bg-[#e31c79] rounded-full border-2 border-white/20 hover:border-white transition-all shadow-lg"></button>
                                </div>
                            </div>

                            {/* Size Selector */}
                            {sizes.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Select Size</h3>
                                        <button
                                            onClick={() => setShowSizeGuide(true)}
                                            className="text-xs text-gold hover:text-white uppercase font-bold tracking-widest transition-colors"
                                        >
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-3">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all uppercase border-2",
                                                    selectedSize === size
                                                        ? "border-cherry-red bg-cherry-red text-white shadow-[0_0_15px_rgba(227,28,121,0.5)]"
                                                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="space-y-4">
                                <LowStockWarning stock={12} />
                                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Quantity</h3>
                                <div className="flex items-center gap-4 bg-white/5 w-fit p-1.5 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="w-4 h-4 text-white" />
                                    </button>
                                    <span className="w-8 text-center text-white font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-cherry-red text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 border-2 border-cherry-red hover:border-white"
                            >
                                Add to Bag
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-lg active:scale-95 border-2 border-white hover:border-gold"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Product Accordions / Details */}
                    <div className="space-y-8 pt-8 border-t border-white/10">
                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold font-display text-white uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-gold"></div>
                                Description
                            </h2>
                            <div className="text-white/60 leading-relaxed prose-invert">
                                <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
                            </div>
                        </div>

                        {/* Material */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold font-display text-white uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-gold"></div>
                                Composition
                            </h2>
                            <p className="text-white/60">
                                100% Premium Cotton. Designed in Paris.
                            </p>
                        </div>
                    </div>

                </div>

                <div className="mt-24 border-t border-white/10 pt-16">
                    <ReviewSection productId={product.id} />
                </div>

                <div className="mt-8">
                    <RelatedProducts />
                </div>
            </div>

            {/* Fixed Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-rich-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <div className="hidden sm:block flex-1">
                        <div className="text-xl font-black text-white">{formatPrice(price.amount, price.currencyCode)}</div>
                        <div className="text-xs text-gold uppercase tracking-widest font-bold">Free global shipping</div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="flex-[2] bg-gradient-to-r from-cherry-red to-red-600 text-white py-4 rounded-full font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(227,28,121,0.5)] transition-all active:scale-95"
                    >
                        Add to Bag
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="hidden md:block flex-1 bg-white text-black py-4 rounded-full font-black uppercase tracking-widest hover:bg-gold transition-all active:scale-95"
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={handleWishlist}
                        className={cn(
                            "p-4 border-2 rounded-full transition-all aspect-square flex items-center justify-center",
                            isInWishlist(product.id)
                                ? "border-cherry-red bg-cherry-red/20"
                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30"
                        )}
                    >
                        <Heart
                            className={cn(
                                "w-6 h-6",
                                isInWishlist(product.id) ? "fill-cherry-red text-cherry-red" : "text-white"
                            )}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
