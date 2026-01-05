"use client";

import { Database } from "@/types/database.types";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

type Order = Database["public"]["Tables"]["orders"]["Row"];

interface OrderHistoryProps {
    orders: Order[] | null;
}

export function OrderHistory({ orders }: OrderHistoryProps) {
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-card border border-white/5 rounded-2xl p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet.</p>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "cancelled": return <XCircle className="w-4 h-4 text-destructive" />;
            default: return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "cancelled": return "text-destructive bg-destructive/10 border-destructive/20";
            default: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-card border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Order ID</p>
                                <p className="font-mono text-sm text-white">{order.id.slice(0, 8)}...</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Date</p>
                                <p className="text-sm text-white">
                                    {new Date(order.created_at || "").toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Total</p>
                                <p className="text-sm font-bold text-white">${order.total_amount.toFixed(2)}</p>
                            </div>
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status}</span>
                                </span>
                            </div>
                        </div>
                        {/* Could add 'View Details' button here linking to dynamic order page */}
                    </div>
                ))}
            </div>
        </div>
    );
}
