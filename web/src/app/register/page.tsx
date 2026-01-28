"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check, Terminal, Fingerprint, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function RegisterPage() {
    const router = useRouter();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUser(user);
            setPageLoading(false);
        };
        checkUser();
    }, [supabase]);

    const passwordStrength = (password: string) => {
        if (password.length === 0) return { strength: "", color: "" };
        if (password.length < 6) return { strength: "WEAK", color: "text-red-500" };
        if (password.length < 10) return { strength: "MEDIUM", color: "text-yellow-500" };
        return { strength: "STRONG", color: "text-green-500" };
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Security Mismatch: Passwords do not match");
            setLoading(false);
            return;
        }

        if (!agreedToTerms) {
            setError("Protocol Violation: Terms must be accepted");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        phone: formData.phone,
                    },
                },
            });

            if (error) throw error;

            // Auto-login after registration
            router.push("/account");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || "Failed to signup with Google");
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const strength = passwordStrength(formData.password);

    if (pageLoading) {
        return <div className="min-h-screen bg-[#050505]" />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto px-6 relative z-10">
                <AnimatePresence mode="wait">
                    {user ? (
                        <motion.div
                            key="logged-in"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a0a0a] border border-accent/20 p-8 clip-path-slant relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-2">
                                    <Fingerprint className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display italic">
                                        Identity Verified
                                    </h2>
                                    <p className="text-white/50 font-mono text-xs mt-2 truncate max-w-[250px] mx-auto bg-white/5 py-1 px-3 rounded-sm">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <Link href="/account">
                                        <button className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-all flex items-center justify-center gap-2 group clip-path-slant-right">
                                            <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            Open Dashboard
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full py-4 border border-white/10 text-white/50 font-bold uppercase tracking-widest text-xs hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Terminate Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register-form"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 clip-path-slant relative"
                        >
                            {/* Header */}
                            <motion.div variants={itemVariants} className="text-center mb-8">
                                <h1 className="text-4xl font-black text-white uppercase tracking-tighter font-display italic mb-2">
                                    Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Profile</span>
                                </h1>
                                <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                                    Join the RIIQX Network
                                </p>
                            </motion.div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 p-4 bg-red-500/10 border-l-2 border-red-500 overflow-hidden"
                                    >
                                        <p className="text-red-500 text-xs font-mono uppercase flex items-center gap-2">
                                            <Terminal className="w-3 h-3" /> {error}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Register Form */}
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Name */}
                                <motion.div variants={itemVariants} className="group">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-accent transition-colors">
                                        Full Identity
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10 group-focus-within:bg-accent transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="JOHN DOE"
                                            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-white/20 focus:ring-0 font-mono text-sm tracking-wide"
                                        />
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                    </div>
                                </motion.div>

                                {/* Email */}
                                <motion.div variants={itemVariants} className="group">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-accent transition-colors">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10 group-focus-within:bg-accent transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="USER@DOMAIN.COM"
                                            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-white/20 focus:ring-0 font-mono text-sm tracking-wide"
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                    </div>
                                </motion.div>

                                {/* Phone */}
                                <motion.div variants={itemVariants} className="group">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-accent transition-colors">
                                        Contact
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10 group-focus-within:bg-accent transition-colors" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+00 00000 00000"
                                            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-white/20 focus:ring-0 font-mono text-sm tracking-wide"
                                        />
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent transition-colors" />
                                    </div>
                                </motion.div>

                                {/* Password */}
                                <motion.div variants={itemVariants} className="group">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-accent transition-colors">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10 group-focus-within:bg-accent transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-white/20 focus:ring-0 font-mono text-sm tracking-wide"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <p className={`text-[9px] mt-1 font-mono uppercase tracking-widest ${strength.color}`}>
                                            Security Level: {strength.strength}
                                        </p>
                                    )}
                                </motion.div>

                                {/* Confirm Password */}
                                <motion.div variants={itemVariants} className="group">
                                    <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-accent transition-colors">
                                        Verify Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-white/10 group-focus-within:bg-accent transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-white/20 focus:ring-0 font-mono text-sm tracking-wide"
                                        />
                                    </div>
                                </motion.div>

                                {/* Terms Checkbox */}
                                <motion.div variants={itemVariants} className="flex items-start gap-3 cursor-pointer pt-2 group">
                                    <div className="relative mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-4 h-4 border border-white/20 peer-checked:bg-accent peer-checked:border-accent transition-all" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                                            <Check className="w-3 h-3 text-black" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-white/40 leading-relaxed">
                                        Accept Protocol:{" "}
                                        <Link href="/terms-of-service" className="text-white hover:text-accent hover:underline decoration-accent/30 transition-colors">
                                            Terms
                                        </Link>{" "}
                                        &{" "}
                                        <Link href="/privacy-policy" className="text-white hover:text-accent hover:underline decoration-accent/30 transition-colors">
                                            Privacy
                                        </Link>
                                    </span>
                                </motion.div>

                                {/* Register Button */}
                                <motion.div variants={itemVariants} className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:bg-accent hover:text-black hover:tracking-[0.25em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group clip-path-slant-right"
                                    >
                                        {loading ? (
                                            <span>Processing...</span>
                                        ) : (
                                            <>
                                                <span>Initialize Profile</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </form>

                            {/* Divider */}
                            <motion.div variants={itemVariants} className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black tracking-widest uppercase">
                                    <span className="px-4 bg-[#0a0a0a] text-white/20">
                                        Or
                                    </span>
                                </div>
                            </motion.div>

                            {/* Social Signup */}
                            <motion.div variants={itemVariants}>
                                <button
                                    onClick={handleGoogleSignup}
                                    className="w-full py-3 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group"
                                >
                                    <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span>Google Protocol</span>
                                </button>
                            </motion.div>

                            {/* Login Link */}
                            <motion.div variants={itemVariants} className="mt-8 text-center">
                                <Link href="/login" className="text-white/40 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-colors">
                                    Existing User? <span className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-white font-bold ml-2">Login</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
