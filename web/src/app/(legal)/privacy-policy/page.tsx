import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | RIIQX',
    description: 'Privacy Policy for RIIQX - How we handle your data.',
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <h1>Privacy Policy</h1>
            <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

            <p>
                At RIIQX, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website including any other media form, media channel, mobile website, or mobile application related or connected thereto.
            </p>

            <h2>Collection of Data</h2>
            <p>
                We collect information that you provide securely via Supabase Auth and Payment Gateways. This includes personal data such as your name, email address, and shipping details required for order fulfillment.
            </p>
            <ul>
                <li><strong>Personal Data:</strong> Name, Email, Shipping Address.</li>
                <li><strong>Payment Data:</strong> Handled securely by Cashfree. We do not store full card details.</li>
                <li><strong>Derivative Data:</strong> IP address, browser type, and operating system for analytics.</li>
            </ul>

            <h2>Use of Your Information</h2>
            <p>
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we use information collected about you via the Site to:
            </p>
            <ul>
                <li>Process your orders and deliver products via Qikink.</li>
                <li>Create and manage your account.</li>
                <li>Email you regarding your account or order.</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions.</li>
            </ul>

            <h2>Disclosure of Your Information</h2>
            <p>
                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <p>
                <strong>Third-Party Service Providers:</strong> We share your information with third parties that perform services for us or on our behalf, including payment processing (Cashfree), data analysis, email delivery, hosting services, customer service, and marketing assistance.
            </p>

            <h2>Contact Us</h2>
            <p>
                If you have questions or comments about this Privacy Policy, please contact us at support@riiqx.com.
            </p>
        </>
    );
}
