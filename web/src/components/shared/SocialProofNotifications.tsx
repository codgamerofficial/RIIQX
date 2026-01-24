"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, TrendingUp } from 'lucide-react';

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
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className="fixed top-24 right-4 md:right-8 w-[calc(100%-2rem)] md:w-96 z-50"
                >
                    <div className="bg-gradient-to-r from-cherry/10 to-gold/10 backdrop-blur-xl border border-cherry/20 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-cherry/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="w-5 h-5 text-cherry" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">
                                    {currentNotification.productName}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Someone from {currentNotification.location} purchased this {currentNotification.timeAgo}
                                </p>
                            </div>
                            <TrendingUp className="w-4 h-4 text-gold flex-shrink-0" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
