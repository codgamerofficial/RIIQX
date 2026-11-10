// =============================================================================
// RIIQX MUSIC — Real Featured Tracks & Curated Playlists
// Full 320kbps Master Audio Streams, Verified HD Artwork, 100% Real Audio
// =============================================================================

import { Track, Playlist } from '@/types/music';

export const FALLBACK_VINYL_ARTWORK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FA243C"/><stop offset="100%" stop-color="%2318181b"/></linearGradient></defs><rect width="500" height="500" fill="url(%23g)"/><circle cx="250" cy="250" r="140" fill="%2309090b" stroke="%2327272a" stroke-width="4"/><circle cx="250" cy="250" r="80" fill="%2318181b" stroke="%233f3f46" stroke-width="2"/><circle cx="250" cy="250" r="30" fill="%23FA243C"/><path d="M242 232 L266 250 L242 268 Z" fill="white"/></svg>';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'saavn_lahore',
    title: 'Lahore',
    artist: 'Guru Randhawa',
    album: 'Lahore - Single',
    durationMs: 197000,
    audioUrl: 'https://aac.saavncdn.com/437/a5bf59099a04ed7c10681a1aabfa5ea2_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
    year: 2017,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'saavn_high_rated_gabru',
    title: 'High Rated Gabru',
    artist: 'Guru Randhawa',
    album: 'High Rated Gabru - Single',
    durationMs: 214000,
    audioUrl: 'https://aac.saavncdn.com/344/4e7a96829b1ab444247a2a8db16673a8_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/344/High-Rated-Gabru-Punjabi-2017-500x500.jpg',
    year: 2017,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'saavn_paris',
    title: 'PARIS',
    artist: 'Gurjit Gill, Verse',
    album: 'PARIS',
    durationMs: 119000,
    audioUrl: 'https://aac.saavncdn.com/900/498f71ceaf0a2f974c39fb1f9f1da3ad_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
    year: 2026,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
  {
    id: 'saavn_kesariya',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh',
    album: 'Arijit Singh Best Songs',
    durationMs: 268000,
    audioUrl: 'https://aac.saavncdn.com/423/852ad6cc81d7733c5e9bfc46d7b063e2_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/423/Arijit-Singh-All-Time-Best-Hindi-Hit-Love-Songs-Collection-Hindi-2026-20261008160834-500x500.jpg',
    year: 2026,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: true,
  },
  {
    id: 'saavn_ishare_tere',
    title: 'Ishare Tere',
    artist: 'Guru Randhawa & Dhvani Bhanushali',
    album: 'Ishare Tere',
    durationMs: 189000,
    audioUrl: 'https://aac.saavncdn.com/161/a58eb8752d5b6296df2a4ecb3f07be89_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/161/Ishare-Tere-Punjabi-2018-20180724123848-500x500.jpg',
    year: 2018,
    bitrateKbps: 320,
    format: '320kbps Master',
    isFavorite: false,
  },
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist_punjabi_hits',
    title: 'Punjabi & Bollywood Bangers',
    description: 'Guru Randhawa, Arijit Singh, and chart-topping party hits.',
    coverUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20171214-500x500.jpg',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[4]],
  },
  {
    id: 'playlist_global_top',
    title: 'Global Top Hits',
    description: 'The world’s most streamed electronic and pop hits.',
    coverUrl: 'https://c.saavncdn.com/900/PARIS-Punjabi-2026-20260414133157-500x500.jpg',
    tracks: [INITIAL_TRACKS[2], INITIAL_TRACKS[3]],
  },
];
