'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import {
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';

export interface AccountLayoutProps {
  children: React.ReactNode;
}

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navTabs = [
    { label: 'ORDERS & LIVE TRACKING', path: '/account/orders', icon: <Package className="w-4 h-4" /> },
    { label: 'TACTICAL WISHLIST', path: '/account/wishlist', icon: <Heart className="w-4 h-4" /> },
    { label: 'DELIVERY ADDRESSES', path: '/account/addresses', icon: <MapPin className="w-4 h-4" /> },
    { label: 'PROFILE & SECURITY', path: '/account/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary selection:bg-accent-crimson selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 w-full flex-1">
        {/* Customer Portal Top Banner */}
        <div className="p-6 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-medium shadow-glass-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-crimson/20 border border-accent-crimson flex items-center justify-center text-accent-crimson font-mono font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl text-white">
                  WELCOME BACK, SASWAT
                </h2>
                <Badge variant="cyan" shape="chamfer" dot>
                  VERIFIED MEMBER
                </Badge>
              </div>
              <span className="font-mono text-xs text-riiqxText-muted">
                MEMBER ID: RIIQX-USER-99201 // BATCH 004 ACCESS
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-white/5 border border-glass-border-subtle hover:border-accent-crimson text-riiqxText-muted hover:text-accent-crimson transition-colors font-mono text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>

        {/* 2-Column Portal Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Glass Navigation Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 rounded-md bg-charcoal-matte/60 backdrop-blur-xl border border-glass-border-subtle p-3 shadow-glass-md sticky top-28">
            <nav className="space-y-1 font-mono text-xs">
              {navTabs.map((tab) => {
                const isActive = pathname === tab.path || (pathname === '/account' && tab.path === '/account/orders');
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-accent-crimson/15 text-accent-crimson font-bold border-l-2 border-accent-crimson shadow-[0_0_15px_rgba(255,0,60,0.15)]'
                        : 'text-riiqxText-secondary hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Dynamic Content Panel */}
          <div className="flex-1 w-full">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
