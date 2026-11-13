'use client';

// =============================================================================
// RIIQX MUSIC — Navigation Sidebar (Apple Music + Spotify Hybrid)
// Minimalist Matte Obsidian • Smooth Tactile Micro-Interactions • Zero Neon
// Categorized Architecture • Expandable / Collapsible Dock
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import { RiiqxProfileAvatarPill } from '@/components/ui/RiiqxWaveMark';
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
  Headphones,
} from 'lucide-react';

export function RiiqxSidebar() {
  const { activeTab, setActiveTab, user } = useRiiqx();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navSections: {
    category: string;
    items: { tab: RiiqxViewTab; label: string; icon: React.ElementType; badge?: string }[];
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
        { tab: 'ai_dj' as any, label: 'AI Music DJ & Studio', icon: Sparkles, badge: 'AI' },
        { tab: 'video_studio', label: 'Lyric Video Studio', icon: Video, badge: 'PRO' },
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
      category: 'AUDIO ENGINE',
      items: [
        { tab: 'equalizer' as any, label: 'Equalizer & DSP', icon: Sliders },
        { tab: 'settings', label: 'Audio Settings', icon: Settings },
      ],
    },
  ];

  const resolvedDisplayName = user?.name || 'RIIQX Listener';
  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  return (
    <aside
      className={`hidden lg:flex shrink-0 flex-col justify-between border-r border-white/[0.06] bg-[#000000]/60 dark:bg-[#07070a]/90 backdrop-blur-2xl select-none transition-all duration-300 min-h-0 overflow-hidden z-20 pb-24 ${
        isCollapsed ? 'w-18 p-2.5 items-center' : 'w-60 p-3'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0 w-full space-y-3">
        {/* Minimalist Sidebar Header (No Duplicate Logo) */}
        <div className="flex items-center justify-between px-2.5 py-1.5 shrink-0">
          {!isCollapsed && (
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              LIBRARY
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer ml-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Categorized Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-0.5 custom-scrollbar w-full">
          {navSections.map((section) => (
            <div key={section.category} className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1">
                  <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
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
                    className={`group relative flex w-full items-center rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                    } ${
                      isActive
                        ? 'bg-[#FA243C] text-white font-bold shadow-md shadow-[#FA243C]/20'
                        : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && !isActive && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip on Collapsed Mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-zinc-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50 border border-white/10">
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

      {/* Bottom Profile & DAC Capsule (Apple Music Style) */}
      <div className="shrink-0 pt-2 w-full border-t border-white/[0.06]">
        {isCollapsed ? (
          <div
            className="w-9 h-9 flex items-center justify-center shrink-0 mx-auto cursor-pointer"
            title={`${resolvedDisplayName} • Lossless Audio`}
            onClick={() => setActiveTab('settings')}
          >
            <RiiqxProfileAvatarPill size={32} />
          </div>
        ) : (
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <RiiqxProfileAvatarPill size={34} />

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {resolvedDisplayName}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                <Headphones className="w-2.5 h-2.5 text-[#FA243C]" />
                <span className="truncate">Lossless 320k Audio</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
