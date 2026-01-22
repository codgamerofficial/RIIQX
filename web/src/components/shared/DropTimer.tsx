"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DropTimerProps {
    targetDate: Date;
    label?: string;
}

export default function DropTimer({ targetDate, label = "Next Drop In" }: DropTimerProps) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +targetDate - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval as keyof typeof timeLeft] && interval === 'days') {
            return null;
        }

        return (
            <div key={interval} className="flex flex-col items-center mx-2 md:mx-4">
                <motion.div
                    key={timeLeft[interval as keyof typeof timeLeft]}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="text-3xl md:text-5xl font-black font-display text-cherry-red tabular-nums tracking-tighter"
                >
                    {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
                </motion.div>
                <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest mt-1 md:mt-2">
                    {interval}
                </span>
            </div>
        );
    });

    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-rich-black/50 backdrop-blur-md border border-white/5 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cherry-red animate-pulse" />
                {label}
            </h3>
            <div className="flex items-start justify-center">
                {timerComponents.length ? timerComponents : <span className="text-2xl font-black text-white uppercase">Drop is Live!</span>}
            </div>
        </div>
    );
}
