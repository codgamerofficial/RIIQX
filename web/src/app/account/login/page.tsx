"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NeonButton } from "@/components/ui/neon-button";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] animate-blob" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[150px] animate-blob animation-delay-2000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Welcome Back</h1>
                    <p className="text-muted-foreground text-sm">Enter the nexus of future fashion.</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50 pl-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50 pl-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-white/20 bg-transparent text-primary focus:ring-primary" />
                            <span className="text-muted-foreground hover:text-white transition-colors">Remember me</span>
                        </label>
                        <a href="#" className="text-primary hover:underline">Forgot password?</a>
                    </div>

                    <NeonButton className="w-full py-4" glow>
                        <span className="mr-2">Initiate Login</span>
                        <ArrowRight className="w-4 h-4" />
                    </NeonButton>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground border-t border-white/5 pt-6">
                    New to RIIQX?{" "}
                    <Link href="/account/register" className="text-white hover:text-primary font-bold transition-colors">
                        Create Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
