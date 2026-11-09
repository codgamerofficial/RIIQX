package com.example.riiqxmusic

import com.example.riiqxmusic.data.remote.LrcLibLyricsService
import com.example.riiqxmusic.model.Album
import com.example.riiqxmusic.model.Artist
import com.example.riiqxmusic.model.AudioSettings
import com.example.riiqxmusic.model.Track
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class MusicAppUnitTest {

    @Test
    fun testTrackModel_durationFormatting() {
        val track = Track(
            id = "test_1",
            title = "Midnight Horizon",
            artist = "Aether Waves",
            album = "Neon Dreams",
            durationMs = 214000,
            uriString = "content://media/external/audio/media/1",
            format = "FLAC",
            bitrateKbps = 1411
        )

        assertEquals("Midnight Horizon", track.title)
        assertEquals("3:34", track.formattedDuration)
        assertEquals(1411, track.bitrateKbps)
        assertEquals("FLAC", track.format)
    }

    @Test
    fun testLyricsParsing_lrcFormat() {
        val lyricsService = LrcLibLyricsService()
        val rawLrc = """
            [00:12.50] Into the city of glowing lights
            [00:25.10] Finding the rhythm in digital nights
            [00:48.00] Echoes of bass through the silent street
        """.trimIndent()

        val parsed = lyricsService.parseLrcString(rawLrc)

        assertEquals(3, parsed.size)
        assertEquals(12500L, parsed[0].timestampMs)
        assertEquals("Into the city of glowing lights", parsed[0].text)
        assertEquals(25100L, parsed[1].timestampMs)
        assertEquals(48000L, parsed[2].timestampMs)
    }

    @Test
    fun testAlbumAndArtistGroupingLogic() {
        val tracks = listOf(
            Track(
                id = "1",
                title = "Song A",
                artist = "Artist One",
                album = "Album Alpha",
                durationMs = 180000,
                uriString = "content://1"
            ),
            Track(
                id = "2",
                title = "Song B",
                artist = "Artist One",
                album = "Album Alpha",
                durationMs = 200000,
                uriString = "content://2"
            ),
            Track(
                id = "3",
                title = "Song C",
                artist = "Artist Two",
                album = "Album Beta",
                durationMs = 210000,
                uriString = "content://3"
            )
        )

        val albums = tracks.groupBy { it.album }
            .entries
            .toList()
            .mapIndexed { index, entry ->
                Album(
                    id = index.toLong(),
                    title = entry.key,
                    artist = entry.value.first().artist,
                    trackCount = entry.value.size
                )
            }

        assertEquals(2, albums.size)
        val alphaAlbum = albums.find { it.title == "Album Alpha" }
        assertNotNull(alphaAlbum)
        assertEquals(2, alphaAlbum?.trackCount)

        val artists = tracks.groupBy { it.artist }
            .entries
            .toList()
            .mapIndexed { index, entry ->
                Artist(
                    id = index.toLong(),
                    name = entry.key,
                    trackCount = entry.value.size,
                    albumCount = entry.value.map { it.album }.distinct().size
                )
            }

        assertEquals(2, artists.size)
        val artistOne = artists.find { it.name == "Artist One" }
        assertNotNull(artistOne)
        assertEquals(2, artistOne?.trackCount)
    }

    @Test
    fun testAudioSettings_defaults() {
        val settings = AudioSettings()
        assertEquals("Balanced", settings.equalizerPreset)
        assertEquals(1.0f, settings.playbackSpeed, 0.01f)
        assertTrue(settings.gaplessPlayback)
    }
}
