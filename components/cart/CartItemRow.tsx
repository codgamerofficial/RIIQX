'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/store/useCartStore';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="p-3.5 rounded-sm bg-charcoal-matte/70 border border-glass-border-subtle hover:border-glass-border-medium transition-all duration-200 flex items-center gap-3.5 group">
      {/* Product Image Thumbnail */}
      <Link href={`/products/${item.slug}`} className="block shrink-0">
        <div className="w-16 h-20 rounded-sm bg-obsidian-base border border-glass-border-subtle overflow-hidden relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Item Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <Link href={`/products/${item.slug}`}>
          <h4 className="font-sans font-bold text-xs text-white hover:text-accent-crimson transition-colors truncate">
            {item.name}
          </h4>
        </Link>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-riiqxText-muted">
          <span>{item.color}</span>
          <span>•</span>
          <span className="text-accent-cyan font-bold">SIZE {item.size}</span>
        </div>

        <div className="font-mono font-bold text-xs text-accent-crimson pt-0.5">
          ₹{item.price.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Quantity Adjuster & Delete Button */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onRemove(item.variantId)}
          className="text-riiqxText-muted hover:text-status-error transition-colors p-1 cursor-pointer"
          aria-label="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Quantity Controls */}
        <div className="flex items-center rounded-sm bg-obsidian-base border border-glass-border-subtle p-0.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
            className="w-6 h-6 rounded-xs flex items-center justify-center text-riiqxText-muted hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center font-bold text-white text-[11px]">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={item.quantity >= item.maxStock}
            onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
            className="w-6 h-6 rounded-xs flex items-center justify-center text-riiqxText-muted hover:text-white hover:bg-white/5 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
