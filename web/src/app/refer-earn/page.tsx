"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NeonButton } from "@/components/ui/neon-button";
import { motion } from "framer-motion";
import { Copy, Users, Trophy, DollarSign, Share2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReferralStats {
    code: string;
    referralCount: number;
    earnings: number; // Placeholder for now
}

export default function ReferEarnPage() {
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        fetchReferralData();
    }, []);

    const fetchReferralData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }

            // 1. Get Profile
            let { data: profile } = await (supabase
                .from("profiles") as any)
                .select("referral_code, id")
                .eq("id", user.id)
                .single();

            // 2. Generate Code if missing
            if (profile && !profile.referral_code) {
                const newCode = `RIIQX${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
                const { data: updatedProfile, error } = await (supabase
                    .from("profiles") as any)
                    .update({ referral_code: newCode })
                    .eq("id", user.id)
                    .select("referral_code")
                    .single();

                if (updatedProfile) {
                    profile = { ...profile, referral_code: updatedProfile.referral_code };
                }
            }

            // 3. Get Referral Count
            const { count } = await (supabase
                .from("profiles") as any)
                .select("*", { count: "exact", head: true })
                .eq("referred_by", profile?.referral_code);

            setStats({
                code: profile?.referral_code || "ERROR",
                referralCount: count || 0,
                earnings: (count || 0) * 100 // Mock earnings: 100 credits per referral
            });

        } catch (error) {
            console.error("Error fetching referral data:", error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (stats?.code) {
            navigator.clipboard.writeText(stats.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareLink = () => {
        if (navigator.share && stats?.code) {
            navigator.share({
                title: 'Join RIIQX',
                text: `Use my code ${stats.code} to join the elite.`,
                url: window.location.origin
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
                        Refer & <span className="text-primary">Earn.</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Invite your circle to the RIIQX network. Earn credits for every verified member who joins using your unique access code.
                    </p>
                </div>

                {/* Main Code Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Your Unique Access Code</h3>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                        <div className="bg-black/50 border border-white/10 rounded-xl px-8 py-4 text-4xl font-mono font-bold text-white tracking-widest">
                            {stats?.code}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors text-white"
                            >
                                {copied ? <CheckIcon /> : <Copy className="w-6 h-6" />}
                            </button>
                            <button
                                onClick={shareLink}
                                className="p-4 bg-primary/20 hover:bg-primary/30 border border-primary/20 rounded-xl transition-colors text-primary"
                            >
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground/60">
                        *Credits are applied automatically upon successful referral verification.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-white/5 rounded-2xl p-8 flex items-center gap-6">
                        <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Total Referrals</p>
                            <h4 className="text-4xl font-black text-white">{stats?.referralCount}</h4>
                        </div>
                    </div>

                    <div className="bg-card border border-white/5 rounded-2xl p-8 flex items-center gap-6">
                        <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-500">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Earnings (Credits)</p>
                            <h4 className="text-4xl font-black text-white">₹{stats?.earnings}</h4>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
    )
}
