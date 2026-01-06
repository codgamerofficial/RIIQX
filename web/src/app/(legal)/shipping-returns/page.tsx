"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";

export default function ShippingReturnsPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="SHIPPING & RETURNS"
                subtitle="Logistics Protocols"
            />

            <article className="max-w-3xl mx-auto px-4 text-gray-300 space-y-12 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Shipping Policy</h2>
                    <p className="mb-4">
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>Standard Shipping (3-5 days): Free for orders over 299 Rupees</li>
                        <li>Expedited Shipping (2 days): 99 Rupees</li>
                        <li>Overnight Delivery: 199 Rupees</li>
                    </ul>
                </section>

                <div className="h-px bg-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Returns & Exchanges</h2>
                    <p className="mb-4">
                        We want you to be completely satisfied with your purchase. You may return items within 30 days of delivery for a full refund or exchange.
                    </p>
                    <h3 className="text-lg font-bold text-white mb-2 mt-6">Conditions</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>Items must be unworn, unwashed, and unused.</li>
                        <li>Original tags must be attached.</li>
                        <li>Proof of purchase is required.</li>
                    </ul>
                </section>

                <div className="h-px bg-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Damaged Items</h2>
                    <p>
                        If you received a damaged product, please notify us immediately for assistance. We will arrange a replacement or refund as quickly as possible.
                    </p>
                </section>
            </article>
        </main>
    );
}
