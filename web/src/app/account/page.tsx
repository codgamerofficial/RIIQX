"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };

        getUser();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    const menuItems = [
        { icon: User, label: "My Profile", href: "/account/profile", description: "Manage your personal information" },
        { icon: Package, label: "My Orders", href: "/account/orders", description: "Track and manage your orders" },
        { icon: Heart, label: "Wishlist", href: "/wishlist", description: "View your saved products" },
        { icon: MapPin, label: "Addresses", href: "/account/addresses", description: "Manage delivery addresses" },
        { icon: Settings, label: "Settings", href: "/account/settings", description: "Account preferences" },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-2 font-montserrat">
                        My Account
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.user_metadata?.name || user?.email}
                    </p>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group bg-neutral-900 border border-white/10 rounded-xl p-6 hover:border-bewakoof-yellow transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-bewakoof-yellow/10 rounded-lg flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-bewakoof-yellow" />
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-bewakoof-yellow transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.label}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </Link>
                        );
                    })}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-neon-red hover:text-red-400 transition-colors font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
