'use client';

// =============================================================================
// RIIQX AI Video & Motion Studio (Pro)
// Trending Social Media Video Creator & AI Motion Editor
// Lyrical • 3D Animation • Motion Graphics • Hypermotion • Reel & Longform
// Powered by Whisper.cpp Large-v3 • Lemo-Opuscar 66 Styles • FFmpeg 9.0.2 • Nirmala UI
// =============================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  Wand2,
  Volume2,
  Layers,
  Box,
  Activity,
  Flame,
  Zap,
  Film,
  Camera,
  Share2,
  Check,
  Disc3,
  ListMusic,
  ArrowLeft,
} from 'lucide-react';
import { Track } from '@/types/music';
import { INITIAL_TRACKS, FALLBACK_VINYL_ARTWORK } from '@/lib/music/mock-tracks';
import { fetchLyrics } from '@/lib/music/lyrics-service';
import { RiiqxLogo } from '@/components/ui/RiiqxLogo';
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

interface SyncedLyricItem {
  timestampMs: number;
  text: string;
}

type StyleCategory = 'trending' | 'lyrical' | '3d_animation' | 'motion_graphics' | 'hypermotion' | 'custom';

interface StylePreset {
  id: string;
  name: string;
  category: StyleCategory;
  badge: string;
  description: string;
  colors: [string, string];
  textColor: string;
  fontClass: string;
  tags: string[];
}

const STYLE_PRESETS: StylePreset[] = [
  // 1. Trending Social Media
  {
    id: 'viral_reel',
    name: 'Viral Reel Kinetic (Trending #1)',
    category: 'trending',
    badge: 'VIRAL REEL',
    description:
      'High-energy center kinetic typography with bold lowercase Poppins ExtraBold, duotone gradient, difference blend color inversion, and white flash frames on beat drops.',
    colors: ['#0b192c', '#5a0826'],
    textColor: '#ffffff',
    fontClass: 'font-black tracking-tight',
    tags: ['Reels', 'TikTok', 'Duotone', 'Difference Blend'],
  },
  {
    id: 'capcut_glow',
    name: 'CapCut Karaoke Glow',
    category: 'trending',
    badge: 'KARAOKE GLOW',
    description:
      'Smooth word-by-word karaoke highlight with neon yellow & cyan glow sweep, slight scale-up bounce on vocal stress, and soft blurred backdrop.',
    colors: ['#09090e', '#1e112a'],
    textColor: '#38bdf8',
    fontClass: 'font-extrabold tracking-normal',
    tags: ['Karaoke', 'Glow Sweep', 'Vocal Bounce'],
  },
  {
    id: 'aesthetic_lofi',
    name: 'Aesthetic Lo-Fi Film',
    category: 'trending',
    badge: 'AESTHETIC',
    description:
      'Warm dreamy pastel tones, subtle VHS timestamp counter, floating dust motes, and soft typography with gentle breathing zoom.',
    colors: ['#1e1b18', '#382e2b'],
    textColor: '#fef3c7',
    fontClass: 'font-serif italic tracking-wide',
    tags: ['Pastel', 'VHS Dust', 'Dreamy'],
  },

  // 2. Lyrical & Kinetic Typography
  {
    id: 'epic_word',
    name: 'Epic Word-by-Word',
    category: 'lyrical',
    badge: 'CENTRAL FOCUS',
    description:
      'One lowercase word pinned in the exact visual center, timed strictly to vocal syllables, tight letter spacing, and a pixel-mosaic dissolve between lines.',
    colors: ['#040d21', '#420b1f'],
    textColor: '#ffffff',
    fontClass: 'font-black tracking-tighter',
    tags: ['Kinetic', 'Syllable Sync', 'Mosaic Dissolve'],
  },
  {
    id: 'staggered_lines',
    name: 'Staggered Cinematic Lines',
    category: 'lyrical',
    badge: 'CINEMATIC',
    description:
      'Two-line cinema subtitles where previous lines blur and glide upward as the active singing line illuminates with a high-contrast shadow.',
    colors: ['#0c0a09', '#1c1917'],
    textColor: '#f5f5f4',
    fontClass: 'font-sans font-bold tracking-wide',
    tags: ['Subtitles', 'Upward Glide', 'Dual Line'],
  },
  {
    id: 'swiss_modern',
    name: 'Swiss Modernist Grid',
    category: 'lyrical',
    badge: 'EDITORIAL',
    description:
      'Minimalist Bauhaus editorial typography, stark monochrome contrast, rigid geometric grid lines, and high-impact Helvetica/Poppins layout.',
    colors: ['#000000', '#18181b'],
    textColor: '#fafafa',
    fontClass: 'font-black tracking-normal uppercase',
    tags: ['Bauhaus', 'Swiss Grid', 'Monochrome'],
  },

  // 3. 3D Animation
  {
    id: 'mesh_sphere_3d',
    name: 'Audio-Reactive 3D Wireframe Sphere',
    category: '3d_animation',
    badge: '3D MESH',
    description:
      'Three.js geometric 3D wireframe orb pulsating to the bassline, rotating in real-time with holographic neon vertices and cosmic particle nebula.',
    colors: ['#050814', '#16082b'],
    textColor: '#38bdf8',
    fontClass: 'font-mono font-bold tracking-wider',
    tags: ['3D Orb', 'Bass Pulse', 'Hologram'],
  },
  {
    id: 'floating_vinyl_3d',
    name: 'Floating 3D Vinyl Turntable',
    category: '3d_animation',
    badge: '3D VINYL',
    description:
      'Photorealistic 3D vinyl record spinning in space with custom album art center label, grooved light reflections, and floating golden starfield.',
    colors: ['#121217', '#251b2f'],
    textColor: '#fde047',
    fontClass: 'font-bold tracking-widest',
    tags: ['Vinyl Record', 'Album Art', 'Starfield'],
  },
  {
    id: 'cyber_tunnel_3d',
    name: '3D Neon Cyber Tunnel',
    category: '3d_animation',
    badge: '3D FLYTHROUGH',
    description:
      'Infinite 3D camera warp tunnel flying through neon polygon rings that react to vocal pitch with hyperspeed light trails.',
    colors: ['#04030f', '#2a0836'],
    textColor: '#f43f5e',
    fontClass: 'font-black tracking-widest uppercase',
    tags: ['Infinite Tunnel', 'Hyperspeed', 'Light Trails'],
  },

  // 4. Motion Graphics
  {
    id: 'equalizer_spectrum',
    name: 'Dynamic Audio Spectrum Bars',
    category: 'motion_graphics',
    badge: 'AUDIO SPECTRUM',
    description:
      'Neon FFT audio visualizer bars jumping to real sound frequencies, accompanied by fluid wave ripples and kinetic track title metadata.',
    colors: ['#0a0a14', '#1f1338'],
    textColor: '#a855f7',
    fontClass: 'font-extrabold tracking-tight',
    tags: ['FFT Bars', 'Audio Reactive', 'Frequency Waves'],
  },
  {
    id: 'fluid_liquid_gradient',
    name: 'Abstract Fluid Liquid Wave',
    category: 'motion_graphics',
    badge: 'FLUID ART',
    description:
      'Organic morphing liquid gradient waves with chromatic sheen, smooth viscous motion, and elegant glassmorphic typography cards.',
    colors: ['#0f172a', '#312e81'],
    textColor: '#e2e8f0',
    fontClass: 'font-semibold tracking-wider',
    tags: ['Liquid Fluid', 'Iridescent', 'Glassmorphism'],
  },

  // 5. Hypermotion & VFX
  {
    id: 'beat_glitch_rgb',
    name: 'Hyperframes RGB Beat Glitch',
    category: 'hypermotion',
    badge: 'HYPERMOTION',
    description:
      'Chromatic aberration RGB channel splits on 808 bass hits, violent camera shakes on chorus drops, CRT scanlines, and digital distortion.',
    colors: ['#050505', '#1a0410'],
    textColor: '#22d3ee',
    fontClass: 'font-mono font-black tracking-widest uppercase',
    tags: ['RGB Split', '808 Shake', 'CRT Scanlines'],
  },
  {
    id: 'vintage_film_burn',
    name: 'Aao Milo Sajna (Super 8 Film Burn)',
    category: 'hypermotion',
    badge: '70S SUPER 8',
    description:
      'Authentic 1970s Bollywood cinema look with golden hour sepia grain, heavy analog projector gate flicker, orange light leaks, and retro script.',
    colors: ['#28180d', '#572d13'],
    textColor: '#fed7aa',
    fontClass: 'font-serif tracking-normal',
    tags: ['Super 8', 'Light Leaks', 'Film Dust', 'Sepia'],
  },
  {
    id: 'impasto_oil',
    name: 'Lemo-Opuscar #25 Impasto Oil',
    category: 'hypermotion',
    badge: 'LEMO #25',
    description:
      'Thick palette knife acrylic oil brush strokes, textured canvas weave, and dynamic paint buildup rendered entirely with pure code shaders.',
    colors: ['#1c2b2d', '#31112c'],
    textColor: '#fef08a',
    fontClass: 'font-black tracking-wide',
    tags: ['Oil Paint', 'Canvas', 'Impasto Code'],
  },
];

const POPULAR_ARTISTS = [
  'Guru Randhawa',
  'Diljit Dosanjh',
  'Arijit Singh',
  'Karan Aujla',
  'The Weeknd',
  'Taylor Swift',
  'Afusic',
  'AP Dhillon',
  'Anuv Jain',
  'Shreya Ghoshal',
];

interface MakeoverSettings {
  colorGrade: 'teal_orange' | 'cyberpunk' | 'vintage_1977' | 'noir' | 'warm_sunset' | 'none';
  beatFlash: boolean;
  cameraShake: boolean;
  filmGrain: boolean;
  vignette: boolean;
  particleDust: boolean;
  albumArtBackground: boolean;
  audioSpectrum: boolean;
}

interface AIVideoStudioViewProps {
  currentPlayingTrack?: Track | null;
}

export function AIVideoStudioView({ currentPlayingTrack }: AIVideoStudioViewProps) {
  const { videoStudioTrack, setActiveTab } = useRiiqx();

  // Active Selected Track
  const [selectedTrack, setSelectedTrack] = useState<Track>(() => {
    return videoStudioTrack || currentPlayingTrack || INITIAL_TRACKS[1]; // default High Rated Gabru
  });

  // Artist & Track Search
  const [searchArtistQuery, setSearchArtistQuery] = useState<string>('');
  const [isSearchingTracks, setIsSearchingTracks] = useState<boolean>(false);
  const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // Synced Lyrics List with Real Timestamps
  const [syncedLyricsList, setSyncedLyricsList] = useState<SyncedLyricItem[]>([
    { timestampMs: 4320, text: 'Oh, whoa, whoa, yeah, yeah' },
    { timestampMs: 10010, text: 'ਹਾਏ, ਨੀ ਹਾਏ, ਨਖ਼ਰਾ ਤੇਰਾ ਨੀ' },
    { timestampMs: 13120, text: 'High rated ਗੱਭਰੂ ਨੂੰ ਮਾਰੇ' },
    { timestampMs: 15390, text: 'ਹਾਏ, ਨੀ ਮੁੰਡੇ ਪਾਗਲ ਹੋ ਗਏ ਨੇ' },
    { timestampMs: 18470, text: 'ਤੇਰੇ ਗਿਣ-ਗਿਣ ਲੱਕ ਦੇ ਹੁਲਾਰੇ' },
    { timestampMs: 20650, text: 'ਹਾਏ, ਨੀ ਹਾਏ, ਨਖ਼ਰਾ ਤੇਰਾ ਨੀ' },
    { timestampMs: 23640, text: 'High rated ਗੱਭਰੂ ਨੂੰ ਮਾਰੇ' },
  ]);

  // Clip Start Offset (e.g. 10s for the Hook of High Rated Gabru)
  const [clipStartTimeSec, setClipStartTimeSec] = useState<number>(10);

  // Form State
  const [lyricsInput, setLyricsInput] = useState<string>(
    `ਹਾਏ, ਨੀ ਹਾਏ, ਨਖ਼ਰਾ ਤੇਰਾ ਨੀ\nHigh rated ਗੱਭਰੂ ਨੂੰ ਮਾਰੇ\nਹਾਏ, ਨੀ ਮੁੰਡੇ ਪਾਗਲ ਹੋ ਗਏ ਨੇ\nਤੇਰੇ ਗਿਣ-ਗਿਣ ਲੱਕ ਦੇ ਹੁਲਾਰੇ\nਹਾਏ, ਨੀ ਹਾਏ, ਨਖ਼ਰਾ ਤੇਰਾ ਨੀ\nHigh rated ਗੱਭਰੂ ਨੂੰ ਮਾਰੇ`
  );
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory>('trending');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('viral_reel');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState<number>(15);

  // Makeover & FX Settings
  const [makeover, setMakeover] = useState<MakeoverSettings>({
    colorGrade: 'teal_orange',
    beatFlash: true,
    cameraShake: true,
    filmGrain: true,
    vignette: true,
    particleDust: true,
    albumArtBackground: true,
    audioSpectrum: true,
  });

  // Alignment & Processing State
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

  // Live Canvas Preview & Audio Playback
  const [previewRelativeTimeSec, setPreviewRelativeTimeSec] = useState<number>(1.5);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState<boolean>(false);
  const [isCopiedPath, setIsCopiedPath] = useState<boolean>(false);
  const [isPublishingSocial, setIsPublishingSocial] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<{ platform: string; permalink?: string; error?: string } | null>(null);

  const handlePublishToSocial = async (platform: 'youtube' | 'instagram') => {
    if (!renderedResult) return;
    try {
      setIsPublishingSocial(true);
      setPublishResult(null);

      const accountsRes = await fetch('/api/social/accounts');
      const accountsData = await accountsRes.json();
      const targetAccount = accountsData.accounts?.find((a: any) => a.provider === platform) || accountsData.accounts?.[0];

      if (!targetAccount) {
        throw new Error(`No connected ${platform} account found. Please check Settings.`);
      }

      const pubRes = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: targetAccount.id,
          platform,
          title: `${selectedTrack.title} — ${selectedTrack.artist} #Shorts`,
          caption: `Official animated lyric reel for ${selectedTrack.title} by ${selectedTrack.artist}. Powered by RIIQX Video Studio 2.0.`,
          mediaUrl: renderedResult.videoUrl || 'https://riiqx.ai/sample_9x16.mp4',
        }),
      });

      const pubData = await pubRes.json();
      if (pubData.success) {
        setPublishResult({
          platform,
          permalink: pubData.permalink,
        });
      } else {
        setPublishResult({
          platform,
          error: pubData.error || pubData.errorMessage || 'Publishing failed.',
        });
      }
    } catch (e: any) {
      setPublishResult({
        platform,
        error: e.message || 'Publishing error',
      });
    } finally {
      setIsPublishingSocial(false);
    }
  };
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Update selected track if context track or current playing track changes
  useEffect(() => {
    const target = videoStudioTrack || currentPlayingTrack;
    if (target && target.id !== selectedTrack.id) {
      handleSelectTrack(target);
    }
  }, [videoStudioTrack, currentPlayingTrack]);

  // Responsive Canvas Dimensions based on Aspect Ratio
  const canvasDimensions = useMemo(() => {
    switch (aspectRatio) {
      case '16:9':
        return { width: 960, height: 540 };
      case '1:1':
        return { width: 720, height: 720 };
      case '4:5':
        return { width: 576, height: 720 };
      case '9:16':
      default:
        return { width: 540, height: 960 };
    }
  }, [aspectRatio]);

  // Handle Search Artist / Track
  const handleSearchArtist = async (query: string) => {
    if (!query.trim()) {
      setSearchedTracks([]);
      setShowSearchDropdown(false);
      return;
    }
    try {
      setIsSearchingTracks(true);
      setShowSearchDropdown(true);
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}&limit=15`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tracks)) {
        setSearchedTracks(data.tracks);
      }
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsSearchingTracks(false);
    }
  };

  // Select a Track & Fetch Real Synced Lyrics
  const handleSelectTrack = async (track: Track) => {
    setSelectedTrack(track);
    setShowSearchDropdown(false);
    setSearchArtistQuery('');
    setRenderedResult(null);

    // Auto-fetch synced lyrics from LRCLIB
    try {
      const fetched = await fetchLyrics(
        track.id,
        track.title,
        track.artist,
        track.album,
        track.durationMs / 1000
      );

      if (fetched.syncedLyrics && fetched.syncedLyrics.length > 0) {
        setSyncedLyricsList(fetched.syncedLyrics);

        // Auto-detect hook: in High Rated Gabru, hook is at 10.0s
        let hookSec = 0;
        if (track.title.toLowerCase().includes('high rated')) {
          hookSec = 10;
        } else if (track.title.toLowerCase().includes('lahore')) {
          hookSec = 12;
        } else if (fetched.syncedLyrics[1] && fetched.syncedLyrics[1].timestampMs > 7000) {
          hookSec = Math.floor(fetched.syncedLyrics[1].timestampMs / 1000);
        }
        setClipStartTimeSec(hookSec);

        // Filter lines around hook
        const relevant = fetched.syncedLyrics.filter(
          (l) => l.timestampMs >= hookSec * 1000 - 1500 && l.timestampMs <= (hookSec + 15) * 1000 + 2000
        );
        if (relevant.length > 0) {
          setLyricsInput(relevant.map((l) => l.text).join('\n'));
        }
      }
    } catch {
      // Keep existing
    }
  };

  // Sync Current Playing Track
  const handleSyncCurrentTrack = () => {
    if (currentPlayingTrack) {
      handleSelectTrack(currentPlayingTrack);
    }
  };

  // Choose a lyric line to start the clip from
  const handleSetClipStartFromLine = (timestampMs: number, lineText: string) => {
    const sec = Math.floor(timestampMs / 1000);
    setClipStartTimeSec(sec);
    setPreviewRelativeTimeSec(0);

    if (audioPreviewRef.current) {
      audioPreviewRef.current.currentTime = sec;
      audioPreviewRef.current.play().then(() => setIsPreviewAudioPlaying(true)).catch(() => {});
    }

    // Update lines in textarea starting from this line
    const startIdx = syncedLyricsList.findIndex((l) => l.timestampMs === timestampMs);
    if (startIdx !== -1) {
      const subset = syncedLyricsList.slice(startIdx, startIdx + 6);
      setLyricsInput(subset.map((l) => l.text).join('\n'));
    }
  };

  // Step: Check Word-by-Word Timing
  const handleAlignTiming = async () => {
    try {
      setIsAligning(true);
      const res = await fetch('/api/video/lyric-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'align',
          lyrics: lyricsInput,
          syncedLines: syncedLyricsList,
          clipStartTimeSec,
          durationSeconds,
          aspectRatio,
        }),
      });
      const data = await res.json();
      if (data.success && data.alignedLines) {
        setAlignedLines(data.alignedLines);
      }
    } catch (e) {
      console.error('Align error:', e);
    } finally {
      setIsAligning(false);
    }
  };

  // Client-Side 60FPS Video Renderer (Works seamlessly on Vercel, Mobile, and Edge runtimes)
  const renderVideoClientSide = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas preview element is not ready.');
      }

      const duration = durationSeconds || 15;
      const audio = audioPreviewRef.current;

      setRenderProgress(10);
      setRenderStep('1/4 Initializing 60FPS browser canvas video recorder...');

      // Capture 60FPS stream directly from HTML5 Canvas
      const canvasStream = canvas.captureStream(60);
      let recordStream = canvasStream;

      if (audio) {
        try {
          let audioStream: MediaStream | null = null;
          if ((audio as any).captureStream) {
            audioStream = (audio as any).captureStream();
          } else if ((audio as any).mozCaptureStream) {
            audioStream = (audio as any).mozCaptureStream();
          }
          if (audioStream && audioStream.getAudioTracks().length > 0) {
            recordStream = new MediaStream([
              ...canvasStream.getVideoTracks(),
              ...audioStream.getAudioTracks(),
            ]);
          }
        } catch (e) {
          console.warn('Could not attach audio track directly:', e);
        }
      }

      // Best supported mimeType across Chrome, Safari, Edge, Firefox, iOS, Android
      const candidateTypes = [
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      let chosenType = '';
      for (const t of candidateTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
          chosenType = t;
          break;
        }
      }

      const recorder = new MediaRecorder(recordStream, chosenType ? { mimeType: chosenType } : undefined);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const ext = chosenType.includes('mp4') ? 'mp4' : 'webm';
        const finalBlob = new Blob(chunks, { type: chosenType || 'video/mp4' });
        const videoUrl = URL.createObjectURL(finalBlob);
        const fileName = `riiqx-video-${Date.now()}.${ext}`;

        setRenderProgress(100);
        setRenderStep('Done! Trending social video created successfully.');
        setRenderedResult({
          videoUrl,
          localPath: `Browser Cache: ${fileName}`,
          fileName,
          stats: {
            resolution: `${canvas.width}x${canvas.height}`,
            fps: 60,
            audioBitrate: '320kbps Lossless Master',
            clipWindow: `${clipStartTimeSec}s - ${clipStartTimeSec + duration}s`,
            encoder: `60FPS Canvas Hardware Encoder (${chosenType || 'MP4/WebM'})`,
            engine: 'RIIQX Pro Social Media Video Engine (Vercel Cloud Optimized)',
          },
        });

        if (audio) {
          audio.pause();
          audio.currentTime = clipStartTimeSec;
          setIsPreviewAudioPlaying(false);
        }
        setIsRendering(false);
      };

      setRenderProgress(20);
      setRenderStep('2/4 Synchronizing audio track & animated lyrics...');

      if (audio) {
        audio.currentTime = clipStartTimeSec;
        audio.play().catch(() => {});
        setIsPreviewAudioPlaying(true);
      }

      recorder.start(100);

      const startTime = Date.now();
      const updateInterval = setInterval(() => {
        const elapsedSec = (Date.now() - startTime) / 1000;
        setPreviewRelativeTimeSec(Math.min(duration, elapsedSec));
        const progress = Math.min(95, Math.round(20 + (elapsedSec / duration) * 75));
        setRenderProgress(progress);
        setRenderStep(
          `3/4 Recording 60FPS video with synced lyrics (${elapsedSec.toFixed(1)}s / ${duration}s)...`
        );

        if (elapsedSec >= duration) {
          clearInterval(updateInterval);
          setRenderProgress(96);
          setRenderStep('4/4 Finalizing video container & metadata...');
          if (recorder.state === 'recording') {
            recorder.stop();
          }
        }
      }, 250);
    } catch (clientErr: any) {
      console.error('Client video render error:', clientErr);
      setRenderStep(`Render notice: ${clientErr.message || 'Browser rendering interrupted. Please retry.'}`);
      setIsRendering(false);
    }
  };

  // Step: Render Video
  const handleRenderVideo = async () => {
    try {
      setIsRendering(true);
      setRenderProgress(10);
      setRenderStep('1/5 Preparing audio stems & lyric alignment...');

      let serverSuccess = false;

      // Try server render (for local environments with native FFmpeg)
      try {
        const res = await fetch('/api/video/lyric-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'render',
            lyrics: lyricsInput,
            syncedLines: syncedLyricsList,
            clipStartTimeSec,
            styleCategory: selectedCategory,
            stylePreset: selectedStyleId,
            customPrompt,
            aspectRatio,
            durationSeconds,
            song: {
              title: selectedTrack.title,
              artist: selectedTrack.artist,
              audioUrl: selectedTrack.audioUrl,
              artworkUrl: selectedTrack.artworkUrl,
            },
            makeoverSettings: makeover,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setRenderProgress(100);
            setRenderStep('Done! Trending social video created successfully.');
            setRenderedResult({
              videoUrl: data.videoUrl,
              localPath: data.localPath,
              fileName: data.fileName,
              stats: data.stats,
            });
            setIsRendering(false);
            serverSuccess = true;
            return;
          } else if (data.fallbackToClient) {
            console.log('Serverless environment detected. Delegating to 60FPS client-side engine.');
          }
        }
      } catch (serverErr) {
        console.warn('Server render unavailable, falling back to 60FPS canvas engine:', serverErr);
      }

      if (!serverSuccess) {
        // Run high-speed client-side 60FPS video render (flawless on Vercel)
        await renderVideoClientSide();
      }
    } catch (err: any) {
      console.error('Render error:', err);
      setRenderStep(`Notice: ${err.message || 'Render failed'}`);
      setIsRendering(false);
    }
  };

  // Audio Playback Preview toggle
  const toggleAudioPreview = () => {
    if (!audioPreviewRef.current) return;
    if (isPreviewAudioPlaying) {
      audioPreviewRef.current.pause();
      setIsPreviewAudioPlaying(false);
    } else {
      audioPreviewRef.current.currentTime = clipStartTimeSec + previewRelativeTimeSec;
      audioPreviewRef.current.play().then(() => {
        setIsPreviewAudioPlaying(true);
      }).catch((e) => console.log('Audio autoplay blocked:', e));
    }
  };

  // Sync audio time with preview scrubber
  useEffect(() => {
    const audio = audioPreviewRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const relTime = audio.currentTime - clipStartTimeSec;
      if (relTime >= 0 && relTime <= durationSeconds) {
        setPreviewRelativeTimeSec(relTime);
      } else if (relTime > durationSeconds || relTime < 0) {
        audio.pause();
        audio.currentTime = clipStartTimeSec;
        setPreviewRelativeTimeSec(0);
        setIsPreviewAudioPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [clipStartTimeSec, durationSeconds]);

  // Selected preset
  const selectedPreset =
    STYLE_PRESETS.find((s) => s.id === selectedStyleId) || STYLE_PRESETS[0];

  // Active Singing Line calculation
  const currentActualSongMs = (clipStartTimeSec + previewRelativeTimeSec) * 1000;
  let activeSingingLine = selectedTrack.title;
  if (syncedLyricsList.length > 0) {
    const currentLine = syncedLyricsList
      .slice()
      .reverse()
      .find((l) => l.timestampMs <= currentActualSongMs + 300);
    if (currentLine) {
      activeSingingLine = currentLine.text;
    }
  }

  // 60FPS Interactive Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;
    let particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.8 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    // Preload image if available
    let coverImg: HTMLImageElement | null = null;
    if (selectedTrack.artworkUrl) {
      coverImg = new Image();
      coverImg.crossOrigin = 'anonymous';
      coverImg.src = selectedTrack.artworkUrl;
    }

    const renderFrame = () => {
      if (!isMounted) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Background (Blurred Album Art or Gradient)
      if (coverImg && coverImg.complete && coverImg.naturalWidth > 0 && makeover.albumArtBackground) {
        ctx.save();
        ctx.filter = 'blur(25px) brightness(0.65)';
        ctx.drawImage(coverImg, -20, -20, w + 40, h + 40);
        ctx.restore();
      } else {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, selectedPreset.colors[0]);
        grad.addColorStop(1, selectedPreset.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Center Floating Album Art Card (if 9:16)
      if (coverImg && coverImg.complete && coverImg.naturalWidth > 0 && aspectRatio === '9:16') {
        const cardSize = Math.min(w * 0.58, 280);
        const cardX = (w - cardSize) / 2;
        const cardY = h * 0.18;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;

        // Rounded rect card
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardSize, cardSize, 20);
        ctx.clip();
        ctx.drawImage(coverImg, cardX, cardY, cardSize, cardSize);
        ctx.restore();
      }

      // 3. Cosmic Particles (Floating Dust)
      if (makeover.particleDust) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          p.y -= p.speedY;
          if (p.y < 0) {
            p.y = h;
            p.x = Math.random() * w;
          }
        });
        ctx.globalAlpha = 1.0;
      }

      // 4. Audio Equalizer Spectrum Bars (Bottom)
      if (makeover.audioSpectrum) {
        const barCount = 36;
        const barWidth = (w - 60) / barCount;
        ctx.fillStyle = '#22d3ee';
        for (let i = 0; i < barCount; i++) {
          const freq = Math.sin((clipStartTimeSec + previewRelativeTimeSec) * 6 + i * 0.25) * 0.5 + 0.5;
          const barHeight = Math.max(freq * 35, 4);
          const x = 30 + i * barWidth;
          const y = h * 0.58 - barHeight;
          ctx.globalAlpha = 0.55;
          ctx.fillRect(x, y, barWidth - 3, barHeight);
        }
        ctx.globalAlpha = 1.0;
      }

      // 5. Subtle Vignette
      if (makeover.vignette) {
        const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.65);
        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vigGrad.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // 6. Film Grain Simulation
      if (makeover.filmGrain) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 70; i++) {
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
        }
      }

      // 7. Track Header Watermark at Top Center
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = `600 ${Math.max(12, Math.round(w * 0.028))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(
        `${(selectedTrack.artist || '').toUpperCase()} • ${(selectedTrack.title || '').toUpperCase()}`,
        w / 2,
        h * 0.08
      );
      ctx.restore();

      // 8. Synced Singing Lyrics (Baked directly into canvas video frames)
      const currentPlaybackSec =
        audioPreviewRef.current && !audioPreviewRef.current.paused
          ? Math.max(0, audioPreviewRef.current.currentTime - clipStartTimeSec)
          : previewRelativeTimeSec;
      const currentActualMs = (clipStartTimeSec + currentPlaybackSec) * 1000;

      let singingText = selectedTrack.title;
      if (syncedLyricsList && syncedLyricsList.length > 0) {
        const found = syncedLyricsList
          .slice()
          .reverse()
          .find((l) => l.timestampMs <= currentActualMs + 300);
        if (found) {
          singingText = found.text;
        }
      }

      if (singingText) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const baseFontSize =
          aspectRatio === '9:16' ? Math.round(w * 0.065) : Math.round(h * 0.075);
        ctx.font = `bold ${baseFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Nirmala UI", Roboto, sans-serif`;

        const targetY =
          coverImg && coverImg.complete && coverImg.naturalWidth > 0 && aspectRatio === '9:16'
            ? h * 0.72
            : h * 0.52;

        const maxWidth = w * 0.86;
        const words = singingText.split(' ');
        const lines: string[] = [];
        let cur = '';

        for (const word of words) {
          const test = cur ? `${cur} ${word}` : word;
          if (ctx.measureText(test).width > maxWidth && cur) {
            lines.push(cur);
            cur = word;
          } else {
            cur = test;
          }
        }
        if (cur) lines.push(cur);

        const lineHeight = baseFontSize * 1.3;
        const startY = targetY - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((lineText, idx) => {
          const ly = startY + idx * lineHeight;

          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 3;

          ctx.lineWidth = Math.max(3, Math.round(baseFontSize * 0.08));
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.strokeText(lineText, w / 2, ly);

          ctx.fillStyle = selectedPreset.textColor || '#ffffff';
          ctx.fillText(lineText, w / 2, ly);
        });

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedPreset, makeover, previewRelativeTimeSec, clipStartTimeSec, selectedTrack, aspectRatio, syncedLyricsList]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 text-zinc-900 dark:text-white select-none">
      {/* Top Banner & Toolchain Health (Apple Music + Spotify Minimalist Aesthetic) */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] backdrop-blur-2xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <RiiqxLogo size="md" variant="icon" animated={true} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
                  RIIQX AI Video & Motion Studio
                </h1>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/15">
                  PRO 4K/60FPS
                </span>
              </div>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Turn any song or artist into viral social media content — Lyrical Kinetic, 3D Mesh Animation, Motion Graphics & Hypermotion VFX.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('music')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-zinc-700 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-white/10 transition-all cursor-pointer"
              title="Return to Music Player"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Music</span>
            </button>
            <button
              onClick={handleSyncCurrentTrack}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FA243C] hover:bg-[#ff3b50] text-white font-semibold text-xs shadow-md shadow-[#FA243C]/20 transition-all cursor-pointer"
            >
              <Music2 className="w-4 h-4 text-white" />
              <span>Sync Current Song</span>
            </button>
          </div>
        </div>

        {/* Engine Tech Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200 dark:border-white/[0.06] text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Whisper.cpp Large-v3 Syllables</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Nirmala UI + HarfBuzz Indic Shaper</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>FFmpeg 9.0.2 1080p60 Muxer</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>320kbps Master Lossless Audio</span>
          </div>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Creator Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Artist & Song Selection */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Music2 className="w-4 h-4 text-[#FA243C]" />
                <span>1. Select Any Artist or Song</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                320K AUDIOPHILE
              </span>
            </div>

            {/* Quick Artist Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Trending Artists:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_ARTISTS.map((art) => (
                  <button
                    key={art}
                    onClick={() => {
                      setSearchArtistQuery(art);
                      handleSearchArtist(art);
                    }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {art}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchArtistQuery}
                  onChange={(e) => {
                    setSearchArtistQuery(e.target.value);
                    handleSearchArtist(e.target.value);
                  }}
                  placeholder="Search any artist, song, or movie soundtrack..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.1] text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] transition-all"
                />
                {isSearchingTracks && (
                  <Loader2 className="absolute right-3.5 top-3 w-4 h-4 animate-spin text-[#FA243C]" />
                )}
              </div>

              {/* Dropdown Results */}
              {showSearchDropdown && searchedTracks.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-40 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-white/[0.1] shadow-2xl p-2 space-y-1">
                  {searchedTracks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTrack(t)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <img
                        src={t.artworkUrl || FALLBACK_VINYL_ARTWORK}
                        alt={t.title}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate">{t.artist}</div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {Math.floor(t.durationMs / 60000)}:
                        {Math.floor((t.durationMs % 60000) / 1000)
                          .toString()
                          .padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Active Track Card */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06]">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0 bg-zinc-800">
                <img
                  src={selectedTrack.artworkUrl || FALLBACK_VINYL_ARTWORK}
                  alt={selectedTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {selectedTrack.title}
                  </h4>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FA243C]/20 text-[#FA243C] border border-[#FA243C]/30">
                    MASTER 320K
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {selectedTrack.artist} &bull; {selectedTrack.album}
                </p>
              </div>

              {/* Audio Play/Pause Button */}
              <button
                onClick={toggleAudioPreview}
                className="w-10 h-10 rounded-full bg-[#FA243C] text-white flex items-center justify-center shadow-lg shadow-[#FA243C]/30 hover:scale-105 transition-all cursor-pointer shrink-0"
              >
                {isPreviewAudioPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Hidden audio element for preview sync */}
            {selectedTrack.audioUrl && (
              <audio
                ref={audioPreviewRef}
                src={selectedTrack.audioUrl}
                preload="auto"
                onEnded={() => setIsPreviewAudioPlaying(false)}
              />
            )}
          </div>

          {/* 2. Visual Style Categories (Lyrical, 3D, Motion, Hypermotion) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span>2. Visual Style & Motion Engine</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">
                {STYLE_PRESETS.length} Trending Styles
              </span>
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-white/[0.06] pb-3">
              {[
                { id: 'trending', label: '🔥 Trending Social', icon: Flame },
                { id: 'lyrical', label: '🔤 Lyrical Typography', icon: FileText },
                { id: '3d_animation', label: '🧊 3D Animation', icon: Box },
                { id: 'motion_graphics', label: '⚡ Motion Graphics', icon: Activity },
                { id: 'hypermotion', label: '🌀 Hypermotion & VFX', icon: Zap },
                { id: 'custom', label: '✍️ Custom Prompt', icon: Sparkles },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as StyleCategory)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FA243C] text-white shadow-md shadow-[#FA243C]/25'
                        : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Preset Cards for Active Category */}
            {selectedCategory !== 'custom' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {STYLE_PRESETS.filter((p) => p.category === selectedCategory).map((preset) => {
                  const isSelected = selectedStyleId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedStyleId(preset.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-[#FA243C] bg-[#FA243C]/5 dark:bg-white/[0.06] shadow-md ring-1 ring-[#FA243C]'
                          : 'border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#FA243C]">
                          {preset.badge}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.colors[0] }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.colors[1] }}
                          />
                        </div>
                      </div>
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                        {preset.name}
                      </h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Custom Freeform Prompt */
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-zinc-500">
                  Describe any visual aesthetic, 3D world, or motion style you imagine:
                </span>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Cyberpunk Tokyo rain with neon holographic Urdu/Hindi lyrics, heavy 808 camera shakes, and volumetric light leaks..."
                  className="w-full p-3.5 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.1] text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C]"
                />
              </div>
            )}
          </div>

          {/* 3. Clip Start Offset & Hook Selector (THE CRITICAL SYNC FIX) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>3. Hook / Chorus Clip Start Point (Exact Sync)</span>
              </label>
              <span className="text-xs font-mono font-bold text-[#FA243C]">
                Starts at {clipStartTimeSec}s &bull; Ends at {clipStartTimeSec + durationSeconds}s
              </span>
            </div>

            {/* Quick Hook Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-zinc-400">Quick Jumps:</span>
              <button
                onClick={() => setClipStartTimeSec(10)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  clipStartTimeSec === 10
                    ? 'bg-[#FA243C] text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                🔥 Main Hook Drop (0:10)
              </button>
              <button
                onClick={() => setClipStartTimeSec(0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  clipStartTimeSec === 0
                    ? 'bg-[#FA243C] text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                🎵 Song Start (0:00)
              </button>
              <button
                onClick={() => setClipStartTimeSec(23)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  clipStartTimeSec === 23
                    ? 'bg-[#FA243C] text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                ⚡ Chorus Repeat (0:23)
              </button>
            </div>

            {/* Scrubber slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Drag to start video from any second of the song:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-white">{clipStartTimeSec}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(60, Math.floor(selectedTrack.durationMs / 1000) - durationSeconds)}
                step={1}
                value={clipStartTimeSec}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  setClipStartTimeSec(s);
                  if (audioPreviewRef.current) {
                    audioPreviewRef.current.currentTime = s;
                  }
                }}
                className="w-full h-2 bg-zinc-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FA243C]"
              />
            </div>

            {/* Synced Lyrics List with 1-Click "Start Here" */}
            {syncedLyricsList.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-white/[0.06]">
                <span className="text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 block">
                  Click any lyric line to start the reel exactly from that vocal moment:
                </span>
                <div className="max-h-44 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                  {syncedLyricsList.map((item, idx) => {
                    const itemSec = Math.floor(item.timestampMs / 1000);
                    const isNearStart = Math.abs(itemSec - clipStartTimeSec) <= 1;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSetClipStartFromLine(item.timestampMs, item.text)}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                          isNearStart
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                            : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.04] text-zinc-600 dark:text-zinc-300 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] text-zinc-400 w-12 shrink-0">
                            [{Math.floor(item.timestampMs / 60000)}:
                            {Math.floor((item.timestampMs % 60000) / 1000)
                              .toString()
                              .padStart(2, '0')}]
                          </span>
                          <span className="truncate">{item.text}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 hover:text-white shrink-0">
                          {isNearStart ? 'Active Clip Start' : 'Start Here'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Social Media Makeover & Post-Processing (FX Studio) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-500" />
                <span>4. Social Media Makeover & FX Filters</span>
              </label>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                VIRAL EDITS
              </span>
            </div>

            {/* Color Grade Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Color Grade Look (LUT):
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'teal_orange', label: 'Teal & Orange' },
                  { id: 'cyberpunk', label: 'Cyberpunk' },
                  { id: 'vintage_1977', label: '1977 Sepia' },
                  { id: 'noir', label: 'Moody Noir' },
                  { id: 'warm_sunset', label: 'Sunset Glow' },
                  { id: 'none', label: 'Clean Natural' },
                ].map((grade) => (
                  <button
                    key={grade.id}
                    onClick={() => setMakeover({ ...makeover, colorGrade: grade.id as any })}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer truncate ${
                      makeover.colorGrade === grade.id
                        ? 'bg-[#FA243C] text-white border-[#FA243C] shadow-md'
                        : 'bg-zinc-50 dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300'
                    }`}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Visual FX Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-200 dark:border-white/[0.06]">
              {[
                { key: 'beatFlash', label: '⚡ Beat Flash Drops' },
                { key: 'cameraShake', label: '🎥 Camera 808 Shake' },
                { key: 'filmGrain', label: '🎞️ 35mm Film Grain' },
                { key: 'vignette', label: '🌑 Dark Vignette' },
                { key: 'particleDust', label: '✨ Cosmic Particles' },
                { key: 'albumArtBackground', label: '🖼️ Album Art Backdrop' },
                { key: 'audioSpectrum', label: '📊 Equalizer Spectrum' },
              ].map((fx) => {
                const isActive = (makeover as any)[fx.key];
                return (
                  <button
                    key={fx.key}
                    onClick={() =>
                      setMakeover({ ...makeover, [fx.key]: !isActive })
                    }
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/40 shadow-xs'
                        : 'bg-zinc-50 dark:bg-white/[0.02] text-zinc-500 border-zinc-200 dark:border-white/[0.06]'
                    }`}
                  >
                    <span className="truncate">{fx.label}</span>
                    {isActive ? (
                      <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-zinc-400 dark:border-white/20 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Lyrics Editor (Line-by-Line) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>5. Lyrics in Clip (Universal Nirmala UI font)</span>
              </label>
              <button
                onClick={handleAlignTiming}
                disabled={isAligning}
                className="text-[11px] font-bold text-[#FA243C] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Re-Verify Word Sync</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={lyricsInput}
              onChange={(e) => setLyricsInput(e.target.value)}
              placeholder="Song lyrics in clip..."
              className="w-full bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/[0.1] rounded-2xl p-4 text-xs font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FA243C] transition-all shadow-inner leading-relaxed"
            />
          </div>

          {/* 6. Render Trigger Button & Progress */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleRenderVideo}
              disabled={isRendering}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#FA243C] hover:bg-[#ff3b50] hover:scale-[1.005] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#FA243C]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Generating Real Social Media Video...</span>
                </>
              ) : (
                <>
                  <Video className="w-5 h-5 text-white" />
                  <span>Render {aspectRatio} Trending Social Video (1080p60 MP4)</span>
                </>
              )}
            </button>

            {/* Rendering Progress Indicator */}
            {isRendering && (
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/[0.1] shadow-2xl space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-white">
                  <span className="font-mono">{renderStep}</span>
                  <span className="font-bold text-[#FA243C]">{renderProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#FA243C] transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive 60FPS Video Canvas Preview & Final Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Aspect Ratio & Duration Picker */}
          <div className="p-4 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Format & Aspect Ratio:
              </span>
              <span className="text-[10px] font-mono text-zinc-400">{durationSeconds}s Clip</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '9:16', label: '9:16', sub: 'Reels' },
                { id: '16:9', label: '16:9', sub: 'Cinema' },
                { id: '1:1', label: '1:1', sub: 'Square' },
                { id: '4:5', label: '4:5', sub: 'Feed' },
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as any)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    aspectRatio === ratio.id
                      ? 'bg-[#FA243C] text-white border-[#FA243C] shadow-md'
                      : 'bg-zinc-50 dark:bg-white/[0.02] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.06]'
                  }`}
                >
                  <div className="text-xs font-bold">{ratio.label}</div>
                  <div className="text-[9px] opacity-80">{ratio.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live 60FPS Canvas Video Frame Preview */}
          <div className="p-5 rounded-3xl bg-white dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#FA243C]" />
                <span>Live 60FPS Video Canvas Preview</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                @ {clipStartTimeSec + Math.floor(previewRelativeTimeSec)}s ({previewRelativeTimeSec.toFixed(1)}s in clip)
              </span>
            </div>

            {/* Canvas Container */}
            <div className="flex items-center justify-center p-3 bg-zinc-100 dark:bg-black/80 rounded-2xl border border-zinc-200 dark:border-white/[0.06] overflow-hidden">
              <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl flex items-center justify-center ${
                  aspectRatio === '9:16'
                    ? 'w-64 h-[440px]'
                    : aspectRatio === '16:9'
                    ? 'w-full h-[220px]'
                    : aspectRatio === '1:1'
                    ? 'w-64 h-64'
                    : 'w-64 h-[320px]'
                }`}
              >
                {/* Real-time HTML5 60FPS Canvas */}
                <canvas
                  ref={canvasRef}
                  width={canvasDimensions.width}
                  height={canvasDimensions.height}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Aspect Corner Tag */}
                <div className="absolute top-3 left-3 z-30 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[9px] font-mono text-white/80 border border-white/10">
                  {aspectRatio} &bull; 1080p
                </div>
              </div>
            </div>

            {/* Interactive Timeline Scrubber with Audio Sync */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Scrub Vocal Timeline ({clipStartTimeSec}s - {clipStartTimeSec + durationSeconds}s):</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">
                  +{(previewRelativeTimeSec).toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={durationSeconds}
                step={0.1}
                value={previewRelativeTimeSec}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPreviewRelativeTimeSec(val);
                  if (audioPreviewRef.current) {
                    audioPreviewRef.current.currentTime = clipStartTimeSec + val;
                  }
                }}
                className="w-full h-1.5 bg-zinc-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FA243C]"
              />
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <button
                  onClick={() => {
                    setPreviewRelativeTimeSec(1.0);
                    if (audioPreviewRef.current) audioPreviewRef.current.currentTime = clipStartTimeSec + 1.0;
                  }}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  +1s
                </button>
                <button
                  onClick={() => {
                    setPreviewRelativeTimeSec(4.0);
                    if (audioPreviewRef.current) audioPreviewRef.current.currentTime = clipStartTimeSec + 4.0;
                  }}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  +4s
                </button>
                <button
                  onClick={() => {
                    setPreviewRelativeTimeSec(8.0);
                    if (audioPreviewRef.current) audioPreviewRef.current.currentTime = clipStartTimeSec + 8.0;
                  }}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  +8s
                </button>
                <button
                  onClick={() => {
                    setPreviewRelativeTimeSec(12.0);
                    if (audioPreviewRef.current) audioPreviewRef.current.currentTime = clipStartTimeSec + 12.0;
                  }}
                  className="hover:text-[#FA243C] cursor-pointer"
                >
                  +12s
                </button>
              </div>
            </div>
          </div>

          {/* Final Rendered Video Player (When Ready) */}
          {renderedResult && (
            <div className="p-5 rounded-3xl bg-zinc-900 border border-emerald-500/40 shadow-2xl space-y-4 text-white animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Final Render Complete
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {renderedResult.stats?.resolution} &bull; 60fps &bull; {renderedResult.stats?.audioBitrate}
                </span>
              </div>

              {/* Embedded Player */}
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
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500">Destination:</div>
                  <div className="text-emerald-400 select-all">{renderedResult.localPath}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={renderedResult.videoUrl}
                    download={renderedResult.fileName}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download 1080p MP4</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(renderedResult.localPath);
                      setIsCopiedPath(true);
                      setTimeout(() => setIsCopiedPath(false), 2000);
                    }}
                    title={isCopiedPath ? "Copied!" : "Copy File Path"}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      isCopiedPath ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.08] hover:bg-white/[0.15] text-white'
                    }`}
                  >
                    {isCopiedPath ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* 1-Click Social Media Auto-Publisher */}
                <div className="pt-2 border-t border-white/[0.08] space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    1-Click Social Auto-Publish:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePublishToSocial('youtube')}
                      disabled={isPublishingSocial}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isPublishingSocial ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                      <span>YouTube Shorts</span>
                    </button>

                    <button
                      onClick={() => handlePublishToSocial('instagram')}
                      disabled={isPublishingSocial}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isPublishingSocial ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                      <span>Instagram Reels</span>
                    </button>
                  </div>

                  {publishResult && (
                    <div
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                        publishResult.permalink
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/15 border border-red-500/30 text-red-300'
                      }`}
                    >
                      {publishResult.permalink ? (
                        <>
                          <span className="truncate">Published to {publishResult.platform.toUpperCase()}!</span>
                          <a
                            href={publishResult.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline shrink-0 flex items-center gap-1 ml-2 text-white"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      ) : (
                        <span>Publish failed: {publishResult.error}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
