"use client";

import { Database } from "@/types/database.types";
import { User } from "@supabase/supabase-js";
import { Wallet, Gift, User as UserIcon, LogOut } from "lucide-react";
import { NeonButton } from "@/components/ui/neon-button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D9F99D] to-primary rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#D9F99D] to-transparent">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-10 h-10 text-white/50" />
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{profile?.full_name || "RIIQX User"}</h2>
                    <p className="text-sm font-medium text-white/40">{user.email}</p>
                </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 rounded-2xl p-4 border border-white/5 hover:border-[#D9F99D]/30 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-[#D9F99D]/10 rounded-lg">
                            <Wallet className="w-4 h-4 text-[#D9F99D]" />
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Wallet</span>
                    </div>
                    <p className="text-xl font-black text-white">
                        ${profile?.wallet_balance?.toFixed(2) || "0.00"}
                    </p>
                </div>

                <div className="bg-black/50 rounded-2xl p-4 border border-white/5 hover:border-[#D9F99D]/30 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1.5 bg-white/10 rounded-lg">
                            <Gift className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Referral</span>
                    </div>
                    <code className="text-sm font-mono font-bold text-white break-all">
                        {profile?.referral_code || "---"}
                    </code>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <Link href="/dashboard/profile" className="block">
                    <button className="w-full bg-white text-black font-black uppercase text-sm py-4 rounded-xl hover:bg-[#D9F99D] transition-colors relative group overflow-hidden">
                        <span className="relative z-10">Edit Profile</span>
                    </button>
                </Link>
                <Link href="/dashboard/addresses" className="block">
                    <button className="w-full bg-transparent border border-white/10 text-white font-bold uppercase text-sm py-4 rounded-xl hover:bg-white/5 hover:border-white transition-all">
                        Manage Addresses
                    </button>
                </Link>
                <div className="pt-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center space-x-2 text-white/30 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
