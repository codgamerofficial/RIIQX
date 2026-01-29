"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as ImageImpl, Float, Stars, Text, Environment } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { Product } from "@/lib/shopify/types";
import { useRouter } from "next/navigation";

// --- 3D Card Component ---
// --- 3D Card Component ---
function Card({ url, position, rotation, scale, handle, title }: { url: string; position: [number, number, number]; rotation: [number, number, number]; scale: number; handle: string; title: string }) {
    const ref = useRef<THREE.Mesh>(null);
    const [hovered, hover] = useState(false);
    const router = useRouter();

    useFrame((state, delta) => {
        if (ref.current) {
            // Gentle hovering logic handled by <Float>, but we can add specific mouse tilt
            const targetScale = hovered ? scale * 1.15 : scale;
            easing.damp3(ref.current.scale, [targetScale, targetScale * 1.33, 1], 0.1, delta);
            // damp 'zoom' uniform on the custom shader material of Drei Image
            // @ts-ignore - Drei Image material property access
            easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
        }
    });

    const onClick = () => {
        router.push(`/product/${handle}`);
    };

    return (
        <group position={position} rotation={rotation}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <ImageImpl
                    ref={ref}
                    url={url}
                    transparent
                    side={THREE.DoubleSide}
                    scale={[scale, scale * 1.33]} // Initial scale
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; hover(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; hover(false); }}
                    onClick={onClick}
                />
                {hovered && (
                    <Text
                        position={[0, -0.6 * scale, 0.05]}
                        fontSize={0.1 * scale}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    // font="/fonts/Inter-Bold.ttf" // Fallback
                    >
                        {title.toUpperCase()}
                    </Text>
                )}
            </Float>
        </group>
    );
}

// Reuse damping helper
import { damp3, damp } from "maath/easing";
import { useScroll } from "framer-motion"; // Actually R3F usually uses its own scroll controls or just mouse interactions

function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();
    useFrame((state, delta) => {
        // Move camera slightly based on mouse position for parallax
        vec.set(mouse.x * 2, mouse.y * 2, camera.position.z);
        damp3(camera.position, [mouse.x * 0.5, mouse.y * 0.5, 5], 0.25, delta);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// --- Scene Component (Handles Layout) ---
function ProductGroup({ products }: { products: Product[] }) {
    const { viewport } = useThree();
    const isMobile = viewport.width < 5; // Threshold for mobile layout in 3D units

    const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

    // Calculate layouts based on viewport
    const layouts = useMemo(() => {
        if (isMobile) {
            // Mobile: Vertical Stack
            return featuredProducts.map((_, i) => ({
                pos: [0, 1.5 - (i * 1.8), 0] as [number, number, number], // Stacked vertically
                rot: [0, 0, 0] as [number, number, number],
                scale: viewport.width * 0.4 // Scale to fit width (40% of viewport width)
            }));
        } else {
            // Desktop: Dispersed Cloud
            return [
                { pos: [0, 0, 1.5], rot: [0, 0, 0], scale: 2 }, // Center Hero
                { pos: [-3.5, 1.5, -1], rot: [0, 0.2, 0.1], scale: 1.5 }, // Top Left
                { pos: [3.5, -1, 0.5], rot: [0, -0.2, -0.1], scale: 1.6 }, // Bottom Right
                { pos: [-4, -2, -2], rot: [0, 0.3, 0], scale: 1.4 }, // Bottom Left
                { pos: [4, 2.5, -2], rot: [0, -0.3, 0.1], scale: 1.5 }, // Top Right
                { pos: [0, 3, -4], rot: [0.1, 0, 0], scale: 1.2 }, // Top Center
            ];
        }
    }, [isMobile, viewport.width, featuredProducts.length]);

    return (
        <group>
            {featuredProducts.map((product, i) => {
                const layout = layouts[i] || { pos: [0, 0, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], scale: 1 };
                const imgUrl = product.featuredImage?.url || "";
                if (!imgUrl) return null;

                return (
                    <Card
                        key={product.id}
                        url={imgUrl}
                        title={product.title}
                        handle={product.handle}
                        position={layout.pos as [number, number, number]}
                        rotation={layout.rot as [number, number, number]}
                        scale={layout.scale}
                    />
                );
            })}
        </group>
    );
}

export function Hero3D({ products }: { products: Product[] }) {
    return (
        <div className="h-[80vh] w-full relative z-10 bg-[#0B0B0B]">
            {/* Overlay Text */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                <h1 className="text-[12vw] font-black text-white/5 uppercase leading-none tracking-tighter mix-blend-overlay">
                    FUTURE
                </h1>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 35 }} dpr={[1, 2]}>
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                {/* Stars/Particles Background */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Product Group with Responsive Logic */}
                <ProductGroup products={products} />

                {/* Controls */}
                <Rig />
                <Environment preset="city" />
            </Canvas>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono uppercase tracking-widest animate-bounce">
                Explore Collection
            </div>
        </div>
    );
}

// Tiny easing helper locally if maath is not installed or just for simple damp
const easing = {
    damp3: (current: THREE.Vector3, target: [number, number, number] | THREE.Vector3, smooth: number, delta: number) => {
        const t = target instanceof THREE.Vector3 ? target : new THREE.Vector3(...target);
        current.lerp(t, 1 - Math.exp(-smooth * delta));
    },
    damp: (current: any, prop: string, target: number, smooth: number, delta: number) => {
        current[prop] = THREE.MathUtils.lerp(current[prop], target, 1 - Math.exp(-smooth * delta));
    }
};
