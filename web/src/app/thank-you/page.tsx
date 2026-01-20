import { ThankYouSection } from "@/components/shared/ThankYouSection";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ThankYouPage() {
    return (
        <main className="min-h-screen bg-black">
            {/* Thank You Hero */}
            <section className="relative py-20 md:py-32 text-center">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                            ORDER CONFIRMED!
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-8">
                            Your order has been successfully placed
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link href="/shop">
                                <button className="px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wider rounded-full hover:bg-lime-400 transition-colors duration-300">
                                    Continue Shopping
                                </button>
                            </Link>
                            <Link href="/orders">
                                <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg uppercase tracking-wider rounded-full hover:bg-white/20 transition-colors duration-300">
                                    View Orders
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Premium Thank You Section */}
            <ThankYouSection />
        </main>
    );
}
