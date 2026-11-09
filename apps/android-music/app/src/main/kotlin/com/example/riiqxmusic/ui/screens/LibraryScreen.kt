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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.model.Album
import com.example.riiqxmusic.model.Artist
import com.example.riiqxmusic.model.Playlist
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.ArtworkCard
import com.example.riiqxmusic.ui.theme.AppleMusicRed
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary

@Composable
fun LibraryScreen(
    tracks: List<Track>,
    albums: List<Album>,
    artists: List<Artist>,
    playlists: List<Playlist>,
    onTrackSelected: (Track) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("Songs", "Albums", "Artists", "Playlists")

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        Text(
            text = "Library",
            color = TextPrimary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(start = 20.dp, top = 20.dp, bottom = 12.dp)
        )

        ScrollableTabRow(
            selectedTabIndex = selectedTab,
            containerColor = DarkBackground,
            contentColor = AppleMusicRed,
            edgePadding = 20.dp,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                    color = AppleMusicRed
                )
            }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = {
                        Text(
                            text = title,
                            fontSize = 15.sp,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal,
                            color = if (selectedTab == index) TextPrimary else TextSecondary
                        )
                    }
                )
            }
        }

        when (selectedTab) {
            0 -> {
                // Songs Tab
                LazyColumn(
                    contentPadding = PaddingValues(bottom = 120.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(tracks) { track ->
                        TrackListItem(track = track, onClick = { onTrackSelected(track) })
                    }
                }
            }
            1 -> {
                // Albums Grid
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 120.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(albums) { album ->
                        AlbumGridItem(album = album)
                    }
                }
            }
            2 -> {
                // Artists Tab
                LazyColumn(
                    contentPadding = PaddingValues(top = 12.dp, bottom = 120.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(artists) { artist ->
                        ArtistListItem(artist = artist)
                    }
                }
            }
            3 -> {
                // Playlists Grid
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 120.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(playlists) { playlist ->
                        PlaylistCard(playlist = playlist)
                    }
                }
            }
        }
    }
}

@Composable
fun AlbumGridItem(album: Album) {
    Column {
        ArtworkCard(
            artworkUri = album.artworkUriString,
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp)),
            cornerRadius = 12.dp
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = album.title,
            color = TextPrimary,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Text(
            text = "${album.artist} • ${album.trackCount} songs",
            color = TextSecondary,
            fontSize = 12.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
fun ArtistListItem(artist: Artist) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ArtworkCard(
            artworkUri = null,
            modifier = Modifier.size(54.dp),
            cornerRadius = 27.dp // circular
        )
        Spacer(modifier = Modifier.padding(start = 14.dp))
        Column {
            Text(
                text = artist.name,
                color = TextPrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold
            )
            Text(
                text = "${artist.trackCount} songs • ${artist.albumCount} albums",
                color = TextSecondary,
                fontSize = 13.sp
            )
        }
    }
}

