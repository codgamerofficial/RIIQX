'use client';

// =============================================================================
// RIIQX — Modern Autonomous Twin Desktop Sidebar
// Obsidian Glassmorphism • Glowing Amber/Orange Active States • Real Identity Card
// =============================================================================

import React from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import {
  LayoutDashboard,
  Sparkles,
  Scale,
  Compass,
  Utensils,
  Gift,
  BookOpen,
  Boxes,
  Clock,
  Settings,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function RiiqxSidebar() {
  const { activeTab, setActiveTab, user } = useRiiqx();

  const navItems: { tab: RiiqxViewTab; label: string; icon: React.ElementType }[] = [
    { tab: 'home', label: 'Home', icon: LayoutDashboard },
    { tab: 'twin', label: 'My Twin', icon: Sparkles },
    { tab: 'decisions', label: 'Decisions', icon: Scale },
    { tab: 'opportunities', label: 'Opportunities', icon: Compass },
    { tab: 'lifestyle', label: 'Lifestyle', icon: Utensils },
    { tab: 'rewards', label: 'Rewards', icon: Gift },
    { tab: 'digest', label: 'Weekly Intelligence', icon: BookOpen },
    { tab: 'connections', label: 'Connections', icon: Boxes },
    { tab: 'activity', label: 'Activity', icon: Clock },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ];

  // Resolve authentic display name without legacy "Studio" or "Creator" placeholders
  const resolvedDisplayName =
    user?.name && user.name !== 'RIIQX Creator' && user.name !== 'RIIQX Studio'
      ? user.name
      : 'RIIQX Twin';

  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  return (
    <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col justify-between border-r border-white/[0.08] bg-[#09090b]/95 backdrop-blur-2xl p-3.5 select-none transition-colors min-h-0 overflow-hidden text-white">
      <div className="flex flex-col flex-1 min-h-0 space-y-3">
        {/* Brand Logo Header */}
        <div
          className="flex items-center gap-3 px-3 py-2 shrink-0 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setActiveTab('home')}
        >
          <RiiqxEmblem size={32} glow={true} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white font-heading">
                RIIQX
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                TWIN
              </span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-400 tracking-wide -mt-0.5">
              Personal Intelligence Twin
            </span>
          </div>
        </div>

        {/* Primary Navigation Workspaces */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-amber-500/5 text-white font-bold border border-orange-500/30 shadow-lg shadow-orange-500/10'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-all ${
                      isActive
                        ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(255,87,34,0.4)]'
                        : 'text-zinc-400 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#f97316] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div
        onClick={() => setActiveTab('settings')}
        className="shrink-0 mt-2 rounded-2xl bg-zinc-900/90 p-3 border border-white/[0.08] hover:border-orange-500/40 hover:bg-zinc-800/80 transition-all cursor-pointer group shadow-lg shadow-black/40"
      >
        <div className="flex items-center gap-2.5">
          {/* Glowing Presence Avatar Squircle */}
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md shadow-orange-500/20">
            <span>{userInitial}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#09090b] shadow-[0_0_6px_#10b981]" />
          </div>

          {/* User Details & Status */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-white truncate">
                {resolvedDisplayName}
              </span>
              <span className="text-[9px] font-black text-amber-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.2)] tracking-wider">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 truncate">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span className="truncate">Level 2 Autonomy • Active</span>
            </div>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </aside>
  );
}
