"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, Smartphone, ArrowUp, Mail, Package, RefreshCw, RotateCcw, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThankYouSection } from "@/components/shared/ThankYouSection";

export function Footer() {
    const [email, setEmail] = useState("");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Premium Thank You Section */}
            <ThankYouSection />

            <footer className="w-full bg-[#121212] text-white pt-16 pb-8 border-t border-white/5 font-sans">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- Top Section: Brand & Main Columns --- */}
                    <div className="mb-12">
                        <Link href="/" className="inline-block mb-12">
                            <span className="text-3xl font-black text-bewakoof-yellow tracking-tighter uppercase">RIIQX</span>
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            {/* Column 1: Customer Service */}
                            <div>
                                <h3 className="text-bewakoof-yellow font-bold mb-6 text-sm uppercase tracking-wider">Customer Service</h3>
                                <ul className="space-y-2 text-sm text-white font-medium mb-8">
                                    <li><Link href="/contact" className="hover:text-bewakoof-yellow transition-colors">Contact Us</Link></li>
                                    <li><Link href="/track-order" className="hover:text-bewakoof-yellow transition-colors">Track Order</Link></li>
                                    <li><Link href="/return-order" className="hover:text-bewakoof-yellow transition-colors">Return Order</Link></li>
                                    <li><Link href="/cancel-order" className="hover:text-bewakoof-yellow transition-colors">Cancel Order</Link></li>
                                </ul>

                                <div className="space-y-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4" /> <span>15 Days Return Policy*</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" /> <span>Cash On Delivery*</span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Company */}
                            <div>
                                <h3 className="text-bewakoof-yellow font-bold mb-6 text-sm uppercase tracking-wider">Company</h3>
                                <ul className="space-y-2 text-sm text-white font-medium">
                                    <li><Link href="/about" className="hover:text-bewakoof-yellow transition-colors">About Us</Link></li>
                                    <li><Link href="/terms-of-service" className="hover:text-bewakoof-yellow transition-colors">Terms & Conditions</Link></li>
                                    <li><Link href="/privacy-policy" className="hover:text-bewakoof-yellow transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/careers" className="hover:text-bewakoof-yellow transition-colors">We are Hiring</Link></li>
                                </ul>

                                <div className="mt-8">
                                    <h3 className="text-bewakoof-yellow font-bold mb-6 text-sm uppercase tracking-wider">Download The App</h3>
                                    <div className="flex gap-2">
                                        <img src="https://images.bewakoof.com/web/app_android_v1.png" alt="Android App" className="h-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
                                        <img src="https://images.bewakoof.com/web/app_ios_v1.png" alt="iOS App" className="h-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Connect With Us */}
                            <div>
                                <h3 className="text-bewakoof-yellow font-bold mb-6 text-sm uppercase tracking-wider">Connect With Us</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <Facebook className="w-5 h-5 text-white" />
                                        <span>4.7M People like this</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <Instagram className="w-5 h-5 text-white" />
                                        <span>1M People like this</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Twitter className="w-5 h-5 text-white cursor-pointer hover:text-bewakoof-yellow" />
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 cursor-pointer hover:bg-bewakoof-yellow">
                                        <span className="text-black font-bold text-[10px]">P</span>
                                    </div>
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 cursor-pointer hover:bg-bewakoof-yellow">
                                        <span className="text-black font-bold text-[10px]">S</span>
                                    </div>
                                    <div className="w-5 h-5 cursor-pointer hover:text-bewakoof-yellow">
                                        {/* Apple Logo Placeholder */}
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M17.05 20.28c-.98.95-2.05.87-3.08.49-1.09-.41-2.09-.39-3.2 0-1.28.46-2.09.28-3.08-.49-2.22-2.18-3.05-6.83-1.12-9.62 1.01-1.45 2.65-2.09 3.99-2 1.13.07 2.05.57 2.87.57.82 0 1.95-.57 3.2-.5 1.45.08 3.1.86 4.14 2-.15.22-2.43 1.41-2.43 4.22 0 3.39 2.92 4.46 3 4.49-.03.11-.47 1.6-1.57 3.13-.5.7-1.13 1.41-1.78 1.41l-.94-.7zM12.03 7.25c-.2 1.39-1.39 2.76-2.91 2.81-.39-1.47.78-2.9 2.09-3.41.22.92.82 1.57.82 1.57zm-.97-3.41c1.55-.13 2.81 1.09 2.81 2.81-1.6.09-2.98-1.07-2.81-2.81z" /></svg>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-bewakoof-yellow font-bold mb-6 text-sm uppercase tracking-wider">100% Secure Payment</h3>
                                    <div className="flex flex-wrap gap-2 items-center opacity-80">
                                        <div className="bg-white px-2 py-1 rounded h-6 w-12 flex items-center justify-center"><span className="text-black text-[8px] font-bold">GPay</span></div>
                                        <div className="bg-white px-2 py-1 rounded h-6 w-12 flex items-center justify-center"><span className="text-blue-600 text-[8px] font-bold">Paytm</span></div>
                                        <div className="bg-white px-2 py-1 rounded h-6 w-12 flex items-center justify-center"><span className="text-purple-600 text-[8px] font-bold">PhonePe</span></div>
                                        <div className="bg-white px-2 py-1 rounded h-6 w-12 flex items-center justify-center"><span className="text-blue-800 text-[8px] font-bold">VISA</span></div>
                                        <div className="bg-white px-2 py-1 rounded h-6 w-12 flex items-center justify-center"><span className="text-orange-600 text-[8px] font-bold">Master</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4: Keep Up To Date */}
                            <div>
                                <h3 className="text-bewakoof-yellow font-bold mb-6 text-sm uppercase tracking-wider">Keep Up To Date</h3>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Enter Email Id:"
                                        className="bg-transparent border-b border-bewakoof-yellow text-white py-2 px-0 w-full focus:outline-none focus:border-white text-sm placeholder:text-gray-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button className="bg-bewakoof-yellow text-black font-bold px-6 text-sm uppercase shrink-0 hover:bg-[#fbc02d] transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Divider --- */}
                    <div className="border-t border-white/10 my-12"></div>

                    {/* --- Bottom Section: Sitemap Links --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-[11px] text-gray-400 leading-6">
                        {/* Expanded Brand Links (Simplified) */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-2 gap-8 text-[11px] text-gray-400">
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-4 uppercase">Popular</h4>
                                    <ul className="space-y-2">
                                        <li><Link href="/collections/streetwear" className="hover:text-bewakoof-yellow">Streetwear</Link></li>
                                        <li><Link href="/collections/new-arrivals" className="hover:text-bewakoof-yellow">New Arrivals</Link></li>
                                        <li><Link href="/lookbook" className="hover:text-bewakoof-yellow">Lookbook</Link></li>
                                        <li><Link href="/shop" className="hover:text-bewakoof-yellow">All Products</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Empty or Additional Columns */}
                        <div className="hidden lg:block"></div>

                        {/* Right Side Links */}
                        <div className="text-right flex flex-col items-end gap-2">
                            <Link href="/fanbook" className="text-cyan-400 font-bold uppercase hover:text-white mb-2">FANBOOK</Link>
                            <Link href="/offers" className="text-cyan-400 font-bold uppercase hover:text-white mb-2">OFFERS</Link>
                            <Link href="/sitemap" className="text-cyan-400 font-bold uppercase hover:text-white mb-2">SITEMAP</Link>
                        </div>

                    </div>

                    {/* Back to Top */}
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 bg-[#2d2d2d] text-white p-2 rounded flex flex-col items-center justify-center hover:bg-bewakoof-yellow hover:text-black transition-all z-50 group shadow-lg"
                    >
                        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        <span className="text-[10px] font-bold mt-1">TOP</span>
                    </button>

                </div>
            </footer>
        </>
    );
}
