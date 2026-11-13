package com.example.riiqxmusic.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.model.Album
import com.example.riiqxmusic.model.Artist
import com.example.riiqxmusic.model.Playlist
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.RiiqxProfileAvatar
import com.example.riiqxmusic.ui.components.RiiqxWaveLogo
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.DarkCard
import com.example.riiqxmusic.ui.theme.DarkCardBorder
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary

/**
 * Library Screen (Matches Screenshot 6 with Listening Experience cards, action rows, and playlist cards)
 */
@Composable
fun LibraryScreen(
    tracks: List<Track>,
    albums: List<Album>,
    artists: List<Artist>,
    playlists: List<Playlist>,
    onTrackSelected: (Track) -> Unit,
    onOpenSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground),
        contentPadding = PaddingValues(bottom = 140.dp)
    ) {
        // Top Header: Title "Library" + History Icon + QX Profile Avatar (Screenshot 6)
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Library",
                    color = TextPrimary,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = (-0.5).sp
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = Icons.Default.History,
                            contentDescription = "Listening History",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    RiiqxProfileAvatar(
                        modifier = Modifier.size(36.dp),
                        onClick = onOpenSettings
                    )
                }
            }
        }

        // Horizontal Stats Cards: "YOUR LISTENING EXPERIENCE"
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Card 1: Listening stats
                item {
                    Box(
                        modifier = Modifier
                            .width(280.dp)
                            .height(180.dp)
                            .clip(RoundedCornerShape(22.dp))
                            .background(
                                Brush.verticalGradient(
                                    listOf(
                                        Color(0xFF2C2F36),
                                        Color(0xFF1B1D22)
                                    )
                                )
                            )
                            .padding(18.dp)
                    ) {
                        // Top label & wave logo
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Text(
                                text = "YOUR LISTENING EXPERIENCE",
                                color = TextMuted,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                            RiiqxWaveLogo(
                                modifier = Modifier.size(22.dp),
                                tint = Color.White.copy(alpha = 0.7f)
                            )
                        }

                        // Big minutes counter
                        Column(
                            modifier = Modifier.align(Alignment.CenterStart)
                        ) {
                            Text(
                                text = "3,196",
                                color = Color.White,
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = "MINUTES LISTENED",
                                color = TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        // Bottom member info
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .align(Alignment.BottomStart),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Bottom
                        ) {
                            Column {
                                Text(
                                    text = "RIIQX STUDIO",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "1,143 plays • 2026",
                                    color = TextMuted,
                                    fontSize = 10.sp
                                )
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "MEMBER SINCE",
                                    color = TextMuted,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "09/26",
                                    color = Color.White,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }

                // Card 2: Top Song
                item {
                    Box(
                        modifier = Modifier
                            .width(280.dp)
                            .height(180.dp)
                            .clip(RoundedCornerShape(22.dp))
                            .background(
                                Brush.verticalGradient(
                                    listOf(
                                        Color(0xFF382A3A),
                                        Color(0xFF1E1722)
                                    )
                                )
                            )
                            .padding(18.dp)
                    ) {
                        Text(
                            text = "YOUR LISTENING STATS",
                            color = TextMuted,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp,
                            modifier = Modifier.align(Alignment.TopStart)
                        )

                        Column(
                            modifier = Modifier.align(Alignment.CenterStart)
                        ) {
                            Text(
                                text = "Barbaad\nSaiyaan",
                                color = Color.White,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                lineHeight = 28.sp
                            )
                            Text(
                                text = "TOP SONG",
                                color = Color(0xFFEC4899),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Column(modifier = Modifier.align(Alignment.BottomStart)) {
                            Text(
                                text = "RIIQX STUDIO",
                                color = Color.White,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Jubin Nautiyal, Tulsi Kumar",
                                color = TextMuted,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(20.dp)) }

        // Navigation Action Rows: Downloads, Local Music, Spotify
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                LibraryNavRow(
                    icon = Icons.Default.FileDownload,
                    title = "Downloads",
                    onClick = {}
                )
                LibraryNavRow(
                    icon = Icons.Default.Folder,
                    title = "Local Music",
                    onClick = {}
                )
                LibraryNavRow(
                    icon = Icons.Default.History,
                    title = "Spotify",
                    onClick = {}
                )
            }
        }

        item { Spacer(modifier = Modifier.height(24.dp)) }

        // Section Title: "Playlists"
        item {
            Text(
                text = "Playlists",
                color = TextPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
            )
        }

        // Horizontal Playlist Action Cards: + New playlist, Import Spotify, Liked Music
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Card 1: + New playlist
                item {
                    PlaylistActionCard(
                        icon = Icons.Default.Add,
                        title = "New playlist",
                        subtitle = "Saved to YouTube Music...",
                        iconBg = Color(0xFF1E1E22),
                        onClick = {}
                    )
                }

                // Card 2: Import Spotify
                item {
                    PlaylistActionCard(
                        icon = Icons.Default.Folder,
                        title = "Import Spotify",
                        subtitle = "From a playlist link",
                        iconBg = Color(0xFF1DB954),
                        onClick = {}
                    )
                }

                // Card 3: Liked Music
                item {
                    PlaylistActionCard(
                        icon = Icons.Default.ThumbUp,
                        title = "Liked Music",
                        subtitle = "Auto playlist",
                        iconBg = Color(0xFF8B5CF6),
                        onClick = {
                            if (tracks.isNotEmpty()) onTrackSelected(tracks.first())
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun LibraryNavRow(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = Color.White,
            modifier = Modifier.size(24.dp)
        )

        Spacer(modifier = Modifier.width(16.dp))

        Text(
            text = title,
            color = Color.White,
            fontSize = 17.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.weight(1f)
        )

        Icon(
            imageVector = Icons.Default.KeyboardArrowRight,
            contentDescription = "Open",
            tint = TextMuted,
            modifier = Modifier.size(20.dp)
        )
    }
}

@Composable
fun PlaylistActionCard(
    icon: ImageVector,
    title: String,
    subtitle: String,
    iconBg: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(150.dp)
            .height(180.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(DarkCard)
            .border(1.dp, DarkCardBorder, RoundedCornerShape(18.dp))
            .clickable { onClick() }
            .padding(14.dp)
    ) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(iconBg)
                .align(Alignment.TopStart),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = Color.White,
                modifier = Modifier.size(30.dp)
            )
        }

        Column(modifier = Modifier.align(Alignment.BottomStart)) {
            Text(
                text = title,
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                color = TextMuted,
                fontSize = 11.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
