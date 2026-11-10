'use client';

// =============================================================================
// RIIQX MUSIC — Dedicated Music Navigation Desktop Sidebar
// Apple Music Aesthetic • Obsidian Glassmorphism • Audio Workspaces
// =============================================================================

import React from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import {
  Radio,
  ListMusic,
  Disc3,
  Heart,
  Sliders,
  Settings,
  Sparkles,
  Music2,
  ChevronRight,
  Headphones,
} from 'lucide-react';

export function RiiqxSidebar() {
  const { activeTab, setActiveTab, user } = useRiiqx();

  const navItems: { tab: RiiqxViewTab; label: string; icon: React.ElementType }[] = [
    { tab: 'music', label: 'Listen Now', icon: Radio },
    { tab: 'browse' as any, label: 'All Tracks', icon: ListMusic },
    { tab: 'ai_dj' as any, label: 'AI Music DJ & Studio', icon: Sparkles },
    { tab: 'playlists' as any, label: 'Playlists', icon: Disc3 },
    { tab: 'favorites' as any, label: 'Favorites', icon: Heart },
    { tab: 'equalizer' as any, label: 'Equalizer & DSP', icon: Sliders },
    { tab: 'settings', label: 'Audio Settings', icon: Settings },
  ];

  const resolvedDisplayName = user?.name || 'RIIQX Listener';
  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  return (
    <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col justify-between border-r border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#09090b]/95 backdrop-blur-2xl p-3.5 select-none transition-colors min-h-0 overflow-hidden text-zinc-900 dark:text-white">
      <div className="flex flex-col flex-1 min-h-0 space-y-3">
        {/* Brand Logo Header */}
        <div
          className="flex items-center gap-3 px-3 py-2 shrink-0 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setActiveTab('music')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center shadow-lg shadow-[#FA243C]/30 shrink-0">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-zinc-900 dark:text-white font-heading">
                RIIQX
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#FA243C]/20 text-[#FA243C] border border-[#FA243C]/30">
                PRO AUDIO
              </span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide -mt-0.5">
              High-Fidelity AI Streaming
            </span>
          </div>
        </div>

        {/* Primary Music Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-3 mb-2 block">
            Music Library
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#FA243C] text-white font-bold shadow-lg shadow-[#FA243C]/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-all ${
                      isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Audiophile Info Card */}
      <div className="shrink-0 mt-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 p-3 border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-black/40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
            <span>{userInitial}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-[0_0_6px_#10b981]" />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{resolvedDisplayName}</span>
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-full tracking-wider">
                FLAC 320K
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
              <Headphones className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
              <span className="truncate">Lossless DSP Engine</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
