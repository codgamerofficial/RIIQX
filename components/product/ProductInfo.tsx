'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Heading, Text } from '@/components/ui/Typography';
import { PincodeDeliveryEstimator } from '@/components/product/PincodeDeliveryEstimator';
import { FitPredictorModal } from '@/components/product/FitPredictorModal';
import { ShieldCheck, Truck, RotateCcw, Ruler, Sparkles, AlertTriangle } from 'lucide-react';
import type { Product } from '@/lib/mock/homepage';
import type { ProductVariant } from '@/components/product/VariantSelector';

export interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  onSelectSize?: (size: string) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedVariant = product.variants?.[0] || null,
  onSelectSize,
}) => {
  const [isFitModalOpen, setIsFitModalOpen] = useState(false);
  const categoryName = product.category?.name || 'HAUTE COUTURE';

  // Price calculations
  const effectivePrice =
    selectedVariant?.price_override ?? product.sale_price ?? product.base_price;
  const originalPrice = selectedVariant?.price_override
    ? product.base_price
    : product.sale_price
    ? product.base_price
    : null;

  const stockCount = selectedVariant?.stock_quantity ?? 5;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const metadata = (product.metadata as Record<string, any>) || {};

  return (
    <div className="space-y-6">
      {/* Category & Status Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="gold" shape="chamfer" dot className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40">
            {categoryName}
          </Badge>
          <span className="font-mono text-xs text-riiqxText-muted">// SKU: {selectedVariant?.sku || 'RIIQX-HD-520'}</span>
        </div>

        <Heading size="3xl" font="display" className="text-white tracking-wide">
          {product.name}
        </Heading>
      </div>

      {/* Pricing Matrix */}
      <div className="flex items-baseline gap-4 font-mono p-4 rounded-md bg-[#141312] border border-[#D4AF37]/25 shadow-glow-gold">
        <span className="font-display font-black text-3xl text-white">
          ₹{effectivePrice.toLocaleString('en-IN')}
        </span>

        {originalPrice && (
          <span className="text-base text-riiqxText-muted line-through">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}

        {originalPrice && (
          <Badge variant="gold" shape="chamfer" className="ml-auto bg-[#D4AF37] text-[#0C0B0A] font-bold">
            SAVE ₹{(originalPrice - effectivePrice).toLocaleString('en-IN')}
          </Badge>
        )}
      </div>

      {/* Low Stock Scarcity Counter (Bewakoof/Nike Trigger) */}
      {isLowStock && (
        <div className="p-3 rounded-sm bg-[#1C1B18] border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs flex items-center justify-between font-bold animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F3E5AB]" />
            <span>ONLY {stockCount} UNITS REMAINING IN STOCK</span>
          </div>
          <span className="text-[10px] text-[#F3E5AB]">HIGH DEMAND</span>
        </div>
      )}

      {/* Fit Predictor Launcher (Zara / Nike Style) */}
      <button
        type="button"
        onClick={() => setIsFitModalOpen(true)}
        className="w-full py-2.5 px-4 rounded-sm bg-[#141312] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F3E5AB] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#D4AF37]" /> UNSURE OF YOUR SIZE? FIT PREDICTOR
        </span>
        <span className="text-[#D4AF37] text-[10px]">SMART FIT AI →</span>
      </button>

      {/* Description */}
      <Text size="sm" variant="secondary" className="leading-relaxed">
        {product.description}
      </Text>

      {/* Pincode Delivery Estimator */}
      <PincodeDeliveryEstimator />

      {/* Textile Specs Bullet List */}
      {metadata.specs && Array.isArray(metadata.specs) && (
        <div className="space-y-2 pt-2">
          <span className="font-mono text-xs text-[#D4AF37] uppercase tracking-wider block font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F3E5AB]" /> GARMENT SPECIFICATIONS // MATRIX
          </span>
          <ul className="space-y-1.5 font-mono text-xs text-riiqxText-secondary">
            {metadata.specs.map((spec: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Value Proposition Micro Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#D4AF37]/15 font-mono text-[10px] text-riiqxText-muted">
        <div className="flex items-center gap-1.5 p-2 rounded-sm bg-white/5 border border-[#D4AF37]/15">
          <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>FREE AIR FREIGHT OVER ₹15,000</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-sm bg-white/5 border border-[#D4AF37]/15">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>NFC HARDWARE SERIAL</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-sm bg-white/5 border border-[#D4AF37]/15">
          <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>7-DAY DISPATCH REPLACEMENT</span>
        </div>
      </div>

      {/* Smart Fit Predictor Modal */}
      <FitPredictorModal
        isOpen={isFitModalOpen}
        onClose={() => setIsFitModalOpen(false)}
        onSelectSize={(size) => {
          if (onSelectSize) onSelectSize(size);
        }}
      />
    </div>
  );
};
