package com.example.riiqxmusic.playback

import android.content.Context
import android.media.audiofx.BassBoost
import android.media.audiofx.Equalizer
import android.net.Uri
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import com.example.riiqxmusic.model.AudioSettings
import com.example.riiqxmusic.model.Track
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Controller connecting Jetpack Compose UI with the ExoPlayer audio engine.
 * Manages playlist queue, playback state, Equalizer and Bass Boost DSP effects.
 */
class MusicPlayerController(private val context: Context) {

    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private var progressJob: Job? = null

    private var player: ExoPlayer? = null
    private var equalizer: Equalizer? = null
    private var bassBoost: BassBoost? = null

    private val _currentTrack = MutableStateFlow<Track?>(null)
    val currentTrack: StateFlow<Track?> = _currentTrack.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _currentPositionMs = MutableStateFlow(0L)
    val currentPositionMs: StateFlow<Long> = _currentPositionMs.asStateFlow()

    private val _durationMs = MutableStateFlow(0L)
    val durationMs: StateFlow<Long> = _durationMs.asStateFlow()

    private val _isShuffle = MutableStateFlow(false)
    val isShuffle: StateFlow<Boolean> = _isShuffle.asStateFlow()

    private val _repeatMode = MutableStateFlow(Player.REPEAT_MODE_OFF)
    val repeatMode: StateFlow<Int> = _repeatMode.asStateFlow()

    private val _audioSettings = MutableStateFlow(AudioSettings())
    val audioSettings: StateFlow<AudioSettings> = _audioSettings.asStateFlow()

    private val playlistQueue = mutableListOf<Track>()
    private var currentTrackIndex = -1

    init {
        initializePlayer()
    }

    @OptIn(UnstableApi::class)
    private fun initializePlayer() {
        val audioAttributes = AudioAttributes.Builder()
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .setUsage(C.USAGE_MEDIA)
            .build()

        player = ExoPlayer.Builder(context)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true)
            .build().apply {
                addListener(object : Player.Listener {
                    override fun onIsPlayingChanged(playing: Boolean) {
                        _isPlaying.value = playing
                        if (playing) startProgressPolling() else stopProgressPolling()
                    }

                    override fun onPlaybackStateChanged(playbackState: Int) {
                        if (playbackState == Player.STATE_READY) {
                            _durationMs.value = player?.duration?.coerceAtLeast(0L) ?: 0L
                        } else if (playbackState == Player.STATE_ENDED) {
                            playNext()
                        }
                    }

                    override fun onPositionDiscontinuity(
                        oldPosition: Player.PositionInfo,
                        newPosition: Player.PositionInfo,
                        reason: Int
                    ) {
                        _currentPositionMs.value = newPosition.positionMs
                    }
                })

                // Audio Effects Initialization
                try {
                    val sessionId = audioSessionId
                    if (sessionId != C.AUDIO_SESSION_ID_UNSET) {
                        equalizer = Equalizer(0, sessionId).apply { enabled = true }
                        bassBoost = BassBoost(0, sessionId).apply {
                            enabled = true
                            setStrength(100)
                        }
                    }
                } catch (e: Exception) {
                    // AudioFX not supported on some virtual emulators
                    e.printStackTrace()
                }
            }
    }

    fun playTrack(track: Track, queue: List<Track> = listOf(track)) {
        playlistQueue.clear()
        playlistQueue.addAll(queue)
        currentTrackIndex = playlistQueue.indexOfFirst { it.id == track.id }.coerceAtLeast(0)

        playCurrentIndex()
    }

    private fun playCurrentIndex() {
        if (currentTrackIndex in playlistQueue.indices) {
            val track = playlistQueue[currentTrackIndex]
            _currentTrack.value = track

            val mediaMetadata = MediaMetadata.Builder()
                .setTitle(track.title)
                .setArtist(track.artist)
                .setAlbumTitle(track.album)
                .setArtworkUri(track.artworkUri)
                .build()

            val mediaItem = MediaItem.Builder()
                .setMediaId(track.id)
                .setUri(track.uri)
                .setMediaMetadata(mediaMetadata)
                .build()

            player?.run {
                setMediaItem(mediaItem)
                prepare()
                play()
            }
        }
    }

    fun togglePlayPause() {
        player?.let {
            if (it.isPlaying) it.pause() else it.play()
        }
    }

    fun playNext() {
        if (playlistQueue.isNotEmpty()) {
            currentTrackIndex = if (_isShuffle.value) {
                (0 until playlistQueue.size).random()
            } else {
                (currentTrackIndex + 1) % playlistQueue.size
            }
            playCurrentIndex()
        }
    }

    fun playPrevious() {
        if (playlistQueue.isNotEmpty()) {
            currentTrackIndex = if (currentTrackIndex - 1 < 0) {
                playlistQueue.size - 1
            } else {
                currentTrackIndex - 1
            }
            playCurrentIndex()
        }
    }

    fun seekTo(positionMs: Long) {
        player?.seekTo(positionMs)
        _currentPositionMs.value = positionMs
    }

    fun toggleShuffle() {
        val next = !_isShuffle.value
        _isShuffle.value = next
        player?.shuffleModeEnabled = next
    }

    fun toggleRepeat() {
        val next = when (_repeatMode.value) {
            Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
            Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
            else -> Player.REPEAT_MODE_OFF
        }
        _repeatMode.value = next
        player?.repeatMode = next
    }

    fun setPlaybackSpeed(speed: Float) {
        player?.setPlaybackSpeed(speed)
        _audioSettings.value = _audioSettings.value.copy(playbackSpeed = speed)
    }

    fun setBassBoostStrength(strength: Int) {
        try {
            bassBoost?.setStrength((strength * 10).toShort())
            _audioSettings.value = _audioSettings.value.copy(bassBoostLevel = strength)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun setEqualizerPreset(preset: String) {
        _audioSettings.value = _audioSettings.value.copy(equalizerPreset = preset)
    }

    private fun startProgressPolling() {
        progressJob?.cancel()
        progressJob = scope.launch {
            while (isActive) {
                player?.let {
                    _currentPositionMs.value = it.currentPosition
                    _durationMs.value = it.duration.coerceAtLeast(0L)
                }
                delay(250)
            }
        }
    }

    private fun stopProgressPolling() {
        progressJob?.cancel()
    }

    fun release() {
        stopProgressPolling()
        try {
            equalizer?.release()
            bassBoost?.release()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        player?.release()
        player = null
    }
}

