'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Garment3DMeshContent } from './Garment3DMesh';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RotateCw, Eye, Sparkles, Box, RefreshCw } from 'lucide-react';

export interface GarmentViewer3DProps {
  initialColor?: string;
  productName?: string;
  sku?: string;
}

export const GarmentViewer3D: React.FC<GarmentViewer3DProps> = ({
  initialColor = '#D4AF37',
  productName = 'MONOLITHIC HEAVYWEIGHT HOODIE',
  sku = 'RQX-HD-001',
}) => {
  const [activeColor, setActiveColor] = useState(initialColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  const colorOptions = [
    { name: 'LIQUID GOLD', hex: '#D4AF37' },
    { name: 'OBSIDIAN BLACK', hex: '#1C1B18' },
    { name: 'CHAMPAGNE', hex: '#F3E5AB' },
    { name: 'ELECTRIC CYAN', hex: '#00F0FF' },
  ];

  return (
    <div className="relative w-full h-[520px] rounded-lg bg-gradient-to-b from-[#141312] via-[#0C0B0A] to-[#141312] border border-[#D4AF37]/30 shadow-glow-gold overflow-hidden flex flex-col justify-between p-6">
      {/* Top Header Overlay */}
      <div className="relative z-10 flex items-start justify-between gap-4 pointer-events-auto">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40">
              3D CAD CANVAS // R3F ENGINE
            </Badge>
            <span className="font-mono text-[10px] text-riiqxText-muted tracking-widest hidden sm:inline">
              SKU: {sku}
            </span>
          </div>
          <h3 className="font-mono font-bold text-sm text-white tracking-wider uppercase flex items-center gap-1.5">
            <Box className="w-4 h-4 text-[#D4AF37]" /> {productName}
          </h3>
        </div>

        <span className="font-mono text-[10px] text-[#F3E5AB] border border-[#D4AF37]/20 px-2.5 py-1 rounded bg-[#0C0B0A]/80 backdrop-blur-md flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" /> INTERACTIVE 360° VIEW
        </span>
      </div>

      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Garment3DMeshContent
            color={activeColor}
            autoRotate={autoRotate}
            wireframe={wireframe}
          />
        </Canvas>
      </div>

      {/* Bottom Floating Control Panel Overlay */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/15 bg-[#0C0B0A]/70 backdrop-blur-md px-4 py-3 rounded-md">
        {/* Color Palette Selector */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-riiqxText-muted uppercase tracking-widest mr-1">
            COLOR MATRICES:
          </span>
          {colorOptions.map((opt) => (
            <button
              key={opt.hex}
              type="button"
              onClick={() => setActiveColor(opt.hex)}
              className={`w-6 h-6 rounded-full border transition-all duration-200 cursor-pointer ${
                activeColor === opt.hex
                  ? 'border-[#D4AF37] scale-110 shadow-glow-gold'
                  : 'border-white/20 hover:border-white/60 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: opt.hex }}
              title={opt.name}
            />
          ))}
        </div>

        {/* Interactive Tool Toggles */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAutoRotate((prev) => !prev)}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'text-[#D4AF37] animate-spin-slow' : ''}`} />}
            className="text-[11px] px-3 py-1.5 border-[#D4AF37]/30"
          >
            {autoRotate ? 'ROTATE: ON' : 'ROTATE: OFF'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setWireframe((prev) => !prev)}
            leftIcon={<Eye className={`w-3.5 h-3.5 ${wireframe ? 'text-[#00F0FF]' : ''}`} />}
            className="text-[11px] px-3 py-1.5 border-[#D4AF37]/30"
          >
            {wireframe ? 'WIREFRAME' : 'SURFACE'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveColor(initialColor);
              setAutoRotate(true);
              setWireframe(false);
            }}
            className="text-[11px] px-2 text-riiqxText-muted hover:text-white"
            title="Reset View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
