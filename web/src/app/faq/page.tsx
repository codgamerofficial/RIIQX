import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ | RIIQX',
    description: 'Frequently Asked Questions.',
};

const faqs = [
    {
        q: "How long does shipping take?",
        a: "We typically process orders within 1-3 days. Delivery across India usually takes 5-7 business days."
    },
    {
        q: "How do I track my order?",
        a: "Once shipped, you'll receive an email with a tracking link. You can also track it from your User Dashboard."
    },
    {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unused items in original packaging. Check our Shipping & Returns page for full details."
    },
    {
        q: "Do you ship internationally?",
        a: "Currently, RIIQX ships exclusively within India. We plan to expand globally soon."
    },
    {
        q: "How do I contact support?",
        a: "You can email us at support@riiqx.com or use the form on our Contact page."
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-8 text-center">
                    F.A.Q.
                </h1>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-secondary/5 border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                            <p className="text-muted-foreground">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
