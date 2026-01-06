import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Email Call to Action */}
                <div className="text-center mb-20">
                    <p className="text-muted-foreground mb-2">Or email us directly</p>
                    <a href="mailto:thelegacyroars@gmail.com" className="text-2xl md:text-3xl font-bold text-white hover:text-primary transition-colors">
                        thelegacyroars@gmail.com
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="relative w-10 h-10">
                                <img
                                    src="/riiqx-logo.png"
                                    alt="RIIQX Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                RIIQX
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            The future of fashion is here. Cinematic, high-quality print-on-demand
                            apparel inspired by the heroes we love.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Shop</h3>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link href="/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Support</h3>
                        <ul className="space-y-4 text-muted-foreground">
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Connect</h3>
                        <div className="flex space-x-4">
                            <Link href="https://twitter.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="https://facebook.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
