'use client';

// =============================================================================
// RIIQX 2.0 — Modern Indian Heritage Master Brand Assets & Vector Identity
// Royal Minimalism • Earthy Luxury • Architectural Jharokha Geometry • Pure Vector
// Primary Logo • Secondary Wordmark • Monogram • Packaging Seal • Product Label
// =============================================================================

import React from 'react';

export interface RiiqxHeritageLogoProps {
  variant?: 'full' | 'wordmark' | 'monogram' | 'seal' | 'compact';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  colorMode?: 'light' | 'dark' | 'terracotta' | 'brass';
  className?: string;
  subtitle?: string;
}

export function RiiqxHeritageLogo({
  variant = 'full',
  size = 'md',
  colorMode = 'dark',
  className = '',
  subtitle = 'Modern Indian Living',
}: RiiqxHeritageLogoProps) {
  const sizeMap = {
    xs: { box: 24, text: 'text-xs tracking-[0.2em]', sub: 'text-[7px]', gap: 'gap-2' },
    sm: { box: 32, text: 'text-sm tracking-[0.25em]', sub: 'text-[8px]', gap: 'gap-2.5' },
    md: { box: 42, text: 'text-lg tracking-[0.3em] font-medium', sub: 'text-[9px]', gap: 'gap-3' },
    lg: { box: 54, text: 'text-2xl tracking-[0.35em] font-medium', sub: 'text-[11px]', gap: 'gap-4' },
    xl: { box: 68, text: 'text-3xl tracking-[0.4em] font-semibold', sub: 'text-xs', gap: 'gap-5' },
    hero: { box: 92, text: 'text-5xl tracking-[0.45em] font-bold', sub: 'text-sm', gap: 'gap-6' },
  };

  const currentSize = sizeMap[size];

  // Palette assignments
  const isLightMode = colorMode === 'light';
  const textColor = isLightMode ? 'text-[#1A1A1A]' : 'text-[#FBF9F5]';
  const subTextColor = isLightMode ? 'text-[#7D766E]' : 'text-[#B3ACA3]';

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none cursor-pointer group ${className}`}>
      {/* 1. Architectural Heritage Monogram Mark (Arch + Jharokha Geometric Vector) */}
      {(variant === 'full' || variant === 'monogram' || variant === 'compact' || variant === 'seal') && (
        <div
          className="relative shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ width: currentSize.box, height: currentSize.box }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            <defs>
              {/* Antique Brass Gradient */}
              <linearGradient id="riiqx-brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D8B878" />
                <stop offset="50%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#9E7E3C" />
              </linearGradient>

              {/* Terracotta Clay Gradient */}
              <linearGradient id="riiqx-terracotta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D9775F" />
                <stop offset="100%" stopColor="#C2593F" />
              </linearGradient>

              {/* Sandstone & Warm Charcoal Base */}
              <linearGradient id="riiqx-base-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isLightMode ? '#F5F2EB' : '#22201E'} />
                <stop offset="100%" stopColor={isLightMode ? '#E6DFD5' : '#141312'} />
              </linearGradient>

              <linearGradient id="riiqx-gold-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {variant === 'seal' ? (
              // Artisanal Circular Heritage Seal
              <g>
                <circle cx="50" cy="50" r="46" stroke="url(#riiqx-brass-grad)" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="41" stroke="url(#riiqx-brass-grad)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="38" fill="url(#riiqx-base-grad)" />
                {/* Micro Arch */}
                <path
                  d="M38 64V46C38 39.3726 43.3726 34 50 34C56.6274 34 62 39.3726 62 46V64"
                  stroke="url(#riiqx-brass-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="46" r="3.5" fill="url(#riiqx-terracotta-grad)" />
              </g>
            ) : (
              // Contemporary Jharokha (Arch) Monogram Chassis
              <g>
                {/* Modern Indian Architectural Arch Chassis */}
                <path
                  d="M12 92V46C12 25.0132 29.0132 8 50 8C70.9868 8 88 25.0132 88 46V92H12Z"
                  fill="url(#riiqx-base-grad)"
                  stroke="url(#riiqx-gold-stroke)"
                  strokeWidth="1.2"
                />

                {/* Inner Stepped Heritage Arch */}
                <path
                  d="M22 92V50C22 34.536 34.536 22 50 22C65.464 22 78 34.536 78 50V92"
                  stroke="url(#riiqx-gold-stroke)"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />

                {/* Minimalist Modern "R" Geometry inside Arch */}
                <path
                  d="M38 40H52C58.6274 40 64 45.3726 64 52C64 58.6274 58.6274 64 52 64H44V80H38V40Z"
                  fill="url(#riiqx-terracotta-grad)"
                />
                <rect x="44" y="46" width="8" height="12" rx="4" fill={isLightMode ? '#F5F2EB' : '#1A1A1A'} />
                <path
                  d="M50 64L64 80H56L43 65"
                  fill="url(#riiqx-terracotta-grad)"
                />

                {/* Top Keystone Accent (Brass Finial) */}
                <polygon points="50,4 53,9 50,14 47,9" fill="url(#riiqx-brass-grad)" />
              </g>
            )}
          </svg>
        </div>
      )}

      {/* 2. Brand Wordmark & Tagline (Editorial High-Contrast Serif) */}
      {(variant === 'full' || variant === 'wordmark' || variant === 'compact') && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span
              className={`font-editorial ${currentSize.text} ${textColor} uppercase font-medium tracking-[0.3em] transition-colors`}
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            >
              RIIQX
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#C5A059] opacity-80" />
          </div>

          {variant === 'full' && (
            <span
              className={`${currentSize.sub} ${subTextColor} uppercase tracking-[0.25em] font-sans font-medium mt-0.5`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Packaging Label Badge Component for Product Packaging & Detail Cards
 */
export function RiiqxPackagingBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#FBF9F5] text-[#1A1A1A] shadow-xs ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-[#C2593F]" />
      <span className="text-[10px] font-sans uppercase tracking-[0.18em] font-semibold text-[#1A1A1A]">
        RIIQX Genuine Indian Heritage
      </span>
      <span className="text-[9px] text-[#C5A059] font-serif font-bold">100% ARTISANAL ORIGIN</span>
    </div>
  );
}
