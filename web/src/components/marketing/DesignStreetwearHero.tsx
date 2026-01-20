"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function DesignStreetwearHero() {
    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center bg-black overflow-hidden">
            {/* Background with slight parallax effect possibility */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/assets/marketing/design-02.png"
                    alt="Streetwear - Fashion Jo Dil Chahe"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            <div className="relative z-10 text-center w-full px-4">
                {/* The design has strong typography built-in. 
            We can add an interactive layer if needed. 
        */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-[40vh]" /* Push content down as the design might have text at top/center */
                >
                    {/* Optional text or button if design image text isn't enough */}
                </motion.div>
            </div>
        </section>
    );
}
