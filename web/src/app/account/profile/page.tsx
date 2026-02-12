"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Phone, Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
    });

    const supabase = createClient();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                setFormData({
                    full_name: profile?.full_name || user.user_metadata?.full_name || "",
                    email: user.email || "",
                    phone: profile?.phone || user.user_metadata?.phone || "",
                });
            }
            setFetching(false);
        };
        getProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: formData.full_name, phone: formData.phone }
            });

            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            setMessage("Profile updated successfully!");
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-6">
            <div className="max-w-xl mx-auto">
                <Link href="/account" className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Back to Hub
                </Link>

                <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Profile Settings</h1>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-8 border backdrop-blur-md ${message.includes("Error") ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"}`}
                    >
                        <p className="text-sm font-bold">{message}</p>
                    </motion.div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/20"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-[#0A0A0A]/50 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm font-medium text-white/40 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:border-white/40 focus:outline-none transition-colors placeholder:text-white/20"
                                placeholder="Add phone number"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
