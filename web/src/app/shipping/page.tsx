import { Truck, Globe, Clock, Plane, Map } from 'lucide-react';

export const metadata = {
    title: 'Logistics | Shipping Info',
    description: 'RIIQX Global Shipping Operations.',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md mb-6 text-accent">
                        Operations
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black font-display uppercase tracking-tighter mb-6 leading-[0.8]">
                        Logistics <span className="text-white/20">Squad</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg font-mono uppercase tracking-wide">
                        Global deployment protocols. From our warehouse to your dugout.
                    </p>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />

                    {/* Step 1: Processing */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#121212] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-white group-hover:text-black transition-colors z-10 relative">
                            <Clock className="w-10 h-10" />
                        </div>
                        <div className="text-center bg-[#121212] border border-white/5 p-8 rounded-[32px] hover:border-accent/30 transition-colors h-full">
                            <h3 className="text-2xl font-black font-display uppercase mb-4">Processing Time</h3>
                            <p className="text-white/50 leading-relaxed font-light">
                                All orders are processed within <span className="text-white font-bold">24-48 hours</span>. Our kit managers ensure every item is quality checked before dispatch.
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Domestic */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#121212] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-accent group-hover:text-black transition-colors z-10 relative">
                            <Truck className="w-10 h-10" />
                        </div>
                        <div className="text-center bg-[#121212] border border-white/5 p-8 rounded-[32px] hover:border-accent/30 transition-colors h-full">
                            <h3 className="text-2xl font-black font-display uppercase mb-4">Domestic (India)</h3>
                            <p className="text-white/50 leading-relaxed font-light mb-4">
                                Standard Match Delivery: <span className="text-white font-bold">3-5 Business Days</span> across all major metros.
                            </p>
                            <div className="inline-block bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                <span className="text-xs uppercase tracking-widest text-accent">Free Shipping &gt; ₹1999</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Global */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#121212] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-500 group-hover:text-white transition-colors z-10 relative">
                            <Plane className="w-10 h-10" />
                        </div>
                        <div className="text-center bg-[#121212] border border-white/5 p-8 rounded-[32px] hover:border-purple-500/30 transition-colors h-full">
                            <h3 className="text-2xl font-black font-display uppercase mb-4">International</h3>
                            <p className="text-white/50 leading-relaxed font-light mb-4">
                                Global deployment via DHL/FedEx. Expected arrival in <span className="text-white font-bold">7-14 Business Days</span>.
                            </p>
                            <p className="text-[10px] uppercase text-white/30 tracking-widest">
                                *Customs duties may apply
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tracking CTA */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-4 bg-[#121212] border border-white/10 p-2 pr-6 rounded-full hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <Map className="w-5 h-5 text-black" />
                        </div>
                        <div className="text-left">
                            <span className="block text-[10px] uppercase text-white/40 tracking-widest">Got a tracking ID?</span>
                            <a href="/track-order" className="block text-white font-bold uppercase tracking-wide group-hover:text-accent transition-colors">Locate Your Shipment</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
