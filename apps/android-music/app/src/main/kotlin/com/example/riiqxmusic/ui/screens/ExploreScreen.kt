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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.model.Track
import com.example.riiqxmusic.ui.components.RiiqxProfileAvatar
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TileChill
import com.example.riiqxmusic.ui.theme.TileCommute
import com.example.riiqxmusic.ui.theme.TileDiwali
import com.example.riiqxmusic.ui.theme.TileEnergize
import com.example.riiqxmusic.ui.theme.TileFeelGood
import com.example.riiqxmusic.ui.theme.TileFocus
import com.example.riiqxmusic.ui.theme.TileGaming
import com.example.riiqxmusic.ui.theme.TileParty
import com.example.riiqxmusic.ui.theme.TileRomance
import com.example.riiqxmusic.ui.theme.TileSad

data class ExploreCategory(
    val title: String,
    val subtitle: String,
    val color: Color
)

val EXPLORE_CATEGORIES = listOf(
    ExploreCategory("Chill", "Coffee Shop Blend", TileChill),
    ExploreCategory("Commute", "Feel-Good Hip Hop", TileCommute),
    ExploreCategory("Diwali", "Bollywood Party", TileDiwali),
    ExploreCategory("Energize", "Pump-up Pop", TileEnergize),
    ExploreCategory("Feel good", "Sunshine Indie", TileFeelGood),
    ExploreCategory("Focus", "Lofi Loft", TileFocus),
    ExploreCategory("Gaming", "Gaming Hits", TileGaming),
    ExploreCategory("Party", "Bollywood Dance", TileParty),
    ExploreCategory("Romance", "Bollywood Romance", TileRomance),
    ExploreCategory("Sad", "Bollywood Melancholy", TileSad),
    ExploreCategory("African", "Afrobeats & Heat", Color(0xFF5A442E)),
    ExploreCategory("Arabic", "Khaleeji & Levantine", Color(0xFF6B5824))
)

/**
 * Explore Screen (Matches Screenshot 2 with 2-column atmospheric genre/mood tiles)
 */
@Composable
fun ExploreScreen(
    tracks: List<Track>,
    onTrackSelected: (Track) -> Unit,
    onOpenSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 140.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Big Apple Music Style Title: "Explore"
        item(span = { GridItemSpan(2) }) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Explore",
                    color = TextPrimary,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = (-0.5).sp
                )

                RiiqxProfileAvatar(
                    modifier = Modifier.size(36.dp),
                    onClick = onOpenSettings
                )
            }
        }

        // 2-Column Grid of Mood/Genre Tiles
        items(EXPLORE_CATEGORIES) { category ->
            ExploreTileCard(
                category = category,
                onClick = {
                    if (tracks.isNotEmpty()) {
                        val track = tracks.random()
                        onTrackSelected(track)
                    }
                }
            )
        }
    }
}

@Composable
fun ExploreTileCard(
    category: ExploreCategory,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(110.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(
                Brush.horizontalGradient(
                    listOf(
                        category.color,
                        category.color.copy(alpha = 0.65f)
                    )
                )
            )
            .clickable { onClick() }
            .padding(14.dp)
    ) {
        // Top: Large Category Name (e.g. "Chill", "Commute")
        Text(
            text = category.title,
            color = Color.White,
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.align(Alignment.TopStart)
        )

        // Bottom: Subtitle / Description (e.g. "Coffee Shop Blend")
        Text(
            text = category.subtitle,
            color = Color.White.copy(alpha = 0.85f),
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            maxLines = 1,
            modifier = Modifier.align(Alignment.BottomStart)
        )
    }
}
