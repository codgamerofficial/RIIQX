// =============================================================================
// RIIQX MUSIC — Client-Side Offline Music Storage Engine (IndexedDB)
// Caches full 320kbps audio blobs for instant zero-buffering & offline playback
// =============================================================================

import { Track } from '@/types/music';

const DB_NAME = 'RIIQX_Music_Offline_DB';
const DB_VERSION = 1;
const STORE_NAME = 'offline_tracks';

export interface OfflineStoredTrackRecord {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  format: string;
  artworkUrl: string;
  audioBlob: Blob;
  sizeBytes: number;
  savedAt: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this browser'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt', { unique: false });
        store.createIndex('artist', 'artist', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Downloads and caches the full track audio into IndexedDB
 */
export async function saveTrackOffline(track: Track): Promise<boolean> {
  try {
    const db = await openDatabase();

    // Fetch audio stream via our download proxy to avoid CORS blocks
    const fetchUrl = `/api/music/download?url=${encodeURIComponent(track.audioUrl)}&name=${encodeURIComponent(
      `${track.artist} - ${track.title}`
    )}`;

    const res = await fetch(fetchUrl);
    if (!res.ok) {
      // Fallback: direct fetch if already same-origin
      const directRes = await fetch(track.audioUrl);
      if (!directRes.ok) throw new Error('Audio fetch failed');
      const blob = await directRes.blob();
      return storeBlobInDb(db, track, blob);
    }

    const blob = await res.blob();
    return storeBlobInDb(db, track, blob);
  } catch (error) {
    console.error('[OfflineStorage] Failed to save track offline:', error);
    return false;
  }
}

function storeBlobInDb(db: IDBDatabase, track: Track, blob: Blob): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: OfflineStoredTrackRecord = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album || 'Single',
      durationMs: track.durationMs || 180000,
      format: track.format || '320kbps Master',
      artworkUrl: track.artworkUrl || '',
      audioBlob: blob,
      sizeBytes: blob.size,
      savedAt: Date.now(),
    };

    const req = store.put(record);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Checks if a specific track is already saved offline
 */
export async function isTrackSavedOffline(id: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/**
 * Retrieves a playable object URL for an offline track
 */
export async function getOfflineTrackAudioUrl(id: string): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        const record = req.result as OfflineStoredTrackRecord | undefined;
        if (record && record.audioBlob) {
          const objectUrl = URL.createObjectURL(record.audioBlob);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Lists all tracks saved for offline listening
 */
export async function getAllOfflineTracks(): Promise<Track[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = (req.result || []) as OfflineStoredTrackRecord[];
        const tracks: Track[] = records.map((rec) => ({
          id: rec.id,
          title: rec.title,
          artist: rec.artist,
          album: rec.album,
          durationMs: rec.durationMs,
          format: `${rec.format} (Offline)`,
          artworkUrl: rec.artworkUrl,
          audioUrl: '', // Will be hydrated with ObjectURL on playback
          isFavorite: false,
        }));
        resolve(tracks);
      };

      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

/**
 * Deletes a track from the offline cache
 */
export async function deleteOfflineTrack(id: string): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

/**
 * Gets total storage used and track count
 */
export async function getOfflineStorageUsage(): Promise<{ count: number; totalBytes: number; formattedSize: string }> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records = (req.result || []) as OfflineStoredTrackRecord[];
        const totalBytes = records.reduce((sum, r) => sum + (r.sizeBytes || 0), 0);
        const mb = (totalBytes / (1024 * 1024)).toFixed(1);
        resolve({
          count: records.length,
          totalBytes,
          formattedSize: `${mb} MB`,
        });
      };

      req.onerror = () => resolve({ count: 0, totalBytes: 0, formattedSize: '0 MB' });
    });
  } catch {
    return { count: 0, totalBytes: 0, formattedSize: '0 MB' };
  }
}

/**
 * Wipes all offline downloaded music
 */
export async function clearAllOfflineTracks(): Promise<boolean> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return false;
  }
}

