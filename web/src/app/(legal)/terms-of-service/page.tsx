"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";

export default function TermsPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="TERMS OF SERVICE"
                subtitle="Operational Parameters"
            />

            <article className="max-w-3xl mx-auto px-4 text-gray-300 space-y-12 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">overview</h2>
                    <p>
                        This website is operated by RIIQX. Throughout the site, the terms "we", "us" and "our" refer to RIIQX.
                        RIIQX offers this website, including all information, tools and services available from this site to you, the user,
                        conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">section 1 - online store terms</h2>
                    <p>
                        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.
                        You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4">section 2 - general conditions</h2>
                    <p>
                        We reserve the right to refuse service to anyone for any reason at any time.
                        You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks;
                        and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
                    </p>
                </section>
            </article>
        </main>
    );
}
