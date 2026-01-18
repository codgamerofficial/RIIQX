'use client';

import { useState } from 'react';
import { CheckoutLayout } from '@/components/checkout/CheckoutLayout';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { useCartStore } from '@/store/useCartStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState<'info' | 'shipping' | 'payment'>('info');
    const [showSuccess, setShowSuccess] = useState(false);
    const clearCart = useCartStore((state) => state.clearCart);
    const router = useRouter();

    const handleStepChange = (step: 'info' | 'shipping' | 'payment') => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleComplete = () => {
        setShowSuccess(true);
        clearCart();
        // Keep overlay open for a bit then redirect
        setTimeout(() => {
            router.push('/account/orders'); // Or back home
        }, 3000);
    };

    return (
        <>
            <CheckoutLayout currentStep={currentStep}>
                {/* Split layout managed here by manual grid placement if needed, 
                but CheckoutLayout handles the grid structure.
                Here we just pass the main content.
            */}

                {/* This div is the left column content inside CheckoutLayout */}
                <CheckoutForm
                    onStepChange={handleStepChange}
                    onComplete={handleComplete}
                />

                {/* 
                HACK: The OrderSummary needs to be in the right column of the layout.
                Since I structured CheckoutLayout to take children as the LEFT column,
                I need to portal or restructure. 
                
                Actually, let's fix CheckoutLayout usage.
                The current CheckoutLayout puts `children` in the Left Column.
                We need to pass the Summary to the layout or just render it here if the layout supports it.
            
                Let's stick to the structure:
                CheckoutLayout renders a grid.
                Left Col = children.
                Right Col = Hardcoded OrderSummary for now? 
                
                Let's Quick Refactor: I'll modify CheckoutLayout to accept a `sidebar` prop
                or just put the OrderSummary directly IN CheckoutLayout for simplicity since it's specific.
                
                Actually, sticking with simpler approach:
                I'll modify CheckoutLayout to render OrderSummary internally or accept it as a prop.
                Let's just update `CheckoutLayout` to render `<OrderSummary />` imported directly since it's dedicated.
            */}
            </CheckoutLayout>

            {/* Since I didn't pass OrderSummary to CheckoutLayout in the previous file write,
            I need to update CheckoutLayout to include it. 
            I will do that in the next step.
        */}

            {/* Success Modal */}
            <Dialog open={showSuccess} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-md bg-black/90 border-white/10 text-white">
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="w-10 h-10 text-green-500 animate-bounce" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Order Confirmed!</DialogTitle>
                        <p className="text-muted-foreground">
                            Your gear is being prepared for shipment. You will receive a confirmation email shortly.
                        </p>
                        <div className="pt-4 text-sm text-indigo-400">
                            Redirecting to dashboard...
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
