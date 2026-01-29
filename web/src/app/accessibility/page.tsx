import { Accessibility } from "lucide-react";

export default function AccessibilityPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-16 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-4 mb-4 text-accent">
                        <Accessibility className="w-8 h-8" />
                        <span className="text-xs font-mono uppercase tracking-widest">Legal Document 003</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-display italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-4">
                        Accessibility
                    </h1>
                    <p className="text-white/40 text-sm font-mono max-w-xl">
                        RIIQX Labs is committed to ensuring digital inclusion for all users.
                    </p>
                </div>

                <div className="space-y-12 font-sans text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">Our Commitment</h2>
                        <p>
                            We believe that fashion is for everyone. We are continuously optimizing the RIIQX platform to ensure it is accessible to individuals with disabilities, aiming to meet or exceed WCAG 2.1 Level AA standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">Accessibility Features</h2>
                        <ul className="list-disc pl-5 space-y-2 marker:text-accent">
                            <li>High contrast text ratios for readability.</li>
                            <li>Semantic HTML markup for screen reader compatibility.</li>
                            <li>Keyboard navigation support for all interactive elements.</li>
                            <li>ARIA labels on all non-text content.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 font-display">Feedback</h2>
                        <p>
                            If you encounter any accessibility barriers while using our secure terminal, please reach out immediately. We treat these reports with high priority.
                        </p>
                        <a href="mailto:support@riiqx.com" className="inline-block mt-4 text-accent font-bold uppercase tracking-widest text-xs border-b border-accent pb-1 hover:text-white hover:border-white transition-all">
                            Report an Issue
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
