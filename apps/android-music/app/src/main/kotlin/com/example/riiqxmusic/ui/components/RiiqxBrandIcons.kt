package com.example.riiqxmusic.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.riiqxmusic.ui.theme.LosslessBadgeBg
import com.example.riiqxmusic.ui.theme.LosslessBadgeText

/**
 * 3-Wave Flowing Sound Logo (Matches the brand mark in top-left of screenshots)
 */
@Composable
fun RiiqxWaveLogo(
    modifier: Modifier = Modifier.size(32.dp),
    tint: Color = Color.White
) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val strokeWidth = (h * 0.12f).coerceAtLeast(3f)

        // 3 flowing wave curves stacked vertically
        val waveOffsets = listOf(0.24f, 0.50f, 0.76f)
        val waveWidths = listOf(0.95f, 0.85f, 0.75f)

        waveOffsets.forEachIndexed { index, yRatio ->
            val curY = h * yRatio
            val waveW = w * waveWidths[index]
            val startX = (w - waveW) / 2f
            val endX = startX + waveW

            val path = Path().apply {
                moveTo(startX, curY)
                cubicTo(
                    startX + waveW * 0.35f, curY - h * 0.10f,
                    startX + waveW * 0.65f, curY + h * 0.10f,
                    endX, curY
                )
            }

            drawPath(
                path = path,
                color = tint,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
        }
    }
}

/**
 * Vibrant Circular Profile Avatar with "QX" / Riiqx badge (Matches top-right in screenshots)
 */
@Composable
fun RiiqxProfileAvatar(
    modifier: Modifier = Modifier.size(34.dp),
    onClick: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(
                Brush.sweepGradient(
                    listOf(
                        Color(0xFF8B5CF6),
                        Color(0xFFEC4899),
                        Color(0xFFF59E0B),
                        Color(0xFF8B5CF6)
                    )
                )
            )
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(Color(0xFF141418)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "QX",
                color = Color.White,
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = (-0.5).sp
            )
        }
    }
}

/**
 * Sleek Audio Quality Pill Badge (e.g. "🎧 High quality" / "320kbps Master" / "Lossless")
 */
@Composable
fun AudioQualityBadge(
    text: String = "High quality",
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(LosslessBadgeBg)
            .padding(horizontal = 10.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "🎧",
            fontSize = 11.sp
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = text,
            color = LosslessBadgeText,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

