import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-obsidian-base flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
      {/* Background Subtle Radar Glow */}
      <div className="w-96 h-96 bg-accent-crimson/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-sm bg-accent-crimson flex items-center justify-center font-mono font-black text-white text-2xl shadow-glow-crimson animate-bounce">
          R
        </div>

        <div className="flex flex-col items-center space-y-1">
          <span className="font-display font-extrabold text-xl tracking-wider text-white">
            RIIQX LABS
          </span>
          <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase animate-pulse">
            INITIALIZING SYSTEM TELEMETRY...
          </span>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-charcoal-matte rounded-full overflow-hidden border border-glass-border-subtle">
          <div className="h-full bg-accent-crimson w-1/2 animate-[scanline-sweep_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
}
