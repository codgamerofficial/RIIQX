"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

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
        <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black pt-32 pb-20 px-6">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#B4F000]/10 border border-[#B4F000]/20 rounded-sm backdrop-blur-md">
                        <HelpCircle className="w-4 h-4 text-[#B4F000]" />
                        <span className="text-xs font-mono uppercase tracking-[0.3em] font-bold text-[#B4F000]">
                            Knowledge Base
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black font-oswald uppercase tracking-tighter mb-6 leading-[0.8] text-white">
                        Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white/20">Questions</span>
                    </h1>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <AccordionItem key={idx} question={faq.question} answer={faq.answer} index={idx} />
                    ))}
                </div>
            </div>
        </main>
    );
}

function AccordionItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`border border-white/5 bg-[#121212] overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#B4F000]/50' : 'hover:border-white/20'}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-8 text-left group"
            >
                <div className="flex items-center gap-6">
                    <span className="font-mono text-[#B4F000] text-sm opacity-50">0{index + 1}</span>
                    <span className={`text-xl font-bold font-oswald uppercase transition-colors ${isOpen ? 'text-[#B4F000]' : 'text-white group-hover:text-white/80'}`}>
                        {question}
                    </span>
                </div>
                <div className={`p-1 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#B4F000]' : 'text-white/30'}`}>
                    {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-8 pb-8 pl-[4.5rem] pt-0">
                            <p className="text-white/40 font-mono text-sm leading-relaxed border-l-2 border-[#B4F000]/20 pl-6 py-2">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
