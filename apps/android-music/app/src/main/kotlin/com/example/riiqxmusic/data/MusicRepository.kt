package com.example.riiqxmusic.data

import android.content.Context
import com.example.riiqxmusic.data.local.AudioScanner
import com.example.riiqxmusic.data.remote.LrcLibLyricsService
import com.example.riiqxmusic.data.supabase.MusicCloudSync
import com.example.riiqxmusic.model.Album
import com.example.riiqxmusic.model.Artist
import com.example.riiqxmusic.model.Lyrics
import com.example.riiqxmusic.model.Playlist
import com.example.riiqxmusic.model.Track
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class MusicRepository(context: Context) {

    private val audioScanner = AudioScanner(context)
    private val lyricsService = LrcLibLyricsService()
    private val cloudSync = MusicCloudSync()

    private val _tracks = MutableStateFlow<List<Track>>(emptyList())
    val tracks: StateFlow<List<Track>> = _tracks.asStateFlow()

    private val _albums = MutableStateFlow<List<Album>>(emptyList())
    val albums: StateFlow<List<Album>> = _albums.asStateFlow()

    private val _artists = MutableStateFlow<List<Artist>>(emptyList())
    val artists: StateFlow<List<Artist>> = _artists.asStateFlow()

    private val _playlists = MutableStateFlow<List<Playlist>>(emptyList())
    val playlists: StateFlow<List<Playlist>> = _playlists.asStateFlow()

    private val _favorites = MutableStateFlow<Set<String>>(emptySet())
    val favorites: StateFlow<Set<String>> = _favorites.asStateFlow()

    private val lyricsCache = mutableMapOf<String, Lyrics>()

    suspend fun loadLibrary() {
        val loadedTracks = audioScanner.scanLocalTracks()
        _tracks.value = loadedTracks
        _albums.value = audioScanner.groupIntoAlbums(loadedTracks)
        _artists.value = audioScanner.groupIntoArtists(loadedTracks)

        // Seed initial curated playlists
        val favTracks = loadedTracks.filter { it.isFavorite }
        _favorites.value = favTracks.map { it.id }.toSet()

        _playlists.value = listOf(
            Playlist(
                id = "pl_favorites",
                title = "Favorite Tracks",
                description = "Your starred and loved songs",
                coverUriString = loadedTracks.firstOrNull()?.artworkUriString,
                tracks = favTracks
            ),
            Playlist(
                id = "pl_chill",
                title = "Late Night Chill",
                description = "Atmospheric beats & acoustic melodies",
                coverUriString = loadedTracks.getOrNull(1)?.artworkUriString,
                tracks = loadedTracks.take(3)
            )
        )
    }

    fun toggleFavorite(trackId: String) {
        val currentFavs = _favorites.value.toMutableSet()
        if (currentFavs.contains(trackId)) {
            currentFavs.remove(trackId)
        } else {
            currentFavs.add(trackId)
        }
        _favorites.value = currentFavs

        // Update tracks list state
        _tracks.value = _tracks.value.map { track ->
            if (track.id == trackId) {
                track.copy(isFavorite = currentFavs.contains(trackId))
            } else track
        }
    }

    suspend fun getLyricsForTrack(track: Track): Lyrics {
        lyricsCache[track.id]?.let { return it }

        val fetched = lyricsService.fetchLyrics(
            trackId = track.id,
            trackName = track.title,
            artistName = track.artist,
            albumName = track.album,
            durationSeconds = track.durationMs / 1000
        )
        lyricsCache[track.id] = fetched
        return fetched
    }
}

