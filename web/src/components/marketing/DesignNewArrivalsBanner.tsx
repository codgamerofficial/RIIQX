"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function DesignNewArrivalsBanner() {
    return (
        <section className="relative w-full py-12 bg-black">
            <div className="container mx-auto px-4">
                <Link href="/collections/new-arrivals" className="block relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden group">
                    <Image
                        src="/assets/marketing/design-03.png"
                        alt="New Arrivals - Shop Now"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>
            </div>
        </section>
    );
}
