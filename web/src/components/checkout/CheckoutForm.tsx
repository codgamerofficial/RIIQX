'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Truck, CreditCard, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Validation Schemas ---
const infoSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(2, 'Required'),
    lastName: z.string().min(2, 'Required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'Required'),
    postalCode: z.string().min(3, 'Required'),
    phone: z.string().min(10, 'Valid phone required'),
});

const shippingSchema = z.object({
    method: z.enum(['standard', 'express']),
});

// Payment schema is minimal for now as we might just mock it
const paymentSchema = z.object({
    cardNumber: z.string().regex(/^\d{16}$/, 'Enter a valid 16-digit card number'), // Simple regex for mock
    expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'MM/YY'),
    cvc: z.string().regex(/^\d{3}$/, '3 digits'),
});

type InfoData = z.infer<typeof infoSchema>;
type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;

interface CheckoutFormProps {
    onStepChange: (step: 'info' | 'shipping' | 'payment') => void;
    onComplete: () => void;
}

export function CheckoutForm({ onStepChange, onComplete }: CheckoutFormProps) {
    const [step, setStep] = useState<'info' | 'shipping' | 'payment'>('info');
    const [direction, setDirection] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Forms
    const infoForm = useForm<InfoData>({ resolver: zodResolver(infoSchema) });
    const shippingForm = useForm<ShippingData>({
        resolver: zodResolver(shippingSchema),
        defaultValues: { method: 'standard' }
    });
    const paymentForm = useForm<PaymentData>({ resolver: zodResolver(paymentSchema) });

    // Handlers
    const handleInfoSubmit = (data: InfoData) => {
        console.log('Info Data:', data);
        setDirection(1);
        setStep('shipping');
        onStepChange('shipping');
    };

    const handleShippingSubmit = (data: ShippingData) => {
        console.log('Shipping Data:', data);
        setDirection(1);
        setStep('payment');
        onStepChange('payment');
    };

    const handlePaymentSubmit = async (data: PaymentData) => {
        console.log('Payment Data:', data);
        setIsProcessing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        onComplete();
    };

    const goBack = () => {
        setDirection(-1);
        if (step === 'payment') {
            setStep('shipping');
            onStepChange('shipping');
        } else if (step === 'shipping') {
            setStep('info');
            onStepChange('info');
        }
    };

    // Animation variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="relative overflow-hidden min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>

                {/* STEP 1: INFO */}
                {step === 'info' && (
                    <motion.form
                        key="info"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onSubmit={infoForm.handleSubmit(handleInfoSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Contact Information</h2>
                            <span className="text-xs text-muted-foreground">Step 1 of 3</span>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Email</label>
                                <input
                                    {...infoForm.register('email')}
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                                {infoForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            {/* Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">First Name</label>
                                    <input
                                        {...infoForm.register('firstName')}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                    />
                                    {infoForm.formState.errors.firstName && (
                                        <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.firstName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Last Name</label>
                                    <input
                                        {...infoForm.register('lastName')}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                    />
                                    {infoForm.formState.errors.lastName && (
                                        <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Address</label>
                                <input
                                    {...infoForm.register('address')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="123 Cyberpunk St"
                                />
                                {infoForm.formState.errors.address && (
                                    <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.address.message}</p>
                                )}
                            </div>

                            {/* City & Zip */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">City</label>
                                    <input
                                        {...infoForm.register('city')}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                    />
                                    {infoForm.formState.errors.city && (
                                        <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.city.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Postal Code</label>
                                    <input
                                        {...infoForm.register('postalCode')}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                    />
                                    {infoForm.formState.errors.postalCode && (
                                        <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.postalCode.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Phone</label>
                                <input
                                    {...infoForm.register('phone')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                />
                                {infoForm.formState.errors.phone && (
                                    <p className="text-red-400 text-xs mt-1">{infoForm.formState.errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                <span>Continue to Shipping</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* STEP 2: SHIPPING */}
                {step === 'shipping' && (
                    <motion.form
                        key="shipping"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Shipping Method</h2>
                            <span className="text-xs text-muted-foreground">Step 2 of 3</span>
                        </div>

                        <div className="space-y-4">
                            <div className="border border-white/10 rounded-lg p-4 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-muted-foreground text-sm mr-4">Contact</span>
                                    <span className="text-sm font-medium">{infoForm.getValues('email')}</span>
                                </div>
                                <button type="button" onClick={goBack} className="text-xs text-indigo-400 hover:text-indigo-300">Change</button>
                            </div>
                            <div className="border border-white/10 rounded-lg p-4 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-muted-foreground text-sm mr-4">Ship to</span>
                                    <span className="text-sm font-medium truncate max-w-[200px]">{infoForm.getValues('address')}, {infoForm.getValues('city')}</span>
                                </div>
                                <button type="button" onClick={goBack} className="text-xs text-indigo-400 hover:text-indigo-300">Change</button>
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className={cn(
                                    "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                                    shippingForm.watch('method') === 'standard'
                                        ? "border-indigo-500 bg-indigo-500/10"
                                        : "border-white/10 hover:bg-white/5"
                                )}>
                                    <div className="flex items-center">
                                        <input {...shippingForm.register('method')} type="radio" value="standard" className="hidden" />
                                        <div className={cn("w-4 h-4 rounded-full border mr-3 flex items-center justify-center", shippingForm.watch('method') === 'standard' ? "border-indigo-500" : "border-muted-foreground")}>
                                            {shippingForm.watch('method') === 'standard' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                        </div>
                                        <div>
                                            <span className="block font-medium">Standard Shipping</span>
                                            <span className="text-xs text-muted-foreground">5-7 business days</span>
                                        </div>
                                    </div>
                                    <span className="font-medium">Free</span>
                                </label>

                                <label className={cn(
                                    "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                                    shippingForm.watch('method') === 'express'
                                        ? "border-indigo-500 bg-indigo-500/10"
                                        : "border-white/10 hover:bg-white/5"
                                )}>
                                    <div className="flex items-center">
                                        <input {...shippingForm.register('method')} type="radio" value="express" className="hidden" />
                                        <div className={cn("w-4 h-4 rounded-full border mr-3 flex items-center justify-center", shippingForm.watch('method') === 'express' ? "border-indigo-500" : "border-muted-foreground")}>
                                            {shippingForm.watch('method') === 'express' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                        </div>
                                        <div>
                                            <span className="block font-medium">Express Gravity</span>
                                            <span className="text-xs text-muted-foreground">1-2 business days</span>
                                        </div>
                                    </div>
                                    <span className="font-medium">$20.00</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <button type="button" onClick={goBack} className="text-muted-foreground hover:text-white transition-colors flex items-center">
                                Wait, go back
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                <span>Continue to Payment</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 'payment' && (
                    <motion.form
                        key="payment"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Payment</h2>
                            <span className="text-xs text-muted-foreground">Step 3 of 3</span>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-xl p-6 text-white mb-6">
                                <div className="flex justify-between items-start mb-8">
                                    <CreditCard className="w-8 h-8 opacity-80" />
                                    <span className="font-mono opacity-50">CREDIT CARD</span>
                                </div>
                                <div className="text-2xl font-mono tracking-widest mb-4">
                                    {paymentForm.watch('cardNumber') || '•••• •••• •••• ••••'}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] uppercase opacity-50 mb-1">Card Holder</div>
                                        <div className="text-sm font-medium uppercase">{infoForm.getValues('firstName')} {infoForm.getValues('lastName')}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase opacity-50 mb-1">Expires</div>
                                        <div className="text-sm font-medium">{paymentForm.watch('expiry') || 'MM/YY'}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Card Number</label>
                                <input
                                    {...paymentForm.register('cardNumber')}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={16}
                                />
                                {paymentForm.formState.errors.cardNumber && (
                                    <p className="text-red-400 text-xs mt-1">{paymentForm.formState.errors.cardNumber.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Expiry Date</label>
                                    <input
                                        {...paymentForm.register('expiry')}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                    {paymentForm.formState.errors.expiry && (
                                        <p className="text-red-400 text-xs mt-1">{paymentForm.formState.errors.expiry.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">CVC</label>
                                    <input
                                        {...paymentForm.register('cvc')}
                                        type="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-indigo-500 transition-all outline-none"
                                        placeholder="123"
                                        maxLength={3}
                                    />
                                    {paymentForm.formState.errors.cvc && (
                                        <p className="text-red-400 text-xs mt-1">{paymentForm.formState.errors.cvc.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <button type="button" onClick={goBack} className="text-muted-foreground hover:text-white transition-colors flex items-center">
                                Wait, go back
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Pay Now</span>
                                        <ShieldCheck className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}

            </AnimatePresence>
        </div>
    );
}
