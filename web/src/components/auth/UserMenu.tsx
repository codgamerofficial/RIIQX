"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, MapPin, Settings, LayoutDashboard } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
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
        return <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />;
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="p-2 text-white hover:text-bewakoof-yellow transition-colors"
                aria-label="Login"
            >
                <User className="w-6 h-6" />
            </Link>
        );
    }

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="flex items-center justify-center transition-transform hover:scale-105 focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    {user.user_metadata?.avatar_url ? (
                        <div className="relative w-8 h-8 overflow-hidden clip-path-slant border border-white/20 group-hover:border-accent transition-colors">
                            <img
                                className="h-full w-full object-cover"
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata.full_name || "User"}
                            />
                        </div>
                    ) : (
                        <div className="relative group">
                            <User className="w-5 h-5 text-white/70 group-hover:text-accent transition-colors" />
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
                <Menu.Items className="absolute right-0 z-50 mt-4 w-64 origin-top-right bg-[#050505] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl clip-path-slant-right-bottom p-1">
                    <div className="px-4 py-4 border-b border-white/5 bg-white/5">
                        <p className="text-sm text-white font-black uppercase tracking-wider font-display italic truncate">
                            {user.user_metadata?.full_name || "Guest User"}
                        </p>
                        <p className="text-[10px] text-white/40 font-mono truncate mt-1">
                            {user.email}
                        </p>
                    </div>

                    <div className="py-2">
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
                                        className={`${active ? "bg-white/5 text-accent pl-6" : "text-white/60 pl-4"
                                            } group flex items-center py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300`}
                                    >
                                        <Icon className={`mr-3 h-4 w-4 transition-colors ${active ? "text-accent" : "text-white/30"}`} />
                                        {label}
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </div>

                    <div className="py-1 border-t border-white/5">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`${active ? "bg-red-500/10 text-red-500 pl-6" : "text-white/60 pl-4"
                                        } group flex w-full items-center py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300`}
                                >
                                    <LogOut className="mr-3 h-4 w-4 group-hover:text-red-500 transition-colors" />
                                    Sign Out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
