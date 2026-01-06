"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";

export default function PrivacyPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="PRIVACY POLICY"
                subtitle="Data Protocols"
            />

            <article className="max-w-3xl mx-auto px-4 text-gray-300 space-y-12 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                    <p>
                        RIIQX respects the privacy of its users and is committed to protecting the personal information that you share with us.
                        This privacy policy describes how we collect and use your personal information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>Personal Identification Information (Name, email address, phone number, etc.)</li>
                        <li>Payment Information (Processed securely by third-party providers)</li>
                        <li>Usage Data (Browser type, pages visited, time spent on site)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Data</h2>
                    <p>
                        We use the collected data for various purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400 mt-4">
                        <li>To provide and maintain our Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To provide customer support</li>
                        <li>To monitor the usage of our Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>
                </section>
            </article>
        </main>
    );
}
