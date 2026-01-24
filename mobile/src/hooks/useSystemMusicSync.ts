
import { useEffect } from 'react';
import { useIslandStore } from '@/store/islandStore';

/**
 * Checks for system music or simulates a "Spotify Sync" effect.
 * In a real app, this would use 'expo-av' or native modules to read system audio state.
 * For this demo/prototype, it mocks a connection to Spotify.
 */
export function useSystemMusicSync() {
    useEffect(() => {
        // Simulate "Spotify Connected" state on mount after a short delay
        const timer = setTimeout(() => {
            useIslandStore.getState().startActivity({
                id: 'spotify-sync-1',
                type: 'music',
                title: 'Trilogy',
                subtitle: 'The Weeknd • Spotify'
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, []);
}
