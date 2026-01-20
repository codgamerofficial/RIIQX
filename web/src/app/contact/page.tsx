"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { ContactSection } from "@/components/contact/ContactSection";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="GET IN TOUCH"
                subtitle="Signals Open"
                description="Our team is ready to assist you. Send us a transmission directly from the interface below."
            />

            {/* Premium Contact Section */}
            <ContactSection />

            <section className="max-w-6xl mx-auto px-4 md:px-8 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6">
                            <h3 className="text-2xl font-bold text-white">Headquarters</h3>
                            <div className="space-y-4 text-gray-400">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-primary shrink-0" />
                                    <p>Headquarters<br />Monoharchak Road, Near Sani Temple, Contai,<br />East Medinipur, West Bengal, 721401, INDIA</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="w-6 h-6 text-primary shrink-0" />
                                    <p>thelegacyroars@gmail.com</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="w-6 h-6 text-primary shrink-0" />
                                    <p>+91 8145172429</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-purple-900/20 to-black border border-purple-500/20 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-white mb-2">Support Hours</h3>
                            <p className="text-gray-400">
                                Mon - Fri: 09:00 - 18:00 (IST)<br />
                                Sat - Sun: Closed
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.form
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-black border border-white/10 p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl shadow-purple-900/10"
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="First Name" placeholder="John" />
                                <InputGroup label="Last Name" placeholder="Doe" />
                            </div>
                            <InputGroup label="Email" placeholder="john@example.com" type="email" />
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Message</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all h-32 resize-none placeholder:text-white/20"
                                    placeholder="Enter your transmission..."
                                />
                            </div>
                        </div>

                        <button className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors group">
                            <span>Send Message</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.form>
                </div>
            </section>
        </main>
    );
}

function InputGroup({ label, placeholder, type = "text" }: { label: string, placeholder: string, type?: string }) {
    return (
        <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">{label}</label>
            <input
                type={type}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all placeholder:text-white/20"
                placeholder={placeholder}
            />
        </div>
    );
}
