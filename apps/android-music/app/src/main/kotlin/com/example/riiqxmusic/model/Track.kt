package com.example.riiqxmusic.model

import android.net.Uri
import kotlinx.serialization.Serializable

/**
 * Domain model representing an audio track in RIIQX MUSIC.
 */
data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val durationMs: Long,
    val uriString: String,
    val artworkUriString: String? = null,
    val year: Int = 0,
    val trackNumber: Int = 0,
    val bitrateKbps: Int = 320,
    val format: String = "AUDIO",
    val isFavorite: Boolean = false
) {
    val uri: Uri get() = Uri.parse(uriString)
    val artworkUri: Uri? get() = artworkUriString?.let { Uri.parse(it) }

    val formattedDuration: String
        get() {
            val totalSeconds = durationMs / 1000
            val minutes = totalSeconds / 60
            val seconds = totalSeconds % 60
            return "%d:%02d".format(minutes, seconds)
        }
}

data class Album(
    val id: Long,
    val title: String,
    val artist: String,
    val artworkUriString: String? = null,
    val trackCount: Int = 0,
    val year: Int = 0
)

data class Artist(
    val id: Long,
    val name: String,
    val trackCount: Int = 0,
    val albumCount: Int = 0
)

data class Playlist(
    val id: String,
    val title: String,
    val description: String = "",
    val coverUriString: String? = null,
    val tracks: List<Track> = emptyList(),
    val isCloudSynced: Boolean = false
)

data class LyricLine(
    val timestampMs: Long,
    val text: String
)

data class Lyrics(
    val trackId: String,
    val plainLyrics: String? = null,
    val syncedLyrics: List<LyricLine> = emptyList(),
    val isSynced: Boolean = syncedLyrics.isNotEmpty()
)

data class AudioSettings(
    val equalizerPreset: String = "Balanced",
    val bassBoostLevel: Int = 0, // 0 to 100
    val virtualizerLevel: Int = 0,
    val playbackSpeed: Float = 1.0f,
    val sleepTimerMinutes: Int = 0,
    val gaplessPlayback: Boolean = true
)

