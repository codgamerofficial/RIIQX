"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, Terminal } from "lucide-react";
import Link from "next/link";
import { AuthProductShowcase } from "@/components/auth/AuthProductShowcase";
import { ScaleButton } from "@/components/ui/ScaleButton";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/callback?next=/account/update-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex">
            {/* Left Side - 3D Showcase (Desktop Only) */}
            <div className="hidden lg:block w-1/2 relative bg-[#020202] border-r border-white/5">
                <AuthProductShowcase />
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 relative flex flex-col justify-center items-center p-6 sm:p-12 pt-32 lg:pt-0 overflow-y-auto">
                {/* Background Elements for Mobile */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md relative z-10"
                >
                    {/* Back Link */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <Link href="/login" className="inline-flex items-center text-xs font-mono text-white/40 hover:text-white transition-colors group">
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                            RETURN TO TERMINAL
                        </Link>
                    </motion.div>

                    {/* Logo/Icon */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Terminal className="w-8 h-8 text-white/80" />
                        </div>
                    </motion.div>

                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter font-display italic mb-2">
                            RECOVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">ACCESS</span>
                        </h1>
                        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                            Initiate Protocol: Password Reset
                        </p>
                    </motion.div>

                    {/* Form or Success Message */}
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-xl text-center backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                <Mail className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-wide">Link Sent</h3>
                            <p className="text-white/60 text-sm mb-6">
                                We have sent a recovery protocol to <span className="text-white font-mono">{email}</span>. Please check your inbox.
                            </p>
                            <Link href="/login">
                                <ScaleButton className="w-full h-12 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-accent transition-colors flex items-center justify-center">
                                    Return to Login
                                </ScaleButton>
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ENTER YOUR EMAIL"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-mono"
                                >
                                    ERROR: {error}
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants}>
                                <ScaleButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-accent transition-colors flex items-center justify-center mt-4 relative overflow-hidden group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="relative z-10">Send Recovery Link</span>
                                            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                        </>
                                    )}
                                </ScaleButton>
                            </motion.div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
