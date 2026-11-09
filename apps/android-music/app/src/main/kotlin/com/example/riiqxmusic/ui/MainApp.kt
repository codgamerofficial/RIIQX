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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LibraryMusic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.data.MusicRepository
import com.example.riiqxmusic.model.Lyrics
import com.example.riiqxmusic.playback.MusicPlayerController
import com.example.riiqxmusic.ui.components.MiniPlayer
import com.example.riiqxmusic.ui.screens.AudioSettingsScreen
import com.example.riiqxmusic.ui.screens.HomeScreen
import com.example.riiqxmusic.ui.screens.LibraryScreen
import com.example.riiqxmusic.ui.screens.NowPlayingScreen
import com.example.riiqxmusic.ui.screens.SearchScreen
import com.example.riiqxmusic.ui.theme.AppleMusicRed
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.DarkSurface
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextSecondary
import kotlinx.coroutines.launch

@Composable
fun MainApp(
    repository: MusicRepository,
    playerController: MusicPlayerController
) {
    var selectedNavTab by remember { mutableStateOf(0) }
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

    // Load local tracks on launch
    LaunchedEffect(Unit) {
        repository.loadLibrary()
    }

    // Fetch synchronized lyrics when track changes
    LaunchedEffect(currentTrack) {
        currentTrack?.let {
            activeLyrics = repository.getLyricsForTrack(it)
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Scaffold(
            bottomBar = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DarkBackground)
                ) {
                    // Floating Mini-Player
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

                    // Glassmorphic Bottom Navigation Bar
                    NavigationBar(
                        containerColor = DarkSurface.copy(alpha = 0.95f),
                        contentColor = AppleMusicRed,
                        modifier = Modifier.navigationBarsPadding()
                    ) {
                        NavigationBarItem(
                            selected = selectedNavTab == 0,
                            onClick = { selectedNavTab = 0 },
                            icon = { Icon(Icons.Default.Home, contentDescription = "Listen Now") },
                            label = { Text("Listen Now", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = AppleMusicRed,
                                selectedTextColor = AppleMusicRed,
                                unselectedIconColor = TextMuted,
                                unselectedTextColor = TextMuted,
                                indicatorColor = Color.Transparent
                            )
                        )
                        NavigationBarItem(
                            selected = selectedNavTab == 1,
                            onClick = { selectedNavTab = 1 },
                            icon = { Icon(Icons.Default.LibraryMusic, contentDescription = "Library") },
                            label = { Text("Library", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = AppleMusicRed,
                                selectedTextColor = AppleMusicRed,
                                unselectedIconColor = TextMuted,
                                unselectedTextColor = TextMuted,
                                indicatorColor = Color.Transparent
                            )
                        )
                        NavigationBarItem(
                            selected = selectedNavTab == 2,
                            onClick = { selectedNavTab = 2 },
                            icon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                            label = { Text("Search", fontSize = 11.sp) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = AppleMusicRed,
                                selectedTextColor = AppleMusicRed,
                                unselectedIconColor = TextMuted,
                                unselectedTextColor = TextMuted,
                                indicatorColor = Color.Transparent
                            )
                        )
                    }
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
                        }
                    )
                    1 -> LibraryScreen(
                        tracks = tracks,
                        albums = albums,
                        artists = artists,
                        playlists = playlists,
                        onTrackSelected = { track ->
                            playerController.playTrack(track, tracks)
                        }
                    )
                    2 -> SearchScreen(
                        tracks = tracks,
                        onTrackSelected = { track ->
                            playerController.playTrack(track, tracks)
                        }
                    )
                }
            }
        }

        // Full-Screen Now Playing View Overlay
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

        // Audio Settings & Equalizer Bottom Modal Overlay
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

