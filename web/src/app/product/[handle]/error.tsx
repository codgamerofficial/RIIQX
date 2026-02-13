"use client";

import { useEffect } from "react";
import { HypeButton } from "@/components/ui/HypeButton";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Product Page Error:", error);
    }, [error]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
            <p className="text-white/50 mb-8 font-mono text-sm max-w-md text-center">
                {error.message || "An unexpected error occurred while loading the product."}
            </p>
            <HypeButton onClick={() => reset()} variant="outline">
                Try again
            </HypeButton>
        </div>
    );
}
