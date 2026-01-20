"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function DesignFearlessPromo() {
    return (
        <section className="relative w-full bg-[#E5E5E5] text-black">
            {/* 
          Design 4 appears to be a split layout or a wide banner. 
          Assuming it's a wide promotional banner. 
      */}
            <div className="w-full relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.5/1] overflow-hidden">
                <Image
                    src="/assets/marketing/design-04.png"
                    alt="Fearless - Homepage 25% Off Everything"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Interactive Layer */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <Link
                        href="/shop"
                        className="absolute inset-0 z-10"
                        aria-label="Shop Fearless Collection"
                    />
                    {/* 
               If the design has a "SHOP NOW" button that is part of the image, 
               we just make the area clickable. 
               If we wanted to animate the button specifically, we'd place a div here.
            */}
                </div>
            </div>
        </section>
    );
}
