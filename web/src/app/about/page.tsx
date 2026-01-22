import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Our Story',
    description: 'Learn about RIIQX - where streetwear meets innovation. Discover our mission, values, and commitment to sustainable fashion.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rich-black via-cherry-red/20 to-gold/10" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-black font-serif text-white uppercase tracking-tight mb-4">
                        Our Story
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Where streetwear culture meets cutting-edge innovation
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black font-serif text-rich-black uppercase mb-6">
                            Our Mission
                        </h2>
                        <p className="text-xl text-neutral-gray leading-relaxed">
                            RIIQX was born from a simple belief: fashion should be bold, authentic, and accessible.
                            We're not just selling clothes—we're building a movement that celebrates individuality,
                            creativity, and the fearless spirit of street culture.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                        <div className="bg-neutral-light border border-neutral-gray rounded-xl p-8">
                            <div className="w-12 h-12 bg-cherry-red/10 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-cherry-red" />
                            </div>
                            <h3 className="text-2xl font-black text-rich-black mb-3">Authenticity First</h3>
                            <p className="text-neutral-gray">
                                Every design tells a story. We create pieces that resonate with real people,
                                not trends that fade overnight.
                            </p>
                        </div>

                        <div className="bg-neutral-light border border-neutral-gray rounded-xl p-8">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-gold" />
                            </div>
                            <h3 className="text-2xl font-black text-rich-black mb-3">Premium Quality</h3>
                            <p className="text-neutral-gray">
                                100% premium cotton, eco-friendly inks, and meticulous attention to detail.
                                Your comfort is our priority.
                            </p>
                        </div>

                        <div className="bg-neutral-light border border-neutral-gray rounded-xl p-8">
                            <div className="w-12 h-12 bg-cherry-red/10 rounded-full flex items-center justify-center mb-4">
                                <Leaf className="w-6 h-6 text-cherry-red" />
                            </div>
                            <h3 className="text-2xl font-black text-rich-black mb-3">Sustainable Practices</h3>
                            <p className="text-neutral-gray">
                                We're committed to reducing our environmental footprint through responsible
                                sourcing and ethical manufacturing.
                            </p>
                        </div>

                        <div className="bg-neutral-light border border-neutral-gray rounded-xl p-8">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-gold" />
                            </div>
                            <h3 className="text-2xl font-black text-rich-black mb-3">Community Driven</h3>
                            <p className="text-neutral-gray">
                                Our designs are inspired by you. We listen, we adapt, and we grow together
                                as a community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-4 bg-neutral-light">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black font-serif text-rich-black uppercase mb-8 text-center">
                        How It Started
                    </h2>
                    <div className="space-y-6 text-lg text-neutral-gray leading-relaxed">
                        <p>
                            RIIQX began in 2024 with a vision to disrupt the traditional fashion industry.
                            We saw a gap between mass-produced fast fashion and luxury brands—a space where
                            quality meets affordability, and style meets substance.
                        </p>
                        <p>
                            Our founder, inspired by the vibrant street culture of Mumbai, Delhi, and Bangalore,
                            set out to create a brand that speaks to the modern Indian youth. A brand that's
                            unapologetically bold, culturally rooted, yet globally inspired.
                        </p>
                        <p>
                            Today, RIIQX is more than a clothing brand. It's a platform for self-expression,
                            a celebration of creativity, and a testament to what happens when passion meets purpose.
                        </p>
                    </div>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black font-serif text-rich-black uppercase mb-8">
                        Our Commitment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div>
                            <div className="text-5xl font-black text-cherry-red mb-2">100%</div>
                            <p className="text-neutral-gray font-semibold">Premium Cotton</p>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-cherry-red mb-2">24/7</div>
                            <p className="text-neutral-gray font-semibold">Customer Support</p>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-cherry-red mb-2">30 Days</div>
                            <p className="text-neutral-gray font-semibold">Easy Returns</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-cherry-red to-rich-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black font-serif uppercase mb-6">
                        Join the Movement
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Be part of a community that values authenticity, creativity, and bold self-expression.
                    </p>
                    <a
                        href="/shop"
                        className="inline-block bg-white text-cherry-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-neutral-light transition-colors"
                    >
                        Shop Now
                    </a>
                </div>
            </section>
        </div>
    );
}
