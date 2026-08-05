'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows, OrbitControls, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export interface Garment3DMeshProps {
  color?: string;
  autoRotate?: boolean;
  wireframe?: boolean;
}

export const Garment3DMeshContent: React.FC<Garment3DMeshProps> = ({
  color = '#D4AF37',
  autoRotate = true,
  wireframe = false,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#FFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#D4AF37" />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={meshRef}>
          {/* Main Monolithic Garment Core (Heavyweight Cyber Silhouette) */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.1, 1.4, 2.2, 32, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.25}
              metalness={0.65}
              wireframe={wireframe}
              envMapIntensity={1.2}
            />
          </mesh>

          {/* Liquid Gold Obsidian Chest Plate Armor / NFC Emblem */}
          <mesh position={[0, 0.4, 1.12]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.08]} />
            <meshStandardMaterial
              color="#0C0B0A"
              roughness={0.1}
              metalness={0.95}
            />
          </mesh>

          {/* Gold Inlaid Serial Emblem */}
          <mesh position={[0, 0.4, 1.17]}>
            <planeGeometry args={[0.3, 0.15]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Left Sleeve Structure */}
          <mesh position={[-1.4, 0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
            <cylinderGeometry args={[0.45, 0.38, 1.8, 24]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
          </mesh>

          {/* Right Sleeve Structure */}
          <mesh position={[1.4, 0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
            <cylinderGeometry args={[0.45, 0.38, 1.8, 24]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      </Float>

      {/* Realistic Contact Shadow Floor */}
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.7}
        scale={6}
        blur={2.5}
        far={4}
        color="#0C0B0A"
      />

      <OrbitControls
        enableZoom={true}
        minDistance={2.5}
        maxDistance={6}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
};
