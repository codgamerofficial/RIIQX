'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateCouponAction } from '@/app/actions/checkout';
import { Tag, CheckCircle2, AlertCircle } from 'lucide-react';

export interface CouponCodeInputProps {
  subtotal: number;
  onCouponApplied: (code: string, discountAmount: number) => void;
  onCouponRemoved: () => void;
}

export const CouponCodeInput: React.FC<CouponCodeInputProps> = ({
  subtotal,
  onCouponApplied,
  onCouponRemoved,
}) => {
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountMsg, setDiscountMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsValidating(true);
    setErrorMsg('');
    setDiscountMsg('');

    const res = await validateCouponAction(code, subtotal);
    setIsValidating(false);

    if (res.valid) {
      setAppliedCode(res.code);
      setDiscountMsg(res.message);
      onCouponApplied(res.code, res.calculatedDiscount);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRemove = () => {
    setAppliedCode('');
    setCode('');
    setDiscountMsg('');
    setErrorMsg('');
    onCouponRemoved();
  };

  return (
    <div className="p-4 rounded-md bg-charcoal-matte/70 border border-glass-border-subtle space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-accent-cyan font-bold">
        <Tag className="w-4 h-4" />
        <span>PROMO & DISPATCH COUPON</span>
      </div>

      {appliedCode ? (
        <div className="p-3 rounded-sm bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent-cyan font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{discountMsg}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-riiqxText-muted hover:text-accent-crimson underline cursor-pointer"
          >
            REMOVE
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="COUPON (e.g. CYBER10)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              status={errorMsg ? 'error' : 'default'}
              helperText={errorMsg || 'Try "CYBER10" or "FLAT1000"'}
            />
          </div>
          <Button variant="cyan" size="md" isLoading={isValidating} type="submit">
            APPLY
          </Button>
        </form>
      )}
    </div>
  );
};
