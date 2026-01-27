"use server";

import { createCart } from "@/lib/shopify";
import { CartItem } from "@/store/useCartStore";

import { createClient } from "@/lib/supabase/server";

export async function redirectToCheckout(items: CartItem[]) {
    try {
        if (!items || items.length === 0) {
            throw new Error("Cart is empty");
        }

        const lines = items.map((item) => ({
            merchandiseId: item.variantId || item.id, // Use variantId if available, otherwise fallback (though variants are preferred)
            quantity: item.quantity,
        }));

        // Get user session to pre-fill checkout if logged in
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const email = session?.user?.email;

        // Note: We are passing email for pre-fill, but not customerAccessToken yet (requires Multipass or unified auth)
        const cart = await createCart(lines, undefined, email);

        if (!cart?.checkoutUrl) {
            throw new Error("Failed to create checkout URL");
        }

        return { url: cart.checkoutUrl };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { error: "Failed to initiate checkout. Please try again." };
    }
}
