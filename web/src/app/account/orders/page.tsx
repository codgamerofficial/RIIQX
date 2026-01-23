"use client";

import { useEffect, useState } from "react";
import { Package, Search, ChevronRight, ShoppingBag, Clock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { addItems } = useCartStore();
    const router = useRouter();

    const handleReorder = (items: any[]) => {
        const cartItems = items.map(item => ({
            id: item.id || item.product_id, // Fallback if id naming differs
            variantId: item.variant_id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: 1 // Default to 1 or item.quantity
        }));
        addItems(cartItems);
        router.push('/shop'); // Or open cart drawer
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                setOrders(data || []);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-white">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Order History</h1>
                <div className="bg-neutral-800/30 border border-white/5 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Once you place an order, it will appear here. Start shopping to fill your wardrobe with the latest drops.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block bewakoof-btn bewakoof-btn-primary px-8 py-3"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">Order History</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-neutral-800/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                        {/* Order Header */}
                        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Order Placed</p>
                                <p className="text-white font-medium">
                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total</p>
                                <p className="text-white font-medium">
                                    {formatPrice(order.total_price.toString(), order.currency_code)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Order #</p>
                                <p className="text-white font-medium">{order.order_number}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Status</p>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${order.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="text-white font-medium capitalize">{order.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-16 h-20 bg-neutral-900 rounded-md overflow-hidden relative border border-white/10 flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                    <ShoppingBag className="w-6 h-6 text-white/20" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium line-clamp-1">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Qty: {item.quantity} × {formatPrice(item.price.toString(), "INR")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => handleReorder(order.items)}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Buy Again
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
