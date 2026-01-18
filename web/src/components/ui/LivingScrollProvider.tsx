"use client";

/**
 * LivingScrollProvider
 * Originally wrapped the app in smooth scroll (Lenis).
 * Now restricted to default native scrolling as per user request.
 */
export function LivingScrollProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
