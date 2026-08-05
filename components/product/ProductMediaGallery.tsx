'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/Badge';
import { Rotate3D, Box, Image as ImageIcon } from 'lucide-react';
import type { Database } from '@/types/database.types';

export type ProductImage = Database['public']['Tables']['product_images']['Row'];

const GarmentViewer3D = dynamic(
  () => import('./GarmentViewer3D').then((m) => m.GarmentViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-lg bg-[#141312] border border-[#D4AF37]/30 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-[#D4AF37] tracking-widest uppercase">INITIALIZING R3F 3D CANVAS...</span>
      </div>
    ),
  }
);

export interface ProductMediaGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductMediaGallery: React.FC<ProductMediaGalleryProps> = ({
  images,
  productName,
}) => {
  // Multi-angle fallback image list for 360-degree rotation view
  const galleryImages =
    images && images.length > 0
      ? images
      : [
          {
            id: 'img-1',
            product_id: 'p1',
            url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1200',
            alt_text: 'Front Angle',
            display_order: 0,
            created_at: '',
          },
          {
            id: 'img-2',
            product_id: 'p1',
            url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200',
            alt_text: 'Side Angle',
            display_order: 1,
            created_at: '',
          },
          {
            id: 'img-3',
            product_id: 'p1',
            url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
            alt_text: 'Back Angle',
            display_order: 2,
            created_at: '',
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [is360Mode, setIs360Mode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // Drag handler for 360° photo view
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!is360Mode) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!is360Mode || !isDragging) return;
    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else {
        setActiveIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      }
      startXRef.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top View Mode Switcher Header */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
        <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40">
          HAUTE COUTURE STAGE
        </Badge>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
              viewMode === 'photo'
                ? 'bg-[#D4AF37] text-[#0C0B0A] font-bold border-[#D4AF37] shadow-glow-gold'
                : 'bg-[#1C1B18] text-[#9E9A93] border-[#D4AF37]/20 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>STUDIO PHOTOS</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#0C0B0A] font-bold border-[#00F0FF] shadow-glow-cyan'
                : 'bg-[#1C1B18] text-[#9E9A93] border-[#00F0FF]/30 hover:text-[#00F0FF]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>REALTIME 3D CAD</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      {viewMode === '3d' ? (
        <GarmentViewer3D productName={productName} />
      ) : (
        <>
          {/* Primary Display Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative aspect-[3/4] w-full rounded-md bg-obsidian-void border border-glass-border-medium overflow-hidden group select-none shadow-glass-lg"
          >
            <img
              src={galleryImages[activeIndex]?.url}
              alt={galleryImages[activeIndex]?.alt_text || productName}
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-magnetic group-hover:scale-110"
            />

            {/* 360° Drag Helper Overlay */}
            {is360Mode && (
              <div className="absolute inset-0 bg-obsidian-base/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 rounded-sm bg-obsidian-base/80 border border-accent-cyan text-accent-cyan font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan animate-pulse">
                  <Rotate3D className="w-4 h-4" /> DRAG LEFT / RIGHT TO ROTATE 360°
                </div>
              </div>
            )}

            {/* 360 Rotation Toggle Overlay */}
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={() => setIs360Mode((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-obsidian-base/80 backdrop-blur-md border border-glass-border-medium hover:border-accent-cyan text-riiqxText-secondary hover:text-accent-cyan font-mono text-xs cursor-pointer transition-colors"
              >
                <Rotate3D className="w-3.5 h-3.5" />
                <span>{is360Mode ? 'EXIT 360°' : '360° VIEW'}</span>
              </button>
            </div>

            {/* Model Spec Overlay */}
            <div className="absolute bottom-4 left-4 pointer-events-none">
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-sm bg-obsidian-base/80 backdrop-blur-md border border-glass-border-subtle text-riiqxText-muted uppercase">
                MODEL: 6'1" (185CM) // WEARING SIZE L
              </span>
            </div>
          </div>

          {/* Thumbnails Navigation Row */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={img.id || idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIs360Mode(false);
                  }}
                  className={`relative aspect-[4/5] rounded-sm overflow-hidden border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-[#D4AF37] shadow-glow-gold scale-105'
                      : 'border-glass-border-subtle opacity-60 hover:opacity-100 hover:border-glass-border-medium'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
