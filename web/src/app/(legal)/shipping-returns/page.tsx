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
                    </p>
                    <p className="mb-4">
                        <strong>Shipping Timelines:</strong><br />
                        - Standard Shipping: Delivered within 5-7 business days.<br />
                        - Expedited Shipping: Delivered within 2-4 business days.<br />
                        - Overnight Delivery: Delivered within 1-2 business days.
                    </p>
                    <p>
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                    </p>
                </section>

                <div className="h-px bg-white/10" />

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Refund & Cancellation Policy</h2>
                    <p className="mb-4">
                        We want you to be completely satisfied with your purchase. You may request a return or exchange within 30 days of delivery.
                    </p>
                    <h3 className="text-lg font-bold text-white mb-2 mt-6">Review & Processing</h3>
                    <p className="mb-4">
                        Once your return is received and inspected, we will notify you of the approval or rejection of your refund.
                        If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment within <strong>5-7 working days</strong>.
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
                        If you received a damaged product, please notify us immediately at thelegacyroars@gmail.com for assistance. We will arrange a replacement or refund as quickly as possible.
                    </p>
                </section>
            </article>
        </main>
    );
}
