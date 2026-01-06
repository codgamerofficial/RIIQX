"use client";

import { useState } from "react";
import { NeonButton } from "@/components/ui/neon-button";
import { HoloCard } from "@/components/ui/holo-card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
    });

    const router = useRouter();
    const supabase = createClient();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === "signup") {
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                        },
                    },
                });

                if (error) throw error;
                setMessage({ type: "success", text: "Account created! Please check your email to verify." });
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) throw error;

                router.push("/dashboard");
                router.refresh();
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Authentication failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <HoloCard className="border-primary/30 backdrop-blur-xl bg-black/60">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow mb-2">
                            RIIQX ACCESS
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {mode === "login" ? "Welcome back, Operator." : "Join the RIIQX Network."}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-black/40 rounded-lg p-1 mb-8 border border-white/10">
                        <button
                            onClick={() => { setMode("login"); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "login" ? "bg-primary/20 text-white shadow-lg" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setMode("signup"); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "signup" ? "bg-primary/20 text-white shadow-lg" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {mode === "signup" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-2"
                                >
                                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required={mode === "signup"}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="cyberpunk@riiqx.com"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}
                            >
                                {message.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                {message.text}
                            </motion.div>
                        )}

                        <NeonButton type="submit" disabled={loading} className="w-full py-6 mt-4" glow>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "login" ? "Authenticate" : "Initialize Account")}
                        </NeonButton>
                    </form>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        Protected by RIIQX Secure Protocols.
                    </p>
                </HoloCard>
            </div>
        </main>
    );
}
