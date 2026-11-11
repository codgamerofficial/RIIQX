'use client';

// =============================================================================
// RIIQX MUSIC — Floating Glass Cyber-Dock Navigation Sidebar
// Inspired by Apple VisionOS • Samsung One UI 7 • Figma • Tidal Audiophile
// Dual Mode (Expanded Glass Island & Compact Icon Rail) • Category Segmentation
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import { RiiqxLogo } from '@/components/ui/RiiqxLogo';
import {
  Radio,
  Disc3,
  Heart,
  Sliders,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HardDriveDownload,
  Scale,
  Video,
  Compass,
  Activity,
} from 'lucide-react';

export function RiiqxSidebar() {
  const { activeTab, setActiveTab, user } = useRiiqx();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navSections: {
    category: string;
    items: { tab: RiiqxViewTab; label: string; icon: React.ElementType; badge?: string; badgeColor?: string }[];
  }[] = [
    {
      category: 'DISCOVER',
      items: [
        { tab: 'music', label: 'Listen Now', icon: Radio },
        { tab: 'browse' as any, label: 'All Tracks & Search', icon: Compass },
      ],
    },
    {
      category: 'STUDIO & AI',
      items: [
        { tab: 'ai_dj' as any, label: 'AI Music DJ & Studio', icon: Sparkles, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
        { tab: 'video_studio', label: 'AI Video Studio (Pro)', icon: Video, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-[#FA243C]/20 to-orange-500/20 text-[#FA243C] border-[#FA243C]/40' },
        { tab: 'decisions', label: 'Decisions Lab & Deals', icon: Scale },
      ],
    },
    {
      category: 'MY LIBRARY',
      items: [
        { tab: 'playlists' as any, label: 'Playlists', icon: Disc3 },
        { tab: 'favorites' as any, label: 'Favorites', icon: Heart },
        { tab: 'offline' as any, label: 'Downloaded & Offline', icon: HardDriveDownload },
      ],
    },
    {
      category: 'AUDIOPHILE DSP',
      items: [
        { tab: 'equalizer' as any, label: 'Equalizer & 3D DSP', icon: Sliders, badge: '320K', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        { tab: 'settings', label: 'Audio Settings', icon: Settings },
      ],
    },
  ];

  const resolvedDisplayName = user?.name || 'RIIQX Listener';
  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  return (
    <aside
      className={`hidden lg:flex shrink-0 flex-col justify-between my-2.5 ml-2.5 rounded-3xl border border-zinc-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-[#07080d]/80 backdrop-blur-3xl select-none transition-all duration-300 min-h-0 overflow-hidden shadow-xl dark:shadow-2xl z-30 pb-22 ${
        isCollapsed ? 'w-20 p-2.5 items-center' : 'w-64 p-3.5'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0 w-full space-y-3">
        {/* Brand Logo Header & Collapse Toggle */}
        <div className="flex items-center justify-between px-1.5 py-1 shrink-0">
          <div
            className="cursor-pointer transition-transform duration-200 hover:scale-102 flex items-center"
            onClick={() => setActiveTab('music')}
            title="RIIQX High-Fidelity Music"
          >
            {isCollapsed ? (
              <RiiqxLogo size="sm" variant="icon" animated={true} />
            ) : (
              <RiiqxLogo size="sm" variant="full" animated={true} subtitle="PRO AUDIOPHILE &bull; 320K" />
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Categorized Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-0.5 custom-scrollbar w-full">
          {navSections.map((section) => (
            <div key={section.category} className="space-y-1">
              {!isCollapsed && (
                <div className="flex items-center justify-between px-3 pt-1 pb-0.5">
                  <span className="text-[9px] font-black tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
                    {section.category}
                  </span>
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;

                return (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    title={isCollapsed ? item.label : undefined}
                    className={`group relative flex w-full items-center rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FA243C] to-red-600 text-white font-bold shadow-lg shadow-[#FA243C]/35 scale-[1.01]'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-white'
                            : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && !isActive && (
                          <span
                            className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md border ${
                              item.badgeColor || 'bg-[#FA243C]/20 text-[#FA243C] border-[#FA243C]/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] shrink-0" />
                        )}
                      </div>
                    )}

                    {/* Tooltip on Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 rounded-xl bg-zinc-900 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl z-50 border border-white/10">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Profile Capsule & Lossless DAC Status */}
      <div className="shrink-0 mt-2 w-full">
        {isCollapsed ? (
          <div
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg mx-auto relative cursor-pointer"
            title={`${resolvedDisplayName} • FLAC 320K`}
          >
            <span>{userInitial}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-[0_0_6px_#10b981]" />
          </div>
        ) : (
          <div className="rounded-2xl bg-zinc-50 dark:bg-white/[0.04] p-3 border border-zinc-200 dark:border-white/[0.06] shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                <span>{userInitial}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-[0_0_6px_#10b981]" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {resolvedDisplayName}
                  </span>
                  <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded-full tracking-wider">
                    FLAC 320K
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  <Activity className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                  <span className="truncate">Lossless DSP Engine</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
