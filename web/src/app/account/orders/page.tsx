"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/shopify";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    order_items: any[];
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          order_items (*)
        `)
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setOrders(data);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [router, supabase]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="w-5 h-5 text-bewakoof-green" />;
            case "shipped":
                return <Truck className="w-5 h-5 text-bewakoof-yellow" />;
            case "cancelled":
                return <XCircle className="w-5 h-5 text-neon-red" />;
            default:
                return <Clock className="w-5 h-5 text-muted-foreground" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "text-bewakoof-green";
            case "shipped":
                return "text-bewakoof-yellow";
            case "cancelled":
                return "text-neon-red";
            default:
                return "text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
                <div className="text-white">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-2 font-montserrat">
                        My Orders
                    </h1>
                    <p className="text-muted-foreground">
                        {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </p>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="text-center py-24">
                        <Package className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">No Orders Yet</h2>
                        <p className="text-muted-foreground mb-8">
                            Start shopping to see your orders here
                        </p>
                        <button
                            onClick={() => router.push("/shop")}
                            className="bewakoof-btn bewakoof-btn-primary px-8 py-4"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-neutral-900 border border-white/10 rounded-xl p-6"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-white/10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                {order.order_number}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)}
                                                <span className={cn("text-sm font-bold uppercase", getStatusColor(order.status))}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <p className="text-2xl font-black text-white">
                                            {formatPrice(order.total_amount.toString(), "INR")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Payment: {order.payment_status}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {order.order_items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold">{item.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                                </p>
                                            </div>
                                            <p className="text-white font-bold">
                                                {formatPrice((item.price * item.quantity).toString(), "INR")}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="mt-6 pt-6 border-t border-white/10 flex gap-4">
                                    <button
                                        onClick={() => router.push(`/account/orders/${order.id}`)}
                                        className="bewakoof-btn bewakoof-btn-secondary px-6 py-2"
                                    >
                                        View Details
                                    </button>
                                    {order.status === "delivered" && (
                                        <button className="bewakoof-btn bewakoof-btn-primary px-6 py-2">
                                            Reorder
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
