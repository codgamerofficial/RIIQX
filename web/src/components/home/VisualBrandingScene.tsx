"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, ScrollControls, useScroll, Stars, Text, Float } from "@react-three/drei";
import * as THREE from "three";

function SceneItems() {
    const scroll = useScroll();
    const { width, height } = useThree((state) => state.viewport);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Zoom/Flythrough effect:
        // We move the entire group towards the camera based on scroll offset.
        // The range 0..1 of scroll.offset is mapped to Z position.
        // Initial Z = -20 (far away), Final Z = 10 (past camera)

        const targetZ = scroll.offset * 40;

        // Smooth lerp for buttery smooth 60fps feel
        groupRef.current.position.z = THREE.MathUtils.damp(
            groupRef.current.position.z,
            targetZ,
            4,
            delta
        );

        // Slight rotation based on scroll for dynamic feel
        groupRef.current.rotation.z = THREE.MathUtils.damp(
            groupRef.current.rotation.z,
            scroll.offset * 0.2, // rotate slightly as we go deep
            2,
            delta
        );
    });

    return (
        <group ref={groupRef}>
            {/* 
        We place items along the negative Z axis.
        As the user scrolls, we pull the group forward (Positive Z),
        effectively flying past these items.
      */}

            {/* Hero Title - Far back but huge */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <Text
                    font="/fonts/Geist-Bold.ttf" // Fallback to standard if not found, usually Three default
                    fontSize={4}
                    color="#7c3aed" // Primary Purple
                    position={[0, 1, -15]}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.8}
                >
                    VISUALIZE
                    <meshStandardMaterial emissive="#7c3aed" emissiveIntensity={2} toneMapped={false} />
                </Text>
                <Text
                    fontSize={1}
                    color="#ffffff"
                    position={[0, -2, -15]}
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.2}
                >
                    THE FUTURE OF STYLE
                </Text>
            </Float>

            {/* Image 1 - Left */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Image
                    url="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                    position={[-4, 0, -10]}
                    scale={[4, 6, 1]}
                    grayscale={0.5}
                    toneMapped={false}
                />
            </Float>

            {/* Image 2 - Right */}
            <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
                <Image
                    url="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop"
                    position={[5, 2, -18]}
                    scale={[5, 7, 1]}
                    grayscale={0.3}
                    toneMapped={false}
                />
            </Float>

            {/* Image 3 - Center Low */}
            <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
                <Image
                    url="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
                    position={[0, -3, -8]}
                    scale={[6, 4, 1]}
                    grayscale={0}
                    toneMapped={false}
                />
            </Float>

            {/* Scattered Debris / Floating UI bits */}
            {/* We can use simple colored planes as "Holographic Panels" */}
            <mesh position={[-3, 4, -5]} rotation={[0.2, 0.5, 0]}>
                <planeGeometry args={[2, 1]} />
                <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
            </mesh>
            <mesh position={[4, -3, -12]} rotation={[-0.2, -0.5, 0.4]}>
                <planeGeometry args={[1.5, 2]} />
                <meshBasicMaterial color="#ff004f" wireframe transparent opacity={0.3} />
            </mesh>

        </group>
    );
}

export function VisualBrandingScene() {
    return (
        <div className="h-[400vh] w-full bg-black relative">
            {/* Sticky container for the Canvas */}
            <div className="sticky top-0 h-screen w-full">
                <Canvas gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#7c3aed" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#00f0ff" />

                    {/* Fog for depth - Starts black, fades to scene */}
                    <fog attach="fog" args={['#020204', 5, 25]} />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <ScrollControls pages={4} damping={0.2}>
                        <SceneItems />
                    </ScrollControls>
                </Canvas>

                {/* HTML Overlay (HUD) - Stays static on top of Canvas */}
                <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="text-xs font-mono text-primary/60 border border-primary/30 p-2 rounded bg-black/50 backdrop-blur-sm">
                            SYS.ORDINAL.505<br />
                            SECTOR: RIIQX_PRIME
                        </div>
                        <div className="text-right">
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent to-primary"></div>
                            <div className="text-[10px] text-white/50 mt-1 font-mono">RENDERING_ENGINE: ONLINE</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="w-8 h-8 border-l border-b border-primary/50"></div>
                        <div className="w-8 h-8 border-r border-b border-primary/50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
