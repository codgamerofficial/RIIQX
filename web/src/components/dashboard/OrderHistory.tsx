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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Drop History</h2>
                <button className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">View All</button>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="group bg-black/40 border border-white/5 rounded-xl p-5 hover:border-[#D9F99D]/50 transition-all duration-300 cursor-pointer"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#D9F99D]/10 transition-colors">
                                    <Package className="w-6 h-6 text-white/70 group-hover:text-[#D9F99D] transition-colors" />
                                </div>
                                <div>
                                    <p className="font-mono text-xs text-[#D9F99D] mb-1">#{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-white/40 uppercase font-bold tracking-wide">
                                        {new Date(order.created_at || "").toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 flex-1">
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase font-bold mb-1 pt-2 sm:pt-0">Total</p>
                                    <p className="text-sm font-bold text-white">${order.total_amount.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="capitalize">{order.status}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
