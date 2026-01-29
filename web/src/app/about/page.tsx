import { Metadata } from 'next';
import { Award, Heart, Leaf, Users, Crown, Zap, Target } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Legacy | Our Story',
    description: 'RIIQX - Where street meets sport.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Hero Section: The Pitch */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grain.png')] opacity-20 z-10 pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-0" />

                {/* Radial Gradient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full" />

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <span className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md mb-8">
                        Est. 2026 • India
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black font-display text-white uppercase tracking-tighter mb-6 leading-[0.8]">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20">Legacy</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-mono uppercase tracking-widest border-t border-b border-white/10 py-6">
                        Streetwear × Cricket × Culture
                    </p>
                </div>
            </section>

            {/* Mission Section: The Game Plan */}
            <section className="py-24 px-4 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-col-reverse">

                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black font-display text-white uppercase leading-none">
                            Built for the <br /><span className="text-accent">Main Character.</span>
                        </h2>
                        <div className="space-y-6 text-lg text-white/50 font-light leading-relaxed">
                            <p>
                                RIIQX isn't just a brand; it's a movement. Born from the electric energy of street cricket and the grit of urban fashion, we craft gear for those who play life on the front foot.
                            </p>
                            <p>
                                We don't do basics. We do bold cuts, heavy fabrics, and designs that scream louder than a stadium roar. This is for the openers, the finishers, and the game-changers.
                            </p>
                        </div>
                        <div className="pt-8">
                            <div className="w-24 h-1 bg-accent mb-8" />
                            <p className="text-xs font-mono uppercase tracking-widest text-white/30">
                                RIIQX Labs // Innovation Center
                            </p>
                        </div>
                    </div>

                    {/* Values Grid using Rounded Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ValueCard
                            icon={<Crown className="w-6 h-6 text-black" />}
                            title="Elite Tier"
                            desc="Premium heavy-gauge cotton and technical fabrics."
                            color="bg-white text-black"
                        />
                        <ValueCard
                            icon={<Zap className="w-6 h-6 text-accent" />}
                            title="High Voltage"
                            desc="Designs that spark conversations and turn heads."
                            color="bg-[#121212] border-white/10 text-white"
                        />
                        <ValueCard
                            icon={<Target className="w-6 h-6 text-accent" />}
                            title="Precision"
                            desc="Fits engineered for movement and swagger."
                            color="bg-[#121212] border-white/10 text-white"
                        />
                        <ValueCard
                            icon={<Users className="w-6 h-6 text-accent" />}
                            title="The Sqaud"
                            desc="A community of fearless creators and players."
                            color="bg-[#121212] border-white/10 text-white"
                        />
                    </div>
                </div>
            </section>

            {/* Team Sheet / Footer CTA */}
            <section className="py-32 px-4 text-center">
                <div className="max-w-4xl mx-auto bg-[#121212] rounded-[48px] border border-white/10 p-12 md:p-24 relative overflow-hidden group">
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <h2 className="text-5xl md:text-8xl font-black font-display uppercase mb-8 relative z-10">
                        Join The XI
                    </h2>
                    <p className="text-white/40 mb-12 max-w-xl mx-auto text-lg relative z-10">
                        The roster is filling up. Secure your spot in the cult of RIIQX.
                    </p>
                    <a
                        href="/shop"
                        className="relative z-10 inline-flex items-center justify-center bg-white text-black px-12 py-5 rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Shop The Kit
                    </a>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
    return (
        <div className={`${color} p-8 rounded-[32px] border transition-all hover:-translate-y-2 duration-300 relative overflow-hidden`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${color.includes('bg-white') ? 'bg-black/10' : 'bg-white/5'}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide mb-2">{title}</h3>
            <p className="opacity-60 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
