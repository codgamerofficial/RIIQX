// =============================================================================
// RIIQX — Affiliate Smart-Router & Revenue Attribution Engine Test Suite
// Real Commission Calculations • Link Attribution Integrity • Persistence • Live HTTP Telemetry
// =============================================================================

import assert from 'assert';
import http from 'http';
import { AffiliateSmartRouter } from '../src/services/product-intelligence/affiliate-router.ts';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX Affiliate Smart-Router & Revenue Attribution Engine Test Suite');
console.log(`Target: AffiliateSmartRouter Service & HTTP Telemetry (${BASE_URL})`);
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
  // --- Test 1: Amazon India Affiliate Link Resolution ---
  console.log('--- Test 1: Amazon India Affiliate Link Resolution ---');
  try {
    const canonical = 'https://www.amazon.in/dp/B0BDK62PDX?th=1';
    const res = AffiliateSmartRouter.resolveAffiliateUrl(canonical, 'Amazon India');
    assert(res.affiliateUrl.includes('tag=riiqx-21'), 'Must contain Amazon Associate tag');
    assert(res.affiliateUrl.includes('linkCode=as2'), 'Must contain associate linkCode');
    assert(res.affiliateUrl.includes('/dp/B0BDK62PDX'), 'Must retain original ASIN path');
    pass('Amazon Associate tag (riiqx-21) and linkCode injected without corrupting ASIN PDP', res.affiliateUrl);
  } catch (err) {
    fail('Amazon India Affiliate Link Resolution', err);
  }

  // --- Test 2: Flipkart Affiliate ID Injection ---
  console.log('\n--- Test 2: Flipkart Affiliate ID Injection ---');
  try {
    const canonical = 'https://www.flipkart.com/sony-wh-1000xm5/p/itm12345?pid=ACC123';
    const res = AffiliateSmartRouter.resolveAffiliateUrl(canonical, 'Flipkart');
    assert(res.affiliateUrl.includes('affid=riiqx_aff'), 'Must contain Flipkart affid');
    assert(res.affiliateUrl.includes('pid=ACC123'), 'Must retain original product identifier');
    pass('Flipkart affiliate ID (riiqx_aff) accurately attached to product link', res.affiliateUrl);
  } catch (err) {
    fail('Flipkart Affiliate ID Injection', err);
  }

  // --- Test 3: Tata CLiQ, Croma, Myntra, Reliance, Nykaa Attribution ---
  console.log('\n--- Test 3: Tata CLiQ, Croma, Myntra, Reliance, Nykaa Attribution ---');
  try {
    const tataCliq = AffiliateSmartRouter.resolveAffiliateUrl('https://www.tatacliq.com/p-mp00000001', 'Tata CLiQ');
    assert(decodeURIComponent(tataCliq.affiliateUrl).includes('cid=af:riiqx:pdp'), 'Tata CLiQ must contain campaign CID');
    pass('Tata CLiQ campaign CID injected', tataCliq.affiliateUrl);

    const croma = AffiliateSmartRouter.resolveAffiliateUrl('https://www.croma.com/apple-macbook/p/245231', 'Croma');
    assert(croma.affiliateUrl.includes('utm_source=affiliate'), 'Croma must contain utm_source');
    pass('Croma utm_source injected', croma.affiliateUrl);

    const myntra = AffiliateSmartRouter.resolveAffiliateUrl('https://www.myntra.com/shoes/nike/1234', 'Myntra');
    assert(myntra.affiliateUrl.includes('aff_id=riiqx_affiliate'), 'Myntra must contain aff_id');
    pass('Myntra aff_id injected', myntra.affiliateUrl);

    const reliance = AffiliateSmartRouter.resolveAffiliateUrl('https://www.reliancedigital.in/item/4919', 'Reliance Digital');
    assert(reliance.affiliateUrl.includes('utm_source=affiliate'), 'Reliance Digital must contain utm_source');
    pass('Reliance Digital utm_source injected', reliance.affiliateUrl);

    const nykaa = AffiliateSmartRouter.resolveAffiliateUrl('https://www.nykaa.com/product/p/999', 'Nykaa');
    assert(nykaa.affiliateUrl.includes('utm_source=affiliate'), 'Nykaa must contain utm_source');
    pass('Nykaa utm_source injected', nykaa.affiliateUrl);
  } catch (err) {
    fail('Multi-Retailer Attribution', err);
  }

  // --- Test 4: Commission Rate Schedules by Category & Retailer ---
  console.log('\n--- Test 4: Commission Rate Schedules by Category & Retailer ---');
  try {
    const audioAmazonRate = AffiliateSmartRouter.getCommissionRate('Amazon India', 'audio');
    assert.strictEqual(audioAmazonRate, 4.5, 'Audio on Amazon should be 4.5%');
    pass('Amazon Audio commission rate verified at 4.5%');

    const audioFlipkartRate = AffiliateSmartRouter.getCommissionRate('Flipkart', 'audio');
    assert.strictEqual(audioFlipkartRate, 4.0, 'Audio on Flipkart should be 4.0%');
    pass('Flipkart Audio commission rate verified at 4.0%');

    const smartphoneAmazonRate = AffiliateSmartRouter.getCommissionRate('Amazon India', 'smartphone');
    assert.strictEqual(smartphoneAmazonRate, 1.5, 'Smartphones have lower margin of 1.5%');
    pass('Amazon Smartphone commission rate capped at standard 1.5%');

    const fashionAmazonRate = AffiliateSmartRouter.getCommissionRate('Amazon India', 'fashion');
    assert.strictEqual(fashionAmazonRate, 9.0, 'Fashion is high commission at 9.0%');
    pass('Amazon Fashion commission rate verified at 9.0%');
  } catch (err) {
    fail('Commission Rate Schedules', err);
  }

  // --- Test 5: Exact Projected Commission INR Calculation ---
  console.log('\n--- Test 5: Exact Projected Commission INR Calculation ---');
  try {
    // Sony WH-1000XM5 selling at ₹26,990 on Amazon (Audio = 4.5%)
    // 26,990 * 0.045 = ₹1214.55
    const comm1 = AffiliateSmartRouter.calculateProjectedCommission(26990, 'Amazon India', 'audio');
    assert.strictEqual(comm1.commissionPct, 4.5);
    assert.strictEqual(comm1.projectedEarningsINR, 1214.55);
    pass('Sony Headphones (₹26,990 @ 4.5%) yields exactly ₹1,214.55 commission', `₹${comm1.projectedEarningsINR}`);

    // iPhone 15 selling at ₹65,000 on Amazon (Mobile = 1.5%)
    // 65,000 * 0.015 = ₹975
    const comm2 = AffiliateSmartRouter.calculateProjectedCommission(65000, 'Amazon India', 'mobiles');
    assert.strictEqual(comm2.commissionPct, 1.5);
    assert.strictEqual(comm2.projectedEarningsINR, 975);
    pass('iPhone 15 (₹65,000 @ 1.5%) yields exactly ₹975 commission', `₹${comm2.projectedEarningsINR}`);

    // Luxury Watch/Fashion at ₹12,000 on Myntra (Fashion = 10%)
    // 12,000 * 0.10 = ₹1200
    const comm3 = AffiliateSmartRouter.calculateProjectedCommission(12000, 'Myntra', 'fashion');
    assert.strictEqual(comm3.commissionPct, 10.0);
    assert.strictEqual(comm3.projectedEarningsINR, 1200);
    pass('Fashion item (₹12,000 @ 10%) yields exactly ₹1,200 commission', `₹${comm3.projectedEarningsINR}`);
  } catch (err) {
    fail('Projected Commission Calculation', err);
  }

  // --- Test 6: Outbound Click Recording & Persistence ---
  console.log('\n--- Test 6: Outbound Click Recording & Persistence ---');
  try {
    const event = await AffiliateSmartRouter.recordOutboundClick({
      userId: 'usr_test_entrepreneur_001',
      productIdentifier: 'WH-1000XM5',
      productTitle: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      retailerName: 'Amazon India',
      sellerName: 'Appario Retail Private Ltd',
      sellingPrice: 26990,
      destinationUrl: 'https://www.amazon.in/dp/B0BDK62PDX',
      category: 'audio',
      referrerPage: 'Price Watchlist',
    });

    assert(event.id.startsWith('click_'), 'Must generate valid click ID');
    assert.strictEqual(event.projectedEarningsINR, 1214.55, 'Projected earnings must match math');
    assert(event.affiliateUrl.includes('tag=riiqx-21'), 'Affiliate URL must be stored');
    pass('Click event successfully persisted to storage', `Event ID: ${event.id}`);

    // Verify summary aggregation
    const summary = await AffiliateSmartRouter.getEarningsSummary();
    assert(summary.totalClicks >= 1, 'Total clicks must be at least 1');
    assert(summary.totalGrossOrderValueINR >= 26990, 'GMV must account for transaction value');
    assert(summary.totalProjectedCommissionINR >= 1214, 'Total commission must accumulate');
    pass('Earnings summary correctly aggregates GMV and projected commissions', 
      `Clicks: ${summary.totalClicks}, GMV: ₹${summary.totalGrossOrderValueINR.toLocaleString('en-IN')}, Commission: ₹${summary.totalProjectedCommissionINR.toLocaleString('en-IN')}`
    );
  } catch (err) {
    fail('Outbound Click Recording', err);
  }

  // --- Test 7: Live HTTP API - POST /api/twin/affiliate/click ---
  console.log('\n--- Test 7: Live HTTP API - POST /api/twin/affiliate/click ---');
  try {
    const res = await runHttpRequest('POST', '/api/twin/affiliate/click', {
      productIdentifier: 'MACBOOK-M3-AIR',
      productTitle: 'Apple MacBook Air M3 16GB',
      retailerName: 'Flipkart',
      sellerName: 'IndiFlashMart',
      sellingPrice: 114900,
      destinationUrl: 'https://www.flipkart.com/apple-macbook-air-m3/p/itm123',
      category: 'electronics',
      referrerPage: 'Decision Matrix',
    });

    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
    assert(res.json.success === true, 'Response must be success: true');
    assert(res.json.clickEvent.id.startsWith('click_'), 'Response must return event ID');
    assert.strictEqual(res.json.clickEvent.expectedCommissionPct, 2.5, 'Electronics on Flipkart is 2.5%');
    assert.strictEqual(res.json.clickEvent.projectedEarningsINR, 2872.5, '114,900 * 2.5% = ₹2,872.5');
    pass('POST /api/twin/affiliate/click registered click intent with correct revenue model', `Earnings: ₹${res.json.clickEvent.projectedEarningsINR}`);
  } catch (err) {
    fail('POST /api/twin/affiliate/click', err);
  }

  // --- Test 8: Live HTTP API - GET /api/twin/affiliate/click (Smart 302 Redirect) ---
  console.log('\n--- Test 8: Live HTTP API - GET /api/twin/affiliate/click (Smart 302 Redirect) ---');
  try {
    const targetUrl = 'https://www.amazon.in/dp/B0CX23V252';
    const res = await runHttpRequest('GET', `/api/twin/affiliate/click?url=${encodeURIComponent(targetUrl)}&retailer=Amazon%20India&price=89900&category=electronics`);

    assert.strictEqual(res.statusCode, 302, `Expected 302 redirect, got ${res.statusCode}`);
    const location = res.headers['location'];
    assert(location, 'Location header must be present');
    assert(location.includes('tag=riiqx-21'), 'Location header must redirect to affiliate URL with tag');
    pass('GET /api/twin/affiliate/click returned 302 redirect with verified partner attribution', location);
  } catch (err) {
    fail('GET /api/twin/affiliate/click 302 Redirect', err);
  }

  // --- Test 9: Live HTTP API - GET /api/twin/affiliate/click?dashboard=true ---
  console.log('\n--- Test 9: Live HTTP API - GET /api/twin/affiliate/click?dashboard=true ---');
  try {
    const res = await runHttpRequest('GET', '/api/twin/affiliate/click?dashboard=true');
    assert.strictEqual(res.statusCode, 200, `Expected 200, got ${res.statusCode}`);
    assert(res.json.success === true, 'Response must be success');
    assert(typeof res.json.dashboard.totalClicks === 'number', 'Summary must have totalClicks');
    assert(typeof res.json.dashboard.totalProjectedCommissionINR === 'number', 'Summary must have totalProjectedCommissionINR');
    assert(Array.isArray(res.json.dashboard.topRetailers), 'Summary must have topRetailers breakdown');
    pass('GET /api/twin/affiliate/click?dashboard=true delivered real-time analytics data', 
      `GMV: ₹${res.json.dashboard.totalGrossOrderValueINR.toLocaleString('en-IN')}, Projected Income: ₹${res.json.dashboard.totalProjectedCommissionINR.toLocaleString('en-IN')}`
    );
  } catch (err) {
    fail('GET /api/twin/affiliate/click dashboard', err);
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
