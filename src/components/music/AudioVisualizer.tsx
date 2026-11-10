'use client';

// =============================================================================
// RIIQX MUSIC — Real-time Web Audio FFT Spectrum Visualizer
// Animates audio frequencies with liquid gradient neon bars
// =============================================================================

import React, { useRef, useEffect } from 'react';
import { WebAudioEngine } from '@/lib/music/audio-engine';

interface AudioVisualizerProps {
  engine: WebAudioEngine | null;
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}

export function AudioVisualizer({
  engine,
  isPlaying,
  barCount = 24,
  height = 40,
  className = '',
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const freqArray = new Uint8Array(32);

    const render = () => {
      animId = requestAnimationFrame(render);

      if (engine && isPlaying) {
        engine.getFrequencyData(freqArray);
      } else {
        // Idle gentle float when paused
        for (let i = 0; i < freqArray.length; i++) {
          freqArray[i] = Math.max(0, freqArray[i] * 0.9);
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / barCount) * 0.65;
      const gap = (canvas.width / barCount) * 0.35;

      for (let i = 0; i < barCount; i++) {
        const binIndex = Math.floor((i / barCount) * 24);
        const value = freqArray[binIndex] || 4;
        const percent = Math.min(1, Math.max(0.08, value / 255));
        const barHeight = percent * canvas.height;

        const x = i * (barWidth + gap);
        const y = canvas.height - barHeight;

        // Gradient: Apple Music Red to Orange/Gold
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, y);
        gradient.addColorStop(0, '#FA243C');
        gradient.addColorStop(0.7, '#f97316');
        gradient.addColorStop(1, '#fbbf24');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine, isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 8}
      height={height}
      className={`block opacity-90 ${className}`}
    />
  );
}

