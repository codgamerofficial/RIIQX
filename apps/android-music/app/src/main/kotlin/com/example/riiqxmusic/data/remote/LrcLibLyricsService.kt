package com.example.riiqxmusic.data.remote

import com.example.riiqxmusic.model.LyricLine
import com.example.riiqxmusic.model.Lyrics
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.net.URLEncoder
import java.util.concurrent.TimeUnit
import java.util.regex.Pattern

/**
 * LRCLIB API Client for fetching synchronized and plain lyrics.
 * Spec: https://lrclib.net/docs
 */
class LrcLibLyricsService {

    private val client = OkHttpClient.Builder()
        .connectTimeout(6, TimeUnit.SECONDS)
        .readTimeout(6, TimeUnit.SECONDS)
        .build()

    private val lrcPattern = Pattern.compile("""\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)""")

    suspend fun fetchLyrics(
        trackId: String,
        trackName: String,
        artistName: String,
        albumName: String,
        durationSeconds: Long
    ): Lyrics = withContext(Dispatchers.IO) {
        try {
            val encodedTrack = URLEncoder.encode(trackName, "UTF-8")
            val encodedArtist = URLEncoder.encode(artistName, "UTF-8")
            val encodedAlbum = URLEncoder.encode(albumName, "UTF-8")

            val url = "https://lrclib.net/api/get?track_name=$encodedTrack&artist_name=$encodedArtist&album_name=$encodedAlbum&duration=$durationSeconds"

            val request = Request.Builder()
                .url(url)
                .header("User-Agent", "RIIQX-Music-Android/1.0 (https://riiqx.vercel.app)")
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: ""
                val json = JSONObject(body)

                val plainLyrics = if (json.has("plainLyrics") && !json.isNull("plainLyrics")) {
                    json.getString("plainLyrics")
                } else null

                val syncedLyricsRaw = if (json.has("syncedLyrics") && !json.isNull("syncedLyrics")) {
                    json.getString("syncedLyrics")
                } else null

                val parsedSyncedLines = parseLrcString(syncedLyricsRaw)

                return@withContext Lyrics(
                    trackId = trackId,
                    plainLyrics = plainLyrics,
                    syncedLyrics = parsedSyncedLines,
                    isSynced = parsedSyncedLines.isNotEmpty()
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Fallback demo synchronized lyrics for sample audio
        Lyrics(
            trackId = trackId,
            plainLyrics = "Lost in the rhythm of the glowing night\nNeon reflections in the morning light\nEvery bass drop echoes deep inside\nWe found our sanctuary where dreams collide",
            syncedLyrics = listOf(
                LyricLine(0, "♪ (Ambient Synth Intro) ♪"),
                LyricLine(12000, "Lost in the rhythm of the glowing night"),
                LyricLine(24000, "Neon reflections in the morning light"),
                LyricLine(36000, "Every bass drop echoes deep inside"),
                LyricLine(48000, "We found our sanctuary where dreams collide"),
                LyricLine(62000, "♪ (Melodic Synth Climax) ♪"),
                LyricLine(85000, "Lost in the sound... Forever unbounded"),
                LyricLine(110000, "♪ (Deep Outro Fade) ♪")
            ),
            isSynced = true
        )
    }

    internal fun parseLrcString(raw: String?): List<LyricLine> {
        if (raw.isNullOrBlank()) return emptyList()

        val lines = mutableListOf<LyricLine>()
        raw.lines().forEach { line ->
            val matcher = lrcPattern.matcher(line.trim())
            if (matcher.matches()) {
                val minutes = matcher.group(1)?.toLongOrNull() ?: 0L
                val seconds = matcher.group(2)?.toLongOrNull() ?: 0L
                val millisString = matcher.group(3) ?: "0"
                val millis = if (millisString.length == 2) {
                    millisString.toLong() * 10
                } else {
                    millisString.toLong()
                }

                val timestampMs = (minutes * 60 + seconds) * 1000 + millis
                val text = matcher.group(4)?.trim() ?: ""

                lines.add(LyricLine(timestampMs, text))
            }
        }

        return lines.sortedBy { it.timestampMs }
    }
}

