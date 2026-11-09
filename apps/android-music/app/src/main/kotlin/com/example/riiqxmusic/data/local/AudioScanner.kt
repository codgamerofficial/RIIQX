package com.example.riiqxmusic.data.local

import android.content.ContentUris
import android.content.Context
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
import com.example.riiqxmusic.model.Album
import com.example.riiqxmusic.model.Artist
import com.example.riiqxmusic.model.Track
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Scans local audio storage using Android MediaStore ContentResolver.
 * Supports MP3, FLAC, AAC, WAV, OGG, OPUS with artwork resolution.
 */
class AudioScanner(private val context: Context) {

    suspend fun scanLocalTracks(): List<Track> = withContext(Dispatchers.IO) {
        val tracks = mutableListOf<Track>()

        val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            MediaStore.Audio.Media.getContentUri(MediaStore.VOLUME_EXTERNAL)
        } else {
            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
        }

        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.ALBUM_ID,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.YEAR,
            MediaStore.Audio.Media.TRACK,
            MediaStore.Audio.Media.MIME_TYPE
        )

        val selection = "${MediaStore.Audio.Media.IS_MUSIC} != 0"
        val sortOrder = "${MediaStore.Audio.Media.TITLE} ASC"

        try {
            context.contentResolver.query(
                collection,
                projection,
                selection,
                null,
                sortOrder
            )?.use { cursor ->
                val idCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                val titleCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                val artistCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                val albumCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                val albumIdCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)
                val durationCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                val yearCol = cursor.getColumnIndex(MediaStore.Audio.Media.YEAR)
                val trackCol = cursor.getColumnIndex(MediaStore.Audio.Media.TRACK)
                val mimeCol = cursor.getColumnIndex(MediaStore.Audio.Media.MIME_TYPE)

                val artworkBaseUri = Uri.parse("content://media/external/audio/albumart")

                while (cursor.moveToNext()) {
                    val id = cursor.getLong(idCol)
                    val title = cursor.getString(titleCol) ?: "Unknown Track"
                    val artist = cursor.getString(artistCol) ?: "Unknown Artist"
                    val album = cursor.getString(albumCol) ?: "Unknown Album"
                    val albumId = cursor.getLong(albumIdCol)
                    val duration = cursor.getLong(durationCol)
                    val year = if (yearCol != -1) cursor.getInt(yearCol) else 0
                    val trackNum = if (trackCol != -1) cursor.getInt(trackCol) else 0
                    val mimeType = if (mimeCol != -1) cursor.getString(mimeCol) ?: "audio/mpeg" else "audio/mpeg"

                    val contentUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id)
                    val artworkUri = ContentUris.withAppendedId(artworkBaseUri, albumId)

                    val format = when {
                        mimeType.contains("flac", ignoreCase = true) -> "FLAC Lossless"
                        mimeType.contains("wav", ignoreCase = true) -> "WAV Lossless"
                        mimeType.contains("aac", ignoreCase = true) -> "AAC"
                        mimeType.contains("ogg", ignoreCase = true) || mimeType.contains("opus", ignoreCase = true) -> "OGG/OPUS"
                        else -> "MP3"
                    }

                    if (duration > 5000) { // filter out short sound effects
                        tracks.add(
                            Track(
                                id = id.toString(),
                                title = title,
                                artist = artist,
                                album = album,
                                durationMs = duration,
                                uriString = contentUri.toString(),
                                artworkUriString = artworkUri.toString(),
                                year = year,
                                trackNumber = trackNum,
                                bitrateKbps = if (format.contains("Lossless")) 1411 else 320,
                                format = format
                            )
                        )
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // If local library is empty or permission not granted, provide premium demo tracks
        if (tracks.isEmpty()) {
            tracks.addAll(getSampleTracks())
        }

        tracks
    }

    fun groupIntoAlbums(tracks: List<Track>): List<Album> {
        return tracks.groupBy { it.album }
            .entries
            .toList()
            .mapIndexed { index, entry ->
                val albumTitle = entry.key
                val albumTracks = entry.value
                val first = albumTracks.first()
                Album(
                    id = index.toLong(),
                    title = albumTitle,
                    artist = first.artist,
                    artworkUriString = first.artworkUriString,
                    trackCount = albumTracks.size,
                    year = first.year
                )
            }
    }

    fun groupIntoArtists(tracks: List<Track>): List<Artist> {
        return tracks.groupBy { it.artist }
            .entries
            .toList()
            .mapIndexed { index, entry ->
                val artistName = entry.key
                val artistTracks = entry.value
                val albumsCount = artistTracks.map { it.album }.distinct().size
                Artist(
                    id = index.toLong(),
                    name = artistName,
                    trackCount = artistTracks.size,
                    albumCount = albumsCount
                )
            }
    }

    private fun getSampleTracks(): List<Track> {
        return listOf(
            Track(
                id = "sample_1",
                title = "Midnight Horizon",
                artist = "Aether Waves",
                album = "Neon Dreamscapes",
                durationMs = 214000,
                uriString = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
                artworkUriString = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&auto=format&fit=crop&q=80",
                year = 2026,
                trackNumber = 1,
                bitrateKbps = 320,
                format = "FLAC Lossless",
                isFavorite = true
            ),
            Track(
                id = "sample_2",
                title = "Starlight Symphony",
                artist = "Celeste Audio",
                album = "Galactic Echoes",
                durationMs = 186000,
                uriString = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=electronic-future-beats-117997.mp3",
                artworkUriString = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
                year = 2026,
                trackNumber = 2,
                bitrateKbps = 320,
                format = "Lossless 24-bit/96kHz"
            ),
            Track(
                id = "sample_3",
                title = "Urban Mirage",
                artist = "Velvet Pulse",
                album = "City Lights Nocturne",
                durationMs = 245000,
                uriString = "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-night-123456.mp3",
                artworkUriString = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
                year = 2025,
                trackNumber = 3,
                bitrateKbps = 320,
                format = "320 kbps MP3",
                isFavorite = true
            ),
            Track(
                id = "sample_4",
                title = "Ethereal Descent",
                artist = "Astral Drift",
                album = "Quantum State",
                durationMs = 198000,
                uriString = "https://cdn.pixabay.com/download/audio/2023/04/18/audio_651a2bfdc3.mp3?filename=ambient-piano-amp-strings-10711.mp3",
                artworkUriString = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
                year = 2026,
                trackNumber = 4,
                bitrateKbps = 320,
                format = "FLAC Lossless"
            )
        )
    }
}

