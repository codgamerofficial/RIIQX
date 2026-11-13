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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Extension
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.model.AudioSettings
import com.example.riiqxmusic.ui.components.RiiqxProfileAvatar
import com.example.riiqxmusic.ui.theme.AccentGreen
import com.example.riiqxmusic.ui.theme.DarkBackground
import com.example.riiqxmusic.ui.theme.DarkCard
import com.example.riiqxmusic.ui.theme.DarkCardBorder
import com.example.riiqxmusic.ui.theme.TextMuted
import com.example.riiqxmusic.ui.theme.TextPrimary
import com.example.riiqxmusic.ui.theme.TextSecondary

/**
 * Settings Screen (Matches Screenshot 5 with Grouped iOS/Apple-style cards, Audio Quality controls)
 */
@Composable
fun AudioSettingsScreen(
    settings: AudioSettings,
    onPresetSelected: (String) -> Unit,
    onBassBoostChange: (Int) -> Unit,
    onSpeedSelected: (Float) -> Unit,
    onDismiss: () -> Unit
) {
    var searchSettingsQuery by remember { mutableStateOf("") }
    var directSourceStream by remember { mutableStateOf(false) }
    var dolbyAtmosEnabled by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
    ) {
        // Back Button & Large "Settings" Headline (Screenshot 5)
        item {
            IconButton(
                onClick = onDismiss,
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF1C1C20))
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = "Settings",
                color = TextPrimary,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = (-0.5).sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Capsule "Search settings" input
            OutlinedTextField(
                value = searchSettingsQuery,
                onValueChange = { searchSettingsQuery = it },
                placeholder = { Text("Search settings", color = TextMuted, fontSize = 14.sp) },
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = "Search", tint = TextMuted, modifier = Modifier.size(20.dp))
                },
                singleLine = true,
                shape = RoundedCornerShape(22.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = DarkCard,
                    unfocusedContainerColor = DarkCard,
                    focusedBorderColor = Color(0x33FFFFFF),
                    unfocusedBorderColor = Color.Transparent,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(20.dp))
        }

        // Group 1: Account & Integrations + Listen Together (Screenshot 5)
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkCard)
            ) {
                // Account & Integrations
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RiiqxProfileAvatar(modifier = Modifier.size(32.dp))
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Account & integrations",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "@riiqxstudio",
                            color = TextSecondary,
                            fontSize = 13.sp
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowRight,
                        contentDescription = "Open",
                        tint = TextMuted
                    )
                }

                Divider(color = Color(0x1AFFFFFF), thickness = 0.8.dp, modifier = Modifier.padding(start = 62.dp))

                // Listen Together
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Group,
                        contentDescription = "Listen together",
                        tint = Color.White,
                        modifier = Modifier.size(26.dp)
                    )
                    Spacer(modifier = Modifier.width(18.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Listen together",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Share a code and play the same music, in time",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.KeyboardArrowRight,
                        contentDescription = "Open",
                        tint = TextMuted
                    )
                }
            }
        }

        // Section Title: "AUDIO QUALITY" (Screenshot 5)
        item {
            Spacer(modifier = Modifier.height(24.dp))
            Text(
                text = "AUDIO QUALITY",
                color = TextMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 8.dp)
            )
        }

        // Group 2: Audio Quality Controls (Sources, Direct Stream, Wi-Fi, Mobile Data, Dolby Atmos)
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkCard)
            ) {
                // Sources
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Extension,
                        contentDescription = "Sources",
                        tint = Color.White,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Sources",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Where audio comes from and the order used",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                    Icon(Icons.Default.KeyboardArrowRight, contentDescription = "Open", tint = TextMuted)
                }

                Divider(color = Color(0x1AFFFFFF), thickness = 0.8.dp, modifier = Modifier.padding(start = 54.dp))

                // Direct Source Stream Toggle
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Direct Source Stream",
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Switch(
                        checked = directSourceStream,
                        onCheckedChange = { directSourceStream = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = AccentGreen,
                            uncheckedThumbColor = Color.White,
                            uncheckedTrackColor = Color(0xFF333338)
                        )
                    )
                }

                Divider(color = Color(0x1AFFFFFF), thickness = 0.8.dp, modifier = Modifier.padding(start = 16.dp))

                // On Wi-Fi: Lossless
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Wifi, contentDescription = "Wi-Fi", tint = Color.White, modifier = Modifier.size(22.dp))
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(text = "On Wi-Fi", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "Lossless", color = TextSecondary, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(Icons.Default.KeyboardArrowRight, contentDescription = "Open", tint = TextMuted)
                    }
                }

                Divider(color = Color(0x1AFFFFFF), thickness = 0.8.dp, modifier = Modifier.padding(start = 54.dp))

                // On mobile data: [IN USE] Lossless
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Tune, contentDescription = "Mobile Data", tint = Color.White, modifier = Modifier.size(22.dp))
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(text = "On mobile data", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(Color(0xFF28282E))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "IN USE",
                                color = TextSecondary,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "Lossless", color = TextSecondary, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(Icons.Default.KeyboardArrowRight, contentDescription = "Open", tint = TextMuted)
                    }
                }

                Divider(color = Color(0x1AFFFFFF), thickness = 0.8.dp, modifier = Modifier.padding(start = 54.dp))

                // Dolby Atmos Surround
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
                        Text(
                            text = "Dolby Atmos",
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Play the more immersive, surround version of a song when there is one.",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                    Switch(
                        checked = dolbyAtmosEnabled,
                        onCheckedChange = { dolbyAtmosEnabled = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = AccentGreen,
                            uncheckedThumbColor = Color.White,
                            uncheckedTrackColor = Color(0xFF333338)
                        )
                    )
                }
            }
        }

        // Group 3: Downloads & Content Preferences (Screenshot 5)
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(DarkCard)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Download, contentDescription = "Downloads", tint = Color.White, modifier = Modifier.size(22.dp))
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(text = "Downloads", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                    Icon(Icons.Default.KeyboardArrowRight, contentDescription = "Open", tint = TextMuted)
                }

                Divider(color = Color(0x1AFFFFFF), thickness = 0.8.dp, modifier = Modifier.padding(start = 54.dp))

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { }
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Content Preferences", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                    Icon(Icons.Default.KeyboardArrowRight, contentDescription = "Open", tint = TextMuted)
                }
            }
        }
    }
}
