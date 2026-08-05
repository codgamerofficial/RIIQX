'use client';

import React, { useState } from 'react';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { Ruler, AlertTriangle } from 'lucide-react';
import type { Database } from '@/types/database.types';

export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];

export interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
}) => {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Extract unique colors & sizes
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const currentVariant = selectedVariant || variants[0] || null;
  const activeColor = currentVariant?.color || colors[0] || 'OBSIDIAN BLACK';

  // Filter sizes for active color
  const colorVariants = variants.filter((v) => v.color === activeColor);

  const handleColorSelect = (colorName: string) => {
    const matched = variants.find((v) => v.color === colorName);
    if (matched) onVariantChange(matched);
  };

  const handleSizeSelect = (variantItem: ProductVariant) => {
    onVariantChange(variantItem);
  };

  return (
    <div className="space-y-6">
      {/* Color Swatch Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-riiqxText-muted uppercase">COLOR WAY:</span>
          <span className="text-accent-cyan font-bold uppercase">{activeColor}</span>
        </div>

        <div className="flex items-center gap-3">
          {colors.map((colorName) => {
            const isSelected = colorName === activeColor;
            return (
              <button
                key={colorName}
                onClick={() => handleColorSelect(colorName)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-sm border transition-all duration-200 cursor-pointer font-mono text-xs ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/15 text-white font-bold shadow-glow-cyan'
                    : 'border-glass-border-medium bg-charcoal-matte/80 text-riiqxText-secondary hover:border-glass-border-active'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border border-white/20 ${
                    colorName.includes('CRIMSON')
                      ? 'bg-accent-crimson'
                      : colorName.includes('CHARCOAL')
                      ? 'bg-charcoal-elevated'
                      : 'bg-obsidian-base'
                  }`}
                />
                <span>{colorName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-riiqxText-muted uppercase">SELECT SIZE:</span>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-accent-cyan hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" /> SIZE GUIDE
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {['S', 'M', 'L', 'XL', 'XXL'].map((sizeName) => {
            const variantForSize = colorVariants.find((v) => v.size === sizeName);
            const isSelected = currentVariant?.size === sizeName;
            const isOutOfStock = !variantForSize || variantForSize.status === 'out_of_stock' || variantForSize.stock_quantity <= 0;
            const isLowStock = variantForSize && variantForSize.stock_quantity > 0 && variantForSize.stock_quantity <= 3;

            return (
              <button
                key={sizeName}
                disabled={isOutOfStock}
                onClick={() => variantForSize && handleSizeSelect(variantForSize)}
                className={`relative py-3 rounded-sm border font-mono text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-accent-crimson bg-accent-crimson/20 text-white shadow-glow-crimson'
                    : isOutOfStock
                    ? 'border-glass-border-subtle bg-obsidian-base/50 text-riiqxText-disabled cursor-not-allowed line-through opacity-40'
                    : 'border-glass-border-medium bg-charcoal-matte/80 text-riiqxText-primary hover:border-glass-border-active hover:bg-white/5'
                }`}
              >
                <span>{sizeName}</span>
                {isLowStock && !isSelected && (
                  <span className="text-[9px] text-status-warning mt-0.5">{variantForSize.stock_quantity} LEFT</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Low Stock Warning Alert */}
      {currentVariant && currentVariant.stock_quantity > 0 && currentVariant.stock_quantity <= 3 && (
        <div className="p-3 rounded-sm bg-status-warning/15 border border-status-warning/40 text-status-warning font-mono text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>URGENT: ONLY {currentVariant.stock_quantity} UNITS REMAINING IN BATCH.</span>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
