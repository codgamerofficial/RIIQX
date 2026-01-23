"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { Sidebar } from "./_components/Sidebar";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-background pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Sidebar />
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
