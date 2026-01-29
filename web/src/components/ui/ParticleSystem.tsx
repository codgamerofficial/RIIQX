"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

interface ParticleSystemProps {
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
    interactive?: boolean;
}

export function ParticleSystem({
    count = 100,
    color = "#ffffff",
    size = 0.02,
    speed = 0.5,
    interactive = true
}: ParticleSystemProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePosition = useRef({ x: 0, y: 0 });
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (!containerRef.current) return;
        if (shouldReduceMotion) return; // Skip rendering particles if reduced motion is on

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Particles
        const geometry = new THREE.BufferGeometry();
        const particlesCount = count;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: size,
            color: color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        // Animation
        const clock = new THREE.Clock();
        let animationId: number;

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate particles container slightly
            particlesMesh.rotation.y = elapsedTime * (speed * 0.1);
            particlesMesh.rotation.x = -mousePosition.current.y * (interactive ? 0.5 : 0.05);
            particlesMesh.rotation.y += mousePosition.current.x * (interactive ? 0.5 : 0.05);

            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Interaction
        const handleMouseMove = (event: MouseEvent) => {
            mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        if (interactive) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        // Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationId) cancelAnimationFrame(animationId);
            if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
        };
    }, [count, color, size, speed, interactive, shouldReduceMotion]);

    if (shouldReduceMotion) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
