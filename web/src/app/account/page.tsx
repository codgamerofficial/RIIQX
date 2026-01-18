"use client";

import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Nav */}
                    <aside className="w-full md:w-64 space-y-2">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8 text-center">
                            <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center text-primary font-bold text-2xl">
                                U
                            </div>
                            <h2 className="text-white font-bold">User Name</h2>
                            <p className="text-xs text-muted-foreground">user@example.com</p>
                        </div>

                        <nav className="space-y-1">
                            <NavItem icon={<User />} label="Profile" active />
                            <NavItem icon={<Package />} label="Orders" />
                            <NavItem icon={<Heart />} label="Wishlist" />
                            <NavItem icon={<Settings />} label="Settings" />
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[500px]">
                        <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome to your command center.</p>
                        {/* Placeholder for specific tab content */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-2">Total Orders</h3>
                                <p className="text-3xl font-mono text-primary">0</p>
                            </div>
                            <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-2">Wishlist Items</h3>
                                <p className="text-3xl font-mono text-secondary">0</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? "bg-white text-black font-bold" : "text-muted-foreground hover:bg-white/10 hover:text-white"
            }`}>
            <span className="w-5 h-5">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );
}
