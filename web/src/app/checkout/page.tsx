"use client";

import { useCartStore } from "@/store/useCartStore";
import { NeonButton } from "@/components/ui/neon-button";
import { Loader2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { createCart } from "@/lib/shopify";
import { CartLineInput } from "@/lib/shopify/types";

export default function CheckoutPage() {
    const { items, getCartTotal } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            // Convert zustand cart items to Shopify CartLineInputs
            const lines: CartLineInput[] = items.map((item) => ({
                merchandiseId: item.variantId || item.id, // Ensure this maps to a valid Variant ID (gid://shopify/ProductVariant/...)
                quantity: item.quantity,
            }));

            // Create cart on Shopify
            const cart = await createCart(lines);

            // Redirect to Shopify Checkout
            if (cart.checkoutUrl) {
                window.location.href = cart.checkoutUrl;
            } else {
                throw new Error("No checkout URL returned from Shopify.");
            }
        } catch (err: any) {
            console.error("Checkout Error:", err);
            setError(err.message || "Failed to start checkout. Please try again.");
            setLoading(false);
        }
    };

    // Auto-redirect if user lands here directly (optional, but good UX)
    // useEffect(() => {
    //     if (items.length > 0) {
    //         handleCheckout();
    //     }
    // }, []);

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8">Add some awesome gear to get started.</p>
                <NeonButton onClick={() => window.location.href = "/shop"}>
                    Return to Shop
                </NeonButton>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-card border border-white/5 rounded-2xl p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Items ({items.length})</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-white/10">
                        <span>Total</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <NeonButton
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full py-6 text-lg"
                    glow
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span className="animate-pulse">Redirecting to Shopify...</span>
                        </div>
                    ) : (
                        "Proceed to Secure Checkout"
                    )}
                </NeonButton>

                <div className="mt-8 flex flex-col items-center space-y-3 opacity-60">
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-muted-foreground">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                        </svg>
                        <span>Secured by Shopify</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
