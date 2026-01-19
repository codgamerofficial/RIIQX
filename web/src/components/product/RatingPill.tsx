"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingPillProps {
    rating: number;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    className?: string;
}

export function RatingPill({
    rating,
    position = "bottom-left",
    className
}: RatingPillProps) {
    const positionClasses = {
        "top-left": "top-2 left-2",
        "top-right": "top-2 right-2",
        "bottom-left": "bottom-2 left-2",
        "bottom-right": "bottom-2 right-2",
    };

    return (
        <div
            className={cn(
                "bewakoof-rating-pill absolute z-10",
                positionClasses[position],
                className
            )}
        >
            <Star className="w-3 h-3 fill-current bewakoof-rating-star" />
            <span>{rating.toFixed(1)}</span>
        </div>
    );
}
