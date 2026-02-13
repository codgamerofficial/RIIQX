"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="min-h-[100dvh] bg-[#050505] text-[#F5F5F5]">
            <div className="lg:grid lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px] min-h-[100dvh]">

                {/* LEFT: VISUALIZERS SKELETON */}
                <div className="relative bg-[#080808] h-[50dvh] lg:h-[100dvh] flex items-center justify-center border-r border-white/5">
                    <Skeleton className="w-3/4 h-3/4 rounded-xl bg-white/5" />
                </div>

                {/* RIGHT: CONTROL PANEL SKELETON */}
                <div className="relative flex flex-col h-full lg:h-[100dvh] bg-[#050505] p-8 lg:p-12">
                    <div className="flex flex-col min-h-full pb-32">

                        {/* Heading */}
                        <div className="mb-10 space-y-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-16 w-3/4 rounded-lg" />
                            <Skeleton className="h-4 w-32 rounded-full" />
                        </div>

                        {/* Price */}
                        <div className="mb-10 space-y-2">
                            <Skeleton className="h-12 w-48 rounded-lg" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>

                        {/* Options */}
                        <div className="space-y-8 mb-12">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                    <Skeleton className="h-12 w-16 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 mt-auto">
                            <Skeleton className="w-full h-16 rounded-none" />
                            <Skeleton className="w-full h-10 rounded-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
