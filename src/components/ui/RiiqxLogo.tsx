'use client';

import React from 'react';

export interface RiiqxLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'icon' | 'full' | 'compact';
  animated?: boolean;
  className?: string;
  subtitle?: string;
}

export function RiiqxLogo({
  size = 'md',
  variant = 'full',
  animated = true,
  className = '',
  subtitle = 'PRO AUDIO &bull; 320K',
}: RiiqxLogoProps) {
  const sizeMap = {
    xs: { box: 22, iconSize: 22, text: 'text-sm', subText: 'text-[7px]', badgeText: 'text-[6px]' },
    sm: { box: 30, iconSize: 30, text: 'text-base', subText: 'text-[9px]', badgeText: 'text-[7px]' },
    md: { box: 38, iconSize: 38, text: 'text-xl', subText: 'text-[10px]', badgeText: 'text-[8px]' },
    lg: { box: 48, iconSize: 48, text: 'text-2xl', subText: 'text-xs', badgeText: 'text-[9px]' },
    xl: { box: 64, iconSize: 64, text: 'text-3xl', subText: 'text-sm', badgeText: 'text-[10px]' },
    hero: { box: 88, iconSize: 88, text: 'text-5xl', subText: 'text-base', badgeText: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Iconic Quantum Sonic Prism Mark */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
        style={{ width: currentSize.box, height: currentSize.box }}
      >
        {/* Ambient Neon Back-Glow */}
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#FA243C] via-[#9333EA] to-[#06B6D4] opacity-50 blur-md pointer-events-none ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ animationDuration: '3s' }}
        />

        {/* SVG Icon Masterpiece */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-xl"
        >
          <defs>
            {/* Holographic Primary Gradient */}
            <linearGradient id="riiqx-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA243C" />
              <stop offset="45%" stopColor="#FF4655" />
              <stop offset="75%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Inner Sonic Core Glow */}
            <radialGradient id="riiqx-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#FA243C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E112A" stopOpacity="0" />
            </radialGradient>

            {/* Facet Reflection Accent */}
            <linearGradient id="riiqx-facet-shine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>

            {/* Outer Squircle Border Gradient */}
            <linearGradient id="riiqx-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FA243C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Squircle Chassis with Dark Obsidian Glass */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="26"
            fill="#090A10"
            stroke="url(#riiqx-border-grad)"
            strokeWidth="2.5"
          />

          {/* Inner Geometric Sound Chamber Wave */}
          <circle cx="50" cy="50" r="32" stroke="url(#riiqx-grad-primary)" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="3 3" />

          {/* Central R-Q-X Convergent Sound Vortex */}
          {/* Stem of R and left acoustic blade */}
          <path
            d="M26 24C26 20.6863 28.6863 18 32 18H46C56 18 64 24 64 33C64 40 58.5 45.5 50.5 47C59.5 52 68 66 74 82H58C53 70 46 56 40 50H36V82H26V24Z"
            fill="url(#riiqx-grad-primary)"
          />

          {/* Upper Loop Inner Chamber Cutout */}
          <path
            d="M36 28V42H45C49.5 42 53 39 53 35C53 31 49.5 28 45 28H36Z"
            fill="#090A10"
          />

          {/* Futuristic Sonic Crossbar & Frequency Beam (Crossing into X and resonant Q ring) */}
          <path
            d="M48 42L72 20C73.5 18.5 76 19.5 76 21.5V31L56 50L48 42Z"
            fill="#06B6D4"
            fillOpacity="0.85"
          />

          {/* Dynamic Frequency Equalizer Pulsar Bars (Upper Right) */}
          <rect x="74" y="38" width="3.5" height="18" rx="1.75" fill="#FA243C">
            {animated && (
              <animate attributeName="height" values="18;8;24;14;18" dur="1.4s" repeatCount="indefinite" />
            )}
          </rect>
          <rect x="80" y="32" width="3.5" height="26" rx="1.75" fill="#06B6D4">
            {animated && (
              <animate attributeName="height" values="26;14;30;10;26" dur="1.1s" repeatCount="indefinite" />
            )}
          </rect>
          <rect x="86" y="44" width="3.5" height="12" rx="1.75" fill="#F43F5E">
            {animated && (
              <animate attributeName="height" values="12;20;6;16;12" dur="1.7s" repeatCount="indefinite" />
            )}
          </rect>

          {/* Central Glowing Sonic Sparkle (Energy Nexus) */}
          <circle cx="50" cy="50" r="14" fill="url(#riiqx-core-glow)" />
          <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />

          {/* Diagonal Glass Sheen Highlight */}
          <path
            d="M10 26C10 17.1634 17.1634 10 26 10H74C82.8366 10 90 17.1634 90 26V32L10 68V26Z"
            fill="url(#riiqx-facet-shine)"
          />
        </svg>
      </div>

      {/* Typography & Subtitle (Full Variant) */}
      {variant !== 'icon' && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-black tracking-tight leading-none text-zinc-900 dark:text-white font-heading ${currentSize.text}`}
            >
              RIIQX
            </span>
            <span
              className={`font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FA243C] to-orange-500 text-white shadow-xs shadow-[#FA243C]/40 ${currentSize.badgeText}`}
            >
              PRO
            </span>
          </div>

          {variant === 'full' && (
            <span
              className={`font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 mt-1 uppercase ${currentSize.subText}`}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
        </div>
      )}
    </div>
  );
}
