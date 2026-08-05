'use client';

import React, { useState } from 'react';
import { useCartStore, useCartHydration } from '@/store/useCartStore';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { AddressForm } from '@/components/checkout/AddressForm';
import { CouponCodeInput } from '@/components/checkout/CouponCodeInput';
import { OrderSummaryPanel } from '@/components/checkout/OrderSummaryPanel';
import { PaymentTrigger } from '@/components/checkout/PaymentTrigger';
import { Heading, Text } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const isHydrated = useCartHydration();
  const { items, getSubtotal, getDiscountAmount, shippingCost, getGrandTotal } = useCartStore();

  const [address, setAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  if (!isHydrated) return null;

  const subtotal = getSubtotal();
  const discountAmount = couponDiscount || getDiscountAmount();
  const taxAmount = Math.round((subtotal - discountAmount) * 0.12);
  const calculatedShipping = subtotal >= 15000 ? 0 : 499;
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount + calculatedShipping);

  const cartPayloadItems = items.map((i) => ({
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson flex flex-col justify-between">
        <CheckoutHeader />
        <main className="max-w-2xl mx-auto px-6 py-24 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-charcoal-matte border border-glass-border-medium flex items-center justify-center mx-auto text-accent-cyan">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <Heading size="3xl" font="display">
            YOUR CART IS EMPTY
          </Heading>
          <Text size="sm" variant="muted">
            Add technical streetwear items to your cart before proceeding to checkout.
          </Text>
          <Link href="/collections/all">
            <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              RETURN TO CATALOG
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white pb-20">
      <CheckoutHeader />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="crimson" shape="chamfer" dot>
                SECURE CHECKOUT PROTOCOL
              </Badge>
              <span className="font-mono text-xs text-accent-cyan tracking-widest">// STEP 1 OF 1</span>
            </div>
            <Heading size="3xl" font="display">
              DISPATCH & PAYMENT PROTOCOL
            </Heading>
          </div>

          <Link href="/collections/all">
            <span className="font-mono text-xs text-riiqxText-muted hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> BACK TO BAG
            </span>
          </Link>
        </div>

        {/* 2-Column Checkout Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Shipping Address & Coupon */}
          <div className="lg:col-span-7 space-y-6">
            <AddressForm address={address} onChange={setAddress} />

            <CouponCodeInput
              subtotal={subtotal}
              onCouponApplied={(code, amount) => {
                setAppliedCouponCode(code);
                setCouponDiscount(amount);
              }}
              onCouponRemoved={() => {
                setAppliedCouponCode('');
                setCouponDiscount(0);
              }}
            />

            <PaymentTrigger
              items={cartPayloadItems}
              shippingAddress={address}
              couponCode={appliedCouponCode}
              grandTotal={grandTotal}
            />
          </div>

          {/* Right Column: Order Summary Panel */}
          <div className="lg:col-span-5">
            <OrderSummaryPanel
              items={items}
              subtotal={subtotal}
              discountAmount={discountAmount}
              taxAmount={taxAmount}
              shippingFee={calculatedShipping}
              grandTotal={grandTotal}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
