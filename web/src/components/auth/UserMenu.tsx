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
                <Menu.Button className="flex rounded-full bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-bewakoof-yellow focus:ring-offset-2 focus:ring-offset-neutral-900">
                    <span className="sr-only">Open user menu</span>
                    {user.user_metadata?.avatar_url ? (
                        <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata.full_name || "User"}
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-bewakoof-yellow flex items-center justify-center text-black font-bold">
                            {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                        </div>
                    )}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-neutral-900 border border-white/10 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-white font-medium truncate">
                            {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>

                    <div className="py-1">
                        <Menu.Item>
                            {({ active }: { active: boolean }) => (
                                <Link
                                    href="/account"
                                    className={`${active ? "bg-neutral-800 text-white" : "text-gray-300"
                                        } group flex items-center px-4 py-2 text-sm transition-colors`}
                                >
                                    <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-bewakoof-yellow" />
                                    Dashboard
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }: { active: boolean }) => (
                                <Link
                                    href="/account/orders"
                                    className={`${active ? "bg-neutral-800 text-white" : "text-gray-300"
                                        } group flex items-center px-4 py-2 text-sm transition-colors`}
                                >
                                    <Package className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-bewakoof-yellow" />
                                    Orders
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }: { active: boolean }) => (
                                <Link
                                    href="/account/addresses"
                                    className={`${active ? "bg-neutral-800 text-white" : "text-gray-300"
                                        } group flex items-center px-4 py-2 text-sm transition-colors`}
                                >
                                    <MapPin className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-bewakoof-yellow" />
                                    Addresses
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }: { active: boolean }) => (
                                <Link
                                    href="/account/profile"
                                    className={`${active ? "bg-neutral-800 text-white" : "text-gray-300"
                                        } group flex items-center px-4 py-2 text-sm transition-colors`}
                                >
                                    <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-bewakoof-yellow" />
                                    Profile
                                </Link>
                            )}
                        </Menu.Item>
                    </div>

                    <div className="py-1 border-t border-white/10">
                        <Menu.Item>
                            {({ active }: { active: boolean }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`${active ? "bg-neon-red/10 text-neon-red" : "text-gray-300"
                                        } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                                >
                                    <LogOut className="mr-3 h-4 w-4 group-hover:text-neon-red" />
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
