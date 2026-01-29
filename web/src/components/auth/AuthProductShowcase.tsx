"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as ImageImpl, Float, Text, Environment, Stars, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { Group } from "three";
import { Play, Pause, SkipForward, Maximize, Aperture, Video, Disc } from "lucide-react";

const PRODUCTS = [
    "/assets/marketing/hero-bold.png",
    "/assets/marketing/hero-fearless.png",
    "/assets/marketing/hero-future.png"
];

function FloatingProduct({ url, index }: { url: string; index: number }) {
    const ref = useRef<Group>(null);

    useFrame((state) => {
        if (!ref.current) return;
        // Slow subtle rotation
        ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.1;
        ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2 + index) * 0.05;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={ref}>
                <ImageImpl url={url} transparent scale={[4, 5, 1]} position={[0, 0, 0]} />
            </group>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#7C3AED" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#CCFF00" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Main Product */}
            <FloatingProduct url={PRODUCTS[0]} index={0} />

            <Environment preset="city" />
        </>
    );
}

export function AuthProductShowcase() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [waveform, setWaveform] = useState<number[]>(Array(40).fill(20));

    useEffect(() => {
        const updateWaveform = () => {
            setWaveform(Array.from({ length: 40 }, () => Math.random() * 100));
        };

        // Initial set
        updateWaveform();

        // Animate
        const interval = setInterval(updateWaveform, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full bg-[#020202] overflow-hidden border-r border-white/5">
            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
                    <Scene />
                </Canvas>
            </div>

            {/* Premiere Pro / Camera UI Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">

                {/* Top UI */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs animate-pulse">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            REC
                        </div>
                        <div className="font-mono text-white/60 text-xs">
                            00:04:23:12
                        </div>
                    </div>

                    <div className="flex gap-4 text-white/40">
                        <div className="border border-white/20 px-2 py-1 text-[9px] font-mono uppercase">
                            4K / 60FPS
                        </div>
                        <div className="border border-white/20 px-2 py-1 text-[9px] font-mono uppercase">
                            ISO 800
                        </div>
                    </div>
                </div>

                {/* Center Safe Area Markers */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/5 border-dashed rounded-lg opacity-30 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-accent/50">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-accent/50" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-accent/50" />
                </div>

                {/* Bottom Timeline UI */}
                <div className="space-y-4">
                    {/* Audio Waveform Mock */}
                    <div className="flex items-end gap-[2px] h-8 opacity-40">
                        {waveform.map((height, i) => (
                            <div
                                key={i}
                                className="w-1 bg-accent transition-all duration-300 ease-in-out"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>

                    {/* Timeline Controls */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 pointer-events-auto">
                        <div className="flex items-center gap-4 text-white/50">
                            <button className="hover:text-white transition-colors"><Disc className="w-4 h-4" /></button>
                            <button className="hover:text-white transition-colors"><Video className="w-4 h-4" /></button>
                            <button className="hover:text-white transition-colors"><Aperture className="w-4 h-4" /></button>
                        </div>

                        <div className="flex items-center gap-4 text-white">
                            <Play className="w-4 h-4 fill-white hover:text-accent transition-colors cursor-pointer" />
                            <div className="w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
                                <div className="absolute top-0 left-0 h-full bg-accent w-1/3" />
                            </div>
                            <span className="font-mono text-[9px]">33%</span>
                        </div>

                        <div className="text-white/50">
                            <Maximize className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Glitch Overlay Text */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 z-0 pointer-events-none mix-blend-overlay opacity-20">
                <h1 className="text-[120px] font-black font-display text-white italic rotate-90 origin-left">
                    RIIQX
                </h1>
            </div>
        </div>
    );
}
