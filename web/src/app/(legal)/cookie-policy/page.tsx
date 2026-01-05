import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy | RIIQX',
    description: 'How RIIQX uses cookies.',
};

export default function CookiePolicyPage() {
    return (
        <>
            <h1>Cookie Policy</h1>
            <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

            <p>
                This Cookie Policy explains how RIIQX uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <h2>What are cookies?</h2>
            <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>

            <h2>Why do we use cookies?</h2>
            <ul>
                <li><strong>Essential Cookies:</strong> strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas (Authentication).</li>
                <li><strong>Performance and Functionality Cookies:</strong> used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.</li>
                <li><strong>Analytics Cookies:</strong> help us understand how our Website is being used or how effective our marketing campaigns are.</li>
            </ul>

            <h2>How can I control cookies?</h2>
            <p>
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>
        </>
    );
}
