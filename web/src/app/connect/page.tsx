import { Metadata } from 'next';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Connect | RIIQX',
    description: 'Join the RIIQX community.',
};

const socials = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-600" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com", color: "hover:bg-blue-400" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-600" },
    { name: "Newsletter", icon: Mail, href: "#newsletter", color: "hover:bg-primary" },
];

export default function ConnectPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 flex flex-col items-center justify-center">

            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">CULT.</span>
            </h1>
            <p className="text-muted-foreground text-center max-w-lg mb-12 text-lg">
                Stay updated on exclusive drops, behind-the-scenes content, and community events.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {socials.map((s, i) => (
                    <Link
                        key={i}
                        href={s.href}
                        className={`
                            flex flex-col items-center justify-center 
                            w-32 h-32 md:w-40 md:h-40 
                            rounded-3xl bg-secondary/10 border border-white/5 
                            transition-all duration-300 group
                            ${s.color} hover:text-white
                        `}
                    >
                        <s.icon className="w-8 h-8 md:w-10 md:h-10 text-white/50 group-hover:text-white group-hover:scale-110 transition-transform mb-3" />
                        <span className="font-bold text-sm">{s.name}</span>
                    </Link>
                ))}
            </div>

            <div className="mt-24 p-8 rounded-3xl bg-white/5 border border-white/10 max-w-2xl w-full text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Subscribe to our Newsletter</h2>
                <p className="text-muted-foreground mb-6">Get 10% off your first order.</p>
                <div className="flex gap-2 max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                    <button className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                        JOIN
                    </button>
                </div>
            </div>

        </div>
    );
}
