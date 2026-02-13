import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/ShareButton";

interface StreetwearProductCardProps {
    product: Product;
    priority?: boolean;
    className?: string;
}

export function StreetwearProductCard({ product, priority = false, className }: StreetwearProductCardProps) {
    const { addItem } = useWishlistStore();

    // Format Price
    const priceAmount = parseFloat(product.priceRange.minVariantPrice.amount);
    const currency = product.priceRange.minVariantPrice.currencyCode;
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(priceAmount);

    // Accessory Logic
    const lowerType = (product.productType || '').toLowerCase();
    const lowerTitle = product.title.toLowerCase();

    // Detect Tech
    const isPhoneCase = lowerType.includes('case') || lowerType.includes('cover') || lowerTitle.includes('iphone');
    const isMagSafe = lowerTitle.includes('magsafe') || product.tags?.includes('magsafe');

    // Detect Lifestyle
    const isDrinkware = lowerType.includes('bottle') || lowerType.includes('mug') || lowerTitle.includes('bottle') || lowerTitle.includes('mug');
    const isAccessory = isPhoneCase || isDrinkware || lowerType.includes('accessory');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("group relative bg-[#0A0A0A] border border-white/10 hover:border-[#B4F000] transition-colors duration-300", className)}
        >
            {/* ═ TOP BAR ═ */}
            <div className="flex justify-between items-center p-3 border-b border-white/10 bg-[#080808] relative z-20">
                <span className="text-[9px] font-mono text-[#B4F000] uppercase tracking-widest opacity-80 pl-2">
                    //{product.handle.slice(0, 8)}__V2
                </span>

                <div className="flex items-center gap-2">
                    {/* Share Action */}
                    <ShareButton
                        title={product.title}
                        url={`/product/${product.handle}`}
                        className="w-6 h-6 bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20"
                    />

                    {/* Status Indicator */}
                    <div className="flex gap-2 items-center px-1.5 py-0.5 border border-[#B4F000]/20 rounded-full bg-[#B4F000]/5">
                        <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-[#B4F000] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                        <span className="text-[8px] md:text-[9px] font-bold text-[#B4F000] uppercase tracking-widest hidden md:inline">LIVE</span>
                    </div>
                </div>
            </div>

            {/* ═ IMAGE CONTAINER ═ */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                <Link href={`/product/${product.handle}`} className="block w-full h-full">
                    {product.featuredImage ? (
                        <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            priority={priority}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="text-white/20 font-mono text-xs">NO IMAGE</span>
                        </div>
                    )}
                </Link>

                {/* Accessory Specific Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {isMagSafe && (
                        <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-bold uppercase tracking-widest text-[#B4F000]">
                            MAGSAFE READY
                        </span>
                    )}
                    {isDrinkware && (
                        <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-bold uppercase tracking-widest text-white">
                            INSULATED
                        </span>
                    )}
                    {/* Dynamic Specs */}
                    {(product.options.find(o => o.name.toLowerCase().includes('device') || o.name.toLowerCase().includes('model'))?.values[0]) && (
                        <span className="px-2 py-1 bg-[#B4F000] text-black text-[8px] font-bold uppercase tracking-widest">
                            {product.options.find(o => o.name.toLowerCase().includes('device') || o.name.toLowerCase().includes('model'))?.values[0]}
                        </span>
                    )}
                    {(product.options.find(o => o.name.toLowerCase().includes('capacity'))?.values[0]) && (
                        <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-bold uppercase tracking-widest text-white">
                            {product.options.find(o => o.name.toLowerCase().includes('capacity'))?.values[0]}
                        </span>
                    )}
                </div>

                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* ═ QUICK ACTIONS (Bottom Slide-in) ═ */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                        }}
                        className={cn(
                            "w-full py-3 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 clip-path-slant-right transition-colors",
                            isAccessory
                                ? "bg-white text-black hover:bg-gray-200"
                                : "bg-[#B4F000] text-black hover:bg-[#c2ff0a]"
                        )}
                    >
                        <Plus className="w-4 h-4" /> {isAccessory ? "FAST ADD" : "Quick Add"}
                    </button>
                </div>
            </div>

            {/* ═ INFO SECTION ═ */}
            <div className="p-5 flex flex-col gap-3 relative bg-[#0A0A0A]">
                {/* Decoration Line */}
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-[#B4F000] group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] delay-75" />

                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg md:text-xl font-black font-[family-name:var(--font-oswald)] text-white uppercase leading-[0.9] tracking-tight group-hover:text-[#B4F000] transition-colors duration-300 w-full line-clamp-2">
                        <Link href={`/product/${product.handle}`}>
                            {product.title}
                        </Link>
                    </h3>
                    <Link href={`/product/${product.handle}`} className="text-white/20 group-hover:text-[#B4F000] transition-colors duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1 shrink-0">
                        <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="flex justify-between items-end mt-1 border-t border-white/5 pt-3 group-hover:border-white/10 transition-colors">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mb-0.5">
                            MSRP // PRICE
                        </span>
                        <span className="text-xl font-mono text-white font-bold tracking-tighter group-hover:text-[#B4F000] transition-colors">
                            {formattedPrice}
                        </span>
                    </div>
                    {/* Collection/Type Tag */}
                    <div className={cn(
                        "px-2 py-[2px] border text-[9px] uppercase tracking-widest font-mono transition-all",
                        isAccessory
                            ? "border-[#B4F000]/30 bg-[#B4F000]/10 text-[#B4F000]"
                            : "border-white/10 bg-white/5 text-white/50 group-hover:border-[#B4F000]/50 group-hover:bg-[#B4F000]/10 group-hover:text-[#B4F000]"
                    )}>
                        {isPhoneCase ? 'TECH' : isDrinkware ? 'LIFESTYLE' : 'APPAREL'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
