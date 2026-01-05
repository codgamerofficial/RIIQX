"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.1;
        meshRef.current.rotation.y = time * 0.15;
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere args={[1.5, 64, 64]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#7c3aed"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.9}
                    wireframe={true}
                    emissive="#00f0ff"
                    emissiveIntensity={0.1}
                />
            </Sphere>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#00f0ff" />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#ff004f" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <AnimatedSphere />
            <fog attach="fog" args={['#020204', 5, 20]} />
        </>
    );
}

export function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Scene />
            </Canvas>
        </div>
    );
}
