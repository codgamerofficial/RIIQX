"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Phone, Loader2, Save } from "lucide-react";

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
                // Fetch profile data from 'profiles' table if we want simpler access, 
                // but user_metadata is often enough for basic info. 
                // Let's rely on metadata for now as per Auth flow, or fetch from 'profiles' table.
                // The trigger syncs metadata to profiles, so let's fetch from profiles for SS of Truth.

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

            // Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: formData.full_name, phone: formData.phone }
            });

            if (authError) throw authError;

            // Update Profiles Table (Trigger handles insert, we handle update manually for redundancy/safety)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    updated_at: new Date().toISOString()
                    // phone column might not exist in profiles schema I created?
                    // Checked schema: profiles (id, updated_at, username, full_name, avatar_url, website)
                    // I did NOT add phone to profiles in the schema.
                    // Let's stick to full_name.
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
        return <div className="text-white">Loading profile...</div>;
    }

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-white mb-6">Profile Details</h1>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.includes("Error") ? "bg-neon-red/10 text-neon-red" : "bg-green-500/10 text-green-400"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-white uppercase mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white uppercase mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full bg-neutral-800/50 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Email cannot be changed.</p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-white uppercase mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bewakoof-btn bewakoof-btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </form>
        </div>
    );
}
