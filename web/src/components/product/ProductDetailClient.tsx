"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Shield, RotateCcw, Truck, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { RelatedProducts } from "./RelatedProducts";
import { ProductGallery } from "./ProductGallery";

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

function FitGuideModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-[10px] uppercase tracking-[0.2em] text-[#B4F000] hover:text-white underline decoration-[#B4F000]/30 hover:decoration-white underline-offset-4 flex items-center gap-1"
            >
                RIIQX Fit OS <Shield className="w-3 h-3" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z[999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm z-[200]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#0A0A0A] border border-white/10 w-full max-w-md p-6 relative shadow-2xl"
                        >
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><Minus className="w-6 h-6 rotate-45" /></button>
                            <h3 className="text-xl font-display font-black uppercase text-white mb-6">RIIQX Fit OS <span className="text-[#B4F000]">v2.0</span></h3>

                            <div className="space-y-4 font-mono text-xs text-white/70">
                                <p>Our cuts are engineered for an <strong className="text-white">Oversized Street Fit</strong>.</p>
                                <div className="grid grid-cols-3 gap-2 text-center py-4">
                                    <div className="p-3 bg-white/5 border border-white/5">
                                        <div className="text-white font-bold mb-1">HEIGHT</div>
                                        <div>&lt; 5'7"</div>
                                        <div className="text-[#B4F000] mt-1 font-bold">SIZE S</div>
                                    </div>
                                    <div className="p-3 bg-white/5 border border-white/5">
                                        <div className="text-white font-bold mb-1">5'8" - 6'0"</div>
                                        <div>Normal</div>
                                        <div className="text-[#B4F000] mt-1 font-bold">SIZE M</div>
                                    </div>
                                    <div className="p-3 bg-white/5 border border-white/5">
                                        <div className="text-white font-bold mb-1">6'1" +</div>
                                        <div>Tall</div>
                                        <div className="text-[#B4F000] mt-1 font-bold">SIZE L/XL</div>
                                    </div>
                                </div>
                                <p className="italic text-white/40">*If you prefer a standard fit, size down once.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Accordion states
    const [openSection, setOpenSection] = useState<string | null>("description");

    const images = product.images?.edges?.map(edge => edge.node) || [];
    const price = product.priceRange.minVariantPrice;

    // Extract options
    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
    const sizes = sizeOption?.values || [];
    const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');
    const colors = colorOption?.values || [];

    // Get selected variant
    const selectedVariant = product.variants.edges.find(edge => {
        const options = edge.node.selectedOptions;
        const sizeMatch = !sizes.length || (selectedSize && options.some(o => o.name.toLowerCase() === 'size' && o.value === selectedSize));
        const colorMatch = !colors.length || (selectedColor && options.some(o => (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') && o.value === selectedColor));
        return sizeMatch && colorMatch;
    })?.node;

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(prev => prev - 1);
        } else if (type === 'inc') {
            // Optional: check against inventory if available
            setQuantity(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* --- LEFT: GALLERY (Carousel) --- */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={images} title={product.title} />
                    </div>

                    {/* --- RIGHT: DETAILS (Sticky) --- */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-32 space-y-8">

                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-4 mb-6 flex-wrap">
                                    <span className="bg-accent text-black px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] transform -skew-x-12">
                                        Official Drop
                                    </span>

                                    {/* Accessory Badges */}
                                    {(product.title.toLowerCase().includes('magsafe') || product.tags?.includes('magsafe')) && (
                                        <span className="border border-[#B4F000] text-[#B4F000] px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] transform -skew-x-12">
                                            MagSafe Ready
                                        </span>
                                    )}
                                    {['bottle', 'mug', 'cup'].some(k => product.title.toLowerCase().includes(k) || product.productType?.toLowerCase().includes(k)) && (
                                        <span className="border border-[#B4F000] text-[#B4F000] px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] transform -skew-x-12">
                                            Thermal Grade
                                        </span>
                                    )}

                                    {/* Mock Rating */}
                                    <div className="flex items-center gap-1 text-white/50 text-[10px] uppercase tracking-widest font-bold ml-auto">
                                        <Star className="w-3 h-3 text-accent fill-accent" /> 4.9 Rated
                                    </div>
                                </div>

                                {/* Hype Pulse - Scarcity Engine */}
                                <div className="flex items-center gap-4 mb-2 text-xs font-mono text-accent/80">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                        </span>
                                        {Math.floor(Math.random() * (45 - 12) + 12)} people viewing
                                    </div>
                                    <span className="text-white/20">|</span>
                                    <div className="text-red-500 font-bold animate-pulse">
                                        Low Stock in {selectedSize || "your size"}
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-[0.9] mb-6 text-white mix-blend-difference">
                                    {product.title}
                                </h1>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                                        {formatPrice(price.amount, price.currencyCode)}
                                    </p>
                                    <ShareButton
                                        title={product.title}
                                        className="h-10 w-10 border border-white/10 bg-white/5 text-white/60 hover:text-[#B4F000] hover:border-[#B4F000]/50"
                                    />
                                </div>
                            </div>

                            {/* Separator - Aggressive */}
                            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-1/3 bg-accent" />
                            </div>

                            {/* Options */}
                            <div className="space-y-8">
                                {/* Colors */}
                                {colors.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-black">Select Color</span>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-white font-bold">{selectedColor}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={cn(
                                                        "h-12 px-8 flex items-center justify-center transition-all text-xs font-black uppercase tracking-widest clip-path-slant",
                                                        selectedColor === color
                                                            ? "bg-white text-black translate-x-1 translate-y-[-2px] shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
                                                            : "bg-white/5 text-white hover:bg-white/10 hover:translate-x-1 hover:-translate-y-1"
                                                    )}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {sizes.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-black">Select Size</span>
                                            <FitGuideModal />
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={cn(
                                                        "h-14 flex items-center justify-center transition-all text-sm font-black italic",
                                                        selectedSize === size
                                                            ? "bg-white text-black skew-x-[-6deg]"
                                                            : "bg-white/5 text-white hover:bg-white/10 skew-x-[-6deg]"
                                                    )}
                                                >
                                                    <span className="skew-x-[6deg]">{size}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity & Actions */}
                            <div className="space-y-6 pt-4">
                                <div className="flex gap-4 h-16">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center bg-white/5 px-2 gap-2 w-36 justify-between border border-white/5 hover:border-white/20 transition-colors">
                                        <button
                                            onClick={() => handleQuantityChange('dec')}
                                            className="text-white/50 hover:text-white hover:bg-white/10 transition-all p-3 h-full"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-display font-black text-xl w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('inc')}
                                            className="text-white/50 hover:text-white hover:bg-white/10 transition-all p-3 h-full"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Add To Cart */}
                                    <AddToCartButton
                                        product={product}
                                        variant={selectedVariant}
                                        quantity={quantity}
                                        className="flex-1 h-full text-base uppercase tracking-[0.2em] font-black bg-accent text-black hover:bg-white hover:scale-[1.01] transition-all"
                                    />
                                </div>

                                <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.15em] text-center text-white/30 pt-4 font-bold">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-3 h-3" /> <span className="hidden md:inline">Global Shipping</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-3 h-3" /> <span className="hidden md:inline">Secure Checkout</span>
                                    </div>
                                    <div className="w-px h-3 bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <RotateCcw className="w-3 h-3" /> <span className="hidden md:inline">30-Day Returns</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info Accordions - Aggressive */}
                            <div className="border-t-2 border-white/10 pt-6 space-y-1">
                                {/* Description */}
                                <div className="group border-b border-white/5 pb-1">
                                    <button
                                        onClick={() => toggleSection('description')}
                                        className="w-full flex justify-between items-center py-4 text-sm font-black uppercase tracking-widest hover:text-accent transition-all hover:pl-2"
                                    >
                                        Description
                                        {openSection === 'description' ? <Minus className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-white/30 group-hover:text-white" />}
                                    </button>
                                    <AnimatePresence>
                                        {openSection === 'description' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    className="pb-6 prose prose-invert prose-sm text-white/90 [&_*]:text-white/90 [&_p]:text-white/90 [&_strong]:text-white [&_li]:text-white/90 font-mono text-xs leading-loose pl-2 border-l-2 border-accent/50"
                                                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Spec Sheet */}
                                <div className="group border-b border-white/5 pb-1">
                                    <button
                                        onClick={() => toggleSection('spec-sheet')}
                                        className="w-full flex justify-between items-center py-4 text-sm font-black uppercase tracking-widest hover:text-accent transition-all hover:pl-2"
                                    >
                                        Spec Sheet
                                        {openSection === 'spec-sheet' ? <Minus className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-white/30 group-hover:text-white" />}
                                    </button>
                                    <AnimatePresence>
                                        {openSection === 'spec-sheet' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-6 pl-2 border-l-2 border-accent/50 space-y-4 font-mono text-xs text-white/80">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Material</span>
                                                            <span className="font-bold text-white">100% Cotton Drill</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Weight</span>
                                                            <span className="font-bold text-white">Heavyweight (320GSM)</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Fit</span>
                                                            <span className="font-bold text-white">Boxy / Oversized</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-white/40 block mb-1 uppercase tracking-wider text-[10px]">Origin</span>
                                                            <span className="font-bold text-white">Made in Italy</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- RELATED --- */}
                <div className="mt-40 space-y-32">
                    <div className="relative">
                        <div className="absolute -top-20 left-0 text-[10rem] font-black text-white/5 select-none font-display leading-none z-0">
                            RELATED
                        </div>
                        <div className="relative z-10">
                            <RelatedProducts products={relatedProducts} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MOBILE STICKY BAR --- */}
            <div className="fixed bottom-0 left-0 w-full bg-[#050505]/80 backdrop-blur-xl border-t border-white/10 p-4 z-[100] md:hidden flex items-center gap-4 safe-area-bottom">
                <div className="flex-1">
                    <p className="text-white text-xs font-black uppercase tracking-widest truncate">{product.title}</p>
                    <p className="text-accent text-xs font-mono">{formatPrice(price.amount, price.currencyCode)}</p>
                </div>
                <AddToCartButton
                    product={product}
                    variant={selectedVariant}
                    quantity={quantity}
                    className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest"
                />
            </div>
        </div>
    );
}
