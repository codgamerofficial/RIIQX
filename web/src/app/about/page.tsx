import { Metadata } from 'next';
import { Award, Heart, Leaf, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Our Story',
    description: 'Learn about RIIQX - where streetwear meets innovation.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-transparent" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-8xl font-black font-display text-white uppercase tracking-tighter mb-4">
                        Our Story
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto font-mono tracking-wide uppercase">
                        Streetwear × Innovation
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black font-display text-white uppercase mb-6">
                            The Mission
                        </h2>
                        <p className="text-xl text-white/50 leading-relaxed font-light">
                            RIIQX wasn't built to fit in. It was built to stand out. We merge the raw energy of street culture with precision engineering to create apparel that doesn't just look good—it performs.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                        <ValueCard
                            icon={<Heart className="w-6 h-6 text-accent" />}
                            title="Authenticity"
                            desc="Real stories. Real people. No fake hype."
                        />
                        <ValueCard
                            icon={<Award className="w-6 h-6 text-accent" />}
                            title="Elite Quality"
                            desc="Precision stitching. Heavyweight fabrics. Built to last."
                        />
                        <ValueCard
                            icon={<Leaf className="w-6 h-6 text-accent" />}
                            title="Sustainability"
                            desc="Eco-conscious production. Because the future matters."
                        />
                        <ValueCard
                            icon={<Users className="w-6 h-6 text-accent" />}
                            title="Community"
                            desc="Built by the streets, for the streets."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center border-t border-white/5 pt-20">
                    <h2 className="text-4xl md:text-6xl font-black font-display uppercase mb-8">
                        Join the Cult
                    </h2>
                    <a
                        href="/shop"
                        className="inline-block bg-white text-black px-12 py-4 rounded-none font-bold text-lg uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                    >
                        Shop Collection
                    </a>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="bg-white/5 border border-white/5 p-8 hover:border-accent/50 transition-colors group">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">{title}</h3>
            <p className="text-white/40">{desc}</p>
        </div>
    );
}
