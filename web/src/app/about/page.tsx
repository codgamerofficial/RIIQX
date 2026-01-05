import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About RIIQX | Cinematic Apparel',
    description: 'The story behind RIIQX.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="relative h-[60vh] rounded-3xl overflow-hidden mb-16">
                    <Image
                        src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1920&auto=format&fit=crop"
                        alt="RIIQX Vision"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end p-8 md:p-16">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4">
                                WEAR YOUR <br /> <span className="text-primary">STORY.</span>
                            </h1>
                            <p className="text-xl text-white/80">
                                RIIQX isn't just a brand. It's a statement. A fusion of cinematic aesthetics and streetwear function.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The Origin</h2>
                        <p className="text-muted-foreground text-lg mb-4">
                            Born from a desire to bridge the gap between high-concept visual art and everyday apparel, RIIQX was established in 2024. We believe that what you wear should be as dynamic as the life you lead.
                        </p>
                        <p className="text-muted-foreground text-lg">
                            Every piece is designed with a narrative in mind. From the cyberpunk undercurrents of our hoodies to the minimalist precision of our tees, we craft gear for the protagonists of the real world.
                        </p>
                    </div>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/10">
                        <Image
                            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop"
                            alt="Design Process"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Quality", desc: "Premium GSM cotton and durable prints meant to last seasons." },
                        { title: "Design", desc: "Original artworks inspired by sci-fi, cinema, and urban culture." },
                        { title: "Sustainability", desc: "Print-on-demand model ensures zero waste inventory." }
                    ].map((value, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-secondary/5 border border-white/5 hover:border-primary/50 transition-colors">
                            <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                            <p className="text-muted-foreground">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
