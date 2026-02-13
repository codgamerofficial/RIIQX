"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Fingerprint, LogOut, Terminal, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthProductShowcase } from "@/components/auth/AuthProductShowcase";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
            setPageLoading(false);
        };
        checkUser();
    }, [supabase]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/account");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || "Failed to login with Google");
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    if (pageLoading) {
        return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#B4F000] font-mono text-xs tracking-widest uppercase animate-pulse">Initializing Secure Uplink...</div>;
    }

    return (
        <div className="min-h-screen bg-[#050505] flex overflow-hidden">
            {/* Left Side - 3D Showcase (Desktop Only) */}
            <div className="hidden lg:block w-1/2 relative bg-[#020202] border-r border-white/5">
                <div className="absolute top-8 left-8 z-20">
                    <Link href="/">
                        <div className="text-2xl font-black italic tracking-tighter text-white font-display">
                            RIIQX<span className="text-[#B4F000]">.</span>
                        </div>
                    </Link>
                </div>
                <AuthProductShowcase />
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

                {/* Decorative Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#B4F000]/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <AnimatePresence mode="wait">
                        {user ? (
                            <motion.div
                                key="logged-in"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#0A0A0A] border border-[#B4F000]/20 p-8 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#B4F000]" />
                                <div className="absolute top-4 right-4 text-[#B4F000] animate-pulse">
                                    <Fingerprint className="w-6 h-6" />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-[family-name:var(--font-oswald)] italic">
                                            Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white">Verified</span>
                                        </h2>
                                        <p className="text-white/40 font-mono text-xs mt-2 uppercase tracking-widest">
                                            Welcome back, Operator.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white/5 border border-white/10 rounded-none relative">
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#B4F000] opacity-50" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#B4F000] opacity-50" />
                                        <p className="text-[#B4F000] font-mono text-xs truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <Link href="/account" className="block">
                                            <button className="w-full py-4 bg-[#B4F000] text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                                <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                <span>Access Dashboard</span>
                                            </button>
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full py-4 border border-white/10 text-white/40 font-bold uppercase tracking-[0.2em] text-xs hover:text-white hover:border-[#B4F000]/50 transition-all duration-300 flex items-center justify-center gap-2 group bg-black/20"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            <span>Terminate Session</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 p-8 md:p-12 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                            >
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#B4F000]" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#B4F000]" />

                                {/* Header */}
                                <div className="mb-12">
                                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter font-[family-name:var(--font-oswald)] italic mb-3 leading-[0.9]">
                                        System <br /><span className="text-[#B4F000]">Access</span>
                                    </h1>
                                    <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#B4F000] rounded-full animate-pulse" />
                                        Secure Login v2.4
                                    </p>
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-8 p-4 bg-red-500/5 border-l-2 border-red-500/50"
                                        >
                                            <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                                                <Terminal className="w-3 h-3" /> Access Denied: {error}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Login Form */}
                                <form onSubmit={handleLogin} className="space-y-8">
                                    {/* Email */}
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 group-focus-within:text-[#B4F000] transition-colors">
                                            User Identification
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="ENTER EMAIL PROTOCOL"
                                                className="w-full bg-white/5 border-b border-white/10 px-0 py-4 pl-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#B4F000] focus:bg-white/10 transition-all duration-300 font-mono text-sm tracking-wider"
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#B4F000] transition-colors" />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] group-focus-within:text-[#B4F000] transition-colors">
                                                Passkey
                                            </label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-[9px] uppercase font-bold text-white/30 hover:text-[#B4F000] transition-colors tracking-widest"
                                            >
                                                Lost Key?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••••••"
                                                className="w-full bg-white/5 border-b border-white/10 px-0 py-4 pl-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#B4F000] focus:bg-white/10 transition-all duration-300 font-mono text-sm tracking-widest"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Login Button */}
                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-[#B4F000] text-black font-black uppercase tracking-[0.25em] text-sm hover:bg-white hover:tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                                            {loading ? (
                                                <span className="font-mono">INITIALIZING...</span>
                                            ) : (
                                                <>
                                                    <span>Connect</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Divider */}
                                <div className="relative my-10">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[9px] font-black tracking-[0.2em] uppercase">
                                        <span className="px-4 bg-[#0A0A0A] text-white/20">
                                            Alternative Link
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login */}
                                <div>
                                    <button
                                        onClick={handleGoogleLogin}
                                        className="w-full py-3.5 border border-white/10 bg-white/5 text-white/60 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center justify-center gap-3 group"
                                    >
                                        <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Google Access</span>
                                    </button>
                                </div>

                                {/* Register Link */}
                                <div className="mt-8 text-center">
                                    <Link href="/register" className="text-white/30 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] transition-colors group">
                                        No Clearance? <span className="text-[#B4F000] underline decoration-[#B4F000]/30 underline-offset-4 group-hover:decoration-white font-bold ml-2">Request Identification</span>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
