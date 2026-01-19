"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, CreditCard, Truck, Package } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";

type CheckoutStep = "address" | "payment" | "review";

interface Address {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getCartTotal, clearCart } = useCartStore();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
    const [address, setAddress] = useState<Address>({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");

    const subtotal = getCartTotal();
    const shipping = subtotal > 5000 ? 0 : 200;
    const total = subtotal + shipping;

    const steps = [
        { id: "address", label: "Delivery Address", icon: Truck },
        { id: "payment", label: "Payment Method", icon: CreditCard },
        { id: "review", label: "Review Order", icon: Package },
    ];

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentStep("payment");
    };

    const handlePlaceOrder = async () => {
        try {
            // 1. Create Razorpay Order
            const response = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total * 100, // Amount in paise
                    currency: "INR",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order');
            }

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "RIIQX Store",
                description: "Purchase from RIIQX",
                // image: "/logo.png", // Add your logo here
                order_id: data.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        const verifyResponse = await fetch('/api/razorpay/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(verifyData.error || 'Payment verification failed');
                        }

                        // 4. Success
                        clearCart();
                        // alert("Payment Successful!");
                        router.push('/shop'); // Or a success page
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        alert(error.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: address.name,
                    email: "user@example.com", // You might want to collect email
                    contact: address.phone,
                },
                theme: {
                    color: "#F4C753", // Bewakoof Yellow or your brand color
                },
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(error.message || 'Failed to initiate payment');
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-24">
                        <h1 className="text-4xl font-black text-white uppercase mb-4">Cart is Empty</h1>
                        <Link href="/shop">
                            <button className="bewakoof-btn bewakoof-btn-primary px-8 py-4">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-8 font-montserrat">
                        Checkout
                    </h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between max-w-3xl">
                        {steps.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
                                                isCompleted
                                                    ? "bg-bewakoof-green border-bewakoof-green"
                                                    : isActive
                                                        ? "bg-bewakoof-yellow border-bewakoof-yellow"
                                                        : "bg-neutral-900 border-white/20"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-6 h-6 text-white" />
                                            ) : (
                                                <StepIcon
                                                    className={cn(
                                                        "w-6 h-6",
                                                        isActive ? "text-black" : "text-white/50"
                                                    )}
                                                />
                                            )}
                                        </div>
                                        <span
                                            className={cn(
                                                "mt-2 text-xs font-bold uppercase",
                                                isActive ? "text-white" : "text-muted-foreground"
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                "h-0.5 flex-1 mx-4",
                                                isCompleted ? "bg-bewakoof-green" : "bg-white/10"
                                            )}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Address */}
                            {currentStep === "address" && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-neutral-900 border border-white/10 rounded-xl p-8"
                                >
                                    <h2 className="text-2xl font-black text-white uppercase mb-6">
                                        Delivery Address
                                    </h2>
                                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-white uppercase mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.name}
                                                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-white uppercase mb-2">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={address.phone}
                                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-white uppercase mb-2">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={address.addressLine1}
                                                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-white uppercase mb-2">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                value={address.addressLine2}
                                                onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                                                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-white uppercase mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-white uppercase mb-2">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.state}
                                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-white uppercase mb-2">
                                                    Pincode *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.pincode}
                                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bewakoof-btn bewakoof-btn-primary py-4 mt-6"
                                        >
                                            Continue to Payment
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === "payment" && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-neutral-900 border border-white/10 rounded-xl p-8"
                                >
                                    <h2 className="text-2xl font-black text-white uppercase mb-6">
                                        Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { id: "card", label: "Credit/Debit Card", icon: "💳" },
                                            { id: "upi", label: "UPI", icon: "📱" },
                                            { id: "cod", label: "Cash on Delivery", icon: "💵" },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={cn(
                                                    "w-full border-2 rounded-lg p-4 flex items-center gap-4 transition-all",
                                                    paymentMethod === method.id
                                                        ? "border-bewakoof-yellow bg-bewakoof-yellow/10"
                                                        : "border-white/20 hover:border-white/40"
                                                )}
                                            >
                                                <span className="text-2xl">{method.icon}</span>
                                                <span className="text-white font-bold">{method.label}</span>
                                                {paymentMethod === method.id && (
                                                    <Check className="w-5 h-5 text-bewakoof-yellow ml-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button
                                            onClick={() => setCurrentStep("address")}
                                            className="flex-1 bewakoof-btn bewakoof-btn-secondary py-4"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep("review")}
                                            className="flex-1 bewakoof-btn bewakoof-btn-primary py-4"
                                        >
                                            Review Order
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === "review" && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Address Summary */}
                                    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-lg font-black text-white uppercase mb-4">
                                            Delivery Address
                                        </h3>
                                        <p className="text-white">{address.name}</p>
                                        <p className="text-muted-foreground">{address.phone}</p>
                                        <p className="text-muted-foreground mt-2">
                                            {address.addressLine1}, {address.addressLine2}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-lg font-black text-white uppercase mb-4">
                                            Payment Method
                                        </h3>
                                        <p className="text-white capitalize">{paymentMethod.replace("_", " ")}</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setCurrentStep("payment")}
                                            className="flex-1 bewakoof-btn bewakoof-btn-secondary py-4"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            className="flex-1 bewakoof-btn bewakoof-btn-primary py-4"
                                        >
                                            Place Order
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-black text-white uppercase mb-6">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="flex gap-3">
                                        <div className="relative w-16 h-16 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-bold line-clamp-1">{item.title}</p>
                                            <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                                            <p className="text-white text-sm font-bold mt-1">
                                                {formatPrice((item.price * item.quantity).toString(), "INR")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-t border-white/10 pt-6">
                                <div className="flex justify-between text-white">
                                    <span>Subtotal</span>
                                    <span className="font-bold">{formatPrice(subtotal.toString(), "INR")}</span>
                                </div>
                                <div className="flex justify-between text-white">
                                    <span>Shipping</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? "FREE" : formatPrice(shipping.toString(), "INR")}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-2xl font-black text-white uppercase">
                                <span>Total</span>
                                <span>{formatPrice(total.toString(), "INR")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
