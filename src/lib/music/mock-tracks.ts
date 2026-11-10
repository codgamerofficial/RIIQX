// =============================================================================
// RIIQX MUSIC — Real Featured Tracks & Curated Playlists
// Full 320kbps Master Audio Streams, 500x500 HD Artwork, Real Artists & Full Playback
// =============================================================================

import { Track, Playlist } from '@/types/music';

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'saavn_lahore',
    title: 'Lahore',
    artist: 'Guru Randhawa',
    album: 'Lahore - Single',
    durationMs: 197000,
    audioUrl: 'https://aac.saavncdn.com/437/a5bf59099a04ed7c10681a1aabfa5ea2_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20221123015437-500x500.jpg',
    year: 2017,
    bitrateKbps: 320,
    format: '320kbps Full Track',
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
    format: '320kbps Full Track',
    isFavorite: true,
  },
  {
    id: 'saavn_paris',
    title: 'Paris',
    artist: 'The Chainsmokers',
    album: 'Memories...Do Not Open',
    durationMs: 221000,
    audioUrl: 'https://aac.saavncdn.com/686/a9c025b026834bfde7cbb37ff7c14a3e_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/686/Memories-Do-Not-Open-English-2017-500x500.jpg',
    year: 2017,
    bitrateKbps: 320,
    format: '320kbps Full Track',
    isFavorite: false,
  },
  {
    id: 'saavn_kesariya',
    title: 'Kesariya',
    artist: 'Pritam, Arijit Singh & Amitabh Bhattacharya',
    album: 'Brahmastra',
    durationMs: 268000,
    audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    artworkUrl: 'https://c.saavncdn.com/871/Kesariya-From-Brahmastra-Hindi-2022-20220717092820-500x500.jpg',
    year: 2022,
    bitrateKbps: 320,
    format: '320kbps Full Track',
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
    format: '320kbps Full Track',
    isFavorite: false,
  },
];

export const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist_punjabi_hits',
    title: 'Punjabi & Bollywood Bangers',
    description: 'Guru Randhawa, Arijit Singh, and chart-topping party hits.',
    coverUrl: 'https://c.saavncdn.com/437/Lahore-Punjabi-2017-20221123015437-500x500.jpg',
    tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[1], INITIAL_TRACKS[4]],
  },
  {
    id: 'playlist_global_top',
    title: 'Global Top Hits',
    description: 'The world’s most streamed electronic and pop hits.',
    coverUrl: 'https://c.saavncdn.com/686/Memories-Do-Not-Open-English-2017-500x500.jpg',
    tracks: [INITIAL_TRACKS[2], INITIAL_TRACKS[3]],
  },
];
