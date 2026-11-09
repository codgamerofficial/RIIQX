package com.example.riiqxmusic.data.supabase

import com.example.riiqxmusic.model.Playlist
import com.example.riiqxmusic.model.Track
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * Syncs user favorites, playlists, and listening history with the isolated Supabase music schema.
 */
class MusicCloudSync(
    private val supabaseUrl: String = "https://your-project.supabase.co",
    private val anonKey: String = "your-anon-key"
) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(5, TimeUnit.SECONDS)
        .build()

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    suspend fun recordListeningHistory(track: Track, userId: String = "usr_guest_music") = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply {
                put("user_id", userId)
                put("track_id", track.id)
                put("title", track.title)
                put("artist", track.artist)
                put("album", track.album)
                put("played_ms", track.durationMs)
                put("completed", true)
            }

            val request = Request.Builder()
                .url("$supabaseUrl/rest/v1/music_listening_history")
                .header("apikey", anonKey)
                .header("Authorization", "Bearer $anonKey")
                .header("Content-Type", "application/json")
                .header("Prefer", "return=minimal")
                .post(json.toString().toRequestBody(jsonMediaType))
                .build()

            client.newCall(request).execute().close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    suspend fun syncFavorites(userId: String = "usr_guest_music"): List<String> = withContext(Dispatchers.IO) {
        val favoriteIds = mutableListOf<String>()
        try {
            val request = Request.Builder()
                .url("$supabaseUrl/rest/v1/music_favorites?select=track_id&user_id=eq.$userId")
                .header("apikey", anonKey)
                .header("Authorization", "Bearer $anonKey")
                .get()
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "[]"
                val jsonArray = JSONArray(body)
                for (i in 0 until jsonArray.length()) {
                    val item = jsonArray.getJSONObject(i)
                    favoriteIds.add(item.getString("track_id"))
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        favoriteIds
    }
}

