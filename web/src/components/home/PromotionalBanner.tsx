"use client";

import { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromotionalBannerProps {
    message: string;
    icon?: React.ReactNode;
    dismissible?: boolean;
    backgroundColor?: string;
    textColor?: string;
    className?: string;
}

export function PromotionalBanner({
    message,
    icon,
    dismissible = true,
    backgroundColor = "#fdd835",
    textColor = "#000000",
    className,
}: PromotionalBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "w-full py-3 px-4 flex items-center justify-center gap-3 relative",
                className
            )}
            style={{ backgroundColor, color: textColor }}
        >
            {icon || <ShoppingBag className="w-5 h-5" />}
            <p className="text-sm font-bold uppercase tracking-wide">{message}</p>
            {dismissible && (
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 hover:opacity-70 transition-opacity"
                    aria-label="Dismiss banner"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
