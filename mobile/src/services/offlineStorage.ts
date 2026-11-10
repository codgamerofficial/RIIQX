// =============================================================================
// RIIQX Mobile — Native Offline Storage Service
// Powered by expo-file-system & @react-native-async-storage/async-storage
// Full 320kbps Master Audio Offline Download, Storage Accounting & Native Playback
// =============================================================================

import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface OfflineTrackMetadata {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  audioUrl: string;
  artworkUrl: string;
  year?: number;
  bitrateKbps: number;
  format: string;
  localAudioUri: string;
  fileSizeBytes: number;
  downloadedAt: number;
}

const STORAGE_KEY = 'riiqx_mobile_offline_tracks_v1';
const TRACKS_DIR = `${FileSystem.documentDirectory || ''}riiqx_tracks/`;

// Ensure directory exists
async function ensureDirExists(): Promise<void> {
  if (Platform.OS === 'web') return;
  const dirInfo = await FileSystem.getInfoAsync(TRACKS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(TRACKS_DIR, { intermediates: true });
  }
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

// Get all offline track metadata
export async function getOfflineTracks(): Promise<OfflineTrackMetadata[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineTrackMetadata[];
  } catch (err) {
    console.warn('Failed to get offline tracks:', err);
    return [];
  }
}

// Check if a specific track is downloaded
export async function isTrackOffline(trackId: string): Promise<boolean> {
  const tracks = await getOfflineTracks();
  return tracks.some((t) => t.id === trackId);
}

// Download a track to local device filesystem
export async function downloadTrackToDevice(
  track: {
    id: string;
    title: string;
    artist: string;
    album: string;
    durationMs: number;
    audioUrl: string;
    artworkUrl: string;
    year?: number;
    bitrateKbps?: number;
    format?: string;
  },
  onProgress?: (progressRatio: number) => void
): Promise<OfflineTrackMetadata> {
  if (Platform.OS === 'web') {
    throw new Error('Native offline filesystem is only available on Android & iOS');
  }

  await ensureDirExists();

  const safeFilename = `${track.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
  const fileUri = `${TRACKS_DIR}${safeFilename}`;

  const downloadResumable = FileSystem.createDownloadResumable(
    track.audioUrl,
    fileUri,
    {},
    (downloadProgress) => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      if (onProgress && !isNaN(progress)) {
        onProgress(Math.min(Math.max(progress, 0), 1));
      }
    }
  );

  const result = await downloadResumable.downloadAsync();
  if (!result || !result.uri) {
    throw new Error('Download failed: file not written to device');
  }

  const fileInfo = await FileSystem.getInfoAsync(result.uri);
  const fileSizeBytes = fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;

  const offlineMeta: OfflineTrackMetadata = {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    durationMs: track.durationMs,
    audioUrl: track.audioUrl,
    artworkUrl: track.artworkUrl,
    year: track.year || 2026,
    bitrateKbps: track.bitrateKbps || 320,
    format: track.format || '320kbps Master',
    localAudioUri: result.uri,
    fileSizeBytes,
    downloadedAt: Date.now(),
  };

  const existing = await getOfflineTracks();
  const updated = [offlineMeta, ...existing.filter((t) => t.id !== track.id)];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return offlineMeta;
}

// Delete an offline track
export async function deleteOfflineTrack(trackId: string): Promise<void> {
  const existing = await getOfflineTracks();
  const target = existing.find((t) => t.id === trackId);

  if (target && Platform.OS !== 'web') {
    try {
      await FileSystem.deleteAsync(target.localAudioUri, { idempotent: true });
    } catch (err) {
      console.warn('Failed to delete file from disk:', err);
    }
  }

  const remaining = existing.filter((t) => t.id !== trackId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}

// Get storage accounting
export async function getOfflineStorageInfo(): Promise<{
  count: number;
  totalBytes: number;
  formattedSize: string;
}> {
  const tracks = await getOfflineTracks();
  const totalBytes = tracks.reduce((acc, t) => acc + (t.fileSizeBytes || 0), 0);
  return {
    count: tracks.length,
    totalBytes,
    formattedSize: formatBytes(totalBytes),
  };
}
