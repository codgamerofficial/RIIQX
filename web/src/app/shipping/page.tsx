import { Truck, Globe, Clock } from 'lucide-react';

export const metadata = {
    title: 'Shipping Information',
    description: 'Global shipping policies for RIIQX Elite gear.',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter mb-16">
                    Shipping Protocol
                </h1>

                <div className="grid gap-12">
                    {/* Section 1 */}
                    <div className="bg-white/5 border border-white/5 p-8 md:p-12">
                        <div className="flex items-start gap-6">
                            <Truck className="w-8 h-8 text-accent shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-wide mb-4">Domestic Orders (India)</h3>
                                <p className="text-white/60 mb-4 leading-relaxed">
                                    All domestic orders are processed within 24-48 hours. Standard delivery timeline is 3-5 business days across major metro cities.
                                </p>
                                <ul className="list-disc pl-5 text-white/50 space-y-2">
                                    <li>Free Shipping on orders above ₹1999</li>
                                    <li>Standard Shipping: ₹99</li>
                                    <li>Express options available at checkout</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-white/5 border border-white/5 p-8 md:p-12">
                        <div className="flex items-start gap-6">
                            <Globe className="w-8 h-8 text-accent shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-wide mb-4">International shipping</h3>
                                <p className="text-white/60 mb-4 leading-relaxed">
                                    We ship globally to over 220+ countries via DHL Express / FedEx. International timelines vary from 7-14 business days.
                                </p>
                                <p className="text-white/40 text-sm italic">
                                    *Customs duties and taxes are the responsibility of the customer.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-white/5 border border-white/5 p-8 md:p-12">
                        <div className="flex items-start gap-6">
                            <Clock className="w-8 h-8 text-accent shrink-0 mt-1" />
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-wide mb-4">Order Tracking</h3>
                                <p className="text-white/60 mb-4 leading-relaxed">
                                    Once dispatched, you will receive a tracking ID via email and SMS. Use our <a href="/track-order" className="text-accent underline">Track Order</a> page for live updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
