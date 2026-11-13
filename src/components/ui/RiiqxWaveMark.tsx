'use client';

import React from 'react';

export interface RiiqxWaveMarkProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * 3-Wave Flowing Sound Mark (Matches Screenshots 1, 4, 6)
 * Pure SVG vector representation of the 3 flowing wave curves.
 */
export function RiiqxWaveMark({
  className = '',
  size = 32,
  color = 'currentColor',
}: RiiqxWaveMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Wave 1 (Top) */}
      <path
        d="M6 11C11 7.5 17 14.5 23 11C29 7.5 33 11 34 11.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wave 2 (Middle) */}
      <path
        d="M7 20C12 16.5 18 23.5 24 20C29 17 32 20 33 20.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wave 3 (Bottom) */}
      <path
        d="M9 29C13.5 26 18 31.5 23.5 29C27.5 27 30 29 31 29.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Circular "QX" Profile Avatar with Sweep Gradient Ring (Matches Screenshots 1, 2, 3, 5, 6)
 */
export function RiiqxProfileAvatarPill({
  className = '',
  size = 34,
  onClick,
}: {
  className?: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`relative rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 hover:scale-105 transition-transform cursor-pointer shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="RIIQX Account & Settings"
    >
      <div className="w-full h-full rounded-full bg-[#141418] flex items-center justify-center">
        <span className="text-[11px] font-black text-white tracking-tighter">
          QX
        </span>
      </div>
    </button>
  );
}
