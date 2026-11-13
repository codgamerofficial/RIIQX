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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.ArtworkCard
import com.example.riiqxmusic.ui.components.RiiqxProfileAvatar
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.DarkCard
import com.example.riiqxmusic.ui.theme.DarkSurface
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary

/**
 * Search Screen (Matches Screenshot 3 with Capsule Search, YouTube/Library chips, and Recent Searches)
 */
@Composable
fun SearchScreen(
    tracks: List<Track>,
    onTrackSelected: (Track) -> Unit,
    onOpenSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilterChip by remember { mutableStateOf(0) }
    val filterChips = listOf("YouTube", "Library", "Addons")

    val recentSearches = remember {
        mutableStateListOf(
            *tracks.take(10).toTypedArray()
        )
    }

    val filteredTracks = remember(searchQuery, tracks) {
        if (searchQuery.isBlank()) {
            emptyList()
        } else {
            tracks.filter {
                it.title.contains(searchQuery, ignoreCase = true) ||
                it.artist.contains(searchQuery, ignoreCase = true) ||
                it.album.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(14.dp))

        // Top Search Capsule Input Bar with QX Avatar (Screenshot 3)
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = {
                    Text(
                        "Artists, Songs, Lyrics and More",
                        color = TextMuted,
                        fontSize = 14.sp
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Clear",
                                tint = TextSecondary
                            )
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(26.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = DarkSurface,
                    unfocusedContainerColor = DarkSurface,
                    focusedBorderColor = Color(0x33FFFFFF),
                    unfocusedBorderColor = Color.Transparent,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.width(12.dp))

            RiiqxProfileAvatar(
                modifier = Modifier.size(36.dp),
                onClick = onOpenSettings
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Filter Chips: YouTube | Library | Addons
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            filterChips.forEachIndexed { index, title ->
                val isSelected = selectedFilterChip == index
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) Color(0xFF333338) else Color.Transparent)
                        .clickable { selectedFilterChip = index }
                        .padding(horizontal = 18.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = title,
                        color = if (isSelected) Color.White else TextMuted,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // When not actively searching: Show "Recent searches" + Clear button
        if (searchQuery.isBlank()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent searches",
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )

                if (recentSearches.isNotEmpty()) {
                    Text(
                        text = "Clear",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.clickable { recentSearches.clear() }
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            LazyColumn(
                contentPadding = PaddingValues(bottom = 140.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(recentSearches, key = { it.id }) { track ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onTrackSelected(track) }
                            .padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        ArtworkCard(
                            artworkUri = track.artworkUriString,
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(8.dp)),
                            cornerRadius = 8.dp
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
                                text = "${track.artist} • ${track.album}",
                                color = TextSecondary,
                                fontSize = 12.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        IconButton(
                            onClick = { recentSearches.remove(track) },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Remove",
                                tint = TextMuted,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
        } else {
            // Live Search Results List
            LazyColumn(
                contentPadding = PaddingValues(bottom = 140.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(filteredTracks) { track ->
                    RecentTrackRow(
                        track = track,
                        onClick = { onTrackSelected(track) }
                    )
                }
            }
        }
    }
}
