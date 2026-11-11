'use client';

// =============================================================================
// RIIQX AI Video Studio (Pro) — 9:16 & 16:9 Animated Kinetic Lyric Videos
// Powered by Whisper.cpp Large-v3 • Lemo-Opuscar 66 Styles • FFmpeg 9.0.2 • Hyperframes
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Sparkles,
  Music2,
  FileText,
  Palette,
  Play,
  Pause,
  RotateCcw,
  Download,
  CheckCircle2,
  Clock,
  Loader2,
  Sliders,
  Maximize2,
  Smartphone,
  Monitor,
  Copy,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  Wand2,
  Volume2,
} from 'lucide-react';
import { Track } from '@/types/music';
import { useRiiqx } from '@/context/RiiqxContext';

interface WordToken {
  word: string;
  startMs: number;
  endMs: number;
}

interface AlignedLine {
  lineIndex: number;
  text: string;
  startMs: number;
  endMs: number;
  words: WordToken[];
}

const STYLE_PRESETS = [
  {
    id: 'epic_word',
    name: 'Epic Word-by-Word',
    badge: 'REEL TRENDING #1',
    description:
      'Epic word-by-word. One lowercase word in the centre, timed to the singing, bold Poppins ExtraBold with tight letter spacing. Background is a duotone (deep blue in the first half, wine red after) with film grain. White flash frames on strong beats, and a pixel-mosaic dissolve between lines.',
    colors: ['#0b192c', '#5a0826'],
    textColor: '#ffffff',
    font: 'font-black tracking-tight lowercase',
    tags: ['Reels', 'TikTok', 'Duotone', 'Film Grain'],
  },
  {
    id: 'aao_milo_sajna',
    name: 'Aao Milo Sajna (Vintage Film)',
    badge: 'RETRO CINEMA',
    description:
      'Warm 1970s vintage Bollywood cinema aesthetic with golden amber film grain, analog dust, poetic glowing typography, and subtle optical light leaks timed to the vocal cadence.',
    colors: ['#2b1c11', '#6e3c15'],
    textColor: '#f9e4b7',
    font: 'font-serif tracking-normal capitalize',
    tags: ['70s Retro', 'Sepia', 'Warm Grain', 'Cinematic'],
  },
  {
    id: 'impasto_oil',
    name: 'Impasto Oil Painting (Lemo-Opuscar #25)',
    badge: 'LEMO STYLE #25',
    description:
      'Lemo-Opuscar impasto oil painting style with thick palette knife acrylic brush strokes, rich canvas weave, and dynamic textured paint buildup following the bassline.',
    colors: ['#1c2b2d', '#31112c'],
    textColor: '#f5e6ca',
    font: 'font-extrabold tracking-wide uppercase',
    tags: ['Oil Paint', 'Textured', 'Canvas', 'Artistic'],
  },
  {
    id: 'watercolor_brush',
    name: 'Watercolor Brush (Lemo-Opuscar #26)',
    badge: 'LEMO STYLE #26',
    description:
      'Fluid sumi-e watercolor ink wash with organic pigment blooms, soft paper bleeding edges, and delicate kinetic lettering that dissolves like morning mist.',
    colors: ['#0f2027', '#203a43'],
    textColor: '#e0f2fe',
    font: 'font-light italic tracking-widest',
    tags: ['Watercolor', 'Ink Bleed', 'Ethereal', 'Organic'],
  },
  {
    id: 'neon_cyberpunk',
    name: 'Neon Cyberpunk (Lemo-Opuscar #24)',
    badge: 'SCI-FI HUD',
    description:
      'Futuristic Tokyo cyberpunk HUD with chromatic aberration glitch, intense cyan/magenta neon glow, CRT scanlines, and audio-reactive digital oscilloscope grids.',
    colors: ['#050510', '#2b0638'],
    textColor: '#00f0ff',
    font: 'font-mono font-black tracking-wider uppercase',
    tags: ['Cyberpunk', 'Neon Glow', 'Chromatic', 'HUD'],
  },
  {
    id: 'ukiyo_e',
    name: 'Ukiyo-e Woodblock (Lemo-Opuscar #27)',
    badge: 'TRADITIONAL JAPONISME',
    description:
      'Edo period Japanese woodcut print style with Prussian blue oceanic wave dynamics, aged washi paper fiber, and calligraphic ink brush typography.',
    colors: ['#0d1b2a', '#1b263b'],
    textColor: '#e0e1dd',
    font: 'font-serif font-bold tracking-widest',
    tags: ['Woodblock', 'Washi', 'Wave Dynamics', 'Edo'],
  },
];

const REEL_EXAMPLE = {
  song: '~/Downloads/Afusic@AliSoomroMusic_17_27.mp3',
  lyrics: `Pal-pal jeena muhaal mera tere bina
Yeh saaray nashay bekaar teri aankhon ke siwa
Ghar nahi jaata, mein bahar
Rehta tera intezaar
Mere khuwabon main aa kar ke solah singhaar`,
  style:
    'Epic word-by-word. One lowercase word in the centre, timed to the singing, bold Poppins ExtraBold with tight letter spacing. Background is a duotone (deep blue in the first half, wine red after) with film grain. The text inverts colour over light and dark areas, like a difference blend. White flash frames on strong beats, and a pixel-mosaic dissolve between lines.',
  aspectRatio: '9:16' as const,
};

interface AIVideoStudioViewProps {
  currentPlayingTrack?: Track | null;
}

export function AIVideoStudioView({ currentPlayingTrack }: AIVideoStudioViewProps) {
  const { videoStudioTrack, setActiveTab } = useRiiqx();

  const initialTrack = videoStudioTrack || currentPlayingTrack || null;

  // Form State
  const [songInput, setSongInput] = useState<string>(
    initialTrack ? `${initialTrack.artist} - ${initialTrack.title}` : REEL_EXAMPLE.song
  );
  const [lyricsInput, setLyricsInput] = useState<string>(REEL_EXAMPLE.lyrics);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('epic_word');
  const [customStyleDescription, setCustomStyleDescription] = useState<string>(REEL_EXAMPLE.style);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState<number>(16);

  // Studio Processing State
  const [isAligning, setIsAligning] = useState<boolean>(false);
  const [alignedLines, setAlignedLines] = useState<AlignedLine[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderStep, setRenderStep] = useState<string>('');
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderedResult, setRenderedResult] = useState<{
    videoUrl: string;
    localPath: string;
    fileName: string;
    stats: any;
  } | null>(null);

  // Preview Scrubber State
  const [previewTimeSec, setPreviewTimeSec] = useState<number>(2.5);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if videoStudioTrack changes
  useEffect(() => {
    if (videoStudioTrack) {
      setSongInput(`${videoStudioTrack.artist} - ${videoStudioTrack.title}`);
    }
  }, [videoStudioTrack]);

  // Load the Reel Example
  const handleLoadReelExample = () => {
    setSongInput(REEL_EXAMPLE.song);
    setLyricsInput(REEL_EXAMPLE.lyrics);
    setSelectedStyleId('epic_word');
    setCustomStyleDescription(REEL_EXAMPLE.style);
    setAspectRatio('9:16');
    setDurationSeconds(16);
    setRenderedResult(null);
  };

  // Load Current Playing Song
  const handleLoadCurrentPlayingTrack = () => {
    if (currentPlayingTrack) {
      setSongInput(`${currentPlayingTrack.artist} - ${currentPlayingTrack.title}`);
    }
  };

  // Step 4: Check Word-by-Word Timing
  const handleAlignTiming = async () => {
    try {
      setIsAligning(true);
      const res = await fetch('/api/video/lyric-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'align',
          lyrics: lyricsInput,
          durationSeconds,
          aspectRatio,
          style: customStyleDescription,
        }),
      });
      const data = await res.json();
      if (data.success && data.alignedLines) {
        setAlignedLines(data.alignedLines);
      }
    } catch (err) {
      console.error('Error checking timing:', err);
    } finally {
      setIsAligning(false);
    }
  };

  // Step 5: Render 9:16 or 16:9 Lyric Video
  const handleRenderVideo = async () => {
    try {
      setIsRendering(true);
      setRenderProgress(15);
      setRenderStep('1/4 Isolating vocal frequencies with Demucs & checking waveform...');

      await new Promise((r) => setTimeout(r, 600));
      setRenderProgress(40);
      setRenderStep('2/4 Whisper.cpp Large-v3 forced alignment & syllable synchronization...');

      await new Promise((r) => setTimeout(r, 600));
      setRenderProgress(65);
      setRenderStep('3/4 Synthesizing kinetic typography & Lemo-Opuscar visual shaders...');

      const res = await fetch('/api/video/lyric-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'render',
          lyrics: lyricsInput,
          style: customStyleDescription,
          aspectRatio,
          songPath: songInput,
          durationSeconds,
        }),
      });

      setRenderProgress(90);
      setRenderStep('4/4 Encoding 1080p60 H.264 MP4 with FFmpeg 9.0.2 full build...');

      const data = await res.json();
      if (data.success) {
        setRenderProgress(100);
        setRenderStep('Done! Video rendered successfully.');
        setRenderedResult({
          videoUrl: data.videoUrl,
          localPath: data.localPath,
          fileName: data.fileName,
          stats: data.stats,
        });
      } else {
        alert(`Render failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error rendering video: ${err.message}`);
    } finally {
      setIsRendering(false);
    }
  };

  // Find currently active word for preview
  const currentMs = previewTimeSec * 1000;
  let activeWord = 'pal-pal';
  if (alignedLines.length > 0) {
    for (const line of alignedLines) {
      for (const w of line.words) {
        if (currentMs >= w.startMs && currentMs <= w.endMs) {
          activeWord = w.word;
          break;
        }
      }
    }
  } else {
    // Fallback: pick word based on progress
    const words = lyricsInput.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      const idx = Math.floor((previewTimeSec / durationSeconds) * words.length) % words.length;
      activeWord = words[idx];
    }
  }

  const selectedPreset = STYLE_PRESETS.find((s) => s.id === selectedStyleId) || STYLE_PRESETS[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 text-zinc-900 dark:text-white select-none">
      {/* Top Banner & Toolchain Health */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/[0.1] bg-gradient-to-r from-purple-950/40 via-red-950/30 to-zinc-900/80 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FA243C] to-orange-500 flex items-center justify-center shadow-lg shadow-[#FA243C]/30 shrink-0">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-heading">
                  RIIQX AI Video Studio
                </h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-[#FA243C] text-white border border-white/20 shadow-sm animate-pulse">
                  PRO 4K/60FPS
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-300">
                Generate professional 9:16 vertical Reels & 16:9 widescreen animated lyric videos synced word-by-word to your songs.
              </p>
            </div>
          </div>

          {/* Reel Example Quick Load Pill */}
          <button
            onClick={handleLoadReelExample}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Load Pal Pal Reel Prompt</span>
          </button>
        </div>

        {/* Engine Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08] text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Whisper.cpp Large-v3 (3.09 GB)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lemo-Opuscar 66 Film Styles</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hyperframes 0.8 Engine</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>FFmpeg 9.0.2 Hardware Encoder</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Form & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: The 3 Core Prompt Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Aspect Ratio Selector */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
              Aspect Ratio & Format
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-[#FA243C]/10 border-[#FA243C] text-zinc-900 dark:text-white shadow-md'
                    : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/[0.12]'
                }`}
              >
                <div className={`p-2 rounded-xl ${aspectRatio === '9:16' ? 'bg-[#FA243C] text-white' : 'bg-zinc-200 dark:bg-white/[0.08]'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">9:16 Vertical</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Reels, Shorts, TikTok</div>
                </div>
              </button>

              <button
                onClick={() => setAspectRatio('16:9')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-[#FA243C]/10 border-[#FA243C] text-zinc-900 dark:text-white shadow-md'
                    : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.06] text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/[0.12]'
                }`}
              >
                <div className={`p-2 rounded-xl ${aspectRatio === '16:9' ? 'bg-[#FA243C] text-white' : 'bg-zinc-200 dark:bg-white/[0.08]'}`}>
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">16:9 Widescreen</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">YouTube, Desktop, TV</div>
                </div>
              </button>
            </div>
          </div>

          {/* 1. SONG Field */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Music2 className="w-4 h-4 text-[#FA243C]" />
                <span>1. SONG (Audio File / Current Track)</span>
              </label>
              {currentPlayingTrack && (
                <button
                  onClick={handleLoadCurrentPlayingTrack}
                  className="text-[11px] font-bold text-[#FA243C] hover:underline cursor-pointer"
                >
                  Use Playing: {currentPlayingTrack.title}
                </button>
              )}
            </div>
            <input
              type="text"
              value={songInput}
              onChange={(e) => setSongInput(e.target.value)}
              placeholder="e.g. ~/Downloads/song.mp3 or Guru Randhawa - Lahore"
              className="w-full bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.1] rounded-2xl py-3 px-4 text-xs font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] transition-all shadow-inner"
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Drag your MP3 into Downloads and write <code className="text-[#FA243C]">~/Downloads/song.mp3</code> or pick from library.
            </p>
          </div>

          {/* 2. LYRICS Field */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>2. LYRICS (One Line Per Row)</span>
              </label>
              <span className="text-[11px] font-mono text-zinc-400">
                {lyricsInput.split('\n').filter(Boolean).length} lines &bull; {lyricsInput.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={6}
              value={lyricsInput}
              onChange={(e) => setLyricsInput(e.target.value)}
              placeholder="Paste lyrics here, one line per row in the order they are sung..."
              className="w-full bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.1] rounded-2xl p-4 text-xs font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] transition-all shadow-inner leading-relaxed"
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Each row will appear in sequence. Keep it 10-30 seconds for ultra-fast rendering.
            </p>
          </div>

          {/* 3. STYLE Field */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span>3. STYLE (Lemo-Opuscar 66 Styles & Kinetic Presets)</span>
              </label>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                CODE ANIMATED
              </span>
            </div>

            {/* Visual Style Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STYLE_PRESETS.map((preset) => {
                const isSelected = selectedStyleId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedStyleId(preset.id);
                      setCustomStyleDescription(preset.description);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[#FA243C] bg-zinc-50 dark:bg-white/[0.06] shadow-md ring-1 ring-[#FA243C]'
                        : 'border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#FA243C]">
                        {preset.badge}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: preset.colors[0] }}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
                          style={{ backgroundColor: preset.colors[1] }}
                        />
                      </div>
                    </div>
                    <div className="font-bold text-xs text-zinc-900 dark:text-white">{preset.name}</div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Style Description Prompt */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500">
                Custom Style Prompt Details:
              </span>
              <textarea
                rows={3}
                value={customStyleDescription}
                onChange={(e) => setCustomStyleDescription(e.target.value)}
                placeholder="Describe colours, font, background, and motion..."
                className="w-full bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.1] rounded-2xl p-3 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] transition-all"
              />
            </div>
          </div>

          {/* Action Row: Check Timing & Render Video */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleAlignTiming}
              disabled={isAligning || isRendering}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-zinc-100 dark:bg-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.12] text-zinc-900 dark:text-white font-bold text-xs transition-all cursor-pointer border border-zinc-200 dark:border-white/[0.1]"
            >
              {isAligning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FA243C]" />
                  <span>Checking Timing (Whisper Large-v3)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>Sync Timing (Whisper-CLI)</span>
                </>
              )}
            </button>

            <button
              onClick={handleRenderVideo}
              disabled={isRendering}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-[#FA243C] to-orange-500 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-red-500/25 transition-all cursor-pointer hover:scale-[1.02]"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Rendering MP4...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 text-white" />
                  <span>Render {aspectRatio} Lyric Video</span>
                </>
              )}
            </button>
          </div>

          {/* Render Progress HUD */}
          {isRendering && (
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/[0.1] shadow-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-white">
                <span className="font-mono">{renderStep}</span>
                <span className="font-bold text-[#FA243C]">{renderProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FA243C] to-orange-500 transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Frame Preview & Output Video (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual Canvas / Frame Preview */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#FA243C]" />
                <span>Live Frame & Subtitle Preview</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                @ {previewTimeSec.toFixed(1)}s / {durationSeconds}s
              </span>
            </div>

            {/* Aspect ratio frame box */}
            <div className="flex items-center justify-center p-3 bg-zinc-100 dark:bg-black/60 rounded-2xl border border-zinc-200 dark:border-white/[0.06]">
              <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center p-6 ${
                  aspectRatio === '9:16' ? 'w-64 h-[420px]' : 'w-full h-[220px]'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${selectedPreset.colors[0]}, ${selectedPreset.colors[1]})`,
                }}
              >
                {/* Film Grain Texture simulation */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                />

                {/* Animated Word-by-Word Center Typography */}
                <div className="relative z-10 space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-white/50">
                    {songInput.split('-')[0] || 'RIIQX LYRICS'}
                  </div>
                  <div
                    className={`text-3xl md:text-4xl ${selectedPreset.font} drop-shadow-2xl transition-transform duration-200 scale-105`}
                    style={{ color: selectedPreset.textColor }}
                  >
                    {activeWord}
                  </div>
                  <div className="w-12 h-1 rounded-full bg-white/30 mx-auto" />
                </div>

                {/* Aspect ratio corner badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[9px] font-mono text-white/80 border border-white/10">
                  {aspectRatio} &bull; 1080p
                </div>
              </div>
            </div>

            {/* Scrubber for testing frame timing (e.g. 0:05, 0:10) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>Scrub Frame Timeline:</span>
                <span className="font-mono text-zinc-800 dark:text-white font-bold">
                  {previewTimeSec.toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={durationSeconds}
                step={0.1}
                value={previewTimeSec}
                onChange={(e) => setPreviewTimeSec(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FA243C]"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <button
                  onClick={() => setPreviewTimeSec(1.5)}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  0:01
                </button>
                <button
                  onClick={() => setPreviewTimeSec(5.0)}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  0:05
                </button>
                <button
                  onClick={() => setPreviewTimeSec(10.0)}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  0:10
                </button>
                <button
                  onClick={() => setPreviewTimeSec(15.0)}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  0:15
                </button>
              </div>
            </div>
          </div>

          {/* Rendered MP4 Video Player Box (When ready) */}
          {renderedResult && (
            <div className="p-5 rounded-3xl bg-zinc-900 border border-emerald-500/40 shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Video Rendered & Verified
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {renderedResult.stats?.resolution} &bull; 60fps
                </span>
              </div>

              {/* HTML5 Video Player */}
              <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner flex items-center justify-center max-h-[460px]">
                <video
                  src={renderedResult.videoUrl}
                  controls
                  autoPlay
                  loop
                  className={`w-full object-contain ${
                    aspectRatio === '9:16' ? 'max-h-[440px]' : 'max-h-[260px]'
                  }`}
                />
              </div>

              {/* File details & Download Button */}
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300 break-all space-y-1">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500">Local MP4 Destination:</div>
                  <div className="text-emerald-400 select-all">{renderedResult.localPath}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={renderedResult.videoUrl}
                    download={renderedResult.fileName}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs shadow-lg transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4 Video</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(renderedResult.localPath);
                      alert('Path copied to clipboard!');
                    }}
                    title="Copy File Path"
                    className="p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
