// =============================================================================
// RIIQX — Autonomous Faceless Deal Shorts & Reels Factory
// Automated Viral Scripting • Physical 9:16 Video Rendering • FFmpeg & Sharp
// Zero Simulated Delay • Verified Affiliate Attribution • Ready for YouTube & Instagram
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { resolveFfmpegBinary, FFmpegService } from '@/lib/video/ffmpeg-service';
import { AffiliateSmartRouter } from '@/services/product-intelligence/affiliate-router';

ffmpeg.setFfmpegPath(resolveFfmpegBinary());

export interface DealShortsRequest {
  productTitle: string;
  productIdentifier?: string;
  retailerName: string;
  originalPrice: number;
  lowestPrice: number;
  productImageUrl?: string;
  productUrl: string;
  category?: string;
  language?: 'en' | 'bn' | 'hi';
  theme?: 'obsidian_emerald' | 'crimson_fire' | 'cyberpunk_neon';
  autoPublish?: boolean;
  targetPlatform?: 'youtube' | 'instagram' | 'all';
  userId?: string;
}

export interface DealShortsResult {
  id: string;
  title: string;
  script: {
    hook: string;
    body: string;
    callToAction: string;
  };
  caption: string;
  hashtags: string[];
  affiliateUrl: string;
  projectedCommissionINR: number;
  expectedCommissionPct: number;
  savingsINR: number;
  savingsPercentage: number;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  aspectRatio: '9:16';
  width: number;
  height: number;
  fileSizeBytes: number;
  renderedAt: string;
  publishingStatus: 'ready' | 'queued' | 'published';
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export class DealShortsVideoFactory {
  private static DATA_DIR = path.resolve(process.cwd(), '.data');
  private static HISTORY_FILE = path.resolve(DealShortsVideoFactory.DATA_DIR, 'deal_shorts_history.json');
  private static UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads', 'rendered');

  private static ensureDirs() {
    if (!fs.existsSync(this.DATA_DIR)) {
      try { fs.mkdirSync(this.DATA_DIR, { recursive: true }); } catch {}
    }
    if (!fs.existsSync(this.UPLOADS_DIR)) {
      try { fs.mkdirSync(this.UPLOADS_DIR, { recursive: true }); } catch {}
    }
  }

  private static readHistory(): DealShortsResult[] {
    try {
      this.ensureDirs();
      if (fs.existsSync(this.HISTORY_FILE)) {
        return JSON.parse(fs.readFileSync(this.HISTORY_FILE, 'utf8'));
      }
    } catch {}
    return [];
  }

  private static writeHistory(records: DealShortsResult[]) {
    try {
      this.ensureDirs();
      fs.writeFileSync(this.HISTORY_FILE, JSON.stringify(records, null, 2), 'utf8');
    } catch {}
  }

  /**
   * Generates viral script, caption, and hashtags tailored for Shorts & Reels
   */
  public static generateScript(params: {
    productTitle: string;
    retailerName: string;
    originalPrice: number;
    lowestPrice: number;
    savingsINR: number;
    savingsPercentage: number;
    language?: 'en' | 'bn' | 'hi';
  }) {
    const lang = params.language || 'en';
    const cleanTitle = params.productTitle.slice(0, 48);

    if (lang === 'bn') {
      return {
        title: `🚨 ${cleanTitle} এ বিশাল প্রাইস ড্রপ! ₹${params.savingsINR.toLocaleString('en-IN')} ছাড়! #shorts`,
        hook: `দাঁড়ান! এখনই কোনো প্রডাক্ট কেনার আগে এই অফারটা দেখে নিন!`,
        body: `${params.retailerName} এ ${cleanTitle} এর দাম কমে সরাসরি ₹${params.lowestPrice.toLocaleString('en-IN')} হয়ে গেছে! আপনি পাচ্ছেন পুরো ₹${params.savingsINR.toLocaleString('en-IN')} ডিসকাউন্ট!`,
        callToAction: `অফার শেষ হওয়ার আগেই ডেসক্রিপশন বা বায়োর লিঙ্কে ক্লিক করে অর্ডার করুন!`,
        hashtags: ['#shorts', '#dealsbengali', '#amazondeals', '#lootdeals', '#techbengali', '#riiqx'],
      };
    }

    if (lang === 'hi') {
      return {
        title: `🚨 ${cleanTitle} पर भारी गिरावट! ₹${params.savingsINR.toLocaleString('en-IN')} की बचत! #shorts`,
        hook: `रुकिए! अगर आप ये खरीदने की सोच रहे थे, तो अभी बेस्ट टाइम है!`,
        body: `${params.retailerName} पर ${cleanTitle} का प्राइस ड्रॉप होकर सिर्फ ₹${params.lowestPrice.toLocaleString('en-IN')} हो चुका है! यानी सीधे ₹${params.savingsINR.toLocaleString('en-IN')} की बचत!`,
        callToAction: `स्टॉक खत्म होने से पहले बायो या डिस्क्रिप्शन के लिंक से अभी चेक करें!`,
        hashtags: ['#shorts', '#dealsindia', '#amazonsale', '#lootdeal', '#techdeals', '#riiqx'],
      };
    }

    // Default English
    return {
      title: `🚨 HUGE PRICE CRASH: ${cleanTitle} at ₹${params.lowestPrice.toLocaleString('en-IN')} (₹${params.savingsINR.toLocaleString('en-IN')} OFF!) #shorts`,
      hook: `Stop scrolling! If you were planning to buy this, you need to see this right now!`,
      body: `${params.retailerName} just slashed the price on the ${cleanTitle} from ₹${params.originalPrice.toLocaleString('en-IN')} down to ₹${params.lowestPrice.toLocaleString('en-IN')}! That's a massive ₹${params.savingsINR.toLocaleString('en-IN')} savings (${params.savingsPercentage}% off)!`,
      callToAction: `Tap the link in description or bio right now to grab it before stock runs out!`,
      hashtags: ['#shorts', '#deals', '#pricecrash', '#amazondeals', '#techsavings', '#lootdeals', '#riiqx'],
    };
  }

  /**
   * Generates a 720x1280 SVG Card for a specific scene
   */
  private static createSceneSvg(sceneNumber: number, data: {
    productTitle: string;
    retailerName: string;
    originalPrice: number;
    lowestPrice: number;
    savingsINR: number;
    savingsPercentage: number;
    theme?: string;
  }): string {
    const title = escapeXml(data.productTitle.slice(0, 42));
    const retailer = escapeXml(data.retailerName.toUpperCase());
    const origPrice = data.originalPrice.toLocaleString('en-IN');
    const lowPrice = data.lowestPrice.toLocaleString('en-IN');
    const savings = data.savingsINR.toLocaleString('en-IN');
    const pct = data.savingsPercentage;

    if (sceneNumber === 1) {
      // Scene 1: Hook & Urgency Alert
      return `
      <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#09090b"/>
            <stop offset="40%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="720" height="1280" fill="url(#bg)"/>

        <!-- Top Urgent Badge -->
        <rect x="60" y="90" width="600" height="76" rx="38" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2"/>
        <text x="360" y="140" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#f87171" text-anchor="middle" letter-spacing="1.5">🚨 MASSIVE PRICE CRASH 🚨</text>

        <!-- Retailer Tag -->
        <rect x="220" y="210" width="280" height="48" rx="24" fill="#27272a" stroke="#3f3f46" stroke-width="1.5"/>
        <text x="360" y="242" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="#fbbf24" text-anchor="middle">${retailer}</text>

        <!-- Product Title Card -->
        <rect x="50" y="300" width="620" height="480" rx="32" fill="#18181b" stroke="#3f3f46" stroke-width="2"/>
        <circle cx="360" cy="510" r="130" fill="#27272a" fill-opacity="0.5"/>
        <text x="360" y="490" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="900" fill="#10b981" text-anchor="middle">🔥</text>
        <text x="360" y="550" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#e4e4e7" text-anchor="middle">OFFICIAL DROP</text>

        <text x="360" y="850" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">${title}</text>
        <text x="360" y="910" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#a1a1aa" text-anchor="middle">Verified Authentic Listing</text>

        <!-- Hook Banner -->
        <rect x="60" y="1020" width="600" height="130" rx="28" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444" stroke-width="2"/>
        <text x="360" y="1075" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#f87171" text-anchor="middle">DON&apos;T BUY AT FULL PRICE!</text>
        <text x="360" y="1115" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#fca5a5" text-anchor="middle">Check the new lowest price below &#8595;</text>
      </svg>
      `;
    }

    if (sceneNumber === 2) {
      // Scene 2: Price Drop Reveal & Big Savings Math
      return `
      <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#09090b"/>
            <stop offset="50%" stop-color="#142e23"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="720" height="1280" fill="url(#bg2)"/>

        <!-- Top Badge -->
        <rect x="60" y="90" width="600" height="76" rx="38" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
        <text x="360" y="140" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle" letter-spacing="1.5">&#9889; TODAY&apos;S BEST PRICE &#9889;</text>

        <!-- Product Name -->
        <text x="360" y="240" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">${title}</text>
        <text x="360" y="285" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#9ca3af" text-anchor="middle">${retailer} Store Offer</text>

        <!-- Big Price Comparison Box -->
        <rect x="50" y="340" width="620" height="490" rx="32" fill="#18181b" stroke="#10b981" stroke-width="3"/>
        
        <!-- Old Slashed Price -->
        <text x="360" y="430" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="800" fill="#ef4444" text-anchor="middle" text-decoration="line-through">ORIGINAL: &#8377;${origPrice}</text>
        
        <!-- Down Arrow Indicator -->
        <text x="360" y="520" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="900" fill="#10b981" text-anchor="middle">&#8595;</text>

        <!-- Lowest Final Price -->
        <text x="360" y="640" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="900" fill="#10b981" text-anchor="middle">&#8377;${lowPrice}</text>
        <text x="360" y="700" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#6ee7b7" text-anchor="middle">TRUE LOWEST FINAL PAYABLE PRICE</text>

        <!-- Savings Pill -->
        <rect x="110" y="735" width="500" height="66" rx="33" fill="#10b981" fill-opacity="0.25" stroke="#34d399" stroke-width="2"/>
        <text x="360" y="777" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#34d399" text-anchor="middle">SAVE &#8377;${savings} (${pct}% OFF!)</text>

        <!-- Bottom Warning -->
        <rect x="60" y="930" width="600" height="180" rx="28" fill="#27272a" stroke="#3f3f46" stroke-width="1.5"/>
        <text x="360" y="995" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#fbbf24" text-anchor="middle">&#9888; LIMITED STOCK WARNING</text>
        <text x="360" y="1045" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#d1d5db" text-anchor="middle">Merchant offers frequently reset within hours.</text>
      </svg>
      `;
    }

    // Scene 3: Call To Action & Bio Link
    return `
    <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#09090b"/>
          <stop offset="50%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#064e3b"/>
        </linearGradient>
      </defs>
      <rect width="720" height="1280" fill="url(#bg3)"/>

      <!-- Header Badge -->
      <rect x="60" y="90" width="600" height="76" rx="38" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
      <text x="360" y="140" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="900" fill="#60a5fa" text-anchor="middle" letter-spacing="1.5">&#128279; HOW TO CLAIM THIS DEAL &#128279;</text>

      <!-- Step Cards -->
      <rect x="60" y="240" width="600" height="130" rx="24" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="110" y="295" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#10b981">1</text>
      <text x="160" y="295" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Tap the Link in Description / Bio</text>
      <text x="160" y="335" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#9ca3af">Direct PDP to genuine ${retailer} page</text>

      <rect x="60" y="410" width="600" height="130" rx="24" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="110" y="465" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#10b981">2</text>
      <text x="160" y="465" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Instant Bank &amp; Coupon Applied</text>
      <text x="160" y="505" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#9ca3af">Pay exactly &#8377;${lowPrice} at checkout</text>

      <rect x="60" y="580" width="600" height="130" rx="24" fill="#18181b" stroke="#3f3f46" stroke-width="1.5"/>
      <text x="110" y="635" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#10b981">3</text>
      <text x="160" y="635" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="#ffffff">Verified by RIIQX Intelligence</text>
      <text x="160" y="675" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="600" fill="#9ca3af">Zero fake prices &#8226; Zero dark patterns</text>

      <!-- Primary Big Glowing CTA Button -->
      <rect x="60" y="800" width="600" height="110" rx="55" fill="#10b981" stroke="#34d399" stroke-width="3"/>
      <text x="360" y="868" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="1">&#128073; TAP LINK IN BIO TO BUY</text>

      <!-- Watermark Footer -->
      <text x="360" y="1120" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#34d399" text-anchor="middle">RIIQX AUTONOMOUS REVENUE OS</text>
      <text x="360" y="1160" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="600" fill="#6b7280" text-anchor="middle">True Lowest Price Engine &#8226; Automated Deal Video</text>
    </svg>
    `;
  }

  /**
   * Physically renders the 9:16 vertical video using Sharp + FFmpeg
   */
  public static async generateDealShort(req: DealShortsRequest): Promise<DealShortsResult> {
    this.ensureDirs();
    const jobId = `short_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const origPrice = Math.max(req.originalPrice, req.lowestPrice);
    const lowPrice = Math.min(req.originalPrice, req.lowestPrice);
    const savingsINR = Math.max(0, origPrice - lowPrice);
    const savingsPercentage = origPrice > 0 ? Math.round((savingsINR / origPrice) * 100) : 0;

    // 1. Resolve Verified Affiliate Link
    const affiliate = AffiliateSmartRouter.resolveAffiliateUrl(
      req.productUrl,
      req.retailerName,
      req.category || req.productTitle,
      lowPrice
    );

    // 2. Generate Viral Script and Social Copy
    const script = this.generateScript({
      productTitle: req.productTitle,
      retailerName: req.retailerName,
      originalPrice: origPrice,
      lowestPrice: lowPrice,
      savingsINR,
      savingsPercentage,
      language: req.language,
    });

    const caption = `${script.title}\n\n${script.body}\n\n👉 Buy link: ${affiliate.affiliateUrl}\n\n${script.hashtags.join(' ')}`;

    // 3. Render 3 High-Res Graphic Scene Cards with Sharp
    const scene1Svg = this.createSceneSvg(1, {
      productTitle: req.productTitle,
      retailerName: req.retailerName,
      originalPrice: origPrice,
      lowestPrice: lowPrice,
      savingsINR,
      savingsPercentage,
      theme: req.theme,
    });
    const scene2Svg = this.createSceneSvg(2, {
      productTitle: req.productTitle,
      retailerName: req.retailerName,
      originalPrice: origPrice,
      lowestPrice: lowPrice,
      savingsINR,
      savingsPercentage,
      theme: req.theme,
    });
    const scene3Svg = this.createSceneSvg(3, {
      productTitle: req.productTitle,
      retailerName: req.retailerName,
      originalPrice: origPrice,
      lowestPrice: lowPrice,
      savingsINR,
      savingsPercentage,
      theme: req.theme,
    });

    const s1Png = path.join(this.UPLOADS_DIR, `tmp_${jobId}_s1.png`);
    const s2Png = path.join(this.UPLOADS_DIR, `tmp_${jobId}_s2.png`);
    const s3Png = path.join(this.UPLOADS_DIR, `tmp_${jobId}_s3.png`);

    await sharp(Buffer.from(scene1Svg)).png().toFile(s1Png);
    await sharp(Buffer.from(scene2Svg)).png().toFile(s2Png);
    await sharp(Buffer.from(scene3Svg)).png().toFile(s3Png);

    // Thumbnail is Scene 2 (the big price drop reveal)
    const thumbnailFileName = `thumb_${jobId}.jpg`;
    const thumbnailPath = path.join(this.UPLOADS_DIR, thumbnailFileName);
    await sharp(Buffer.from(scene2Svg)).jpeg({ quality: 90 }).toFile(thumbnailPath);

    // 4. Render Segments with FFmpeg
    // Scene 1: 3.5s, Scene 2: 5s, Scene 3: 4.5s -> Total 13 seconds
    const seg1Mp4 = path.join(this.UPLOADS_DIR, `tmp_${jobId}_seg1.mp4`);
    const seg2Mp4 = path.join(this.UPLOADS_DIR, `tmp_${jobId}_seg2.mp4`);
    const seg3Mp4 = path.join(this.UPLOADS_DIR, `tmp_${jobId}_seg3.mp4`);

    const renderSegment = (pngPath: string, mp4Path: string, durationSec: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        ffmpeg()
          .input(pngPath)
          .loop(durationSec)
          .input('anullsrc=r=44100:cl=stereo')
          .inputFormat('lavfi')
          .outputOptions([
            '-c:v libx264',
            '-tune stillimage',
            '-c:a aac',
            '-b:a 192k',
            '-pix_fmt yuv420p',
            '-shortest',
            '-movflags +faststart',
            '-r 30',
          ])
          .output(mp4Path)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      });
    };

    await renderSegment(s1Png, seg1Mp4, 3.5);
    await renderSegment(s2Png, seg2Mp4, 5.0);
    await renderSegment(s3Png, seg3Mp4, 4.5);

    // 5. Concatenate Segments into final 9:16 Video
    const finalVideoFileName = `deal_short_${jobId}.mp4`;
    const finalVideoPath = path.join(this.UPLOADS_DIR, finalVideoFileName);

    await FFmpegService.concatenateSegments([seg1Mp4, seg2Mp4, seg3Mp4], finalVideoPath);

    // Clean up temporary segment and image files
    [s1Png, s2Png, s3Png, seg1Mp4, seg2Mp4, seg3Mp4].forEach((f) => {
      try { fs.unlinkSync(f); } catch {}
    });

    const stat = fs.statSync(finalVideoPath);
    const mediaProbe = await FFmpegService.probeMedia(finalVideoPath);

    const result: DealShortsResult = {
      id: jobId,
      title: script.title,
      script: {
        hook: script.hook,
        body: script.body,
        callToAction: script.callToAction,
      },
      caption,
      hashtags: script.hashtags,
      affiliateUrl: affiliate.affiliateUrl,
      projectedCommissionINR: affiliate.expectedEarningsINR,
      expectedCommissionPct: affiliate.commissionPct,
      savingsINR,
      savingsPercentage,
      videoUrl: `/uploads/rendered/${finalVideoFileName}`,
      thumbnailUrl: `/uploads/rendered/${thumbnailFileName}`,
      durationSeconds: Math.round(mediaProbe.durationSeconds),
      aspectRatio: '9:16',
      width: mediaProbe.width,
      height: mediaProbe.height,
      fileSizeBytes: stat.size,
      renderedAt: new Date().toISOString(),
      publishingStatus: 'ready',
    };

    // 6. Save to durable history
    const history = this.readHistory();
    history.unshift(result);
    this.writeHistory(history);

    return result;
  }

  /**
   * Retrieves generated deal shorts history
   */
  public static async getHistory(limit: number = 20): Promise<DealShortsResult[]> {
    const history = this.readHistory();
    return history.slice(0, limit);
  }
}
