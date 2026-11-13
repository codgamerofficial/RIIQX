package com.example.riiqxmusic.ui.screens

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.material.icons.filled.Cast
import androidx.compose.material.icons.filled.ChatBubbleOutline
import androidx.compose.material.icons.filled.FormatListBulleted
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarOutline
import androidx.compose.material.icons.filled.VolumeDown
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import com.example.riiqxmusic.model.Lyrics
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.ArtworkCard
import com.example.riiqxmusic.ui.components.AudioQualityBadge
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary

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
    var showFullLyricsView by remember { mutableStateOf(false) }
    var volume by remember { mutableFloatStateOf(0.85f) }
    var isFavorite by remember { mutableStateOf(false) }
    val lyricsListState = rememberLazyListState()

    // Determine currently singing lyric index
    val activeLyricIndex = remember(progressMs, lyrics) {
        if (lyrics != null && lyrics.syncedLyrics.isNotEmpty()) {
            val idx = lyrics.syncedLyrics.indexOfLast { it.timestampMs <= progressMs }
            if (idx >= 0) idx else 0
        } else -1
    }

    val activeLyricText = remember(activeLyricIndex, lyrics) {
        if (activeLyricIndex >= 0 && lyrics?.syncedLyrics?.indices?.contains(activeLyricIndex) == true) {
            lyrics.syncedLyrics[activeLyricIndex].text
        } else {
            "Lyrics synced via LRCLIB Master"
        }
    }

    // Auto-scroll lyrics to keep active line centered
    LaunchedEffect(activeLyricIndex, showFullLyricsView) {
        if (showFullLyricsView && activeLyricIndex >= 0 && lyrics?.syncedLyrics?.isNotEmpty() == true) {
            lyricsListState.animateScrollToItem((activeLyricIndex - 2).coerceAtLeast(0))
        }
    }

    val progressRatio = if (durationMs > 0) (progressMs.toFloat() / durationMs.toFloat()).coerceIn(0f, 1f) else 0f
    val remainingMs = (durationMs - progressMs).coerceAtLeast(0L)

    // Dynamic gradient mesh background (Screenshot 4)
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFF6B1A1E), // Deep rich crimson/amber
                        Color(0xFF381014),
                        Color(0xFF180A0C),
                        DarkBackground
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Bar: Dismiss arrow on left, Record Label / Source at center (Screenshot 4)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp)
            ) {
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.align(Alignment.CenterStart)
                ) {
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowDown,
                        contentDescription = "Dismiss",
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                }

                Column(
                    modifier = Modifier.align(Alignment.Center),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "BEATOP RECORDS",
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.2.sp
                    )
                    Text(
                        text = "Playing from Search",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Center Area: Large Artwork OR Fullscreen Synced Lyrics
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                if (showFullLyricsView) {
                    // Full Synchronized Lyrics View
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
                                    color = if (isActive) Color.White else Color.White.copy(alpha = 0.4f),
                                    fontSize = if (isActive) 24.sp else 18.sp,
                                    fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium,
                                    lineHeight = if (isActive) 32.sp else 26.sp,
                                    textAlign = TextAlign.Start,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { onSeek(lyricLine.timestampMs) }
                                        .padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    } else {
                        Text(
                            text = lyrics?.plainLyrics ?: "Searching for synchronized lyrics...",
                            color = Color.White.copy(alpha = 0.8f),
                            fontSize = 16.sp,
                            lineHeight = 26.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(24.dp)
                        )
                    }
                } else {
                    // Large Rounded-3xl Artwork (Screenshot 4)
                    ArtworkCard(
                        artworkUri = track.artworkUriString,
                        modifier = Modifier
                            .fillMaxWidth(0.92f)
                            .aspectRatio(1f)
                            .clip(RoundedCornerShape(28.dp)),
                        cornerRadius = 28.dp,
                        elevation = 20.dp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Song Title, Artist & Actions (Favorite Star, 3-dots) (Screenshot 4)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = track.title,
                        color = Color.White,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = track.artist,
                        color = Color.White.copy(alpha = 0.7f),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Star / Favorite
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(Color(0x33FFFFFF))
                            .clickable {
                                isFavorite = !isFavorite
                                onToggleFavorite()
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isFavorite) Icons.Default.Star else Icons.Default.StarOutline,
                            contentDescription = "Favorite",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    // 3 Dots Menu
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(Color(0x33FFFFFF))
                            .clickable { onOpenAudioSettings() },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.MoreVert,
                            contentDescription = "Options",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Synced Lyric Sneak-Peek Line (Screenshot 4: "तेरे गालों पे बिखरी हैं ज़ुल्फ़ें बनके बादल >")
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { showFullLyricsView = !showFullLyricsView }
                    .padding(vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = activeLyricText,
                    color = Color.White.copy(alpha = 0.85f),
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f)
                )
                Icon(
                    imageVector = Icons.Default.KeyboardArrowRight,
                    contentDescription = "Lyrics View",
                    tint = Color.White.copy(alpha = 0.7f),
                    modifier = Modifier.size(18.dp)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Progress Slider Bar (Screenshot 4)
            Slider(
                value = progressRatio,
                onValueChange = { ratio ->
                    val seekTarget = (ratio * durationMs).toLong()
                    onSeek(seekTarget)
                },
                colors = SliderDefaults.colors(
                    thumbColor = Color.White,
                    activeTrackColor = Color.White,
                    inactiveTrackColor = Color(0x33FFFFFF)
                ),
                modifier = Modifier.fillMaxWidth()
            )

            // Timeline Timestamps & Audio Quality Badge (Screenshot 4)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = formatMs(progressMs),
                    color = Color.White.copy(alpha = 0.7f),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )

                AudioQualityBadge(
                    text = "High quality"
                )

                Text(
                    text = "-${formatMs(remainingMs)}",
                    color = Color.White.copy(alpha = 0.7f),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Transport Controls: Previous, Big Play/Pause, Next (Screenshot 4)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onPrevious,
                    modifier = Modifier.size(54.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.SkipPrevious,
                        contentDescription = "Previous",
                        tint = Color.White,
                        modifier = Modifier.size(38.dp)
                    )
                }

                IconButton(
                    onClick = onTogglePlayPause,
                    modifier = Modifier.size(72.dp)
                ) {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = Color.White,
                        modifier = Modifier.size(52.dp)
                    )
                }

                IconButton(
                    onClick = onNext,
                    modifier = Modifier.size(54.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.SkipNext,
                        contentDescription = "Next",
                        tint = Color.White,
                        modifier = Modifier.size(38.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Volume Slider Bar with Speaker Icons (Screenshot 4)
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.VolumeDown,
                    contentDescription = "Volume Low",
                    tint = Color.White.copy(alpha = 0.6f),
                    modifier = Modifier.size(20.dp)
                )

                Slider(
                    value = volume,
                    onValueChange = { volume = it },
                    colors = SliderDefaults.colors(
                        thumbColor = Color.White,
                        activeTrackColor = Color.White,
                        inactiveTrackColor = Color(0x33FFFFFF)
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 8.dp)
                )

                Icon(
                    imageVector = Icons.Default.VolumeUp,
                    contentDescription = "Volume High",
                    tint = Color.White.copy(alpha = 0.6f),
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Bottom Actions Bar: Lyrics, Cast, Queue (Screenshot 4)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { showFullLyricsView = !showFullLyricsView }) {
                    Icon(
                        imageVector = Icons.Default.ChatBubbleOutline,
                        contentDescription = "Lyrics",
                        tint = if (showFullLyricsView) Color(0xFFFA243C) else Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }

                IconButton(onClick = { /* AirPlay / Cast */ }) {
                    Icon(
                        imageVector = Icons.Default.Cast,
                        contentDescription = "Cast",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }

                IconButton(onClick = { /* Queue */ }) {
                    Icon(
                        imageVector = Icons.Default.FormatListBulleted,
                        contentDescription = "Queue",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Bottom Device Label: "RIIQX's Phone" (Screenshot 4)
            Text(
                text = "RIIQX's Phone",
                color = Color.White.copy(alpha = 0.5f),
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

private fun formatMs(ms: Long): String {
    val totalSeconds = (ms / 1000).coerceAtLeast(0)
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return String.format("%d:%02d", minutes, seconds)
}
