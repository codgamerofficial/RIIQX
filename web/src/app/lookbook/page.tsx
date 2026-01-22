"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, ExternalLink } from "lucide-react";
import DropTimer from "@/components/shared/DropTimer";

// Mock Data for Lookbook
const looks = [
    {
        id: 1,
        title: "Neon Cyberpunk",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        products: [
            { name: "Cyber Jacket", price: "₹4,999", link: "/shop/cyber-jacket" },
            { name: "Neon Pants", price: "₹2,499", link: "/shop/neon-pants" }
        ]
    },
    {
        id: 2,
        title: "Urban Samurai",
        image: "https://images.unsplash.com/photo-1529139574466-a302d20525fa?q=80&w=1000&auto=format&fit=crop",
        products: [
            { name: "Katana Tee", price: "₹1,299", link: "/shop/katana-tee" },
            { name: "Tech Cargo", price: "₹3,999", link: "/shop/tech-cargo" }
        ]
    },
    {
        id: 3,
        title: "Midnight Drift",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
        products: [
            { name: "Drift Hoodie", price: "₹2,999", link: "/shop/drift-hoodie" }
        ]
    },
    {
        id: 4,
        title: "Chrome Hearts",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        products: [
            { name: "Chrome Tee", price: "₹1,499", link: "/shop/chrome-tee" },
            { name: "Silver Chain", price: "₹999", link: "/shop/silver-chain" }
        ]
    },
    {
        id: 5,
        title: "Future Gothic",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
        products: [
            { name: "Goth Dress", price: "₹3,499", link: "/shop/goth-dress" },
            { name: "Combat Boots", price: "₹5,999", link: "/shop/combat-boots" }
        ]
    },
    {
        id: 6,
        title: "Electric Youth",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
        products: [
            { name: "Electric Jacket", price: "₹4,299", link: "/shop/electric-jacket" }
        ]
    }
];

export default function LookbookPage() {
    const [selectedLook, setSelectedLook] = useState<typeof looks[0] | null>(null);

    // Calculate dates for next drop (3 days from now)
    const nextDropDate = new Date();
    nextDropDate.setDate(nextDropDate.getDate() + 3);

    return (
        <div className="min-h-screen bg-rich-black pt-24 pb-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white uppercase tracking-tighter leading-none">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cherry-red to-red-600">Archive</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        Curated styles from our latest collections. Explore the looks and shop the pieces that define the RIIQX aesthetic.
                    </p>
                </div>

                {/* Drop Timer Integration */}
                <div className="max-w-2xl mx-auto">
                    <DropTimer targetDate={nextDropDate} label="Next Collection Drop" />
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-8">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {looks.map((look) => (
                        <motion.div
                            key={look.id}
                            layoutId={`look-container-${look.id}`}
                            className="break-inside-avoid relative group cursor-pointer"
                            onClick={() => setSelectedLook(look)}
                        >
                            <div className="relative overflow-hidden rounded-lg aspect-[3/4] md:aspect-auto">
                                <Image
                                    src={look.image}
                                    alt={look.title}
                                    width={800}
                                    height={1000}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                    <h3 className="text-3xl font-black font-display text-white uppercase tracking-tighter translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {look.title}
                                    </h3>
                                    <p className="text-cherry-red font-bold uppercase tracking-widest text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        View Look
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Look Details Modal */}
            <AnimatePresence>
                {selectedLook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLook(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            layoutId={`look-container-${selectedLook.id}`}
                            className="relative w-full max-w-5xl bg-rich-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedLook(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-cherry-red transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-3/5 relative h-[50vh] md:h-auto">
                                <Image
                                    src={selectedLook.image}
                                    alt={selectedLook.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-2/5 p-8 flex flex-col">
                                <div className="mb-auto">
                                    <h2 className="text-4xl font-black font-display text-white uppercase tracking-tighter mb-2">
                                        {selectedLook.title}
                                    </h2>
                                    <div className="h-1 w-20 bg-cherry-red mb-8" />

                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">
                                        Shop the Look
                                    </h3>

                                    <div className="space-y-4">
                                        {selectedLook.products.map((product, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-cherry-red/50 transition-colors group">
                                                <div>
                                                    <p className="font-bold text-white">{product.name}</p>
                                                    <p className="text-cherry-red text-sm">{product.price}</p>
                                                </div>
                                                <Link href={product.link}>
                                                    <button className="p-2 bg-white text-black rounded-full hover:bg-cherry-red hover:text-white transition-colors">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        See something you like? Individual pieces are available in limited quantities.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
