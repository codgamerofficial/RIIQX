"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface PurchaseNotification {
    id: string;
    productName: string;
    location: string;
    timeAgo: string;
}

const MOCK_PURCHASES: PurchaseNotification[] = [
    { id: '1', productName: 'Unisex Hoodie with Moon Design', location: 'Mumbai', timeAgo: '2 minutes ago' },
    { id: '2', productName: 'Streetwear Graphic Tee', location: 'Delhi', timeAgo: '5 minutes ago' },
    { id: '3', productName: 'Premium Joggers', location: 'Bangalore', timeAgo: '8 minutes ago' },
];

export function SocialProofNotifications() {
    const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
    const [notificationIndex, setNotificationIndex] = useState(0);

    useEffect(() => {
        // Show first notification after 5 seconds
        const initialTimer = setTimeout(() => {
            setCurrentNotification(MOCK_PURCHASES[0]);
        }, 5000);

        return () => clearTimeout(initialTimer);
    }, []);

    useEffect(() => {
        if (!currentNotification) return;

        // Hide notification after 5 seconds
        const hideTimer = setTimeout(() => {
            setCurrentNotification(null);
        }, 5000);

        // Show next notification after 15 seconds
        const nextTimer = setTimeout(() => {
            const nextIndex = (notificationIndex + 1) % MOCK_PURCHASES.length;
            setNotificationIndex(nextIndex);
            setCurrentNotification(MOCK_PURCHASES[nextIndex]);
        }, 15000);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(nextTimer);
        };
    }, [currentNotification, notificationIndex]);

    return (
        <AnimatePresence>
            {currentNotification && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.8, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, scale: 0.9, x: "-50%", transition: { duration: 0.2 } }}
                    className="fixed top-6 left-1/2 z-[100] transform -translate-x-1/2"
                >
                    <div className="bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-full py-2 pl-2 pr-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[320px]">

                        {/* Avatar/Icon */}
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5 text-[#B4F000]" />
                            <div className="absolute inset-0 bg-[#B4F000]/20 animate-pulse" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Verified Purchase</span>
                                <span className="w-1 h-1 rounded-full bg-[#B4F000] shadow-[0_0_5px_#B4F000]" />
                            </div>
                            <p className="text-xs text-white font-medium truncate max-w-[200px]">
                                {currentNotification.productName}
                            </p>
                        </div>

                        {/* Location/Time */}
                        <div className="text-right shrink-0">
                            <div className="text-[10px] font-mono text-white/60 uppercase">{currentNotification.location}</div>
                            <div className="text-[9px] text-[#B4F000] font-mono">{currentNotification.timeAgo}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
