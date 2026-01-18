'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { OrderSummary } from './OrderSummary';


interface CheckoutLayoutProps {
    children: React.ReactNode;
    currentStep: 'info' | 'shipping' | 'payment';
}

const steps = [
    { id: 'info', label: 'Information' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
];

export function CheckoutLayout({ children, currentStep }: CheckoutLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            {/* Simplified Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        RIIQX
                    </Link>

                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column - Form & Steps */}
                    <div className="lg:col-span-7">
                        {/* Breadcrumbs / Steps */}
                        <nav aria-label="Progress" className="mb-8">
                            <ol role="list" className="flex items-center space-x-4">
                                {steps.map((step, stepIdx) => {
                                    const isCompleted = steps.findIndex(s => s.id === currentStep) > stepIdx;
                                    const isCurrent = step.id === currentStep;

                                    return (
                                        <li key={step.id} className="flex items-center">
                                            {stepIdx !== 0 && (
                                                <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
                                            )}
                                            <span className={cn(
                                                "text-sm font-medium transition-colors duration-300",
                                                isCompleted ? "text-indigo-400" :
                                                    isCurrent ? "text-white" : "text-muted-foreground"
                                            )}>
                                                {step.label}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {children}
                        </motion.div>
                    </div>

                    {/* Right Column - Order Summary (Desktop) */}
                    <div className="hidden lg:block lg:col-span-5 relative">
                        <div className="sticky top-24">
                            <OrderSummary />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
