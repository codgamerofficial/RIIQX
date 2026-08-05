'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Tag,
  Truck,
  ShieldCheck,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: 'OVERVIEW', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'ORDERS', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'PRODUCTS', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'INVENTORY', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'COUPONS', path: '/admin/coupons', icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-obsidian-base text-riiqxText-primary flex font-sans selection:bg-accent-crimson selection:text-white">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen bg-obsidian-void/90 backdrop-blur-2xl border-r border-glass-border-medium flex flex-col justify-between transition-all duration-300 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-accent-crimson flex items-center justify-center font-mono font-black text-white text-base shadow-glow-crimson shrink-0">
                R
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-base tracking-wider text-white">
                    RIIQX
                  </span>
                  <span className="font-mono text-[9px] text-accent-cyan tracking-widest uppercase">
                    ADMIN COMMAND
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-sm bg-white/5 border border-glass-border-subtle hover:border-glass-border-medium text-riiqxText-muted hover:text-white cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-crimson/15 text-accent-crimson font-bold border-l-2 border-accent-crimson shadow-[0_0_15px_rgba(255,0,60,0.15)]'
                      : 'text-riiqxText-secondary hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-glass-border-subtle space-y-3 font-mono text-xs">
          {!isCollapsed && (
            <div className="p-3 rounded-sm bg-charcoal-matte border border-glass-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent-cyan/20 border border-accent-cyan flex items-center justify-center text-accent-cyan">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[11px] font-bold">ADMIN ROOT</span>
                  <span className="text-riiqxText-muted text-[9px]">admin@riiqx.com</span>
                </div>
              </div>
            </div>
          )}

          <Link href="/">
            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm bg-white/5 border border-glass-border-subtle hover:border-accent-crimson text-riiqxText-muted hover:text-accent-crimson transition-colors cursor-pointer text-xs uppercase"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!isCollapsed && <span>EXIT TO STORE</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-obsidian-base/80 backdrop-blur-2xl border-b border-glass-border-subtle px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="cyan" shape="chamfer" dot>
              PRODUCTION NODE
            </Badge>
            <span className="font-mono text-xs text-riiqxText-muted hidden sm:inline">
              // RBAC SPEC: PRIVILEGED ACCESS GRANTED
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 text-riiqxText-muted absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search orders, SKUs..."
                className="w-full bg-charcoal-matte/80 border border-glass-border-subtle rounded-sm pl-9 pr-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
            <Badge variant="crimson" shape="pill" dot>
              QIKINK ACTIVE
            </Badge>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};
