"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { GamifiedAddToCart } from "@/components/product/GamifiedAddToCart";
import { HypeButton } from "@/components/ui/HypeButton";
import ProductViewer3D from "@/components/product/ProductViewer3D";
import { StylistWidget } from "@/components/product/StylistWidget";
import { Box, ImageIcon, Ruler, Share2, Sparkles, Truck, Shield, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductControlPanelProps {
    product: Product;
    relatedProducts: Product[];
}

export function ProductControlPanel({ product, relatedProducts }: ProductControlPanelProps) {
    const [show3D, setShow3D] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'shipping'>('details');


    const price = product.priceRange.minVariantPrice;

    // Dynamic Options Logic
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        if (product.variants.edges[0]) {
            product.variants.edges[0].node.selectedOptions.forEach(opt => {
                initial[opt.name] = opt.value;
            });
        }
        return initial;
    });

    const handleOptionChange = (name: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [name]: value }));
    };

    // Find the variant that matches ALL selected options
    const selectedVariant = product.variants.edges.find(edge => {
        return edge.node.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value);
    })?.node || product.variants.edges[0]?.node;

    // Check if current selection is available
    const isAvailable = selectedVariant?.availableForSale ?? false;

    // SORT IMAGES: Put the selected variant's image first
    const images = product.images?.edges?.map(edge => edge.node) || [];
    if (selectedVariant?.image?.url) {
        const variantImageIndex = images.findIndex(img => img.url === selectedVariant.image?.url);
        if (variantImageIndex > -1) {
            const [variantImage] = images.splice(variantImageIndex, 1);
            images.unshift(variantImage);
        }
    }

    return (
        <div className="min-h-[100dvh] bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black">
            <div className="lg:grid lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px] min-h-[100dvh]">

                {/* ════ LEFT: VISUALIZERS ════ */}
                <div className="relative bg-[#080808]">

                    {/* View Switcher/Interactive Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 p-1 flex rounded-sm">
                            <button
                                onClick={() => setShow3D(false)}
                                className={cn(
                                    "p-3 rounded-sm transition-all",
                                    !show3D ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "text-white/50 hover:text-white"
                                )}
                            >
                                <ImageIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShow3D(true)}
                                className={cn(
                                    "p-3 rounded-sm transition-all",
                                    show3D ? "bg-[#B4F000] text-black shadow-[0_0_15px_rgba(180,240,0,0.5)]" : "text-white/50 hover:text-white"
                                )}
                            >
                                <Box className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {show3D ? (
                        <div className="h-[50dvh] lg:h-[100dvh] w-full relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#111] to-[#050505]">
                            <ProductViewer3D className="w-full h-full" modelUrl={undefined} />
                            <div className="absolute bottom-10 left-10 pointer-events-none">
                                <span className="text-[#B4F000] font-black font-[family-name:var(--font-oswald)] text-4xl uppercase opacity-20 select-none">
                                    3D INTERACTIVE
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[50dvh] lg:h-[100dvh] overflow-y-auto hide-scrollbar snap-y snap-mandatory scroll-smooth">
                            {images.map((img, i) => (
                                <div key={i} className="w-full h-full snap-start relative flex items-center justify-center bg-[#050505]">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] opacity-50 pointer-events-none z-10" />
                                    <Image
                                        src={img.url}
                                        alt={img.altText || product.title}
                                        fill
                                        className="object-contain p-12 lg:p-24 relative z-0 hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                        priority={i === 0}
                                    />
                                    <div className="absolute bottom-8 right-8 text-xs font-bold font-mono text-white/30 bg-black/80 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
                                        IMG_00{i + 1} // RAW
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ════ RIGHT: CONTROL PANEL ════ */}
                <div className="relative flex flex-col h-full lg:h-[100dvh] overflow-y-auto bg-[#050505]">
                    <div className="p-8 lg:p-12 flex flex-col min-h-full pb-32 relative safe-area-inset-bottom">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B4F000]/5 blur-[100px] pointer-events-none" />

                        {/* Heading */}
                        <div className="mb-10 relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 bg-[#B4F000]/10 border border-[#B4F000] text-[#B4F000] text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(180,240,0,0.2)]">
                                    New Drop // FW26
                                </span>
                                <HypeButton variant="ghost" size="sm" className="hidden lg:flex hover:bg-white/5" onClick={() => { }}>
                                    <Share2 className="w-4 h-4" />
                                </HypeButton>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] font-[family-name:var(--font-oswald)] mb-4 text-white">
                                {product.title}
                            </h1>
                            <p className="text-white/40 text-sm font-mono tracking-widest uppercase flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#B4F000] rounded-full animate-pulse" />
                                {product.tags?.[0] || "STREETWEAR CORE"}
                            </p>
                        </div>

                        {/* Price & Stock */}
                        <div className="mb-10 flex items-end gap-6 relative z-10">
                            <span className="text-5xl lg:text-6xl font-bold font-mono text-[#B4F000] tracking-tighter drop-shadow-[0_0_15px_rgba(180,240,0,0.3)]">
                                {formatPrice(selectedVariant?.price.amount || price.amount, selectedVariant?.price.currencyCode || price.currencyCode)}
                            </span>
                            <div className={`flex items-center gap-2 mb-2 px-3 py-1 rounded-full border ${isAvailable ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {isAvailable ? "In Stock" : "Sold Out"}
                                </span>
                            </div>
                        </div>

                        {/* Control Grid */}
                        <div className="space-y-8 mb-12 relative z-10">
                            {product.options.map(option => (
                                <div key={option.id}>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                                            Select {option.name}
                                        </span>
                                        {option.name.toLowerCase() === 'size' && (
                                            <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider font-bold">
                                                <Ruler className="w-3 h-3" /> Size Guide
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {option.values.map(value => {
                                            const isSelected = selectedOptions[option.name] === value;
                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() => handleOptionChange(option.name, value)}
                                                    className={cn(
                                                        "h-12 px-6 min-w-[4rem] text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group clip-path-slant-right-mobile",
                                                        isSelected
                                                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105"
                                                            : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <motion.div
                                                            layoutId={`glow-${option.name}`}
                                                            className="absolute inset-0 bg-white/20 blur-md"
                                                        />
                                                    )}
                                                    <span className="relative z-10">{value}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 mb-12 relative z-10">
                            <GamifiedAddToCart
                                product={product}
                                variant={selectedVariant}
                                quantity={1}
                                className="w-full h-16 text-lg font-black tracking-[0.15em] uppercase bg-[#B4F000] text-black hover:bg-[#a3d900] hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(180,240,0,0.4)] transition-all duration-300 clip-path-slant-right"
                            />

                            <StylistWidget product={product} />
                        </div>

                        {/* Details Tabs */}
                        <div className="pt-8 mt-auto relative z-10">
                            <div className="flex gap-8 mb-6">
                                {['details', 'shipping'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={cn(
                                            "text-xs font-bold uppercase tracking-[0.2em] transition-colors relative",
                                            activeTab === tab ? "text-[#B4F000]" : "text-white/30 hover:text-white"
                                        )}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="tab-indicator"
                                                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#B4F000] shadow-[0_0_10px_#B4F000]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-white/60 text-sm leading-relaxed font-light"
                                >
                                    {activeTab === 'details' ? (
                                        <div className="space-y-6">
                                            <p className="font-mono text-xs leading-relaxed tracking-wide opacity-80">
                                                {product.description || "NO DATA AVAILABLE // CLASSIFIED"}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                                                    <div className="flex items-center gap-2 text-[#B4F000] mb-1">
                                                        <Shield className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Authentic</span>
                                                    </div>
                                                    <span className="text-[10px] text-white/40">Verified by RIIQX</span>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-sm border border-white/5">
                                                    <div className="flex items-center gap-2 text-[#B4F000] mb-1">
                                                        <Sparkles className="w-4 h-4" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Premium</span>
                                                    </div>
                                                    <span className="text-[10px] text-white/40">Top-Tier Materials</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 font-mono text-xs tracking-wide">
                                            <div className="flex items-center gap-3 text-white/80">
                                                <Truck className="w-4 h-4 text-[#B4F000]" />
                                                <span>Global Priority Shipping (3-5 Days)</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white/80">
                                                <RotateCcw className="w-4 h-4 text-[#B4F000]" />
                                                <span>30-Day 'No Questions' Return Protocol</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
