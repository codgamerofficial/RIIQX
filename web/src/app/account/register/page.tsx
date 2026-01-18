"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NeonButton } from "@/components/ui/neon-button";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[150px] animate-blob" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] animate-blob animation-delay-2000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Join RIIQX</h1>
                    <p className="text-muted-foreground text-sm">Begin your journey into the future.</p>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50 pl-1">First Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-secondary focus:outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50 pl-1">Last Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-secondary focus:outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50 pl-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-secondary focus:outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/50 pl-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-secondary focus:outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        By creating an account, you agree to our <a href="#" className="underline hover:text-white">Terms</a> and <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                    </div>

                    <NeonButton className="w-full py-4" glow variant="secondary">
                        <span className="mr-2">Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                    </NeonButton>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground border-t border-white/5 pt-6">
                    Already have an account?{" "}
                    <Link href="/account/login" className="text-white hover:text-secondary font-bold transition-colors">
                        Log In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
