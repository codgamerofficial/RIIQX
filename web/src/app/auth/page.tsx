"use client";

import { useState } from "react";
import { NeonButton } from "@/components/ui/neon-button";
import { HoloCard } from "@/components/ui/holo-card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const MotionDiv = motion.div as any;

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage("Error sending magic link. Try again.");
        } else {
            setMessage("Check your email for the magic link!");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <HoloCard className="border-primary/30">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow mb-2">
                            RIIQX ACCESS
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your email to receive a secure login link.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground/80 pl-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="peter.parker@avengers.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                            />
                        </div>

                        {message && (
                            <MotionDiv
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-sm text-center p-3 rounded-lg ${message.includes("Error") ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-400"}`}
                            >
                                {message}
                            </MotionDiv>
                        )}

                        <NeonButton type="submit" disabled={loading} className="w-full text-lg" glow={true}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Magic Link"}
                        </NeonButton>
                    </form>

                    <div className="mt-6 text-center text-xs text-muted-foreground">
                        By accessing RIIQX, you agree to our Terms of Service.
                    </div>
                </HoloCard>
            </div>
        </main>
    );
}
