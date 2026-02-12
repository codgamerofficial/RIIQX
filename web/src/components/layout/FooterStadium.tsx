"use client";

import Link from "next/link";

export function FooterStadium() {
    return (
        <footer className="relative bg-[#050505] border-t border-white/10 overflow-hidden">
            {/* STADIUM LIGHTS BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-[300px] h-[500px] bg-[var(--mi-blue)] opacity-10 blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[500px] bg-[var(--rcb-red)] opacity-10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="grid md:grid-cols-4 gap-12">

                    {/* BRAND COLUMN */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block relative w-48 h-16">
                            <img
                                src="/logo.png"
                                alt="RIIQX"
                                className="h-full w-full object-contain object-left"
                            />
                        </Link>
                        <p className="mt-4 text-white/40 font-mono text-sm">
                            OFFICIAL KIT PARTNER <br />
                            OF THE UNDERGROUND.
                        </p>
                    </div>

                    {/* LINKS COLUMN 1 */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">
                            THE DUG OUT
                        </h3>
                        <ul className="space-y-4 font-['Rajdhani'] font-medium text-white/60">
                            <li><Link href="/shop" className="hover:text-[var(--mi-blue)] transition-colors">Team Kits</Link></li>
                            <li><Link href="/collections" className="hover:text-[var(--mi-blue)] transition-colors">Training Gear</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--mi-blue)] transition-colors">Club History</Link></li>
                        </ul>
                    </div>

                    {/* LINKS COLUMN 2 */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">
                            SUPPORT STAFF
                        </h3>
                        <ul className="space-y-4 font-['Rajdhani'] font-medium text-white/60">
                            <li><Link href="/track-order" className="hover:text-[var(--rcb-red)] transition-colors">Track Match Ticket</Link></li>
                            <li><Link href="/returns" className="hover:text-[var(--rcb-red)] transition-colors">Return Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--rcb-red)] transition-colors">Contact Umpire</Link></li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">
                            JOIN THE SQUAD
                        </h3>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL..."
                                className="bg-white/5 border border-white/10 px-4 py-3 text-white font-mono text-sm w-full focus:outline-none focus:border-[var(--pitch-green)] transition-colors"
                            />
                            <button className="bg-[var(--pitch-green)] text-black px-4 font-bold uppercase hover:bg-white transition-colors">
                                →
                            </button>
                        </form>
                    </div>

                </div>

                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/30 font-mono uppercase">
                    <div>© 2026 RIIQX OFFICIAL. ALL RIGHTS RESERVED.</div>
                    <div className="mt-4 md:mt-0">GAME ON.</div>
                </div>
            </div>
        </footer>
    );
}
