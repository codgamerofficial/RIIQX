"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as ImageImpl, Float, Text, Environment, Stars, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { Group } from "three";
import { Play, Pause, SkipForward, Maximize, Aperture, Video, Disc } from "lucide-react";

const PRODUCTS = [
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop", // Phantom Black (Yellow/Green "No Filter")
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop", // Cyberpunk Hoodie
    "https://images.unsplash.com/photo-1517445312882-5632f77eec86?q=80&w=2069&auto=format&fit=crop"  // Street Cargo
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
            <group ref={ref} scale={[4, 5, 1]} position={[0, 0, 0]}>
                <ImageImpl url={url} transparent />
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

            {/* Environment removed to prevent fetch error - relying on lights */}
            {/* <Environment preset="city" /> */}
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

            {/* Glitch Overlay Text */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 z-0 pointer-events-none mix-blend-overlay opacity-20">
                <h1 className="text-[120px] font-black font-display text-white italic rotate-90 origin-left">
                    RIIQX
                </h1>
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
