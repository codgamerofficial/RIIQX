"use client";

import { cn } from "@/lib/utils";

interface ProductBadgeProps {
    text: string;
    variant?: "default" | "offer" | "new" | "fit";
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    className?: string;
}

export function ProductBadge({
    text,
    variant = "default",
    position = "top-left",
    className
}: ProductBadgeProps) {
    const positionClasses = {
        "top-left": "top-2 left-2",
        "top-right": "top-2 right-2",
        "bottom-left": "bottom-2 left-2",
        "bottom-right": "bottom-2 right-2",
    };

    const variantClasses = {
        default: "bewakoof-badge-default",
        offer: "bewakoof-badge-offer",
        new: "bewakoof-badge-new",
        fit: "bewakoof-badge-default",
    };

    return (
        <span
            className={cn(
                "bewakoof-badge absolute z-10",
                positionClasses[position],
                variantClasses[variant],
                className
            )}
        >
            {text}
        </span>
    );
}
