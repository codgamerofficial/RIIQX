// =============================================================================
// Web Audio DSP Engine, Equalizer & Real-time Analyser for RIIQX Music
// Low-latency playback, BiquadFilter equalizer bands, Bass Boost DSP & FFT Analyser
// =============================================================================

import { EqualizerSettings } from '@/types/music';

export interface EqualizerPresetConfig {
  lowGain: number; // dB
  midGain: number; // dB
  highGain: number; // dB
}

export const EQUALIZER_PRESETS: Record<string, EqualizerPresetConfig> = {
  Balanced: { lowGain: 0, midGain: 0, highGain: 0 },
  'Bass Booster': { lowGain: 9, midGain: -2, highGain: 1 },
  Electronic: { lowGain: 6, midGain: 2, highGain: 4 },
  Acoustic: { lowGain: 2, midGain: 4, highGain: 3 },
  Rock: { lowGain: 5, midGain: -1, highGain: 5 },
  'Vocal Booster': { lowGain: -3, midGain: 6, highGain: 3 },
  'Hip Hop': { lowGain: 8, midGain: 1, highGain: 4 },
  'Chill & Lo-Fi': { lowGain: 4, midGain: 3, highGain: -2 },
  'Club / Dance': { lowGain: 9, midGain: 0, highGain: 6 },
};

export class WebAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private lowFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private highFilter: BiquadFilterNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
    }
  }

  public initWebAudio() {
    if (this.isInitialized || typeof window === 'undefined' || !this.audio) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      // Low Shelf Filter (Bass - 120Hz)
      this.lowFilter = this.audioCtx.createBiquadFilter();
      this.lowFilter.type = 'lowshelf';
      this.lowFilter.frequency.value = 120;

      // Mid Peaking Filter (Mids - 1000Hz)
      this.midFilter = this.audioCtx.createBiquadFilter();
      this.midFilter.type = 'peaking';
      this.midFilter.frequency.value = 1000;
      this.midFilter.Q.value = 1.0;

      // High Shelf Filter (Treble - 4000Hz)
      this.highFilter = this.audioCtx.createBiquadFilter();
      this.highFilter.type = 'highshelf';
      this.highFilter.frequency.value = 4000;

      // FFT Spectrum Analyser (64 fftSize = 32 frequency bins for high-performance visualizer)
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Connect DSP graph: source -> low -> mid -> high -> analyser -> destination
      this.sourceNode.connect(this.lowFilter);
      this.lowFilter.connect(this.midFilter);
      this.midFilter.connect(this.highFilter);
      this.highFilter.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('[WebAudioEngine] Web Audio DSP initialization deferred or unsupported:', e);
    }
  }

  public resumeContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public loadTrack(url: string) {
    if (!this.audio) return;
    this.audio.src = url;
    this.audio.load();
  }

  public async play(): Promise<void> {
    if (!this.audio) return;
    this.initWebAudio();
    this.resumeContext();
    return this.audio.play();
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  public seek(positionSeconds: number) {
    if (!this.audio) return;
    this.audio.currentTime = positionSeconds;
  }

  public setVolume(volume: number) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  public setPlaybackSpeed(speed: number) {
    if (!this.audio) return;
    this.audio.playbackRate = speed;
  }

  public applyEqualizer(settings: EqualizerSettings) {
    const preset = EQUALIZER_PRESETS[settings.preset] || EQUALIZER_PRESETS.Balanced;
    const extraBass = (settings.bassBoostLevel / 100) * 10; // up to +10 dB additional bass

    if (this.lowFilter) {
      this.lowFilter.gain.value = preset.lowGain + extraBass;
    }
    if (this.midFilter) {
      this.midFilter.gain.value = preset.midGain;
    }
    if (this.highFilter) {
      this.highFilter.gain.value = preset.highGain;
    }
    if (this.audio) {
      this.audio.playbackRate = settings.playbackSpeed;
    }
  }

  public getFrequencyData(array: any) {
    if (this.analyserNode) {
      (this.analyserNode as any).getByteFrequencyData(array);
    }
  }

  private savedPreDuckVolume: number = 0.85;

  public async duckVolume(targetRatio: number = 0.2, durationMs: number = 400): Promise<void> {
    if (!this.audio) return;
    this.savedPreDuckVolume = this.audio.volume || 0.85;
    const startVol = this.audio.volume;
    const targetVol = startVol * targetRatio;
    const steps = 15;
    const stepTime = durationMs / steps;
    const decrement = (startVol - targetVol) / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((r) => setTimeout(r, stepTime));
      if (!this.audio) return;
      this.audio.volume = Math.max(targetVol, this.audio.volume - decrement);
    }
  }

  public async restoreVolume(durationMs: number = 400): Promise<void> {
    if (!this.audio) return;
    const startVol = this.audio.volume;
    const targetVol = this.savedPreDuckVolume || 0.85;
    const steps = 15;
    const stepTime = durationMs / steps;
    const increment = (targetVol - startVol) / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((r) => setTimeout(r, stepTime));
      if (!this.audio) return;
      this.audio.volume = Math.min(targetVol, this.audio.volume + increment);
    }
  }

  public async fadeVolumeOut(durationMs: number = 3000): Promise<void> {
    if (!this.audio) return;
    const initialVol = this.audio.volume;
    const steps = 30;
    const stepTime = durationMs / steps;
    const volDecrement = initialVol / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((r) => setTimeout(r, stepTime));
      if (!this.audio) return;
      this.audio.volume = Math.max(0, this.audio.volume - volDecrement);
    }
    this.pause();
    this.audio.volume = initialVol;
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }
}
