"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, MapPin, Settings, LayoutDashboard } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
    isIPLTheme?: boolean;
}

export function UserMenu({ isIPLTheme = false }: UserMenuProps) {
    const router = useRouter();
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

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/");
    };

    if (loading) {
        return (
            <div className={`w-8 h-8 rounded-full animate-pulse ${isIPLTheme ? 'bg-white/20' : 'bg-neutral-200'}`} />
        );
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className={`p-2 transition-colors ${isIPLTheme
                    ? "text-white/70 hover:text-white"
                    : "text-black/70 hover:text-black"
                    }`}
                aria-label="Login"
            >
                <User className="w-5 h-5" strokeWidth={1.5} />
            </Link>
        );
    }

    return (
        <Menu as="div" className="relative">
            <div>
                <Menu.Button className="flex items-center justify-center transition-transform hover:scale-105 focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    {user.user_metadata?.avatar_url ? (
                        <div className="relative w-9 h-9 overflow-hidden rounded-full border border-white/20 hover:border-[#B4F000] transition-colors">
                            <img
                                className="h-full w-full object-cover"
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata.full_name || "User"}
                            />
                        </div>
                    ) : (
                        <div className="relative group w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#B4F000] transition-all">
                            <User className="w-4 h-4 text-white/70 group-hover:text-[#B4F000]" strokeWidth={1.5} />
                        </div>
                    )}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 -translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 -translate-y-2"
            >
                <Menu.Items className="absolute right-0 z-50 mt-4 w-72 origin-top-right bg-[#050505] border border-white/10 rounded-xl shadow-2xl p-2 outline-none">
                    {/* User Info Header */}
                    <div className="px-4 py-4 border-b border-white/5 mb-2">
                        <p className="text-sm font-bold text-white font-[family-name:var(--font-oswald)] uppercase tracking-wide truncate">
                            {user.user_metadata?.full_name || "Guest User"}
                        </p>
                        <p className="text-xs text-white/40 truncate mt-1 font-mono">
                            {user.email}
                        </p>
                    </div>

                    <div className="space-y-1">
                        {[
                            { href: "/account", label: "Dashboard", Icon: LayoutDashboard },
                            { href: "/account/orders", label: "Orders", Icon: Package },
                            { href: "/account/addresses", label: "Addresses", Icon: MapPin },
                            { href: "/account/profile", label: "Profile", Icon: Settings },
                        ].map(({ href, label, Icon }) => (
                            <Menu.Item key={href}>
                                {({ active }) => (
                                    <Link
                                        href={href}
                                        className={`group flex items-center gap-4 px-4 py-3 text-sm transition-all rounded-lg ${active
                                            ? "bg-white/5 text-white"
                                            : "text-white/60"
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 transition-colors ${active ? "text-[#B4F000]" : "text-white/40 group-hover:text-white"}`} strokeWidth={1.5} />
                                        <span className={`uppercase tracking-wider text-xs font-bold ${active ? "text-white" : ""}`}>{label}</span>
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/5">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`group flex w-full items-center gap-4 px-4 py-3 text-sm transition-all rounded-lg ${active
                                        ? "bg-red-500/10 text-red-500"
                                        : "text-white/60"
                                        }`}
                                >
                                    <LogOut className={`w-4 h-4 ${active ? "text-red-500" : "text-white/40 group-hover:text-red-500"}`} strokeWidth={1.5} />
                                    <span className="uppercase tracking-wider text-xs font-bold">Sign Out</span>
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
