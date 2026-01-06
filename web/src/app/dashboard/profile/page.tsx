"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { NeonButton } from "@/components/ui/neon-button";
import { ArrowLeft, User, Camera, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [email, setEmail] = useState("");

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }
            setEmail(user.email || "");

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setFullName(data.full_name || "");
                setAvatarUrl(data.avatar_url || "");
            }
            setLoading(false);
        };
        getProfile();
    }, [supabase, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                toast.error("Failed to update profile");
                console.error(error);
            } else {
                toast.success("Profile updated successfully");
                router.refresh();
                router.push("/dashboard");
            }
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                </div>

                {/* Form Card */}
                <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl">
                    <form onSubmit={handleUpdate} className="space-y-6">

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4 pb-6 border-b border-white/5">
                            <div className="w-24 h-24 rounded-full bg-black border-2 border-primary/50 flex items-center justify-center overflow-hidden relative group">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-muted-foreground" />
                                )}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="w-full max-w-xs">
                                <label className="text-xs text-center text-gray-500 block mb-2">Avatar URL</label>
                                <input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                                />
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/dashboard">
                                <NeonButton type="button" variant="secondary" className="px-6">Cancel</NeonButton>
                            </Link>
                            <NeonButton
                                type="submit"
                                variant="primary"
                                disabled={saving}
                                className="px-6 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </NeonButton>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
