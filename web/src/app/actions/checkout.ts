"use server";

import { createCart } from "@/lib/shopify";
import { CartItem } from "@/store/useCartStore";

export async function redirectToCheckout(items: CartItem[]) {
    try {
        if (!items || items.length === 0) {
            throw new Error("Cart is empty");
        }

        const lines = items.map((item) => ({
            merchandiseId: item.variantId || item.id, // Use variantId if available, otherwise fallback (though variants are preferred)
            quantity: item.quantity,
        }));

        const cart = await createCart(lines);

        if (!cart?.checkoutUrl) {
            throw new Error("Failed to create checkout URL");
        }

        return { url: cart.checkoutUrl };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { error: "Failed to initiate checkout. Please try again." };
    }
}
