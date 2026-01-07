"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        referralCode: "",
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
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            referred_by: formData.referralCode ? formData.referralCode.toUpperCase() : null
                        }
                    },
                });
                if (error) throw error;
                setMessage({ type: "success", text: "Account created! Check email to verify." });
            } else if (mode === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                router.push("/dashboard");
                router.refresh();
            } else if (mode === "reset") {
                const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });
                if (error) throw error;
                setMessage({ type: "success", text: "Password reset link sent to your email." });
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Authentication failed" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            setMessage({ type: "error", text: error.message });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background text-foreground">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-[400px] space-y-8">

                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                            {mode === "login" && "Welcome Back"}
                            {mode === "signup" && "Create Account"}
                            {mode === "reset" && "Reset Password"}
                        </h1>
                        <p className="text-muted-foreground">
                            {mode === "login" && "Enter your credentials to access the network."}
                            {mode === "signup" && "Join RIIQX and experience the future of style."}
                            {mode === "reset" && "Enter your email to receive recovery instructions."}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {mode === "signup" && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-secondary/30 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm focus:bg-secondary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20"
                                                placeholder="Ex. John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Referral Code <span className="text-[10px] opacity-50 px-1">(OPTIONAL)</span></label>
                                        <div className="relative group">
                                            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                name="referralCode"
                                                value={formData.referralCode}
                                                onChange={handleInputChange}
                                                className="w-full bg-secondary/30 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm focus:bg-secondary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20 uppercase tracking-widest"
                                                placeholder="ex. RIIQX24"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-secondary/30 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm focus:bg-secondary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {mode !== "reset" && (
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Password</label>
                                    {mode === "login" && (
                                        <button
                                            type="button"
                                            onClick={() => setMode("reset")}
                                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-secondary/30 border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm focus:bg-secondary/50 focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className={`flex items-center gap-2 p-3 rounded-md text-sm ${message.type === "error" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}
                            >
                                {message.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                {message.text}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    {/* Divider */}
                    {mode !== "reset" && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Google
                            </button>
                        </>
                    )}

                    {/* Footer Switcher */}
                    <div className="text-center text-sm text-muted-foreground">
                        {mode === "login" ? (
                            <>
                                New to RIIQX?{" "}
                                <button onClick={() => setMode("signup")} className="text-primary hover:underline font-bold">
                                    Sign Up
                                </button>
                            </>
                        ) : mode === "signup" ? (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setMode("login")} className="text-primary hover:underline font-bold">
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setMode("login")} className="text-primary hover:underline font-bold flex items-center justify-center gap-1 w-full">
                                Back to Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                <img
                    src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1920&auto=format&fit=crop"
                    alt="RIIQX Visual"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-20" />
                <div className="absolute bottom-16 left-16 z-30 max-w-lg">
                    <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
                        REDEFINE<br />YOUR REALITY.
                    </h2>
                    <p className="text-lg text-white/80">
                        Join the elite community of visionaries. High-fidelity apparel for the modern age.
                    </p>
                </div>
            </div>
        </div>
    );
}
