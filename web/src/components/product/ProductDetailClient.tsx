"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Shield, Plus, Minus, Check } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
    product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"details" | "size" | "reviews">("details");
    const [showSizeGuide, setShowSizeGuide] = useState(false);

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

    const handleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <Link href="/shop" className="text-muted-foreground hover:text-white transition-colors">Shop</Link>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-white font-medium">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse lg:flex-row gap-4 sticky top-24 h-fit">
                        {/* Thumbnails */}
                        {images.length > 0 && (
                            <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 lg:h-[600px] no-scrollbar shrink-0">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "relative w-20 h-24 shrink-0 bg-neutral-900 rounded-lg overflow-hidden border-2 transition-all",
                                            selectedImage === idx ? "border-bewakoof-yellow ring-2 ring-bewakoof-yellow/20" : "border-transparent hover:border-white/30"
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

                        {/* Main Image */}
                        <motion.div
                            className="relative flex-1 aspect-[3/4] bg-neutral-900 overflow-hidden rounded-2xl"
                            layoutId={`product-image-${product.id}`}
                        >
                            <Image
                                src={mainImage?.url || ""}
                                alt={mainImage?.altText || product.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-black" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5 text-black" />
                                    </button>
                                </>
                            )}

                            {/* Zoom Hint / Badge */}
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white pointer-events-none">
                                View Full Screen
                            </div>
                        </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title & Rating */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 font-montserrat">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-5 h-5",
                                                i < Math.floor(rating) ? "fill-bewakoof-yellow text-bewakoof-yellow" : "text-gray-600"
                                            )}
                                        />
                                    ))}
                                    <span className="ml-2 text-white font-bold">{rating.toFixed(1)}</span>
                                </div>
                                <span className="text-muted-foreground">({reviewCount} reviews)</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-black text-white">
                                {formatPrice(price.amount, price.currencyCode)}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-2xl text-muted-foreground line-through">
                                        {formatPrice(comparePrice.amount, comparePrice.currencyCode)}
                                    </span>
                                    <span className="bewakoof-discount text-xl">({discountPercent}% OFF)</span>
                                </>
                            )}
                        </div>

                        {/* Size Selector */}
                        {sizes.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Size</h3>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        className="text-xs text-bewakoof-yellow hover:underline uppercase font-bold"
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
                                                "border-2 rounded-lg py-3 text-sm font-bold transition-all uppercase",
                                                selectedSize === size
                                                    ? "border-bewakoof-yellow bg-bewakoof-yellow text-black"
                                                    : "border-white/20 text-white hover:border-white"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                                >
                                    <Minus className="w-4 h-4 text-white" />
                                </button>
                                <span className="text-xl font-bold text-white w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                                >
                                    <Plus className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bewakoof-btn bewakoof-btn-primary py-4 text-base"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleWishlist}
                                className={cn(
                                    "w-14 h-14 border-2 rounded-lg flex items-center justify-center transition-all",
                                    isInWishlist(product.id)
                                        ? "border-neon-red bg-neon-red/10"
                                        : "border-white/20 hover:border-white"
                                )}
                            >
                                <Heart
                                    className={cn(
                                        "w-6 h-6",
                                        isInWishlist(product.id) ? "fill-neon-red text-neon-red" : "text-white"
                                    )}
                                />
                            </button>
                            <button className="w-14 h-14 border-2 border-white/20 rounded-lg flex items-center justify-center hover:border-white transition-all">
                                <Share2 className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Product Highlights */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                            <div className="flex flex-col items-center text-center gap-2">
                                <Truck className="w-6 h-6 text-bewakoof-yellow" />
                                <span className="text-xs text-muted-foreground">Free Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <RotateCcw className="w-6 h-6 text-bewakoof-yellow" />
                                <span className="text-xs text-muted-foreground">Easy Returns</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <Shield className="w-6 h-6 text-bewakoof-yellow" />
                                <span className="text-xs text-muted-foreground">Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16">
                    <div className="border-b border-white/10 mb-8">
                        <div className="flex gap-8">
                            {["details", "size", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "pb-4 text-sm font-bold uppercase tracking-wider transition-all relative",
                                        activeTab === tab
                                            ? "text-white"
                                            : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {tab === "details" && "Product Details"}
                                    {tab === "size" && "Size & Fit"}
                                    {tab === "reviews" && "Reviews"}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-bewakoof-yellow"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="prose prose-invert max-w-none"
                        >
                            {activeTab === "details" && (
                                <div className="text-muted-foreground">
                                    <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
                                </div>
                            )}
                            {activeTab === "size" && (
                                <div className="text-muted-foreground">
                                    <p>Size guide information will be displayed here.</p>
                                </div>
                            )}
                            {activeTab === "reviews" && (
                                <div className="text-muted-foreground">
                                    <p>Customer reviews will be displayed here.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
