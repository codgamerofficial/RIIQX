'use client';

// =============================================================================
// RIIQX MUSIC — Pro Dynamic Island Header & Navigation Controller
// Apple VisionOS & Samsung One UI Glass Aesthetics • RIIQX Quantum Sonic Mark
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxLogo } from '@/components/ui/RiiqxLogo';
import {
  Menu,
  X,
  Radio,
  Disc3,
  Heart,
  Sliders,
  Settings,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  User,
  HardDriveDownload,
  Scale,
  Video,
  Compass,
  Headphones,
  Car,
} from 'lucide-react';

export function RiiqxHeader() {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    user,
    signOut,
  } = useRiiqx();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const resolvedDisplayName = user?.name || 'RIIQX Listener';
  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  const musicNav = [
    { id: 'music', label: 'Listen Now', icon: Radio },
    { id: 'browse', label: 'All Tracks & Search', icon: Compass },
    { id: 'ai_dj', label: 'AI Music DJ & Studio', icon: Sparkles },
    { id: 'video_studio', label: 'AI Video Studio (Pro)', icon: Video, badge: 'PRO' },
    { id: 'offline', label: 'Downloaded & Offline', icon: HardDriveDownload },
    { id: 'playlists', label: 'Playlists', icon: Disc3 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'equalizer', label: 'Equalizer & 3D DSP', icon: Sliders },
    { id: 'decisions', label: 'Decisions Lab & Deals', icon: Scale },
    { id: 'settings', label: 'Audio Settings', icon: Settings },
  ];

  return (
    <header className="relative z-30 flex h-15 w-full shrink-0 items-center justify-between border-b border-zinc-200/90 dark:border-white/[0.08] bg-white/80 dark:bg-[#07080d]/80 backdrop-blur-3xl px-4 md:px-6 transition-colors">
      {/* Left: Brand Identity & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-zinc-900 dark:text-white" />
          ) : (
            <Menu className="w-5 h-5 text-zinc-900 dark:text-white" />
          )}
        </button>

        <div
          className="cursor-pointer transition-transform duration-200 hover:scale-102 flex items-center"
          onClick={() => setActiveTab('music')}
        >
          <RiiqxLogo size="sm" variant="full" animated={true} subtitle="320K AUDIOPHILE" />
        </div>
      </div>

      {/* Center Dynamic Island: Sonic Ambient Aura Pill */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-100/80 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-xs shadow-inner">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA243C] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FA243C]" />
        </span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200 tracking-wide">
          RIIQX Sonic Engine &bull; Lossless 320K &bull; AI DJ Neural Lab
        </span>
        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          DAC ACTIVE
        </span>
      </div>

      {/* Right Controls: AI Video Studio, AI DJ, Car Mode, Theme, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Launch AI Video Studio (Pro) */}
        <button
          onClick={() => setActiveTab('video_studio')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 via-[#FA243C] to-orange-500 text-white shadow-md shadow-[#FA243C]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Create Animated 9:16 / 16:9 Lyric Videos"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Video Studio</span>
          <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-white/20 text-white border border-white/30">
            PRO
          </span>
        </button>

        {/* Quick Launch AI DJ */}
        <button
          onClick={() => setActiveTab('ai_dj' as any)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.12] text-zinc-800 dark:text-white border border-zinc-200 dark:border-white/[0.08] shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>AI DJ</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-700" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="relative pl-1.5 border-l border-zinc-200 dark:border-white/[0.08]">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center text-white font-black text-xs shadow-md hover:scale-105 transition-transform">
              <span>{userInitial}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-[0_0_6px_#10b981]" />
            </div>
          </button>

          {/* User Popover Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-11 w-64 rounded-3xl bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-2xl border border-zinc-200 dark:border-white/[0.1] p-3 shadow-2xl z-50 text-zinc-900 dark:text-white animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-zinc-200 dark:border-white/[0.08] mb-1">
                <p className="text-xs font-bold truncate">{resolvedDisplayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                    FLAC 320K AUDIOPHILE
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Audio Settings & DSP</span>
              </button>

              <button
                onClick={() => {
                  signOut();
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-15 z-50 bg-black/70 backdrop-blur-2xl flex flex-col p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 dark:bg-[#0b0c12]/95 border border-zinc-200 dark:border-white/[0.1] rounded-3xl p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-white/[0.08]">
              <RiiqxLogo size="sm" variant="full" subtitle="MOBILE AUDIOPHILE" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {musicNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#FA243C] text-white shadow-lg shadow-[#FA243C]/40'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
