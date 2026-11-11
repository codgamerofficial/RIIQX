'use client';

// =============================================================================
// RIIQX — Primary Brand Mark & Identity (Classy • Clean • Minimalist • Luxury)
// Inspired by Apple Music & Spotify • Precision Acoustic Ribbon • Pure Vector
// Smooth Breathing Audio Wave Animation • Zero Neon / Zero Cyberpunk
// =============================================================================

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
  subtitle = 'Music & Audio Intelligence',
}: RiiqxLogoProps) {
  const sizeMap = {
    xs: { box: 22, text: 'text-xs', sub: 'text-[7px]', gap: 'gap-2' },
    sm: { box: 28, text: 'text-sm', sub: 'text-[9px]', gap: 'gap-2.5' },
    md: { box: 36, text: 'text-base font-bold', sub: 'text-[10px]', gap: 'gap-3' },
    lg: { box: 44, text: 'text-xl font-extrabold', sub: 'text-xs', gap: 'gap-3.5' },
    xl: { box: 56, text: 'text-2xl font-black', sub: 'text-xs', gap: 'gap-4' },
    hero: { box: 80, text: 'text-4xl font-black', sub: 'text-sm', gap: 'gap-5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none cursor-pointer group ${className}`}>
      {/* Luxury Minimalist Acoustic Mark */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: currentSize.box, height: currentSize.box }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Apple Music Signature Deep Crimson to Ruby Red Gradient */}
            <linearGradient id="riiqx-classy-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA243C" />
              <stop offset="100%" stopColor="#C8102E" />
            </linearGradient>

            {/* Subtle Brushed Titanium Sheen */}
            <linearGradient id="riiqx-brushed-dark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222228" />
              <stop offset="100%" stopColor="#121216" />
            </linearGradient>

            {/* Precision 1px Border Highlight */}
            <linearGradient id="riiqx-border-classy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Squircle Chassis: Premium Matte Obsidian */}
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="24"
            fill="url(#riiqx-brushed-dark)"
            stroke="url(#riiqx-border-classy)"
            strokeWidth="1.5"
          />

          {/* Fluid Modern "R" Acoustic Monogram */}
          {/* Main Stem */}
          <path
            d="M30 25C30 22.2386 32.2386 20 35 20H52C63.0457 20 72 28.9543 72 40C72 48.6183 66.5744 55.9702 59 58.7466L72.2 78.4C73.4 80.2 72.1 82.5 69.9 82.5H60.5C59.3 82.5 58.2 81.9 57.5 80.9L46.5 62H39V79C39 80.6569 37.6569 82 36 82H33C31.3431 82 30 80.6569 30 79V25Z"
            fill="url(#riiqx-classy-red)"
          />

          {/* Counter Hole (Precision Circle) */}
          <rect
            x="39"
            y="29"
            width="14"
            height="18"
            rx="7"
            fill="#121216"
          />

          {/* Classy Kinetic Equalizer Soundwave Bars (Subtle & Fluid) */}
          <rect x="74" y="32" width="3" height="14" rx="1.5" fill="#FA243C" opacity="0.85">
            {animated && (
              <animate attributeName="height" values="14;6;18;10;14" dur="2s" repeatCount="indefinite" />
            )}
          </rect>
          <rect x="80" y="26" width="3" height="26" rx="1.5" fill="#FA243C">
            {animated && (
              <animate attributeName="height" values="26;12;28;16;26" dur="1.7s" repeatCount="indefinite" />
            )}
          </rect>
          <rect x="86" y="38" width="3" height="10" rx="1.5" fill="#FA243C" opacity="0.7">
            {animated && (
              <animate attributeName="height" values="10;18;8;14;10" dur="2.3s" repeatCount="indefinite" />
            )}
          </rect>
        </svg>
      </div>

      {/* Classy Typography Header */}
      {variant !== 'icon' && (
        <div className="flex flex-col min-w-0 justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-white font-heading ${currentSize.text}`}
              style={{ letterSpacing: '-0.02em' }}
            >
              RIIQX
            </span>
            <span className="text-[9px] font-bold text-white/50 tracking-widest uppercase">
              MUSIC
            </span>
          </div>

          {variant === 'full' && (
            <span className={`font-medium tracking-wide text-zinc-400 -mt-0.5 ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
