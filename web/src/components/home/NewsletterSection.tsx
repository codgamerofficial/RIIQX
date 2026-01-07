"use client";

import { NeonButton } from "@/components/ui/neon-button";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock subscription for now
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000);
        setEmail("");
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-secondary/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-4">
                        <Mail className="w-6 h-6" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
                        JOIN THE <span className="text-primary">MOVEMENT</span>
                    </h2>

                    <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                        Get exclusive access to new drops, limited editions, and behind-the-scenes content.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8">
                        <div className="relative flex-grow">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-14 bg-black/50 border border-white/10 rounded-xl px-4 pl-12 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                        <NeonButton type="submit" className="h-14 px-8" glow>
                            {subscribed ? "Subscribed!" : "Join Now"}
                        </NeonButton>
                    </form>

                    <p className="text-xs text-muted-foreground/60 mt-4">
                        Strictly looking out for the community. No spam, ever.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
