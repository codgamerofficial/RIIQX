'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder submit logic
        setTimeout(() => setSubmitted(true), 1000);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        GET IN TOUCH
                    </h1>
                    <p className="text-muted-foreground">
                        Questions, collabs, or just want to say hi? We're listening.
                    </p>
                </div>

                {submitted ? (
                    <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/20 text-center animate-in fade-in zoom-in">
                        <h3 className="text-2xl font-bold text-green-500 mb-2">Message Sent!</h3>
                        <p className="text-white/80">We'll get back to you shortly.</p>
                        <Button
                            variant="link"
                            className="mt-4 text-white"
                            onClick={() => setSubmitted(false)}
                        >
                            Send another message
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Name</label>
                                <Input placeholder="John Doe" required className="bg-secondary/20 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Email</label>
                                <Input type="email" placeholder="john@example.com" required className="bg-secondary/20 border-white/10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Subject</label>
                            <Input placeholder="Order Inquiry" required className="bg-secondary/20 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white">Message</label>
                            <Textarea
                                placeholder="How can we help?"
                                className="min-h-[150px] bg-secondary/20 border-white/10"
                                required
                            />
                        </div>

                        <Button type="submit" size="lg" className="w-full font-bold text-lg">
                            SEND MESSAGE
                        </Button>
                    </form>
                )}

                <div className="mt-12 pt-12 border-t border-white/10 text-center">
                    <p className="text-muted-foreground mb-4">Or email us directly</p>
                    <a href="mailto:thelegacyroars@gmail.com" className="text-xl font-bold text-white hover:text-primary transition-colors">
                        thelegacyroars@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
