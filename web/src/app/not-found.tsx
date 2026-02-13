"use client";

import Link from "next/link";
import { HypeButton } from "@/components/ui/HypeButton";

export default function NotFound() {
    return (
        <div className="h-[70vh] w-full flex flex-col items-center justify-center bg-black text-white p-4">
            <h2 className="text-4xl font-bold font-oswald mb-4 text-red-500">404</h2>
            <p className="text-xl mb-8 font-mono text-center text-white/70">
                This page has been declassified or does not exist.
            </p>
            <Link href="/">
                <HypeButton variant="outline">
                    Return to Base
                </HypeButton>
            </Link>
        </div>
    );
}
