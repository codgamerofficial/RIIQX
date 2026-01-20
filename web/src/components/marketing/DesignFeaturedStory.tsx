"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function DesignFeaturedStory() {
    return (
        <section className="relative w-full bg-black py-12 md:py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="relative w-full aspect-[16/9] md:aspect-[3/1] rounded-3xl overflow-hidden group">
                    {/* Background Image */}
                    <Image
                        src="/assets/marketing/design-01.png"
                        alt="Featured - Wear Your Story"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />

                    {/* Overlay Content (Invisible Link Wrapper) */}
                    <Link href="/collections/featured" className="absolute inset-0 z-10">
                        <span className="sr-only">Order Now</span>
                    </Link>

                    {/* Optional: Add a real button overlay matching the design's position if needed. 
                For now, the entire card is clickable which is better UX for banners. 
            */}
                </div>
            </div>
        </section>
    );
}
