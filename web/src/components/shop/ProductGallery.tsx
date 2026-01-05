"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Fallback if no images
    const displayImages = images?.length > 0
        ? images
        : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted border border-white/5 group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={displayImages[selectedIndex]}
                            alt={`${title} - View ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* 3D View Toggle Placeholder */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed">
                    3D View (Coming Soon)
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {displayImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === idx
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent hover:border-white/20"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${title} - Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
