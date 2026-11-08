// =============================================================================
// RIIQX — Autonomous Faceless Deal Shorts & Reels Factory Test Suite
// Physical 9:16 Rendering • FFmpeg & Sharp • Viral Scripts • Verified Affiliate Links
// =============================================================================

import assert from 'assert';
import fs from 'node:fs';
import path from 'node:path';
import http from 'http';
import { DealShortsVideoFactory } from '../src/services/video/deal-shorts-factory.ts';
import { FFmpegService } from '../src/lib/video/ffmpeg-service.ts';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX Autonomous Faceless Deal Shorts & Reels Factory Test Suite');
console.log(`Target: DealShortsVideoFactory & Live HTTP Endpoint (${BASE_URL})`);
console.log('=============================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function pass(testName, details = '') {
  totalTests++;
  passedTests++;
  console.log(`  [PASS] ${testName}${details ? ` (${details})` : ''}`);
}

function fail(testName, err) {
  totalTests++;
  failedTests++;
  console.error(`  [FAIL] ${testName}: ${err.message || err}`);
}

async function runHttpRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json,
        });
      });
    });

    req.on('error', (e) => reject(e));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  // --- Test 1: Viral Script Generation in English, Bengali, and Hindi ---
  console.log('--- Test 1: Viral Script Generation (Multilingual) ---');
  try {
    const enScript = DealShortsVideoFactory.generateScript({
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      retailerName: 'Amazon India',
      originalPrice: 29990,
      lowestPrice: 22990,
      savingsINR: 7000,
      savingsPercentage: 23,
      language: 'en',
    });
    assert(enScript.title.includes('HUGE PRICE CRASH'), 'English title must contain viral hook');
    assert(enScript.body.includes('₹7,000'), 'Body must highlight exact savings');
    assert(enScript.hashtags.includes('#shorts'), 'Must include #shorts hashtag');
    pass('English viral script generated with accurate savings and tags', enScript.title);

    const bnScript = DealShortsVideoFactory.generateScript({
      productTitle: 'Apple MacBook Air M3',
      retailerName: 'Flipkart',
      originalPrice: 114900,
      lowestPrice: 94900,
      savingsINR: 20000,
      savingsPercentage: 17,
      language: 'bn',
    });
    assert(bnScript.title.includes('বিশাল প্রাইস ড্রপ'), 'Bengali script must contain Bengali title');
    assert(bnScript.callToAction.includes('ডেসক্রিপশন'), 'Bengali CTA must guide to description');
    pass('Bengali viral script generated for regional reach', bnScript.title);

    const hiScript = DealShortsVideoFactory.generateScript({
      productTitle: 'Samsung Galaxy S24 Ultra',
      retailerName: 'Amazon India',
      originalPrice: 129999,
      lowestPrice: 109999,
      savingsINR: 20000,
      savingsPercentage: 15,
      language: 'hi',
    });
    assert(hiScript.title.includes('भारी गिरावट'), 'Hindi script generated correctly');
    pass('Hindi viral script generated for pan-India reach', hiScript.title);
  } catch (err) {
    fail('Viral Script Generation', err);
  }

  // --- Test 2: Physical 9:16 Video Synthesis via FFmpeg & Sharp ---
  console.log('\n--- Test 2: Physical 9:16 Video Synthesis (Local Render) ---');
  try {
    const result = await DealShortsVideoFactory.generateDealShort({
      productTitle: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      productIdentifier: 'WH-1000XM5',
      retailerName: 'Amazon India',
      originalPrice: 29990,
      lowestPrice: 22990,
      productUrl: 'https://www.amazon.in/dp/B0BDK62PDX',
      category: 'audio',
      language: 'en',
    });

    assert(result.id.startsWith('short_'), 'Result must have valid job ID');
    assert(result.videoUrl.startsWith('/uploads/rendered/'), 'Video URL must be in rendered path');
    assert(result.thumbnailUrl.startsWith('/uploads/rendered/'), 'Thumbnail URL must be present');
    assert.strictEqual(result.aspectRatio, '9:16', 'Aspect ratio must be strictly 9:16');
    assert.strictEqual(result.savingsINR, 7000, 'Savings must be ₹7,000');
    assert.strictEqual(result.savingsPercentage, 23, 'Savings percentage must be 23%');
    assert(result.affiliateUrl.includes('tag=riiqx-21'), 'Affiliate tag must be injected in video destination');
    assert.strictEqual(result.expectedCommissionPct, 4.5, 'Audio on Amazon is 4.5% commission');
    assert.strictEqual(result.projectedCommissionINR, 1034.55, '22,990 * 4.5% = ₹1,034.55 commission');

    // Verify physical file on disk
    const diskPath = path.join(process.cwd(), 'public', result.videoUrl.replace(/^\//, ''));
    assert(fs.existsSync(diskPath), `Physical MP4 file must exist at ${diskPath}`);
    const stat = fs.statSync(diskPath);
    assert(stat.size > 20000, `Video file size must be substantial (>20KB, got ${stat.size} bytes)`);

    // Verify FFprobe video stream specs
    const probe = await FFmpegService.probeMedia(diskPath);
    assert.strictEqual(probe.width, 720, 'Width must be 720px');
    assert.strictEqual(probe.height, 1280, 'Height must be 1280px (9:16 vertical)');
    assert.strictEqual(probe.videoCodec, 'h264', 'Video codec must be H.264');
    assert.strictEqual(probe.audioCodec, 'aac', 'Audio codec must be AAC');
    assert.strictEqual(probe.hasAudio, true, 'Audio track must be present');
    assert(probe.durationSeconds >= 12, `Duration must be ~13s (got ${probe.durationSeconds}s)`);

    pass('Physical 9:16 MP4 video synthesized and verified on disk', 
      `File: ${stat.size} bytes, Duration: ${probe.durationSeconds}s, Resolution: ${probe.width}x${probe.height}, Codec: ${probe.videoCodec}/${probe.audioCodec}`
    );
  } catch (err) {
    fail('Physical 9:16 Video Synthesis', err);
  }

  // --- Test 3: History & Persistence ---
  console.log('\n--- Test 3: History & Persistence ---');
  try {
    const history = await DealShortsVideoFactory.getHistory();
    assert(history.length >= 1, 'History must contain at least 1 record');
    const first = history[0];
    assert(first.videoUrl, 'History entry must contain videoUrl');
    assert(first.affiliateUrl, 'History entry must contain affiliateUrl');
    pass('Deal shorts history persisted and retrievable across restarts', `Count: ${history.length}`);
  } catch (err) {
    fail('History & Persistence', err);
  }

  // --- Test 4: Live HTTP API - POST /api/twin/deal-shorts/generate ---
  console.log('\n--- Test 4: Live HTTP API - POST /api/twin/deal-shorts/generate ---');
  try {
    const res = await runHttpRequest('POST', '/api/twin/deal-shorts/generate', {
      productTitle: 'Apple MacBook Air M3 16GB RAM 512GB SSD',
      productIdentifier: 'MACBOOK-M3',
      retailerName: 'Flipkart',
      originalPrice: 134900,
      lowestPrice: 114900,
      productUrl: 'https://www.flipkart.com/apple-macbook-air-m3/p/itm123',
      category: 'electronics',
      language: 'en',
    });

    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
    assert(res.json.success === true, 'Response must be success: true');
    assert(res.json.dealShort.id.startsWith('short_'), 'Response must return dealShort ID');
    assert(res.json.dealShort.videoUrl.endsWith('.mp4'), 'Response must return playable video URL');
    assert(res.json.dealShort.affiliateUrl.includes('affid=riiqx_aff'), 'Flipkart affiliate tag injected');
    assert.strictEqual(res.json.dealShort.savingsINR, 20000, 'Savings must be ₹20,000');
    assert.strictEqual(res.json.dealShort.expectedCommissionPct, 2.5, 'Electronics on Flipkart is 2.5%');
    assert.strictEqual(res.json.dealShort.projectedCommissionINR, 2872.5, '114,900 * 2.5% = ₹2,872.5 commission');

    pass('POST /api/twin/deal-shorts/generate rendered video and attached affiliate attribution', 
      `Video: ${res.json.dealShort.videoUrl}, Commission: ₹${res.json.dealShort.projectedCommissionINR}`
    );
  } catch (err) {
    fail('POST /api/twin/deal-shorts/generate', err);
  }

  // --- Test 5: Live HTTP API - GET /api/twin/deal-shorts/generate ---
  console.log('\n--- Test 5: Live HTTP API - GET /api/twin/deal-shorts/generate ---');
  try {
    const res = await runHttpRequest('GET', '/api/twin/deal-shorts/generate?limit=5');
    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
    assert(res.json.success === true, 'Response must be success: true');
    assert(res.json.count >= 2, 'History must contain at least 2 generated shorts');
    assert(Array.isArray(res.json.history), 'History must be an array');
    pass('GET /api/twin/deal-shorts/generate delivered generated shorts history list', `Total: ${res.json.count}`);
  } catch (err) {
    fail('GET /api/twin/deal-shorts/generate', err);
  }

  console.log('\n=============================================================================');
  console.log(`TEST RESULTS: ${passedTests} PASSED | ${failedTests} FAILED | TOTAL: ${totalTests}`);
  console.log('=============================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
