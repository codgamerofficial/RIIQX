import { RotateCcw, AlertTriangle, CheckCircle2, PackageX, Shirt } from 'lucide-react';

export const metadata = {
    title: 'Fair Play | Returns',
    description: 'RIIQX Returns & Exchange Policy.',
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md mb-6 text-green-400">
                        Satisfaction Guaranteed
                    </span>
                    <h1 className="text-6xl md:text-9xl font-black font-display uppercase tracking-tighter mb-6 leading-[0.8]">
                        Fair <span className="text-white/20">Play</span>
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg font-mono uppercase tracking-wide">
                        14-Day No Questions Asked Return Policy. If the fit ain't right, we fix it.
                    </p>
                </div>

                {/* Key Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* The Process */}
                    <div className="bg-[#121212] border border-white/10 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <RotateCcw className="w-32 h-32" />
                        </div>
                        <h2 className="text-3xl font-black font-display uppercase mb-8">How To Return</h2>
                        <ul className="space-y-6">
                            <Step index="01" text="Visit the Return Center from the footer link." />
                            <Step index="02" text="Enter your Order ID and Registered Email." />
                            <Step index="03" text="Select items and schedule a seamless pickup." />
                            <Step index="04" text="Refund initiated instantly after quality check." />
                        </ul>
                        <a href="/return-order" className="mt-10 inline-flex items-center justify-center w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-accent hover:text-white transition-colors">
                            Start A Return
                        </a>
                    </div>

                    {/* The Rules */}
                    <div className="bg-[#0f0a15] border border-purple-500/20 p-10 rounded-[40px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <AlertTriangle className="w-32 h-32 text-purple-500" />
                        </div>
                        <h2 className="text-3xl font-black font-display uppercase mb-8">Non-Returnable</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <RejectCard icon={<PackageX />} title="No Tags" />
                            <RejectCard icon={<Shirt />} title="Washed/Worn" />
                            <RejectCard icon={<PackageX />} title="Accessories" />
                            <RejectCard icon={<AlertTriangle />} title="Clearance" />
                        </div>
                    </div>
                </div>

                {/* Timeline Box */}
                <div className="bg-green-500/5 border border-green-500/20 p-8 rounded-[32px] text-center max-w-2xl mx-auto">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold uppercase mb-2 text-green-400">Instant Refund Protocol</h3>
                    <p className="text-white/60 font-light">
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
            <span className="text-sm font-mono text-accent font-bold tracking-widest">{index}</span>
            <span className="text-white/70 font-light">{text}</span>
        </li>
    );
}

function RejectCard({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
            <div className="text-purple-400 opacity-70">{icon}</div>
            <span className="text-white/60 text-sm font-bold uppercase tracking-wide">{title}</span>
        </div>
    );
}
