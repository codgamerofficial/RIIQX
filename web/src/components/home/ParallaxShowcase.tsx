"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export function ParallaxShowcase() {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

    const pictures = [
        {
            src: "https://images.unsplash.com/photo-1617195920950-1145bf9a9c72?q=80&w=800&auto=format&fit=crop",
            scale: scale4,
            classes: "w-[25vw] h-[25vh]"
        },
        {
            src: "https://images.unsplash.com/photo-1563245372-f21720e32aa1?q=80&w=800&auto=format&fit=crop",
            scale: scale5,
            classes: "top-[-30vh] left-[5vw] w-[35vw] h-[30vh]"
        },
        {
            src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
            scale: scale6,
            classes: "top-[-10vh] left-[-25vw] w-[20vw] h-[45vh]"
        },
        {
            src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop",
            scale: scale8,
            classes: "top-[27.5vh] left-[25vw] w-[25vw] h-[25vh]"
        },
        {
            src: "https://images.unsplash.com/photo-1509631179647-b8b92b6a938b?q=80&w=800&auto=format&fit=crop",
            scale: scale9,
            classes: "top-[27.5vh] left-[-22.5vw] w-[20vw] h-[25vh]"
        },
    ];

    return (
        <div ref={container} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden bg-black flex items-center justify-center">
                {pictures.map(({ src, scale, classes }, index) => (
                    <motion.div
                        key={index}
                        style={{ scale }}
                        className={`absolute flex items-center justify-center ${classes}`}
                    >
                        <div className="relative w-full h-full">
                            <motion.img
                                src={src}
                                alt="Parallax Image"
                                className="object-cover w-full h-full rounded-md opacity-70 hover:opacity-100 transition-opacity duration-500"
                            />
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0]) }}
                    className="absolute z-10 text-center pointer-events-none"
                >
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter text-white mix-blend-difference">
                        VISUALIZE
                    </h2>
                    <p className="text-xl tracking-widest text-primary uppercase mt-4">The Future of Style</p>
                </motion.div>
            </div>
        </div>
    );
}
