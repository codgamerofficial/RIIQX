"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function VisualBranding3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // 3D Transforms for the main container
    const zMove = useTransform(smoothProgress, [0, 1], [0, 1200]); // Increased depth for more layers
    const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [25, 0, -25]);
    const opacity = useTransform(smoothProgress, [0.85, 1], [1, 0]);

    // Parallax elements (Existing New Design)
    const layer1Y = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
    const layer2Y = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);

    // Text Animation
    const textScale = useTransform(smoothProgress, [0, 0.4], [0.8, 1.3]);
    const textOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Transformed Scales for "Old" Design elements to fit into 3D space
    // We map scroll progress to z-depth and scale to create the "passing by" effect
    const zScale1 = useTransform(smoothProgress, [0, 1], [0, 500]);
    const zScale2 = useTransform(smoothProgress, [0, 1], [100, 600]);
    const zScale3 = useTransform(smoothProgress, [0, 1], [200, 700]);
    const zScale4 = useTransform(smoothProgress, [0, 1], [300, 800]);
    const zScale5 = useTransform(smoothProgress, [0, 1], [400, 900]);

    // Pictures from Original ParallaxShowcase (The "Old" Design)
    const extraPictures = [
        {
            src: "https://images.unsplash.com/photo-1617195920950-1145bf9a9c72?q=80&w=800&auto=format&fit=crop",
            z: zScale1,
            className: "top-[10%] left-[10%] w-[15vw] h-[20vh] rotate-[-5deg]", // Adjusted positioning for 3D
        },
        {
            src: "https://images.unsplash.com/photo-1563245372-f21720e32aa1?q=80&w=800&auto=format&fit=crop",
            z: zScale2,
            className: "top-[15%] right-[15%] w-[18vw] h-[25vh] rotate-[5deg]",
        },
        {
            src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
            z: zScale3,
            className: "bottom-[20%] left-[20%] w-[20vw] h-[30vh] rotate-[-10deg]",
        },
        {
            src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop",
            z: zScale4,
            className: "bottom-[30%] right-[10%] w-[12vw] h-[18vh] rotate-[8deg]",
        },
        {
            src: "https://images.unsplash.com/photo-1509631179647-b8b92b6a938b?q=80&w=800&auto=format&fit=crop",
            z: zScale5,
            className: "top-[40%] left-[-5%] w-[22vw] h-[28vh] rotate-[-15deg] opacity-50",
        }
    ];

    return (
        <div ref={containerRef} className="relative h-[450vh] bg-background overflow-hidden perspective-[2000px]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Background Grid - Gaming/Sci-fi Feel */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background"></div>
                </div>

                {/* Ambient Glows */}
                <motion.div
                    style={{ scale: useTransform(smoothProgress, [0, 1], [1, 1.5]) }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
                />
                <motion.div
                    style={{ scale: useTransform(smoothProgress, [0, 1], [1.2, 0.8]) }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"
                />

                {/* 3D Container Main */}
                <motion.div
                    style={{
                        rotateX,
                        z: zMove,
                        opacity
                    }}
                    className="relative w-full h-full preserve-3d flex items-center justify-center"
                >
                    {/* MERGED: Old Design Scattered Images (Background Layer) */}
                    {extraPictures.map((pic, idx) => (
                        <motion.div
                            key={`extra-${idx}`}
                            style={{
                                z: pic.z,
                                opacity: useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0]) // Fade in/out
                            }}
                            className={cn("absolute border border-white/5 bg-black/50 backdrop-blur-[2px]", pic.className)}
                        >
                            <img src={pic.src} alt="Legacy Asset" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
                        </motion.div>
                    ))}

                    {/* Main Title Layer */}
                    <motion.div
                        style={{ scale: textScale, opacity: textOpacity }}
                        className="absolute z-20 text-center select-none"
                    >
                        <div className="relative">
                            <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                                VISUALIZE
                            </h1>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-2 bg-primary mt-4 mx-auto glow-bar"
                            />
                            <h2 className="text-2xl md:text-3xl font-bold tracking-[1em] text-primary mt-6 uppercase">
                                The Future of Style
                            </h2>
                        </div>
                    </motion.div>

                    {/* NEW DESIGN: Feature Cards (Foreground Layer) */}

                    {/* Left Card - Clothing */}
                    <motion.div
                        style={{ y: layer1Y, x: "-150%", rotateY: "15deg", z: 100 }}
                        className="absolute w-[20vw] h-[30vw] bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl group z-30"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                            alt="Fashion 1"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
                            <p className="text-xs text-primary font-mono">ASSET_01</p>
                            <p className="font-bold text-white">STREET_WEAR_V2</p>
                        </div>
                    </motion.div>

                    {/* Right Card - Clothing */}
                    <motion.div
                        style={{ y: layer2Y, x: "150%", rotateY: "-15deg", z: 50 }}
                        className="absolute w-[25vw] h-[35vw] bg-black/40 border border-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl group z-30"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop"
                            alt="Fashion 2"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
                            <p className="text-xs text-secondary font-mono">ASSET_02</p>
                            <p className="font-bold text-white">TECH_COAT_MK4</p>
                        </div>
                    </motion.div>

                    {/* Center Bottom - Car/Lifestyle */}
                    <motion.div
                        style={{ y: useTransform(smoothProgress, [0, 1], ["50%", "0%"]), z: 200, scale: useTransform(smoothProgress, [0, 1], [0.8, 1.2]) }}
                        className="absolute bottom-[-15vh] w-[40vw] h-[25vw] bg-black border border-primary/30 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.2)] z-40"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
                            alt="Automotive Style"
                            className="w-full h-full object-cover mix-blend-screen opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 flex items-center justify-between px-8">
                            <div className="h-full w-[1px] bg-primary/50"></div>
                            <div className="h-full w-[1px] bg-primary/50"></div>
                        </div>
                        {/* HUD Overlay */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] text-white/70 font-mono tracking-widest">LIVE_FEED // REC</span>
                        </div>
                    </motion.div>

                </motion.div>

                {/* HUD / Gaming UI Overlay Layers - Static relative to viewport */}
                <div className="absolute inset-0 pointer-events-none z-50">
                    {/* Corners */}
                    <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-primary/50"></div>
                    <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-primary/50"></div>
                    <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-primary/50"></div>
                    <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-primary/50"></div>

                    {/* Side Lines */}
                    <div className="absolute top-1/2 left-6 w-[2px] h-24 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute top-1/2 right-6 w-[2px] h-24 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                    {/* Scrolling Data Text */}
                    <motion.div
                        animate={{ y: [0, -100] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="absolute top-20 right-20 font-mono text-[10px] text-white/30 hidden md:block"
                    >
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i}>&gt; SYSTEM_CHECK_{100 + i}... OK</div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
