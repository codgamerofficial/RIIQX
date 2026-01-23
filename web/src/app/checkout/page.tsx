"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { redirectToCheckout } from "@/app/actions/checkout";

export default function CheckoutPage() {
    const { items } = useCartStore();
    const [error, setError] = useState("");

    useEffect(() => {
        const initCheckout = async () => {
            if (items.length === 0) {
                window.location.href = "/cart"; // Or handle empty cart
                return;
            }

            try {
                const result = await redirectToCheckout(items);
                if (result.url) {
                    window.location.href = result.url;
                } else {
                    setError("Could not initiate checkout. Please try again.");
                }
            } catch (err) {
                console.error(err);
                setError("An unexpected error occurred.");
            }
        };

        const timeout = setTimeout(() => {
            initCheckout();
        }, 1000); // Small delay for UX

        return () => clearTimeout(timeout);
    }, [items]);

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-rich-black text-white">
                <p className="text-neon-red mb-4">{error}</p>
                <a href="/cart" className="underline text-white/60 hover:text-white">Return to Cart</a>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-rich-black z-50 fixed top-0 left-0">
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-cherry-red/20 flex items-center justify-center border border-cherry-red/50 relative">
                    <div className="absolute inset-0 bg-cherry-red/20 rounded-full animate-ping" />
                    <Lock className="w-8 h-8 text-cherry-red" />
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">
                        Securing Checkout
                    </h1>
                    <p className="text-white/50 text-sm font-medium flex items-center gap-2 justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to Shopify...
                    </p>
                </div>
            </div>
        </div>
    );
}
