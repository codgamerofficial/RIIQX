"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Package, MapPin, Clock } from "lucide-react";

export default function AccountDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    const cards = [
        {
            title: "Total Orders",
            value: "0",
            icon: Package,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            title: "Saved Addresses",
            value: "0",
            icon: MapPin,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            title: "Member Since",
            value: new Date(user?.created_at).getFullYear().toString(),
            icon: Clock,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">My Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, <span className="text-white font-semibold">{user?.user_metadata?.full_name || user?.email}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-neutral-800/50 border border-white/5 p-6 rounded-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    {card.title}
                                </p>
                                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Placeholder */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
                <div className="bg-neutral-800/30 border border-white/5 rounded-xl p-8 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No orders found yet.</p>
                </div>
            </div>
        </div>
    );
}
