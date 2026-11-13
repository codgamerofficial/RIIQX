package com.example.riiqxmusic.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.riiqxmusic.data.MusicRepository
import com.example.riiqxmusic.model.Lyrics
import com.example.riiqxmusic.playback.MusicPlayerController
import com.example.riiqxmusic.ui.components.MiniPlayer
import com.example.riiqxmusic.ui.components.RiiqxBottomBar
import com.example.riiqxmusic.ui.screens.AudioSettingsScreen
import com.example.riiqxmusic.ui.screens.ExploreScreen
import com.example.riiqxmusic.ui.screens.HomeScreen
import com.example.riiqxmusic.ui.screens.LibraryScreen
import com.example.riiqxmusic.ui.screens.NowPlayingScreen
import com.example.riiqxmusic.ui.screens.SearchScreen
import com.example.riiqxmusic.ui.theme.DarkBackground

/**
 * RIIQX Mobile Master Application (RiMusic / Apple Music Hybrid Architecture)
 * Matches Screenshots 1, 2, 3, 4, 5, 6.
 */
@Composable
fun MainApp(
    repository: MusicRepository,
    playerController: MusicPlayerController
) {
    var selectedNavTab by remember { mutableIntStateOf(0) }
    var isNowPlayingExpanded by remember { mutableStateOf(false) }
    var isAudioSettingsOpen by remember { mutableStateOf(false) }

    val tracks by repository.tracks.collectAsState()
    val albums by repository.albums.collectAsState()
    val artists by repository.artists.collectAsState()
    val playlists by repository.playlists.collectAsState()

    val currentTrack by playerController.currentTrack.collectAsState()
    val isPlaying by playerController.isPlaying.collectAsState()
    val progressMs by playerController.currentPositionMs.collectAsState()
    val durationMs by playerController.durationMs.collectAsState()
    val isShuffle by playerController.isShuffle.collectAsState()
    val repeatMode by playerController.repeatMode.collectAsState()
    val audioSettings by playerController.audioSettings.collectAsState()

    var activeLyrics by remember { mutableStateOf<Lyrics?>(null) }
    val scope = rememberCoroutineScope()

    // Load library on start
    LaunchedEffect(Unit) {
        repository.loadLibrary()
    }

    // Fetch synchronized lyrics when track changes
    LaunchedEffect(currentTrack) {
        currentTrack?.let {
            activeLyrics = repository.getLyricsForTrack(it)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(DarkBackground)) {
        Scaffold(
            containerColor = DarkBackground,
            bottomBar = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .navigationBarsPadding()
                ) {
                    // Floating Mini-Player (Right above the dock)
                    currentTrack?.let { track ->
                        MiniPlayer(
                            track = track,
                            isPlaying = isPlaying,
                            progressMs = progressMs,
                            durationMs = durationMs,
                            onTogglePlayPause = { playerController.togglePlayPause() },
                            onNext = { playerController.playNext() },
                            onClick = { isNowPlayingExpanded = true }
                        )
                    }

                    // 4-Tab Floating Capsule Navigation Dock (Home, Explore, Library, Search)
                    RiiqxBottomBar(
                        selectedTab = selectedNavTab,
                        onTabSelected = { selectedNavTab = it }
                    )
                }
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                when (selectedNavTab) {
                    0 -> HomeScreen(
                        tracks = tracks,
                        playlists = playlists,
                        onTrackSelected = { track ->
                            playerController.playTrack(track, tracks)
                        },
                        onOpenSettings = { isAudioSettingsOpen = true }
                    )
                    1 -> ExploreScreen(
                        tracks = tracks,
                        onTrackSelected = { track ->
                            playerController.playTrack(track, tracks)
                        },
                        onOpenSettings = { isAudioSettingsOpen = true }
                    )
                    2 -> LibraryScreen(
                        tracks = tracks,
                        albums = albums,
                        artists = artists,
                        playlists = playlists,
                        onTrackSelected = { track ->
                            playerController.playTrack(track, tracks)
                        },
                        onOpenSettings = { isAudioSettingsOpen = true }
                    )
                    3 -> SearchScreen(
                        tracks = tracks,
                        onTrackSelected = { track ->
                            playerController.playTrack(track, tracks)
                        },
                        onOpenSettings = { isAudioSettingsOpen = true }
                    )
                }
            }
        }

        // Full-Screen Now Playing View Overlay (Screenshot 4)
        AnimatedVisibility(
            visible = isNowPlayingExpanded && currentTrack != null,
            enter = slideInVertically(initialOffsetY = { it }),
            exit = slideOutVertically(targetOffsetY = { it })
        ) {
            currentTrack?.let { track ->
                NowPlayingScreen(
                    track = track,
                    isPlaying = isPlaying,
                    progressMs = progressMs,
                    durationMs = durationMs,
                    isShuffle = isShuffle,
                    repeatMode = repeatMode,
                    lyrics = activeLyrics,
                    onTogglePlayPause = { playerController.togglePlayPause() },
                    onNext = { playerController.playNext() },
                    onPrevious = { playerController.playPrevious() },
                    onSeek = { playerController.seekTo(it) },
                    onToggleShuffle = { playerController.toggleShuffle() },
                    onToggleRepeat = { playerController.toggleRepeat() },
                    onToggleFavorite = { repository.toggleFavorite(track.id) },
                    onOpenAudioSettings = { isAudioSettingsOpen = true },
                    onDismiss = { isNowPlayingExpanded = false }
                )
            }
        }

        // Settings & Audio Quality Bottom Modal Overlay (Screenshot 5)
        AnimatedVisibility(
            visible = isAudioSettingsOpen,
            enter = slideInVertically(initialOffsetY = { it }),
            exit = slideOutVertically(targetOffsetY = { it })
        ) {
            AudioSettingsScreen(
                settings = audioSettings,
                onPresetSelected = { playerController.setEqualizerPreset(it) },
                onBassBoostChange = { playerController.setBassBoostStrength(it) },
                onSpeedSelected = { playerController.setPlaybackSpeed(it) },
                onDismiss = { isAudioSettingsOpen = false }
            )
        }
    }
}
