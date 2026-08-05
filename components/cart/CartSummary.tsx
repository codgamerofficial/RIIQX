'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Tag, CheckCircle2, X } from 'lucide-react';
import type { AppliedCoupon } from '@/store/useCartStore';

export interface CartSummaryProps {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  grandTotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discountAmount,
  shippingCost,
  grandTotal,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setIsApplying(true);
    setErrorMsg('');

    const success = await onApplyCoupon(couponCode);
    setIsApplying(false);

    if (!success) {
      setErrorMsg('INVALID OR EXPIRED COUPON CODE (TRY "CYBER10")');
    } else {
      setCouponCode('');
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-glass-border-subtle font-mono text-xs">
      {/* Coupon Form or Active Badge */}
      {appliedCoupon ? (
        <div className="p-3 rounded-sm bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent-cyan font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>COUPON APPLIED: {appliedCoupon.code}</span>
            <span className="text-[10px] text-white">
              ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : `₹${appliedCoupon.discountValue} OFF`})
            </span>
          </div>
          <button
            onClick={onRemoveCoupon}
            className="text-riiqxText-muted hover:text-accent-crimson cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ENTER COUPON (e.g. CYBER10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-obsidian-base border border-glass-border-subtle rounded-sm px-3 py-2 text-xs uppercase font-sans text-white focus:outline-none focus:border-accent-cyan placeholder:text-riiqxText-disabled"
            />
            <Button variant="cyan" size="sm" isLoading={isApplying} type="submit">
              APPLY
            </Button>
          </div>
          {errorMsg && <p className="text-[10px] text-status-error">{errorMsg}</p>}
        </form>
      )}

      {/* Financial Ledger Breakdown */}
      <div className="space-y-2 text-riiqxText-secondary pt-2">
        <div className="flex items-center justify-between">
          <span>SUBTOTAL:</span>
          <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-accent-cyan">
            <span>PROMO DISCOUNT:</span>
            <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>EXPRESS SHIPPING:</span>
          <span className="text-status-success font-bold">
            {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-glass-border-subtle text-white font-black">
          <span>GRAND TOTAL:</span>
          <span className="text-accent-crimson text-base">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full py-4 shadow-glow-crimson tracking-widest font-bold"
        onClick={onCheckout}
        rightIcon={<CheckCircle2 className="w-4 h-4" />}
      >
        PROCEED TO CHECKOUT // ₹{grandTotal.toLocaleString('en-IN')}
      </Button>
    </div>
  );
};
