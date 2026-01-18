"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Collection } from "@/lib/shopify/types";

interface CategoryCirclesProps {
    collections: Collection[];
}

export function CategoryCircles({ collections }: CategoryCirclesProps) {
    // If no collections are found (or passed), we could show a fallback or nothing.
    // For now, let's assume we want to show whatever we got.

    // Sort logic: Maybe put "New In" or "ale" first if they exist? 
    // For now, render as is.

    if (!collections || collections.length === 0) {
        return null;
        // Or return the hardcoded list as fallback if strictly desired, 
        // but User asked for "Real functionality with MY products".
    }

    return (
        <section className="py-8 bg-[#121212] border-b border-white/5 overflow-x-auto no-scrollbar">
            <div className="max-w-7xl mx-auto px-4 flex space-x-6 md:space-x-10 min-w-max justify-start md:justify-center">
                {collections.map((collection, idx) => {
                    const isSale = collection.handle.toLowerCase().includes('sale');
                    const isNew = collection.handle.toLowerCase().includes('new') || collection.handle.toLowerCase().includes('latest');

                    // Fallback image if collection has no image
                    const imageUrl = collection.image?.url || "https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=300&auto=format&fit=crop";

                    return (
                        <Link key={collection.id} href={`/collections/${collection.handle}`} className="group flex flex-col items-center space-y-3">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-1 border-2 transition-colors relative ${isSale ? 'border-red-500 group-hover:border-red-400' :
                                        isNew ? 'border-[#D9F99D] group-hover:border-white' :
                                            'border-transparent group-hover:border-white'
                                    }`}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden relative bg-neutral-900">
                                    <img
                                        src={imageUrl}
                                        alt={collection.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>

                                {/* Ring Animation for "New" items */}
                                {isNew && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D9F99D] rounded-full animate-ping" />
                                )}
                            </motion.div>
                            <span
                                className="text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors group-hover:text-primary max-w-[80px] text-center truncate"
                                style={{ color: isSale ? '#ef4444' : 'white' }}
                            >
                                {collection.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
