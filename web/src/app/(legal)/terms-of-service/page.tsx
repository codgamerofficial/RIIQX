import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | RIIQX',
    description: 'Terms and Conditions for using RIIQX.',
};

export default function TermsPage() {
    return (
        <>
            <h1>Terms of Service</h1>
            <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Agreement to Terms</h2>
            <p>
                These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and RIIQX (“we,” “us” or “our”), concerning your access to and use of the RIIQX website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
            </p>

            <h2>2. Intellectual Property Rights</h2>
            <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
            </p>

            <h2>3. User Representations</h2>
            <p>
                By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
            </p>

            <h2>4. Purchases and Payment</h2>
            <p>
                We accept the following forms of payment: Credit/Debit Cards, UPI, Net Banking via Cashfree. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.
            </p>

            <h2>5. Products</h2>
            <p>
                All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
            </p>

            <h2>6. Return Policy</h2>
            <p>
                Please review our Return Policy posted on the Site prior to making any purchases.
            </p>

            <h2>7. Contact Us</h2>
            <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: support@riiqx.com.
            </p>
        </>
    );
}
