'use client';

import { useState } from 'react';
import { CheckoutLayout } from '@/components/checkout/CheckoutLayout';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCartStore } from '@/store/useCartStore';
import { createCart } from '@/lib/shopify';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState<'info' | 'shipping' | 'payment'>('info');
    const { items, clearCart } = useCartStore();

    const handleStepChange = (step: 'info' | 'shipping' | 'payment') => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleComplete = async (data: any) => {
        try {
            if (items.length === 0) {
                toast.error("Your cart is empty.");
                return;
            }

            // Transform local cart items to Shopify CartLineInput
            // Note: We need the merchandiseId (Variant ID)
            const lines = items.map(item => ({
                merchandiseId: item.variantId || '', // Check if variantId is missing
                quantity: item.quantity
            })).filter(line => line.merchandiseId);

            if (lines.length === 0) {
                toast.error("Invalid items in cart. Please clear and try again.");
                return;
            }

            // Create Cart on Shopify
            const cart = await createCart(lines);

            if (cart && cart.checkoutUrl) {
                // Optional: Attach buyer info if API supports it here, usually done via identity mutation
                // But simplified for headless: Just redirect.

                // Clear local cart?? 
                // Standard practice: Don't clear until success, BUT if we redirect they might lose context.
                // Usually we keep it until they land on 'thank you' or webhook clears it.
                // Or clear it now assuming they go to Shopify.
                // Let's NOT clear it yet, to prevent data loss if they go back.

                toast.success("Redirecting to Secure Checkout...");
                window.location.href = cart.checkoutUrl;
            } else {
                throw new Error("Failed to generate checkout URL");
            }

        } catch (error) {
            console.error("Checkout Error:", error);
            toast.error("Something went wrong initializing checkout.");
        }
    };

    return (
        <CheckoutLayout currentStep={currentStep}>
            <CheckoutForm
                onStepChange={handleStepChange}
                onComplete={handleComplete}
            />
        </CheckoutLayout>
    );
}
