import { RotateCcw, AlertTriangle, CheckCircle2, PackageX, Shirt, Ticket } from 'lucide-react';

export const metadata = {
    title: 'Fair Play | Returns',
    description: 'RIIQX Returns & Exchange Policy.',
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black pt-32 pb-20 px-6">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#B4F000]/10 border border-[#B4F000]/20 rounded-full backdrop-blur-md">
                        <Ticket className="w-4 h-4 text-[#B4F000]" />
                        <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-[#B4F000]">
                            Satisfaction Guaranteed
                        </span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black font-oswald uppercase tracking-tighter mb-6 leading-[0.8] text-white">
                        Fair <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white/20">Play</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg font-mono uppercase tracking-wide">
                        14-Day No Questions Asked Return Policy. If the fit ain't right, we fix it.
                    </p>
                </div>

                {/* Key Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* The Process */}
                    <div className="bg-[#121212] border border-white/5 p-10 rounded-[2px] relative overflow-hidden group hover:border-[#B4F000]/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#B4F000]/10 blur-[80px] rounded-full group-hover:bg-[#B4F000]/20 transition-colors" />

                        <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <RotateCcw className="w-32 h-32 text-[#B4F000]" />
                        </div>

                        <h2 className="text-4xl font-black font-oswald uppercase mb-10 text-white group-hover:text-[#B4F000] transition-colors">How To Return</h2>
                        <ul className="space-y-6 relative z-10">
                            <Step index="01" text="Visit the Return Center from the footer link." />
                            <Step index="02" text="Enter your Order ID and Registered Email." />
                            <Step index="03" text="Select items and schedule a seamless pickup." />
                            <Step index="04" text="Refund initiated instantly after quality check." />
                        </ul>
                        <a href="/return-order" className="mt-12 inline-flex items-center justify-center w-full bg-[#B4F000] text-black font-black uppercase tracking-widest py-4 rounded-[2px] hover:bg-white transition-colors relative z-10 clip-path-slant">
                            Start A Return Protocol
                        </a>
                    </div>

                    {/* The Rules */}
                    <div className="bg-[#0f0a15] border border-red-500/10 p-10 rounded-[2px] relative overflow-hidden hover:border-red-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 blur-[80px] rounded-full" />
                        <div className="absolute top-6 right-8 opacity-5">
                            <AlertTriangle className="w-32 h-32 text-red-500" />
                        </div>
                        <h2 className="text-4xl font-black font-oswald uppercase mb-10 text-white">Non-Returnable</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                            <RejectCard icon={<PackageX />} title="No Tags" />
                            <RejectCard icon={<Shirt />} title="Washed/Worn" />
                            <RejectCard icon={<PackageX />} title="Accessories" />
                            <RejectCard icon={<AlertTriangle />} title="Clearance" />
                        </div>
                    </div>
                </div>

                {/* Timeline Box */}
                <div className="bg-[#B4F000]/5 border border-[#B4F000]/20 p-8 rounded-[2px] text-center max-w-2xl mx-auto">
                    <div className="w-12 h-12 bg-[#B4F000]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <CheckCircle2 className="w-6 h-6 text-[#B4F000]" />
                    </div>
                    <h3 className="text-2xl font-bold uppercase mb-2 text-[#B4F000] font-oswald">Instant Refund Protocol</h3>
                    <p className="text-white/60 font-light font-mono text-sm leading-relaxed">
                        Once our warehouse verifies the gear, the refund is fired instantly to your original payment source. Usually reflects within 5-7 business days.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Step({ index, text }: { index: string, text: string }) {
    return (
        <li className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <span className="text-sm font-mono text-[#B4F000] font-bold tracking-widest">{index}</span>
            <span className="text-white/70 font-light">{text}</span>
        </li>
    );
}

function RejectCard({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="bg-black/40 border border-white/5 p-4 rounded-[2px] flex items-center gap-3 hover:bg-red-500/10 hover:border-red-500/20 transition-colors cursor-not-allowed">
            <div className="text-red-500 opacity-70">{icon}</div>
            <span className="text-white/60 text-sm font-bold uppercase tracking-wide font-mono">{title}</span>
        </div>
    );
}
