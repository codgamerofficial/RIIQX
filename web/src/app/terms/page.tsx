
export const metadata = {
    title: 'Terms of Service',
    description: 'Terms and Conditions for browsing and purchasing on RIIQX.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter mb-12">
                    Terms of Service
                </h1>

                <div className="space-y-8 text-white/60 leading-relaxed font-light prose prose-invert max-w-none">
                    <p>
                        Welcome to RIIQX. By accessing our website, you agree to be bound by these Terms of Service.
                    </p>

                    <h3 className="text-white font-bold text-xl uppercase tracking-wide pt-6">1. General Conditions</h3>
                    <p>
                        We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information) may be transferred unencrypted.
                    </p>

                    <h3 className="text-white font-bold text-xl uppercase tracking-wide pt-6">2. Products & Pricing</h3>
                    <p>
                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue sale of any product.
                    </p>

                    <h3 className="text-white font-bold text-xl uppercase tracking-wide pt-6">3. Accuracy of Billing</h3>
                    <p>
                        You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
                    </p>

                    <h3 className="text-white font-bold text-xl uppercase tracking-wide pt-6">4. User Comments</h3>
                    <p>
                        If you send us creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, and distribute them.
                    </p>

                    <div className="pt-12 border-t border-white/10 mt-12">
                        <p className="text-sm text-white/30">Last Updated: January 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
