/**
 * Skeleton Loader Components
 * Animated skeleton loaders for various content types
 */

"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
    return (
        <div
            style={style}
            className={cn(
                "relative overflow-hidden rounded-md bg-white/5",
                "before:absolute before:inset-0",
                "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
                "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                className
            )}
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="space-y-4">
            {/* Image */}
            <Skeleton className="aspect-[3/4] w-full" />

            {/* Title and Rating */}
            <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-12" />
            </div>

            {/* Price */}
            <Skeleton className="h-4 w-24" />
        </div>
    );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-4"
                    style={{ width: i === lines - 1 ? "60%" : "100%" }}
                />
            ))}
        </div>
    );
}

export function ImageSkeleton({ aspectRatio = "16/9" }: { aspectRatio?: string }) {
    return <Skeleton className="w-full" style={{ aspectRatio }} />;
}

export function ButtonSkeleton() {
    return <Skeleton className="h-10 w-32" />;
}
