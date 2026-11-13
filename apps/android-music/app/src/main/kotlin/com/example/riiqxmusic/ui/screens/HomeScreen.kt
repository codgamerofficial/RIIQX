package com.example.riiqxmusic.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.model.Playlist
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.ArtworkCard
import com.example.riiqxmusic.ui.components.RiiqxProfileAvatar
import com.example.riiqxmusic.ui.components.RiiqxWaveLogo
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.FeaturedOrange
import com.example.riiqxmusic.ui.theme.FeaturedOrangeLight
import com.example.riiqxmusic.ui.theme.FeaturedPurple
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary

@Composable
fun HomeScreen(
    tracks: List<Track>,
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
        // Top App Bar with 3-Wave Logo & QX Avatar (Screenshot 1)
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                RiiqxWaveLogo(
                    modifier = Modifier.size(36.dp),
                    tint = Color.White
                )

                RiiqxProfileAvatar(
                    modifier = Modifier.size(36.dp),
                    onClick = onOpenSettings
                )
            }
        }

        // Section Title: "Top Picks for You"
        item {
            Text(
                text = "Top Picks for You",
                color = TextPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 10.dp)
            )
        }

        // Horizontal Carousel: Featured Orange Artist Mix + New Release Mix
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Card 1: Featuring Arijit Singh & Similar Artists
                item {
                    FeaturedArtistCard(
                        title = "Arijit Singh & Similar Artists",
                        subtitle = "Featuring Arijit Singh",
                        backgroundColor = FeaturedOrange,
                        artistUris = tracks.take(3).map { it.artworkUriString },
                        onClick = {
                            if (tracks.isNotEmpty()) onTrackSelected(tracks.first())
                        }
                    )
                }

                // Card 2: New Release Mix
                item {
                    NewReleaseMixCard(
                        title = "New Release Mix",
                        subtitle = "Made for you",
                        artists = "Guru Randhawa, Karan Aujla, Arijit",
                        onClick = {
                            if (tracks.size > 1) onTrackSelected(tracks[1])
                        }
                    )
                }
            }
        }

        // Section Title: "Recents"
        item {
            Spacer(modifier = Modifier.height(24.dp))
            Text(
                text = "Recents",
                color = TextPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
            )
        }

        // Vertical List: Recent Tracks with 3-dots Menu
        items(tracks) { track ->
            RecentTrackRow(
                track = track,
                onClick = { onTrackSelected(track) }
            )
        }
    }
}

/**
 * Featured Artist Mix Card with 3 circular artist portraits (Screenshot 1)
 */
@Composable
fun FeaturedArtistCard(
    title: String,
    subtitle: String,
    backgroundColor: Color,
    artistUris: List<String?>,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(260.dp)
            .height(340.dp)
            .clip(RoundedCornerShape(26.dp))
            .background(backgroundColor)
            .clickable { onClick() }
            .padding(20.dp)
    ) {
        // Small 3-wave logo in top right
        RiiqxWaveLogo(
            modifier = Modifier
                .size(24.dp)
                .align(Alignment.TopEnd),
            tint = Color.White.copy(alpha = 0.85f)
        )

        // Center: 3 overlapping artist circle cuts
        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(bottom = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Main Top Circle
            ArtworkCard(
                artworkUri = artistUris.getOrNull(0),
                modifier = Modifier
                    .size(110.dp)
                    .clip(CircleShape),
                cornerRadius = 55.dp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Two bottom circles side-by-side
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                ArtworkCard(
                    artworkUri = artistUris.getOrNull(1),
                    modifier = Modifier
                        .size(65.dp)
                        .clip(CircleShape),
                    cornerRadius = 32.dp
                )
                ArtworkCard(
                    artworkUri = artistUris.getOrNull(2),
                    modifier = Modifier
                        .size(65.dp)
                        .clip(CircleShape),
                    cornerRadius = 32.dp
                )
            }
        }

        // Bottom text: Subtitle and Title
        Column(
            modifier = Modifier.align(Alignment.BottomStart)
        ) {
            Text(
                text = subtitle,
                color = Color.White.copy(alpha = 0.8f),
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = title,
                color = Color.White,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

/**
 * Secondary Featured Mix Card (Screenshot 1)
 */
@Composable
fun NewReleaseMixCard(
    title: String,
    subtitle: String,
    artists: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(260.dp)
            .height(340.dp)
            .clip(RoundedCornerShape(26.dp))
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFF2C1E3A),
                        Color(0xFF4A1942),
                        Color(0xFF1E1026)
                    )
                )
            )
            .clickable { onClick() }
            .padding(20.dp)
    ) {
        RiiqxWaveLogo(
            modifier = Modifier
                .size(24.dp)
                .align(Alignment.TopEnd),
            tint = Color.White.copy(alpha = 0.85f)
        )

        Column(
            modifier = Modifier.align(Alignment.CenterStart)
        ) {
            Text(
                text = "New\nRelease\nMix",
                color = Color.White,
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                lineHeight = 36.sp
            )
        }

        Column(
            modifier = Modifier.align(Alignment.BottomStart)
        ) {
            Text(
                text = subtitle,
                color = Color.White.copy(alpha = 0.8f),
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = artists,
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

/**
 * Recent Track Row with rounded artwork, title, artist, and 3-dots icon
 */
@Composable
fun RecentTrackRow(
    track: Track,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 20.dp, vertical = 7.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ArtworkCard(
            artworkUri = track.artworkUriString,
            modifier = Modifier
                .size(52.dp)
                .clip(RoundedCornerShape(10.dp)),
            cornerRadius = 10.dp
        )

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = track.title,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = track.artist,
                color = TextSecondary,
                fontSize = 13.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }

        IconButton(
            onClick = { /* Track Options Menu */ },
            modifier = Modifier.size(36.dp)
        ) {
            Icon(
                imageVector = Icons.Default.MoreVert,
                contentDescription = "Options",
                tint = TextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
