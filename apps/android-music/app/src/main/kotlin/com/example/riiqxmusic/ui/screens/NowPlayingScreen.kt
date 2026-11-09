package com.example.riiqxmusic.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Equalizer
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.Lyrics
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.RepeatOne
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.media3.common.Player
import com.example.riiqxmusic.model.Lyrics
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.ArtworkCard
import com.example.riiqxmusic.ui.theme.AppleMusicPink
import com.example.riiqxmusic.ui.theme.AppleMusicRed
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.LosslessBadgeBg
import com.example.riiqxmusic.ui.theme.LosslessBadgeText
import com.example.riiqxmusic.ui.theme.NeonCyan
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NowPlayingScreen(
    track: Track,
    isPlaying: Boolean,
    progressMs: Long,
    durationMs: Long,
    isShuffle: Boolean,
    repeatMode: Int,
    lyrics: Lyrics?,
    onTogglePlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrevious: () -> Unit,
    onSeek: (Long) -> Unit,
    onToggleShuffle: () -> Unit,
    onToggleRepeat: () -> Unit,
    onToggleFavorite: () -> Unit,
    onOpenAudioSettings: () -> Unit,
    onDismiss: () -> Unit
) {
    var showLyricsView by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val lyricsListState = rememberLazyListState()

    // Determine currently singing lyric index
    val activeLyricIndex = remember(progressMs, lyrics) {
        if (lyrics != null && lyrics.syncedLyrics.isNotEmpty()) {
            val idx = lyrics.syncedLyrics.indexOfLast { it.timestampMs <= progressMs }
            if (idx >= 0) idx else 0
        } else -1
    }

    // Auto-scroll lyrics to keep active line centered
    LaunchedEffect(activeLyricIndex, showLyricsView) {
        if (showLyricsView && activeLyricIndex >= 0 && lyrics?.syncedLyrics?.isNotEmpty() == true) {
            lyricsListState.animateScrollToItem((activeLyricIndex - 2).coerceAtLeast(0))
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFF1B1822),
                        Color(0xFF0F1014),
                        DarkBackground
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onDismiss) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowDown,
                        contentDescription = "Dismiss",
                        tint = TextSecondary,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "PLAYING FROM",
                        color = TextMuted,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.2.sp
                    )
                    Text(
                        text = track.album,
                        color = TextPrimary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                // Audio Settings / Equalizer
                IconButton(onClick = onOpenAudioSettings) {
                    Icon(
                        imageVector = Icons.Default.Equalizer,
                        contentDescription = "Audio Equalizer",
                        tint = TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Center: Album Art OR Real-Time Lyrics View
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                if (showLyricsView) {
                    // Synchronized Scrolling Lyrics
                    if (lyrics != null && lyrics.syncedLyrics.isNotEmpty()) {
                        LazyColumn(
                            state = lyricsListState,
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.spacedBy(16.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(vertical = 40.dp)
                        ) {
                            itemsIndexed(lyrics.syncedLyrics) { index, lyricLine ->
                                val isActive = index == activeLyricIndex
                                Text(
                                    text = lyricLine.text,
                                    color = if (isActive) Color.White else TextMuted.copy(alpha = 0.5f),
                                    fontSize = if (isActive) 24.sp else 18.sp,
                                    fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium,
                                    lineHeight = if (isActive) 32.sp else 26.sp,
                                    textAlign = TextAlign.Start,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            onSeek(lyricLine.timestampMs)
                                        }
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    } else {
                        // Plain Lyrics fallback
                        Text(
                            text = lyrics?.plainLyrics ?: "Searching for synchronized lyrics...",
                            color = TextSecondary,
                            fontSize = 16.sp,
                            lineHeight = 26.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(24.dp)
                        )
                    }
                } else {
                    // Large High-Res Artwork
                    ArtworkCard(
                        artworkUri = track.artworkUriString,
                        modifier = Modifier
                            .fillMaxWidth(0.92f)
                            .aspectRatio(1f),
                        cornerRadius = 24.dp,
                        elevation = 16.dp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Lossless Quality Badge
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(LosslessBadgeBg)
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "${track.format.uppercase()} • ${track.bitrateKbps} KBPS",
                    color = LosslessBadgeText,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Track Title, Artist, & Favorite Heart
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = track.title,
                        color = TextPrimary,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = track.artist,
                        color = TextSecondary,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Normal,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                IconButton(onClick = onToggleFavorite) {
                    Icon(
                        imageVector = if (track.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (track.isFavorite) AppleMusicRed else TextSecondary,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Scrubber Slider
            val progressRatio = if (durationMs > 0) (progressMs.toFloat() / durationMs.toFloat()).coerceIn(0f, 1f) else 0f
            Slider(
                value = progressRatio,
                onValueChange = { ratio ->
                    onSeek((ratio * durationMs).toLong())
                },
                modifier = Modifier.fillMaxWidth(),
                colors = SliderDefaults.colors(
                    thumbColor = Color.White,
                    activeTrackColor = AppleMusicRed,
                    inactiveTrackColor = Color.White.copy(alpha = 0.2f)
                )
            )

            // Scrubber Time Labels (Elapsed and Remaining)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = formatTime(progressMs),
                    color = TextMuted,
                    fontSize = 12.sp
                )
                Text(
                    text = "-${formatTime((durationMs - progressMs).coerceAtLeast(0L))}",
                    color = TextMuted,
                    fontSize = 12.sp
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Main Playback Controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Shuffle Toggle
                IconButton(onClick = onToggleShuffle) {
                    Icon(
                        imageVector = Icons.Default.Shuffle,
                        contentDescription = "Shuffle",
                        tint = if (isShuffle) AppleMusicRed else TextMuted,
                        modifier = Modifier.size(24.dp)
                    )
                }

                // Previous Track
                IconButton(onClick = onPrevious) {
                    Icon(
                        imageVector = Icons.Default.SkipPrevious,
                        contentDescription = "Previous Track",
                        tint = TextPrimary,
                        modifier = Modifier.size(38.dp)
                    )
                }

                // Large Play/Pause Button
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                listOf(AppleMusicRed, AppleMusicPink)
                            )
                        )
                        .clickable { onTogglePlayPause() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = Color.White,
                        modifier = Modifier.size(36.dp)
                    )
                }

                // Next Track
                IconButton(onClick = onNext) {
                    Icon(
                        imageVector = Icons.Default.SkipNext,
                        contentDescription = "Next Track",
                        tint = TextPrimary,
                        modifier = Modifier.size(38.dp)
                    )
                }

                // Repeat Toggle
                IconButton(onClick = onToggleRepeat) {
                    Icon(
                        imageVector = if (repeatMode == Player.REPEAT_MODE_ONE) Icons.Default.RepeatOne else Icons.Default.Repeat,
                        contentDescription = "Repeat",
                        tint = if (repeatMode != Player.REPEAT_MODE_OFF) AppleMusicRed else TextMuted,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Bottom Actions Bar (Synchronized Lyrics toggle)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (showLyricsView) AppleMusicRed.copy(alpha = 0.25f) else Color.White.copy(alpha = 0.08f))
                        .clickable { showLyricsView = !showLyricsView }
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Lyrics,
                            contentDescription = "Lyrics",
                            tint = if (showLyricsView) AppleMusicRed else TextSecondary,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (showLyricsView) "View Album Art" else "Live Lyrics",
                            color = if (showLyricsView) AppleMusicRed else TextSecondary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}

private fun formatTime(millis: Long): String {
    val totalSeconds = millis / 1000
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return "%d:%02d".format(minutes, seconds)
}

