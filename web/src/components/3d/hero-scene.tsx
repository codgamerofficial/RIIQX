"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RotatingPortal() {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * 0.5;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Outer Glow Ring */}
            <mesh>
                <torusGeometry args={[3, 0.1, 16, 100]} />
                <meshStandardMaterial
                    color="#7c3aed"
                    emissive="#7c3aed"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Inner Energy Field */}
            <mesh rotation={[1.5, 0, 0]}>
                <cylinderGeometry args={[2.8, 2.8, 0.2, 32]} />
                <meshPhysicalMaterial
                    color="#00f0ff"
                    transmission={0.5}
                    opacity={0.3}
                    transparent
                    roughness={0}
                    ior={1.5}
                    thickness={0.5}
                    emissive="#00f0ff"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </group>
    );
}

export default function HeroScene() {
    return (
        <div className="w-full h-[600px] relative">
            <Canvas gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} />
                <pointLight position={[-10, -10, -10]} intensity={5} color="#ff004f" />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <RotatingPortal />
                </Float>

                <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#00f0ff" />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
