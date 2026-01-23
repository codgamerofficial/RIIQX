"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Truck, Package } from "lucide-react";
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

    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");

    const steps = [
        { id: "address", label: "Delivery Address", icon: Truck },
        { id: "payment", label: "Payment Method", icon: CreditCard },
        { id: "review", label: "Review Order", icon: Package },
    ];

    useEffect(() => {
        const fetchAddresses = async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                if (data && data.length > 0) {
                    setSavedAddresses(data);
                    // Optional: Auto-fill default address
                    const defaultAddr = data.find((a: any) => a.is_default) || data[0];
                    fillAddress(defaultAddr);
                    setSelectedAddressId(defaultAddr.id);
                }
            }
        };
        fetchAddresses();
    }, []);

    const fillAddress = (addr: any) => {
        setAddress({
            name: addr.full_name || "",
            phone: addr.phone || "",
            addressLine1: addr.street_address || "",
            addressLine2: addr.apt_suite || "",
            city: addr.city || "",
            state: addr.state || "",
            pincode: addr.zip_code || "",
        });
    };

    const handleSavedAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const addrId = e.target.value;
        setSelectedAddressId(addrId);
        if (addrId) {
            const addr = savedAddresses.find(a => a.id === addrId);
            if (addr) fillAddress(addr);
        } else {
            setAddress({
                name: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pincode: "",
            });
        }
    };

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const options: any = {
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
                        await saveOrderToSupabase(response.razorpay_order_id, data.amount / 100);
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

    const saveOrderToSupabase = async (razorpayOrderId: string, amount: number) => {
        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return; // Don't save for guest checkout if we don't support it in DB yet

            const orderId = `ORN-${Math.floor(Math.random() * 1000000)}`;

            const { error } = await supabase.from('orders').insert({
                user_id: user.id,
                shopify_order_id: razorpayOrderId, // Using Razorpay Order ID as unique identifier for now
                order_number: orderId,
                total_price: amount,
                currency_code: "INR",
                status: "paid",
                fulfillment_status: "unfulfilled",
                items: items,
                shipping_address: address,
                created_at: new Date().toISOString()
            });

            if (error) {
                console.error("Failed to save order:", error);
            }
        } catch (err) {
            console.error("Error saving order:", err);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-rich-black pt-24 pb-12 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                        <h1 className="text-4xl font-black font-display text-white uppercase mb-6 tracking-widest">Cart is Empty</h1>
                        <p className="text-white/60 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Browse our collections to find your next fit.</p>
                        <Link href="/">
                            <button className="bg-cherry-red text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(227,28,121,0.5)] transition-all hover:scale-105 active:scale-95">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rich-black pt-24 pb-12 font-sans selection:bg-cherry-red selection:text-white">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tighter mb-8 leading-none">
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
                                                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                isCompleted
                                                    ? "bg-gold border-gold"
                                                    : isActive
                                                        ? "bg-cherry-red border-cherry-red shadow-[0_0_15px_rgba(227,28,121,0.5)]"
                                                        : "bg-white/5 border-white/10"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-6 h-6 text-black" />
                                            ) : (
                                                <StepIcon
                                                    className={cn(
                                                        "w-5 h-5",
                                                        isActive ? "text-white" : "text-white/40"
                                                    )}
                                                />
                                            )}
                                        </div>
                                        <span
                                            className={cn(
                                                "mt-3 text-[10px] font-bold uppercase tracking-widest",
                                                isActive ? "text-white" : "text-white/40"
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                "h-0.5 flex-1 mx-4 transition-all duration-500",
                                                isCompleted ? "bg-gold" : "bg-white/10"
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
                                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                                >
                                    <h2 className="text-2xl font-black font-display text-white uppercase mb-8 flex items-center gap-3">
                                        <span className="text-cherry-red">01.</span> Delivery Address
                                    </h2>

                                    {savedAddresses.length > 0 && (
                                        <div className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
                                                Use Saved Address
                                            </label>
                                            <select
                                                value={selectedAddressId}
                                                onChange={handleSavedAddressChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cherry-red focus:outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="">-- Add New Address --</option>
                                                {savedAddresses.map((addr) => (
                                                    <option key={addr.id} value={addr.id}>
                                                        {addr.full_name} - {addr.street_address}, {addr.city} {addr.is_default ? '(Default)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <form onSubmit={handleAddressSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.name}
                                                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={address.phone}
                                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={address.addressLine1}
                                                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                placeholder="Street address, house number"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                value={address.addressLine2}
                                                onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                placeholder="Apartment, suite, unit, etc."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.state}
                                                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                                                    Pincode *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={address.pincode}
                                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-4 text-white focus:border-cherry-red focus:outline-none transition-colors placeholder:text-white/20"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-cherry-red to-red-700 text-white py-5 rounded-lg font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(227,28,121,0.5)] transition-all mt-6 active:scale-[0.99]"
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
                                    className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                                >
                                    <h2 className="text-2xl font-black font-display text-white uppercase mb-8 flex items-center gap-3">
                                        <span className="text-cherry-red">02.</span> Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { id: "gpay", label: "Google Pay", icon: "💳" },
                                            { id: "phonepe", label: "PhonePe", icon: "📱" },
                                            { id: "razorpay", label: "Razorpay", icon: "💳" },
                                            { id: "card", label: "Credit/Debit Card", icon: "💳" },
                                            { id: "cod", label: "Cash on Delivery", icon: "💵" },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={cn(
                                                    "w-full border rounded-xl p-5 flex items-center gap-4 transition-all group",
                                                    paymentMethod === method.id
                                                        ? "border-cherry-red bg-cherry-red/10"
                                                        : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/5"
                                                )}
                                            >
                                                <span className="text-2xl group-hover:scale-110 transition-transform">{method.icon}</span>
                                                <span className="text-white font-bold">{method.label}</span>
                                                {paymentMethod === method.id && (
                                                    <Check className="w-5 h-5 text-cherry-red ml-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={() => setCurrentStep("address")}
                                            className="flex-1 py-4 text-white/50 font-bold uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setCurrentStep("review")}
                                            className="flex-[2] bg-white text-black py-4 rounded-lg font-black uppercase tracking-widest hover:bg-gold transition-colors"
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
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                        <h3 className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">
                                            Delivery Address
                                        </h3>
                                        <p className="text-white font-bold text-lg">{address.name}</p>
                                        <p className="text-white/60 mb-2">{address.phone}</p>
                                        <p className="text-white/80 mt-2 leading-relaxed">
                                            {address.addressLine1}, {address.addressLine2}<br />
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                        <h3 className="text-xs font-black text-white/50 uppercase tracking-widest mb-4">
                                            Payment Method
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-white font-bold capitalize">{paymentMethod.replace("_", " ")}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={() => setCurrentStep("payment")}
                                            className="flex-1 py-4 text-white/50 font-bold uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            className="flex-[2] bg-gradient-to-r from-cherry-red to-red-700 text-white py-4 rounded-lg font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(227,28,121,0.6)] transition-all active:scale-[0.99]"
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
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24 backdrop-blur-md">
                            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/10">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                {items.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="flex gap-4 group">
                                        <div className="relative w-16 h-20 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-bold line-clamp-2 leading-tight">{item.title}</p>
                                            <p className="text-white/40 text-xs mt-1">Qty: {item.quantity}</p>
                                            <p className="text-cherry-red text-sm font-bold mt-1">
                                                {formatPrice((item.price * item.quantity).toString(), "INR")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-t border-white/10 pt-6">
                                <div className="flex justify-between text-white/70 text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">{formatPrice(subtotal.toString(), "INR")}</span>
                                </div>
                                <div className="flex justify-between text-white/70 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-gold font-bold">
                                        {shipping === 0 ? "FREE" : formatPrice(shipping.toString(), "INR")}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                                <span className="text-lg font-bold text-white uppercase">Total</span>
                                <span className="text-2xl font-black text-white tracking-tight">{formatPrice(total.toString(), "INR")}</span>
                            </div>

                            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/5">
                                <p className="text-[10px] text-white/40 text-center uppercase tracking-widest">
                                    Secure SSL Encryption • 100% Genuine Products
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
