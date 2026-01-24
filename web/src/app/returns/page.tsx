import { RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

export const metadata = {
    title: 'Returns & Exchange',
    description: 'RIIQX Returns and Exchange Policy.',
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-16">
                    Returns & Exchange
                </h1>

                <div className="space-y-12">
                    <p className="text-xl text-white/70 leading-relaxed font-light">
                        We have a no-questions-asked 14-day return policy for all unworn items with original tags attached.
                        Your satisfaction is our command.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-8 border-l-4 border-accent">
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-3">
                                <RotateCcw className="w-5 h-5" /> Return Process
                            </h3>
                            <ol className="list-decimal pl-5 text-white/60 space-y-3">
                                <li>Visit <a href="/return-order" className="text-white underline">Return Center</a></li>
                                <li>Enter Order ID and Email</li>
                                <li>Select items to return/exchange</li>
                                <li>Schedule a pickup</li>
                            </ol>
                        </div>

                        <div className="bg-white/5 p-8 border-l-4 border-red-500">
                            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500" /> Non-Returnable
                            </h3>
                            <ul className="list-disc pl-5 text-white/60 space-y-3">
                                <li>Accessories (Socks, Masks)</li>
                                <li>Used or washed items</li>
                                <li>Items without tags</li>
                                <li>clearance Sale items</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-accent/10 p-8 rounded border border-accent/20">
                        <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-3 text-accent">
                            <CheckCircle className="w-5 h-5" /> Refund Timeline
                        </h3>
                        <p className="text-white/70">
                            Refunds are processed within 5-7 business days after the quality check is approved at our warehouse.
                            The amount will be credited to the original payment source.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
