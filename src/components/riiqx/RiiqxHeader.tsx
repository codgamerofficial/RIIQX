'use client';

// =============================================================================
// RIIQX MUSIC — Top Bar & Mobile Navigation Controller
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Menu,
  X,
  Radio,
  ListMusic,
  Disc3,
  Heart,
  Sliders,
  Settings,
  Sparkles,
  Music2,
  Sun,
  Moon,
  LogOut,
  User,
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
    { id: 'browse', label: 'All Tracks & Search', icon: ListMusic },
    { id: 'ai_dj', label: 'AI Music DJ & Studio', icon: Sparkles },
    { id: 'playlists', label: 'Playlists', icon: Disc3 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'equalizer', label: 'Equalizer & DSP', icon: Sliders },
    { id: 'settings', label: 'Audio Settings', icon: Settings },
  ];

  return (
    <header className="relative z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-zinc-200 dark:border-white/[0.06] bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-2xl px-4 md:px-6 transition-colors">
      {/* Left: Mobile Menu Trigger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-zinc-900 dark:text-white" /> : <Menu className="w-5 h-5 text-zinc-900 dark:text-white" />}
        </button>

        <div
          className="flex lg:hidden items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('music')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center text-white shadow-md">
            <Music2 className="w-4 h-4" />
          </div>
          <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-white font-heading">
            RIIQX <span className="text-xs text-[#FA243C] font-semibold">MUSIC</span>
          </span>
        </div>
      </div>

      {/* Center Branding Pill */}
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] text-xs text-zinc-600 dark:text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-[#FA243C] animate-pulse" />
        <span>RIIQX Audiophile Lossless Engine &bull; LRCLIB Synced &bull; AI DJ</span>
      </div>

      {/* Right Controls: AI DJ quick launch, Theme, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Launch AI DJ */}
        <button
          onClick={() => setActiveTab('ai_dj' as any)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#FA243C] to-orange-500 text-white shadow-md shadow-[#FA243C]/20 hover:scale-105 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Music DJ</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
        </button>

        {/* User Profile Avatar */}
        <div className="relative pl-2 border-l border-zinc-200 dark:border-white/[0.08]">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center text-white font-black text-xs shadow-md">
              <span>{userInitial}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-[0_0_6px_#10b981]" />
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-11 w-56 p-2 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-white/[0.12] shadow-2xl z-50 text-zinc-800 dark:text-white text-xs"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="p-2 border-b border-zinc-100 dark:border-white/[0.08] mb-1">
                <p className="font-bold text-zinc-900 dark:text-white truncate">{resolvedDisplayName}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">RIIQX Music Audiophile</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Audio Settings</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  signOut();
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer mt-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 bg-white/98 dark:bg-[#0a0a0c]/98 backdrop-blur-2xl border-b border-zinc-200 dark:border-white/[0.08] p-4 shadow-2xl z-50 space-y-1">
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FA243C] text-white font-bold shadow-lg shadow-[#FA243C]/20'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
