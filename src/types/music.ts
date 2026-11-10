// =============================================================================
// RIIQX MUSIC — Types & Domain Models (Web & Mobile Parity)
// =============================================================================

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  audioUrl: string;
  artworkUrl?: string;
  year?: number;
  bitrateKbps?: number;
  format?: string;
  isFavorite?: boolean;
}

export interface LyricLine {
  timestampMs: number;
  text: string;
}

export interface Lyrics {
  trackId: string;
  plainLyrics?: string | null;
  syncedLyrics: LyricLine[];
  isSynced: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  tracks: Track[];
}

export interface EqualizerSettings {
  preset:
    | 'Balanced'
    | 'Bass Booster'
    | 'Electronic'
    | 'Acoustic'
    | 'Rock'
    | 'Vocal Booster'
    | 'Hip Hop'
    | 'Chill & Lo-Fi'
    | 'Club / Dance'
    | string;
  bassBoostLevel: number; // 0 to 100
  playbackSpeed: number; // 0.75 to 2.0
}

