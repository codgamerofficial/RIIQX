package com.example.riiqxmusic.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.ui.theme.FloatingDockBg
import com.example.riiqxmusic.ui.theme.NavPillActive
import com.example.riiqxmusic.ui.theme.NavPillInactive

data class NavigationTabItem(
    val title: String,
    val icon: ImageVector
)

/**
 * Floating Capsule Bottom Navigation Dock
 * Matches the floating dark rounded pill with active pill highlight in screenshots 1-6.
 */
@Composable
fun RiiqxBottomBar(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val tabs = listOf(
        NavigationTabItem("Home", Icons.Default.Home),
        NavigationTabItem("Explore", Icons.Default.Home), // Will render custom grid icon if preferred
        NavigationTabItem("Library", Icons.Default.Home),
        NavigationTabItem("Search", Icons.Default.Search)
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(32.dp))
            .background(FloatingDockBg)
            .border(1.dp, Color(0x22FFFFFF), RoundedCornerShape(32.dp))
            .padding(horizontal = 6.dp, vertical = 5.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            tabs.forEachIndexed { index, tab ->
                val isSelected = selectedTab == index

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(24.dp))
                        .background(if (isSelected) NavPillActive else Color.Transparent)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            onTabSelected(index)
                        }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        when (index) {
                            0 -> Icon(
                                imageVector = Icons.Default.Home,
                                contentDescription = "Home",
                                tint = if (isSelected) Color.White else NavPillInactive,
                                modifier = Modifier.size(20.dp)
                            )
                            1 -> ExploreGridIcon(
                                tint = if (isSelected) Color.White else NavPillInactive,
                                modifier = Modifier.size(20.dp)
                            )
                            2 -> LibraryArchiveIcon(
                                tint = if (isSelected) Color.White else NavPillInactive,
                                modifier = Modifier.size(20.dp)
                            )
                            3 -> Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search",
                                tint = if (isSelected) Color.White else NavPillInactive,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(3.dp))

                        Text(
                            text = tab.title,
                            fontSize = 10.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = if (isSelected) Color.White else NavPillInactive
                        )
                    }
                }
            }
        }
    }
}

/**
 * 4-Square Grid Icon for "Explore" tab
 */
@Composable
fun ExploreGridIcon(
    tint: Color,
    modifier: Modifier = Modifier.size(20.dp)
) {
    androidx.compose.foundation.Canvas(modifier = modifier) {
        val gap = size.width * 0.16f
        val rectSize = (size.width - gap) / 2f
        val radius = androidx.compose.ui.geometry.CornerRadius(rectSize * 0.25f, rectSize * 0.25f)

        // 4 small rounded squares
        drawRoundRect(
            color = tint,
            topLeft = androidx.compose.ui.geometry.Offset(0f, 0f),
            size = androidx.compose.ui.geometry.Size(rectSize, rectSize),
            cornerRadius = radius
        )
        drawRoundRect(
            color = tint,
            topLeft = androidx.compose.ui.geometry.Offset(rectSize + gap, 0f),
            size = androidx.compose.ui.geometry.Size(rectSize, rectSize),
            cornerRadius = radius
        )
        drawRoundRect(
            color = tint,
            topLeft = androidx.compose.ui.geometry.Offset(0f, rectSize + gap),
            size = androidx.compose.ui.geometry.Size(rectSize, rectSize),
            cornerRadius = radius
        )
        drawRoundRect(
            color = tint,
            topLeft = androidx.compose.ui.geometry.Offset(rectSize + gap, rectSize + gap),
            size = androidx.compose.ui.geometry.Size(rectSize, rectSize),
            cornerRadius = radius
        )
    }
}

/**
 * Library / Archive Box Icon for "Library" tab
 */
@Composable
fun LibraryArchiveIcon(
    tint: Color,
    modifier: Modifier = Modifier.size(20.dp)
) {
    androidx.compose.foundation.Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height

        // Top cap
        drawRoundRect(
            color = tint,
            topLeft = androidx.compose.ui.geometry.Offset(w * 0.15f, h * 0.10f),
            size = androidx.compose.ui.geometry.Size(w * 0.70f, h * 0.20f),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(3f, 3f)
        )
        // Main container
        drawRoundRect(
            color = tint,
            topLeft = androidx.compose.ui.geometry.Offset(w * 0.20f, h * 0.35f),
            size = androidx.compose.ui.geometry.Size(w * 0.60f, h * 0.55f),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(4f, 4f)
        )
    }
}
