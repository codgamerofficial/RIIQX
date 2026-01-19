"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Lock, Trash2, Smartphone, Moon } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [preferences, setPreferences] = useState({
        marketingEmails: true,
        orderUpdates: true,
        darkMode: true,
    });

    const handleToggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
        toast.success("Preference updated");
        // In real app, save to DB
    };

    const handleDeleteAccount = async () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            toast.error("Contact support to delete account for security reasons.");
            // Real implementation would allow deletion or mark for deletion
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/account" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Settings</h1>
                        <p className="text-muted-foreground">Manage your account preferences</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Preferences Group */}
                    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-bewakoof-yellow" />
                                Notifications
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Marketing Emails</p>
                                    <p className="text-sm text-muted-foreground">Receive offers and new drop alerts</p>
                                </div>
                                <div
                                    onClick={() => handleToggle('marketingEmails')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${preferences.marketingEmails ? 'bg-bewakoof-yellow' : 'bg-neutral-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-black shadow-sm transition-transform ${preferences.marketingEmails ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Order Updates</p>
                                    <p className="text-sm text-muted-foreground">Receive SMS updates about your orders</p>
                                </div>
                                <div
                                    onClick={() => handleToggle('orderUpdates')}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${preferences.orderUpdates ? 'bg-bewakoof-yellow' : 'bg-neutral-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-black shadow-sm transition-transform ${preferences.orderUpdates ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-blue-400" />
                                Application
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Dark Mode</p>
                                    <p className="text-sm text-muted-foreground">RIIQX is best experienced in the dark</p>
                                </div>
                                <div className="text-sm text-bewakoof-yellow font-bold uppercase">Always On</div>
                            </div>
                        </div>
                    </div>

                    {/* Security Zone */}
                    <div className="bg-neutral-900 border border-neon-red/30 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-neon-red flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Security & Privacy
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <button className="w-full text-left flex items-center justify-between group">
                                <div>
                                    <p className="text-white font-medium group-hover:text-primary transition-colors">Change Password</p>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                            </button>

                            <div className="pt-4 border-t border-white/5">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex items-center gap-2 text-neon-red hover:text-red-400 transition-colors font-bold"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </button>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Permanently remove your account and all data.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
