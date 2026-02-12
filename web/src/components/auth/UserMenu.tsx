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
                        <div className={`relative w-8 h-8 overflow-hidden rounded-full transition-colors ${isIPLTheme ? 'border border-white/30' : 'border border-black/20'
                            }`}>
                            <img
                                className="h-full w-full object-cover"
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata.full_name || "User"}
                            />
                        </div>
                    ) : (
                        <div className="relative group">
                            <User className={`w-5 h-5 transition-colors ${isIPLTheme
                                    ? "text-white/70 group-hover:text-white"
                                    : "text-black/70 group-hover:text-black"
                                }`} strokeWidth={1.5} />
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
                <Menu.Items className={`absolute right-0 z-50 mt-4 w-56 origin-top-right shadow-2xl backdrop-blur-xl p-1 rounded-lg ${isIPLTheme
                        ? "bg-black/95 border border-white/10"
                        : "bg-white border border-black/5"
                    }`}>
                    <div className={`px-4 py-3 border-b ${isIPLTheme ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                        <p className={`text-sm font-semibold truncate ${isIPLTheme ? 'text-white' : 'text-black'}`}>
                            {user.user_metadata?.full_name || "Guest User"}
                        </p>
                        <p className={`text-xs truncate mt-0.5 ${isIPLTheme ? 'text-white/50' : 'text-black/50'}`}>
                            {user.email}
                        </p>
                    </div>

                    <div className="py-1">
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
                                        className={`group flex items-center px-4 py-2.5 text-sm transition-colors ${active
                                                ? isIPLTheme ? "bg-white/10 text-white" : "bg-black/5 text-black"
                                                : isIPLTheme ? "text-white/70" : "text-black/70"
                                            }`}
                                    >
                                        <Icon className={`mr-3 h-4 w-4 ${active ? isIPLTheme ? "text-white" : "text-black" : isIPLTheme ? "text-white/40" : "text-black/40"}`} />
                                        {label}
                                    </Link>
                                )}
                            </Menu.Item>
                        ))}
                    </div>

                    <div className={`py-1 border-t ${isIPLTheme ? 'border-white/10' : 'border-black/5'}`}>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`group flex w-full items-center px-4 py-2.5 text-sm transition-colors ${active
                                            ? isIPLTheme ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
                                            : isIPLTheme ? "text-white/70" : "text-black/70"
                                        }`}
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
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
