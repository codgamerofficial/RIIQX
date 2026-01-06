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

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black/60 px-2 text-muted-foreground backdrop-blur-xl">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <NeonButton
                        type="button"
                        variant="secondary"
                        disabled={loading}
                        className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white"
                        onClick={async () => {
                            setLoading(true);
                            setMessage(null);
                            try {
                                const { error } = await supabase.auth.signInWithOAuth({
                                    provider: "google",
                                    options: {
                                        redirectTo: `https://riiqx.vercel.app/auth/callback`,
                                    },
                                });
                                if (error) throw error;
                            } catch (error: any) {
                                setMessage({ type: "error", text: error.message });
                                setLoading(false);
                            }
                        }}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </NeonButton>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        Protected by RIIQX Secure Protocols.
                    </p>
                </HoloCard>
            </div>
        </main>
    );
}
