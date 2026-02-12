"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend, ReactThreeFiber } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// 1. Define Shader Material
const LiquidDistortionMaterial = shaderMaterial(
    {
        uTexture: null,
        uTime: 0,
        uMouse: new THREE.Vector2(0, 0),
        uHover: 0,
        uResolution: new THREE.Vector2(1, 1),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Simplex noise function (simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 uv = vUv;
        
        // Mouse interaction
        float dist = distance(uv, uMouse);
        float decay = clamp(1.0 - dist * 2.0, 0.0, 1.0);
        
        // Noise distortion
        float noise = snoise(uv * 3.0 + uTime * 0.2);
        
        // Combine effects
        float distortion = noise * 0.02 * uHover + decay * 0.05 * uHover;
        
        // Apply distortion to UVs
        vec2 distortedUv = uv + vec2(distortion, distortion);
        
        // Stick to edges (optional)
        // distortedUv = mix(uv, distortedUv, smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x));

        vec4 color = texture2D(uTexture, distortedUv);
        
        // RGB Shift on strong distortion
        float shift = distortion * 0.5;
        color.r = texture2D(uTexture, distortedUv + vec2(shift, 0.0)).r;
        color.b = texture2D(uTexture, distortedUv - vec2(shift, 0.0)).b;

        // gl_Position = vec4(distortedUv, 0.0, 1.0); // REMOVED: Invalid in fragment shader
        gl_FragColor = color;
    }
    `
);

extend({ LiquidDistortionMaterial });

// Add types for TS
declare global {
    namespace JSX {
        interface IntrinsicElements {
            liquidDistortionMaterial: any; // Using any to bypass strict Three.js type matching for custom shader
        }
    }
}

function ImageMesh({ src, intensity = 1 }: { src: string; intensity?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);
    const texture = useTexture(src);

    // Maintain aspect ratio
    const { width, height } = texture.image as HTMLImageElement;
    const aspect = width / height;

    useFrame((state) => {
        if (!materialRef.current) return;

        // Update uniforms
        materialRef.current.uTime = state.clock.elapsedTime;

        // Smooth hover transition
        // For this demo, we can just oscillate uHover or map to mouse
        const targetHover = 1.0; // Always active for demo, or pass prop
        materialRef.current.uHover = THREE.MathUtils.lerp(materialRef.current.uHover, targetHover, 0.1);

        // Update mouse position (normalized 0-1)
        const mouse = state.pointer.clone().addScalar(1).multiplyScalar(0.5);
        materialRef.current.uMouse.set(mouse.x, mouse.y);
    });

    return (
        <mesh ref={meshRef} scale={[aspect * 5, 5, 1]}> {/* Adjust scale based on viewport? */}
            <planeGeometry args={[1, 1, 32, 32]} />
            {/* @ts-ignore */}
            <liquidDistortionMaterial
                ref={materialRef}
                uTexture={texture}
                transparent
            />
        </mesh>
    );
}

function Scene({ src }: { src: string }) {
    const { viewport } = require("@react-three/fiber").useThree();
    return (
        <group scale={[viewport.width / 5, viewport.height / 5, 1]}>
            {/* Logic to fit image to viewport */}
            <ImageMesh src={src} />
        </group>
    )
}

// 2. Main Component
export function LiquidImage({ src, className }: { src: string; className?: string }) {
    return (
        <div className={className}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ImageMesh src={src} />
            </Canvas>
        </div>
    );
}
