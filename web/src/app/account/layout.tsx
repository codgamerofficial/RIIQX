"use client";

import AuthGuard from "@/components/auth/AuthGuard";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            {/* Pages control their own layout now for maximum flexibility (Hub vs Details) */}
            <div className="bg-[#050505] min-h-screen">
                {children}
            </div>
        </AuthGuard>
    );
}
