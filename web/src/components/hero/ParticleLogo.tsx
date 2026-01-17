"use client";

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function ParticleText({ text }: { text: string }) {
    const { viewport } = useThree();

    // Create a grid of particles
    const count = 3000;

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Sphere distribution for "Genesis" feel
            temp[i * 3] = (Math.random() - 0.5) * 15;
            temp[i * 3 + 1] = (Math.random() - 0.5) * 5;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 5;
        }
        return temp;
    }, [count]);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const time = state.clock.getElapsedTime();

        // Subtle rotation
        pointsRef.current.rotation.y = time * 0.05;
        pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;

        if (pointsRef.current.geometry.attributes.position) {
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    const isMobile = viewport.width < 5; // Approx threshold for mobile portrait in Three units with z=10
    const responsiveScale = isMobile ? viewport.width / 5 : 1;

    return (
        <group scale={responsiveScale}>
            {/* The Text Core */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Text
                    font="https://fonts.gstatic.com/s/saira/v13/memWYa2wxmKQyPMrYtQ.woff"
                    fontSize={3}
                    letterSpacing={0.1}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.1}
                    strokeWidth={0.02}
                    strokeColor="#00f0ff"
                >
                    {text}
                </Text>
            </Float>

            {/* The Particle Field Swirling Around */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particles, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#00f0ff"
                    transparent
                    opacity={0.6}
                    sizeAttenuation={true}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

export function ParticleLogo() {
    return (
        <div className="w-full h-screen absolute inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
                <color attach="background" args={['#020204']} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={500} scale={12} size={2} speed={0.4} opacity={0.5} noise={0.2} color="#f472b6" />

                <ParticleText text="RIIQX" />

                <fog attach="fog" args={['#020204', 5, 20]} />
            </Canvas>
        </div>
    );
}
