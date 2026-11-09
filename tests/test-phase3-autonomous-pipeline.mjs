// =============================================================================
// RIIQX — Phase 3: Autonomous Deal Pipeline, Social Auto-Publish & Hyperlocal Test Suite
// Autonomous Cron Sweeps • One-Click Social Publishing • Carto GIS Hyperlocal Arbitrage
// =============================================================================

import assert from 'assert';
import fs from 'node:fs';
import path from 'node:path';
import http from 'http';
import { AutonomousDealPipeline } from '../src/services/video/autonomous-deal-pipeline.ts';
import { PriceMonitoringService } from '../src/services/product-intelligence/price-monitoring-service.ts';
import { HyperlocalArbitrageEngine } from '../src/services/product-intelligence/hyperlocal-arbitrage-engine.ts';
import { FFmpegService } from '../src/lib/video/ffmpeg-service.ts';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX Phase 3: Autonomous Pipeline, Social Auto-Publish & Hyperlocal Suite');
console.log(`Target: AutonomousDealPipeline, Publishing API & Hyperlocal (${BASE_URL})`);
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

async function runHttpRequest(method, path, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
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
  const TEST_USER = `usr_test_phase3_${Date.now()}`;

  // --- Test 1: Autonomous Deal Sweep Detects Qualifying Drop & Renders 9:16 Video ---
  console.log('--- Test 1: Autonomous Deal Pipeline Drop Detection & Render ---');
  try {
    // Seed a watched item with significant price drop (₹34,990 down to ₹24,990 = 28% drop!)
    const seededWl = await PriceMonitoringService.addOrUpdateWatchlist(TEST_USER, {
      productTitle: 'Sony WH-1000XM5 Premium Noise Cancelling Headphones',
      productIdentifier: 'WH1000XM5_SILVER',
      productUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      retailerName: 'Amazon India',
      initialPrice: 34990,
      currentPrice: 24990,
      targetPrice: 26000,
    });

    // Artificially record an observation with huge drop from ₹34,990 initial price
    await PriceMonitoringService.recordPriceObservation({
      watchlistId: seededWl.id,
      productIdentifier: 'WH1000XM5_SILVER',
      productTitle: 'Sony WH-1000XM5 Premium Noise Cancelling Headphones',
      platform: 'amazon',
      observedPrice: 24990,
      observedMrp: 34990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'PDP Extraction',
      verifiedAt: new Date().toISOString(),
    });

    // Run autonomous sweep
    const sweepResult = await AutonomousDealPipeline.runAutonomousSweep({
      userId: TEST_USER,
      minSavingsPct: 15,
      maxVideosPerRun: 1,
      autoPublish: false,
    });

    assert(sweepResult.watchedItemsScanned >= 1, 'Must scan watched items');
    assert(sweepResult.qualifyingDropsFound >= 1, 'Must find qualifying drops >= 15%');
    assert(sweepResult.videosGenerated.length >= 1, 'Must synthesize 9:16 video for qualifying drop');

    const generatedVideo = sweepResult.videosGenerated[0];
    assert(generatedVideo.videoUrl.endsWith('.mp4'), 'Must produce MP4 video');
    assert.strictEqual(generatedVideo.aspectRatio, '9:16', 'Must be strictly 9:16');
    assert(generatedVideo.affiliateUrl.includes('amazon.in'), 'Must include valid Amazon destination URL');
    assert.strictEqual(generatedVideo.expectedCommissionPct, 4.5, 'Audio on Amazon is 4.5% commission');
    assert(typeof sweepResult.totalProjectedCommissionINR === 'number', 'Projected commission must be numeric');

    pass('Autonomous deal pipeline rendered 9:16 video on price drop', 
      `Video: ${generatedVideo.videoUrl}, Savings: ₹${generatedVideo.savingsINR}, Commission: ₹${generatedVideo.projectedCommissionINR}`
    );
  } catch (err) {
    fail('Autonomous Deal Pipeline Drop Detection', err);
  }

  // --- Test 2: Pipeline Deduplication (Prevents Duplicate Video Rendering) ---
  console.log('\n--- Test 2: Pipeline Deduplication Guard ---');
  try {
    const sweep2 = await AutonomousDealPipeline.runAutonomousSweep({
      userId: TEST_USER,
      minSavingsPct: 15,
      maxVideosPerRun: 1,
      autoPublish: false,
    });

    assert.strictEqual(sweep2.videosGenerated.length, 0, 'Must not re-render duplicate video for same price drop');
    pass('Pipeline deduplication successfully suppressed duplicate video rendering');
  } catch (err) {
    fail('Pipeline Deduplication Guard', err);
  }

  // --- Test 3: Live HTTP API - POST /api/twin/deal-shorts/publish (Security Gate) ---
  console.log('\n--- Test 3: Live HTTP API - POST /api/twin/deal-shorts/publish (Auth Gate) ---');
  try {
    const res = await runHttpRequest('POST', '/api/twin/deal-shorts/publish', {
      dealShortId: 'short_test_001',
      platform: 'youtube',
      title: '🚨 MASSIVE SONY HEADPHONE PRICE DROP! #shorts #deals',
      caption: 'Sony WH-1000XM5 just dropped to ₹24,990! Buy link: https://riiqx.ai/p/sony-xm5',
      videoUrl: '/uploads/rendered/sample_vertical.mp4',
    });

    assert.strictEqual(res.statusCode, 401, `Unauthenticated request must be rejected with 401, got ${res.statusCode}`);
    assert(res.json.success === false, 'Response must be success: false');
    assert(res.json.error.includes('Authentication required') || res.json.error.includes('Unauthorized'), 'Error message must specify authentication requirement');
    pass('POST /api/twin/deal-shorts/publish strictly rejects unauthenticated callers with HTTP 401');
  } catch (err) {
    fail('POST /api/twin/deal-shorts/publish (YouTube Auth Gate)', err);
  }

  // --- Test 4: Live HTTP API - POST /api/twin/deal-shorts/publish (Instagram Reels Auth Gate) ---
  console.log('\n--- Test 4: Live HTTP API - POST /api/twin/deal-shorts/publish (Instagram Reels Auth Gate) ---');
  try {
    const res = await runHttpRequest('POST', '/api/twin/deal-shorts/publish', {
      dealShortId: 'short_test_002',
      platform: 'instagram',
      title: '🔥 MacBook Air M3 Slashed by ₹20,000! #reels #tech',
      caption: 'Get the M3 MacBook Air at lowest price ever! Link in bio.',
      videoUrl: '/uploads/rendered/sample_vertical.mp4',
    });

    assert.strictEqual(res.statusCode, 401, `Unauthenticated request must be rejected with 401, got ${res.statusCode}`);
    assert(res.json.success === false, 'Response must be success: false');
    pass('POST /api/twin/deal-shorts/publish strictly protects Instagram Reels publishing with HTTP 401');
  } catch (err) {
    fail('POST /api/twin/deal-shorts/publish (Instagram Auth Gate)', err);
  }

  // --- Test 5: Live HTTP API - GET /api/cron/deal-pipeline (Cryptographic Secret Gate) ---
  console.log('\n--- Test 5: Live HTTP API - GET /api/cron/deal-pipeline ---');
  try {
    // 5a: Unauthenticated cron request rejected with 401
    const unauthRes = await runHttpRequest('GET', '/api/cron/deal-pipeline?minDrop=10&maxVideos=2');
    assert.strictEqual(unauthRes.statusCode, 401, `Unauthenticated cron sweep must return 401, got ${unauthRes.statusCode}`);
    pass('GET /api/cron/deal-pipeline strictly rejects unauthenticated callers without CRON_SECRET (HTTP 401)');

    // 5b: Authenticated cron request with valid CRON_SECRET succeeds with 200
    const cronSecret = process.env.CRON_SECRET || '3024da5cf18a7be3e725f469fbefcf9f3c551b18adf713e2f84c102393adaf63';
    const authRes = await runHttpRequest('GET', '/api/cron/deal-pipeline?minDrop=10&maxVideos=2', null, {
      'Authorization': `Bearer ${cronSecret}`,
    });
    assert.strictEqual(authRes.statusCode, 200, `Authenticated cron sweep must return 200, got ${authRes.statusCode}`);
    assert(authRes.json.success === true, 'Authenticated cron sweep must return success: true');
    assert(authRes.json.result.runId.startsWith('sweep_'), 'Cron result must return runId');
    pass('GET /api/cron/deal-pipeline executes autonomous sweep when authorized with CRON_SECRET', `Run ID: ${authRes.json.result.runId}`);
  } catch (err) {
    fail('GET /api/cron/deal-pipeline', err);
  }

  // --- Test 6: CARTO GIS Hyperlocal Online vs Offline Arbitrage Engine ---
  console.log('\n--- Test 6: CARTO GIS Hyperlocal Online vs Offline Arbitrage Engine ---');
  try {
    const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
      productTitle: 'Apple iPhone 15 128GB Black',
      onlineDeliveredPrice: 65000,
      onlineRetailerName: 'Amazon India',
      onlineDeliveryDays: 2,
      userCity: 'Kolkata',
      userPincode: '700068',
      searchRadiusKm: 15,
    });

    assert(report.arbitrageId.startsWith('arbitrage-'), 'Must generate arbitrage ID');
    assert.strictEqual(report.userCity, 'Kolkata', 'Must resolve user city Kolkata');
    assert(report.offlineStores.length >= 3, 'Must find physical stores in Kolkata');
    assert(report.cartoBasemapUrl.includes('cartodb-basemaps-a.global.ssl.fastly.net'), 'Must configure CARTO GIS basemap URL');
    assert(report.bestOfflineOffer, 'Must identify best offline retailer offer');
    assert(report.bestOfflineOffer.posTerminalCashback.length >= 1, 'Must calculate in-store PineLabs/Innoviti card swipe cashbacks');
    assert(report.bestOfflineOffer.directionsUrl.includes('google.com/maps/dir'), 'Must provide Google Maps directions link');
    assert(typeof report.savingsAmountRupees === 'number', 'Must calculate exact savings amount');

    pass('CARTO GIS Hyperlocal Arbitrage analyzed offline POS stores vs online floor', 
      `Verdict: ${report.arbitrageVerdict}, Best Offline: ${report.bestOfflineOffer.chainName} (${report.bestOfflineOffer.branchName}), Net Store: ₹${report.bestOfflineOffer.netInStorePayablePrice.toLocaleString('en-IN')}`
    );
  } catch (err) {
    fail('CARTO GIS Hyperlocal Arbitrage', err);
  }

  // --- Test 7: Haversine Geodesic Distance Math Accuracy ---
  console.log('\n--- Test 7: Haversine Geodesic Distance Math Accuracy ---');
  try {
    // Distance between Kolkata (South City: 22.5015, 88.3615) and Quest Mall (22.5392, 88.3654)
    // Approximately 4.2 km
    const distKm = HyperlocalArbitrageEngine.calculateHaversineDistanceKm(22.5015, 88.3615, 22.5392, 88.3654);
    assert(distKm >= 4.0 && distKm <= 4.5, `Distance should be ~4.2 km (got ${distKm} km)`);
    pass('Haversine distance verified at 4.2 km within strict geographic tolerance', `${distKm} km`);
  } catch (err) {
    fail('Haversine Distance Accuracy', err);
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
