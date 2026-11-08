// =============================================================================
// RIIQX — Phase 2 Genuine Affiliate Revenue & Attribution Test Suite
// Verifies: Zero fake partner tags, transparent unconfigured state, clean canonical URLs,
// conversion postback lifecycle, and honest separation of clicks vs confirmed earnings.
// =============================================================================

import assert from 'node:assert/strict';
import { AffiliateSmartRouter } from '../src/services/product-intelligence/affiliate-router.ts';

console.log('🧪 [TEST SUITE] Phase 2: Genuine Affiliate Revenue & Attribution');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function main() {
  const origAmazon = process.env.AMAZON_ASSOCIATE_TAG;
  const origFlipkart = process.env.FLIPKART_AFFILIATE_ID;

  try {
    // Test 1: Zero fabricated default tags when unconfigured
    delete process.env.AMAZON_ASSOCIATE_TAG;
    delete process.env.FLIPKART_AFFILIATE_ID;

    runTest('Zero fabricated default partner tags when unconfigured', () => {
      const config = AffiliateSmartRouter.getPartnerConfig();
      assert.equal(config.amazonTag, '', 'Amazon tag must be empty string when unconfigured');
      assert.equal(config.flipkartAffId, '', 'Flipkart tag must be empty string when unconfigured');

      const resolved = AffiliateSmartRouter.resolveAffiliateUrl(
        'https://www.amazon.in/dp/B0CX24921K',
        'Amazon India',
        'Audio',
        14999
      );

      assert.equal(resolved.isAttributed, false, 'isAttributed must be false when unconfigured');
      assert.equal(resolved.partnerStatus, 'unconfigured', 'partnerStatus must be unconfigured');
      assert.equal(resolved.expectedEarningsINR, 0, 'Unconfigured partner cannot claim expected earnings');
      assert.ok(!resolved.affiliateUrl.includes('riiqx-21'), 'Must NEVER include fabricated riiqx-21 tag');
      assert.ok(!resolved.affiliateUrl.includes('tag='), 'Must not include empty tag= parameter');
    });

    // Test 2: Clean canonical URL preserved when partner is unconfigured
    runTest('Clean canonical URL preserved without tracking cruft when unconfigured', () => {
      const canonicalInput = 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W';
      const resolved = AffiliateSmartRouter.resolveAffiliateUrl(
        canonicalInput,
        'Flipkart',
        'Mobiles',
        69999
      );

      assert.equal(resolved.isAttributed, false);
      assert.ok(!resolved.affiliateUrl.includes('riiqx_aff'), 'Must not include fake affid');
    });

    // Test 3: Verified partner attribution when credential is validly supplied
    runTest('Verified partner attribution when partner tag is provided in environment', () => {
      process.env.AMAZON_ASSOCIATE_TAG = 'verifiedpartner-21';
      const resolved = AffiliateSmartRouter.resolveAffiliateUrl(
        'https://www.amazon.in/dp/B0CX24921K',
        'Amazon India',
        'Audio',
        10000
      );

      assert.equal(resolved.isAttributed, true, 'Must attribute when tag configured');
      assert.equal(resolved.partnerStatus, 'verified_partner');
      assert.ok(resolved.affiliateUrl.includes('tag=verifiedpartner-21'), 'Appends genuine partner tag');
      assert.ok(resolved.expectedEarningsINR > 0, 'Calculates real commission math');
    });

    // Test 4: Conversion postback lifecycle tracking
    await runAsyncTest('Affiliate conversion postback lifecycle records correctly', async () => {
      const orderId = `test_ord_${Date.now()}`;
      const conv = await AffiliateSmartRouter.recordConversionPostback({
        retailerName: 'Amazon India',
        orderId,
        orderAmountINR: 25000,
        commissionAmountINR: 1125,
        commissionRatePct: 4.5,
        status: 'approved',
        partnerSource: 'amazon_associates_report',
      });

      assert.equal(conv.orderId, orderId);
      assert.equal(conv.status, 'approved');
      assert.equal(conv.commissionAmountINR, 1125);
    });

    // Test 5: getEarningsDashboard honestly differentiates clicks from confirmed payouts
    await runAsyncTest('getEarningsDashboard honestly separates directed cart clicks from confirmed earnings', async () => {
      const dashboard = await AffiliateSmartRouter.getEarningsDashboard();
      assert.ok('totalClicks' in dashboard, 'Includes totalClicks');
      assert.ok('directedCartVolumeINR' in dashboard, 'Includes directedCartVolumeINR (honest metric)');
      assert.ok('confirmedCommissionINR' in dashboard, 'Includes confirmedCommissionINR');
      assert.ok('partnerStatuses' in dashboard, 'Includes transparent partner statuses');
      assert.ok('Amazon India' in dashboard.partnerStatuses);
    });

  } finally {
    if (origAmazon) process.env.AMAZON_ASSOCIATE_TAG = origAmazon;
    if (origFlipkart) process.env.FLIPKART_AFFILIATE_ID = origFlipkart;
  }

  console.log(`\n📊 [AFFILIATE TEST SUMMARY] ${passedTests}/${totalTests} tests passed.\n`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
