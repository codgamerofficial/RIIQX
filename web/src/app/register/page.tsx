'use client';

import { useActionState } from 'react';
import { signUp } from '../actions/auth';
import Link from 'next/link';
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

const initialState = {
    message: '',
};

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signUp, initialState);

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                    Request <span className="text-primary">Clearance</span>
                </h1>
                <p className="text-white/50 mb-8">Create your operator profile.</p>

                <form action={formAction} className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                                First Name
                            </label>
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                                Last Name
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                required
                                className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="operator@riiqx.com"
                        />
                    </div>


                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                            Referral Code (Optional)
                        </label>
                        <input
                            name="referralCode"
                            type="text"
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="INVITE-123"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/70 mb-2">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={5}
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.message && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium">
                            {state.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Processing...' : 'Create Account'}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-neutral-900 px-2 text-white/50">Or Join With</span></div>
                    </div>

                    <SocialLoginButtons />

                    <div className="text-center mt-6">
                        <Link href="/login" className="text-white/50 hover:text-white text-sm transition-colors">
                            Already have clearance? <span className="text-primary hover:underline">Access Terminal</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
