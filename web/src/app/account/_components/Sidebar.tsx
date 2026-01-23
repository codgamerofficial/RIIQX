"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/account", icon: LayoutDashboard },
    { name: "Orders", href: "/account/orders", icon: Package },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Profile Details", href: "/account/profile", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <nav className="space-y-2 sticky top-24">
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                            isActive
                                ? "bg-bewakoof-yellow text-black shadow-lg shadow-bewakoof-yellow/20"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-current")} />
                        {item.name}
                    </Link>
                );
            })}

            <div className="pt-4 mt-4 border-t border-white/10">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-neon-red hover:bg-neon-red/10 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </nav>
    );
}
