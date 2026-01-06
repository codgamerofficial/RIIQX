"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { NeonButton } from "@/components/ui/neon-button";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient() as SupabaseClient<Database>;

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        zip: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    // Load Razorpay SDK
    useEffect(() => {
        const loadRazorpay = () => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Call our API to create Order
            const response = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderAmount: getCartTotal(),
                    customerName: formData.fullName,
                    customerPhone: "9999999999", // Replace with real input if collected
                    customerEmail: formData.email,
                    shippingAddress: formData,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Payment initialization failed");

            // 2. Open Razorpay Checkout
            // @ts-ignore
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: data.amount,
                currency: data.currency,
                name: "RIIQX",
                description: "Order #" + data.order_id,
                order_id: data.id, // This is the Razorpay Order ID
                handler: function (response: any) {
                    setSuccess(true);
                    clearCart();
                    // Optionally verify signature here via API call
                    console.log("Payment Success:", response);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: "9999999999",
                },
                theme: {
                    color: "#A855F7", // Primary color (Purple)
                },
            };

            // @ts-ignore
            const rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
                alert("Payment Failed: " + response.error.description);
                setLoading(false);
            });
            rzp1.open();

        } catch (error: any) {
            console.error("Checkout Error:", error);
            alert("Checkout failed: " + error.message);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-6 max-w-md"
                >
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. You will receive an email confirmation shortly.
                    </p>
                    <Link href="/shop">
                        <NeonButton className="mt-8">Continue Shopping</NeonButton>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-32 pb-12 px-4 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
                <Link href="/shop">
                    <NeonButton>Go to Shop</NeonButton>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/cart" onClick={(e) => { e.preventDefault(); router.back() }} className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mt-4">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="space-y-8">
                        <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                    <input
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                                    <input
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                        <input
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">ZIP / Postal Code</label>
                                        <input
                                            name="zip"
                                            required
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Payment</h2>
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm flex items-center">
                                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                                Payment Gateway is in Test Mode. No real charge will be made.
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-12 h-16 rounded bg-muted overflow-hidden">
                                                {/* Requires Next/Image or img */}
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-2">
                                    <span>Total</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <NeonButton
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full mt-8 py-6 text-lg"
                                glow
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order"}
                            </NeonButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
