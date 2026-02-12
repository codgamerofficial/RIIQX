"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, useGLTF } from "@react-three/drei";
import { useRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";

function Model({ url, color }: { url?: string; color: string }) {
    const group = useRef<THREE.Group>(null);
    // Use a default model if none provided - likely valid URL or null
    const { scene } = useGLTF(url || "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/hoodie-compressed.glb");

    // Clone scene to avoid mutating cached model for other instances
    const clonedScene = scene.clone();

    // Apply color to materials
    useEffect(() => {
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                // If it looks like a fabric material, tint it
                if (mesh.material) {
                    (mesh.material as THREE.MeshStandardMaterial).color.set(color);
                }
            }
        });
    }, [clonedScene, color]);

    useFrame((_, delta) => {
        if (group.current) {
            group.current.rotation.y += delta * 0.2; // Slow rotation
        }
    });

    return (
        <group ref={group} scale={2.5} position={[0, -1.5, 0]}>
            <primitive object={clonedScene} />
        </group>
    );
}

function FallbackMesh({ color }: { color: string }) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={meshRef}>
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[1.5, 2, 0.5]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
        </group>
    );
}

function ProductModelWrapper({ modelUrl, color }: { modelUrl?: string; color: string }) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return <FallbackMesh color={color} />;
    }

    return (
        <Suspense fallback={null}>
            <ErrorBoundary onError={() => setHasError(true)}>
                <Model url={modelUrl} color={color} />
            </ErrorBoundary>
        </Suspense>
    );
}

// Simple Error Boundary component for Three.js
class ErrorBoundary extends React.Component<{ children: React.ReactNode; onError: () => void }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any) {
        console.error("3D Model load failed:", error);
        this.props.onError();
    }

    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

import React from "react";

function LoadingFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white/20 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">
                Loading Model
            </div>
        </div>
    );
}

interface ProductViewer3DProps {
    color?: string;
    modelUrl?: string;
    className?: string;
}

export default function ProductViewer3D({ color = "#1a1a1a", modelUrl, className = "" }: ProductViewer3DProps) {
    return (
        <div className={`relative bg-[#080808] ${className}`}>
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 35 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, preserveDrawingBuffer: true }}
                    shadows
                >
                    {/* Lighting */}
                    <ambientLight intensity={0.4} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#B4F000" />

                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                        <ProductModelWrapper modelUrl={modelUrl} color={color} />
                    </Float>

                    {/* Ground Shadow */}
                    <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />

                    {/* Controls */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.8}
                    />

                    <Environment preset="city" />
                </Canvas>
            </Suspense>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-[10px] uppercase tracking-[0.3em] font-mono pointer-events-none whitespace-nowrap">
                Drag to rotate
            </div>
        </div>
    );
}
