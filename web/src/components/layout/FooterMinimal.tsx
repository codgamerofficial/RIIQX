"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

const shopLinks = [
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Shop All", href: "/shop" },
    { name: "Bestsellers", href: "/best-sellers" },
    { name: "Accessories", href: "/accessories" },
];

const supportLinks = [
    { name: "Track Order", href: "/track-order" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "FAQ", href: "/faq" },
    { name: "Who We Are", href: "/about" },
];

const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
];

export function FooterMinimal() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

                    {/* Brand */}
                    <div className="md:col-span-4">
                        <Link href="/" className="inline-block mb-6 relative w-24 h-8 bg-transparent">
                            <img
                                src="/logo.png"
                                alt="RIIQX"
                                className="h-full w-full object-contain object-left"
                            />
                        </Link>
                        <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-8">
                            We don&apos;t follow trends.<br />
                            We design identity.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { label: "IG", href: SOCIAL_LINKS.instagram },
                                { label: "TW", href: SOCIAL_LINKS.twitter },
                                { label: "PI", href: SOCIAL_LINKS.pinterest },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 hover:bg-white hover:text-black hover:border-white transition-all"
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-2 md:col-start-7">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-6">
                            Shop
                        </h3>
                        <ul className="space-y-4">
                            {shopLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-white/50 hover:text-white transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-6">
                            Support
                        </h3>
                        <ul className="space-y-4">
                            {supportLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-white/50 hover:text-white transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-6">
                            Updates
                        </h3>
                        <p className="text-xs text-white/30 mb-4">
                            First access to drops. No spam.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white text-sm focus:outline-none focus:border-[#B4F000] transition-colors placeholder:text-white/20"
                            />
                            <button className="absolute right-0 top-3 text-white/30 hover:text-[#B4F000] transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] text-white/15 font-mono uppercase tracking-[0.2em]">
                    <p>© 2026 RIIQX. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        {legalLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="hover:text-white/40 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
