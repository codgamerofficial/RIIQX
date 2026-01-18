'use client';

import { useActionState } from 'react';
import { signUp } from '../actions/auth';
import Link from 'next/link';
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { motion } from "framer-motion";

const initialState = {
    message: '',
};

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signUp, initialState);

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4 relative">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-black/80 p-10 rounded-2xl border border-white/5 backdrop-blur-xl relative z-10 shadow-2xl"
            >
                {/* Header */}
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-3 mb-3"
                    >
                        <span className="h-px w-8 bg-luxury-gold" />
                        <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.3em]">
                            Join
                        </span>
                    </motion.div>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                        Create Account
                    </h1>
                    <p className="text-white/40 mt-2 text-sm">Begin your premium journey</p>
                </div>

                <form action={formAction} className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-2">
                                First Name
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-2">
                                Last Name
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                required
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-2">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300"
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Referral Code */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-2">
                            Referral Code <span className="text-white/30">(Optional)</span>
                        </label>
                        <input
                            name="referralCode"
                            type="text"
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300"
                            placeholder="INVITE-123"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-widest text-white/50 mb-2">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={5}
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/20 transition-all duration-300"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error Message */}
                    {state?.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-neon-red/10 border border-neon-red/20 rounded-lg text-neon-red text-sm font-medium"
                        >
                            {state.message}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-luxury-gold text-black font-display font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-luxury-gold/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-luxury-gold/20"
                    >
                        {isPending ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-3 text-white/30 tracking-widest">Or Join With</span></div>
                    </div>

                    {/* Social Login - Vertical Layout */}
                    <SocialLoginButtons />

                    {/* Login Link */}
                    <div className="text-center mt-8 pt-6 border-t border-white/5">
                        <p className="text-white/40 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-luxury-gold hover:text-luxury-gold/80 font-medium transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs font-mono uppercase tracking-widest z-10">
                Premium Access Portal
            </div>
        </div>
    );
}
