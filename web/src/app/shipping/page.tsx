import { Truck, Globe, Clock, Plane, Map, Container } from 'lucide-react';

export const metadata = {
    title: 'Logistics | Shipping Info',
    description: 'RIIQX Global Shipping Operations.',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black pt-32 pb-20 px-6">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#B4F000]/10 border border-[#B4F000]/20 rounded-sm backdrop-blur-md">
                        <Container className="w-4 h-4 text-[#B4F000]" />
                        <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-[#B4F000]">
                            Operations
                        </span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black font-oswald uppercase tracking-tighter mb-6 leading-[0.8] text-white">
                        Logistics <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white/20">Squad</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg font-mono uppercase tracking-wide border-t border-b border-white/10 py-6">
                        Global deployment protocols. From our warehouse to your dugout.
                    </p>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B4F000]/30 to-transparent -z-10" />

                    {/* Step 1: Processing */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#050505] border border-white/10 rounded-[2px] flex items-center justify-center mx-auto mb-10 group-hover:bg-[#B4F000] group-hover:text-black transition-all duration-300 z-10 relative shadow-[0_0_20px_rgba(180,240,0,0)] group-hover:shadow-[0_0_40px_rgba(180,240,0,0.3)]">
                            <Clock className="w-10 h-10" />
                        </div>
                        <div className="text-center bg-[#121212] border border-white/5 p-10 rounded-[2px] hover:border-[#B4F000]/30 transition-colors h-full">
                            <h3 className="text-3xl font-bold font-oswald uppercase mb-4 text-white">Processing</h3>
                            <p className="text-white/50 leading-relaxed font-light font-mono text-sm">
                                All orders are processed within <span className="text-[#B4F000] font-bold">24-48 hours</span>. Our kit managers ensure every item is quality checked before dispatch.
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Domestic */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#050505] border border-white/10 rounded-[2px] flex items-center justify-center mx-auto mb-10 group-hover:bg-[#B4F000] group-hover:text-black transition-all duration-300 z-10 relative shadow-[0_0_20px_rgba(180,240,0,0)] group-hover:shadow-[0_0_40px_rgba(180,240,0,0.3)]">
                            <Truck className="w-10 h-10" />
                        </div>
                        <div className="text-center bg-[#121212] border border-white/5 p-10 rounded-[2px] hover:border-[#B4F000]/30 transition-colors h-full">
                            <h3 className="text-3xl font-bold font-oswald uppercase mb-4 text-white">Domestic (India)</h3>
                            <p className="text-white/50 leading-relaxed font-light mb-6 font-mono text-sm">
                                Standard Match Delivery: <span className="text-[#B4F000] font-bold">3-5 Business Days</span> across all major metros.
                            </p>
                            <div className="inline-block bg-[#B4F000]/10 px-4 py-2 rounded-[2px] border border-[#B4F000]/20">
                                <span className="text-[10px] uppercase tracking-widest text-[#B4F000] font-bold">Free Shipping &gt; ₹1999</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Global */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-[#050505] border border-white/10 rounded-[2px] flex items-center justify-center mx-auto mb-10 group-hover:bg-[#B4F000] group-hover:text-black transition-all duration-300 z-10 relative shadow-[0_0_20px_rgba(180,240,0,0)] group-hover:shadow-[0_0_40px_rgba(180,240,0,0.3)]">
                            <Plane className="w-10 h-10" />
                        </div>
                        <div className="text-center bg-[#121212] border border-white/5 p-10 rounded-[2px] hover:border-[#B4F000]/30 transition-colors h-full">
                            <h3 className="text-3xl font-bold font-oswald uppercase mb-4 text-white">International</h3>
                            <p className="text-white/50 leading-relaxed font-light mb-6 font-mono text-sm">
                                Global deployment via DHL/FedEx. Expected arrival in <span className="text-[#B4F000] font-bold">7-14 Business Days</span>.
                            </p>
                            <p className="text-[10px] uppercase text-white/30 tracking-widest font-mono">
                                *Customs duties may apply
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tracking CTA */}
                <div className="mt-24 text-center">
                    <a href="/track-order" className="inline-flex items-center gap-6 bg-[#121212] border border-white/10 p-2 pr-8 rounded-full hover:bg-white/5 transition-all cursor-pointer group hover:border-[#B4F000]/50">
                        <div className="w-12 h-12 bg-[#B4F000] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Map className="w-5 h-5 text-black" />
                        </div>
                        <div className="text-left">
                            <span className="block text-[10px] uppercase text-white/40 tracking-widest font-mono mb-1">Got a tracking ID?</span>
                            <span className="block text-white font-bold uppercase tracking-wide group-hover:text-[#B4F000] transition-colors font-oswald text-xl">
                                Locate Shipment
                            </span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
