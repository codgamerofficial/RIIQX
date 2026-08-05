'use client';

import React from 'react';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Truck, Lock } from 'lucide-react';
import type { CartItem } from '@/store/useCartStore';

export interface OrderSummaryPanelProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
}

export const OrderSummaryPanel: React.FC<OrderSummaryPanelProps> = ({
  items,
  subtotal,
  discountAmount,
  taxAmount,
  shippingFee,
  grandTotal,
}) => {
  return (
    <div className="p-6 rounded-md bg-charcoal-matte/80 backdrop-blur-xl border border-glass-border-medium shadow-glass-lg space-y-6 sticky top-28">
      <div className="flex items-center justify-between border-b border-glass-border-subtle pb-3">
        <Heading size="lg" font="display">
          ORDER SUMMARY
        </Heading>
        <Badge variant="cyan" shape="chamfer">
          {items.reduce((acc, i) => acc + i.quantity, 0)} ITEMS
        </Badge>
      </div>

      {/* Cart Items Matrix */}
      <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-1">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center gap-3 p-2.5 rounded-sm bg-obsidian-base/60 border border-glass-border-subtle"
          >
            <div className="w-12 h-14 rounded-sm overflow-hidden bg-obsidian-void border border-glass-border-subtle shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 font-mono text-xs">
              <h5 className="font-sans font-bold text-white text-xs truncate">
                {item.name}
              </h5>
              <div className="text-[10px] text-riiqxText-muted mt-0.5">
                <span>{item.color}</span> • <span>SIZE {item.size}</span>
              </div>
              <div className="text-[10px] text-accent-cyan mt-0.5">
                QTY: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
              </div>
            </div>
            <span className="font-mono font-bold text-xs text-white shrink-0">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Financial Ledger Breakdown */}
      <div className="space-y-2 pt-4 border-t border-glass-border-subtle font-mono text-xs text-riiqxText-secondary">
        <div className="flex justify-between">
          <span>ITEMS SUBTOTAL:</span>
          <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-accent-cyan">
            <span>PROMO SAVINGS:</span>
            <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>ESTIMATED GST (12%):</span>
          <span className="text-white">₹{taxAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between">
          <span>EXPRESS SHIPPING:</span>
          <span className="text-status-success font-bold">
            {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
          </span>
        </div>

        <div className="flex justify-between text-sm pt-3 border-t border-glass-border-subtle font-black text-white">
          <span>FINAL CHARGE:</span>
          <span className="text-accent-crimson text-lg">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Fulfillment Specs */}
      <div className="p-3.5 rounded-sm bg-obsidian-base/80 border border-glass-border-subtle font-mono text-[11px] text-riiqxText-muted space-y-1.5">
        <div className="flex items-center gap-1.5 text-accent-cyan">
          <Truck className="w-3.5 h-3.5" />
          <span>FULFILLED VIA QIKINK EXPRESS NETWORK</span>
        </div>
        <p>Ships in tamper-evident anti-static bag with laser-engraved NFC serial tag.</p>
      </div>
    </div>
  );
};
