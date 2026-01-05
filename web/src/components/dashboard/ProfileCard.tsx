"use client";

import { Database } from "@/types/database.types";
import { User } from "@supabase/supabase-js";
import { Wallet, Gift, User as UserIcon, LogOut } from "lucide-react";
import { NeonButton } from "@/components/ui/neon-button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileCardProps {
    user: User;
    profile: Profile | null;
}

export function ProfileCard({ user, profile }: ProfileCardProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
        router.refresh();
    };

    return (
        <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-8 h-8 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile?.full_name || "RIIQX User"}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-white transition-colors p-2"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center space-x-3 mb-2">
                        <Wallet className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-gray-300">Wallet Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        ${profile?.wallet_balance?.toFixed(2) || "0.00"}
                    </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center space-x-3 mb-2">
                        <Gift className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium text-gray-300">Referral Code</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <code className="text-lg font-mono font-bold text-white tracking-wider">
                            {profile?.referral_code || "---"}
                        </code>
                        {/* Copy button logic could go here */}
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Account Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <NeonButton variant="secondary" className="text-sm py-2 px-4">Edit Profile</NeonButton>
                    <NeonButton variant="secondary" className="text-sm py-2 px-4">Manage Addresses</NeonButton>
                </div>
            </div>
        </div>
    );
}
