'use client';

// =============================================================================
// RIIQX — Master Application Shell Controller
// Edge-to-Edge Audiophile Architecture • Floating Cyber-Glass Sidebar & Cockpit
// =============================================================================

import React from 'react';
import { usePathname } from 'next/navigation';
import { RiiqxHeader } from './RiiqxHeader';
import { RiiqxSidebar } from './RiiqxSidebar';

interface RiiqxAppShellProps {
  children: React.ReactNode;
}

export function RiiqxAppShell({ children }: RiiqxAppShellProps) {
  const pathname = usePathname();

  // Authentication and standalone public routes must NOT render the dashboard shell
  const isAuthRoute = pathname?.startsWith('/auth');
  const isStandalonePublic =
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/about' ||
    pathname?.startsWith('/terms/') ||
    pathname?.startsWith('/privacy/');

  if (isAuthRoute || isStandalonePublic) {
    return (
      <main className="h-full w-full overflow-y-auto min-h-0 min-w-0 bg-[#FAF9F6] dark:bg-[#060608] text-[#202124] dark:text-[#F4F4F6]">
        {children}
      </main>
    );
  }

  // Full Authenticated Workspace Dashboard Shell with Floating Navigation & Edge-to-Edge Stage
  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-hidden min-h-0 bg-[#FAF9F6] dark:bg-[#060608] text-zinc-900 dark:text-zinc-100">
      <RiiqxHeader />
      <div className="relative flex flex-1 overflow-hidden min-h-0 min-w-0">
        <RiiqxSidebar />
        <main className="relative flex flex-1 flex-col overflow-hidden min-w-0 min-h-0 pb-22 sm:pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
