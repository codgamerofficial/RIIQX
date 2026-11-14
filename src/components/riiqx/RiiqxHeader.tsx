'use client';

// =============================================================================
// RIIQX MUSIC — Global Header (Apple Music + Spotify Hybrid)
// Minimalist Matte Frosted Glass • Single Authoritative Brand Logo
// Dynamic Island Acoustic Status • Zero Neon / Zero Cyberpunk
// =============================================================================

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxLogo } from '@/components/ui/RiiqxLogo';
import { RiiqxWaveMark, RiiqxProfileAvatarPill } from '@/components/ui/RiiqxWaveMark';
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
  HardDriveDownload,
  Scale,
  Video,
  Compass,
  ShoppingBag,
  ShieldCheck,
  Clapperboard,
} from 'lucide-react';

export function RiiqxHeader() {
  const router = useRouter();
  const pathname = usePathname();

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

  const resolvedDisplayName = user?.name || 'Saswata Dey';
  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  const navigateToTab = (tabId: string) => {
    if (pathname !== '/' && pathname !== '/music') {
      router.push('/');
    }
    setActiveTab(tabId as any);
    setMobileMenuOpen(false);
  };

  const musicNav = [
    { id: 'music', label: 'Listen Now', icon: Radio },
    { id: 'browse', label: 'All Tracks & Search', icon: Compass },
    { id: 'ai_dj', label: 'AI Music DJ & Studio', icon: Sparkles },
    { id: 'video_studio', label: 'Lyric Video Studio', icon: Video, badge: 'PRO' },
    { id: 'creator', label: 'Creator Studio 2.0', icon: Clapperboard, badge: 'AI' },
    { id: 'decisions', label: 'Decisions Lab & Deals', icon: Scale },
    { id: 'playlists', label: 'Playlists', icon: Disc3 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'offline', label: 'Downloaded & Offline', icon: HardDriveDownload },
    { id: 'equalizer', label: 'Equalizer & DSP', icon: Sliders },
    { id: 'settings', label: 'Audio Settings', icon: Settings },
  ];

  return (
    <header className="relative z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#07070a]/95 backdrop-blur-2xl px-4 md:px-6 select-none">
      {/* Left: Single Primary Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          className="cursor-pointer transition-transform duration-150 hover:opacity-95 flex items-center gap-2.5"
          onClick={() => navigateToTab('music')}
        >
          <div className="w-8 h-8 rounded-xl bg-white/[0.07] border border-white/10 flex items-center justify-center text-white">
            <RiiqxWaveMark size={22} color="#FFFFFF" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white font-heading">RIIQX</span>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#FA243C]/20 text-[#FA243C] border border-[#FA243C]/30">PRO</span>
            </div>
            <span className="text-[9px] text-zinc-400 font-medium tracking-wider uppercase">Lossless Studio</span>
          </div>
        </div>
      </div>

      {/* Center Dynamic Island: Apple Music Style Acoustic Capsule */}
      <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#FA243C] animate-pulse" />
        <span className="text-zinc-300 font-medium tracking-wide">
          Lossless 320k Audio &bull; AI Neural Engine
        </span>
        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">
          DAC
        </span>
      </div>

      {/* Right Controls: Store, AI Video Studio, AI DJ, Theme, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Heritage Store Quick Link */}
        <button
          onClick={() => router.push('/shop')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
          title="RIIQX Modern Indian Heritage Store"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Store</span>
        </button>

        {/* Quick Launch AI Video Studio (Pro) */}
        <button
          onClick={() => navigateToTab('video_studio')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
            activeTab === 'video_studio'
              ? 'bg-[#FA243C] text-white ring-2 ring-[#FA243C]/50 shadow-lg shadow-[#FA243C]/30'
              : 'bg-[#FA243C] hover:bg-[#ff3b50] text-white'
          }`}
          title="Create Animated 9:16 / 16:9 Lyric Videos"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Video Studio</span>
          <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-white/20 text-white">
            PRO
          </span>
        </button>

        {/* Quick Launch AI DJ */}
        <button
          onClick={() => navigateToTab('ai_dj')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            activeTab === 'ai_dj'
              ? 'bg-[#FA243C]/20 text-white border-[#FA243C]/50 ring-1 ring-[#FA243C]/30'
              : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border-white/[0.08]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FA243C]" />
          <span>AI DJ</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-zinc-300" /> : <Moon className="w-4 h-4 text-zinc-300" />}
        </button>

        {/* User Profile Avatar with QX Badge */}
        <div className="relative pl-1 border-l border-white/[0.08]">
          <RiiqxProfileAvatarPill
            size={34}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          />

          {/* User Popover Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-2xl bg-[#121216]/95 backdrop-blur-2xl border border-white/[0.1] p-2 shadow-2xl z-50 text-white animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                <p className="text-xs font-bold truncate">{resolvedDisplayName}</p>
                <p className="text-[10px] text-zinc-400">Lossless 320K Tier &bull; PRO</p>
              </div>

              <button
                onClick={() => {
                  router.push('/shop');
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                <span>Heritage Store (/shop)</span>
              </button>

              <button
                onClick={() => {
                  router.push('/admin');
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Commerce OS Admin</span>
              </button>

              <button
                onClick={() => {
                  navigateToTab('settings');
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Audio Settings</span>
              </button>

              <button
                onClick={() => {
                  signOut();
                  setUserMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer mt-1"
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
        <div className="lg:hidden fixed inset-0 top-14 z-50 bg-black/80 backdrop-blur-xl flex flex-col p-4 animate-in fade-in duration-200">
          <div className="bg-[#121216] border border-white/[0.1] rounded-2xl p-4 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <RiiqxLogo size="sm" variant="full" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
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
                    onClick={() => navigateToTab(item.id)}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FA243C] text-white shadow-md'
                        : 'text-zinc-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/20 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-white/[0.08] space-y-1">
                <button
                  onClick={() => {
                    router.push('/shop');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#C5A059] hover:bg-white/[0.06] transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Heritage Store (/shop)</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-white/[0.06] transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Commerce OS Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
