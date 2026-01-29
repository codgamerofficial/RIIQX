import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-4 mb-4 text-accent">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="text-xs font-mono uppercase tracking-widest">Legal Document 001</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-display italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-4">
                        Privacy Protocol
                    </h1>
                    <p className="text-white/40 text-sm font-mono max-w-xl">
                        Last Updated: January 2026. This document outlines the surveillance and data retention policies of RIIQX Labs.
                    </p>
                </div>

                <div className="space-y-12 font-sans text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">1. Data Collection</h2>
                        <p className="mb-4">
                            We collect information you provide directly to us, including your name, email address, shipping address, and payment information when you make a purchase.
                        </p>
                        <p>
                            Automated data collection protocols initiate upon site access, capturing device identifiers, browser fingerprints, and interaction metrics to optimize the RIIQX terminal experience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">2. Usage of Information</h2>
                        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
                            <li>To fulfill your orders and send tracking updates.</li>
                            <li>To maintain the integrity of our secure checkout systems.</li>
                            <li>To create personalized product recommendations based on your lookbook interactions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">3. Third-Party Sharing</h2>
                        <p>
                            Your data is shared only with strictly vetted partners essential for logistics (delivery carriers) and transaction processing (payment gateways). We do not sell your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">4. Security Protocols</h2>
                        <p>
                            All transmissions are encrypted via SSL/TLS. We employ enterprise-grade firewalls and access controls to protect your personal information within the RIIQX database.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
