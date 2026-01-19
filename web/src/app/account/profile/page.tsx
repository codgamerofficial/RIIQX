"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const supabase = createClient();

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUser(user);
            setProfile({
                name: user.user_metadata?.name || "",
                email: user.email || "",
                phone: user.user_metadata?.phone || "",
            });
            setLoading(false);
        };

        loadProfile();
    }, [router, supabase]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    name: profile.name,
                    phone: profile.phone,
                },
            });

            if (error) throw error;

            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error: any) {
            setMessage(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2 font-montserrat">
                        My Profile
                    </h1>
                    <p className="text-muted-foreground">Manage your personal information</p>
                </div>

                {/* Success Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes("success") ? "bg-bewakoof-green/10 border border-bewakoof-green/20" : "bg-neon-red/10 border border-neon-red/20"}`}>
                        <p className={message.includes("success") ? "text-bewakoof-green" : "text-neon-red"}>{message}</p>
                    </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleSave} className="bg-neutral-900 border border-white/10 rounded-xl p-8 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <button
                            type="button"
                            className="bewakoof-btn bewakoof-btn-secondary px-6 py-2 flex items-center gap-2"
                        >
                            <Camera className="w-4 h-4" />
                            <span>Change Photo</span>
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-white uppercase mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-bold text-white uppercase mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full bg-neutral-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white/50 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-white uppercase mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full bg-neutral-800 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bewakoof-btn bewakoof-btn-primary py-4 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
