"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How long does shipping take?",
        answer: "Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 days depending on the destination processing times."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order ships, you will receive a tracking number via email. You can also view the status in your account dashboard under 'Order History'."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
    },
    {
        question: "Are your products sustainably made?",
        answer: "Absolutely. We use print-on-demand technology to reduce overproduction and source eco-friendly materials whenever possible."
    }
];

export default function FAQPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="KNOWLEDGE BASE"
                subtitle="Frequently Asked Questions"
            />

            <section className="max-w-3xl mx-auto px-4 -mt-10 relative z-20 space-y-4">
                {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} question={faq.question} answer={faq.answer} />
                ))}
            </section>
        </main>
    );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-lg font-bold text-white">{question}</span>
                <div className={`p-2 rounded-full border border-white/20 transition-all ${isOpen ? 'bg-white text-black rotate-180' : 'text-white'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
