// =============================================================================
// RIIQX — Phase 3 & 4 Hyperlocal Verification & Social Truth Test Suite
// Verifies: Removal of fabricated price jitter, transparent benchmark labeling,
// honest POS terminal disclaimers, and honest queued status reporting.
// =============================================================================

import assert from 'node:assert/strict';
import { HyperlocalArbitrageEngine } from '../src/services/product-intelligence/hyperlocal-arbitrage-engine.ts';
import { publishProjectToSocial } from '../src/lib/riiqx/social/publishing-engine.ts';

console.log('🧪 [TEST SUITE] Phase 3 & 4: Hyperlocal Verification & Social Truth');

let passedTests = 0;
let totalTests = 0;

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
  // Test 1: Zero fabricated price jitter in physical store pricing
  await runAsyncTest('Physical stores use baseline price without fabricated jitter multiplier', async () => {
    const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      onlineDeliveredPrice: 26990,
      userCity: 'Kolkata',
      userPincode: '700068',
    });

    assert.ok(report.offlineStores.length > 0, 'Must return nearby verified store locations');
    for (const store of report.offlineStores) {
      assert.equal(
        store.storePrice,
        26990,
        'Base store price must equal online baseline, not artificial random jitter'
      );
      assert.equal(
        store.isPriceVerified,
        false,
        'Must honestly declare store price is unverified live counter quote'
      );
      assert.equal(
        store.priceVerificationType,
        'market_benchmark_estimate',
        'Verification type must be market_benchmark_estimate'
      );
      assert.ok(store.priceDisclaimer, 'Must include explicit price disclaimer');
    }
  });

  // Test 2: In-store terminal cashback marked indicative with zero fake manager discounts
  await runAsyncTest('POS terminal cashbacks flagged as indicative schemes with zero fake manager discounts', async () => {
    const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
      productTitle: 'Apple iPhone 15 128GB',
      onlineDeliveredPrice: 71999,
      userCity: 'Bengaluru',
      userPincode: '560038',
    });

    for (const store of report.offlineStores) {
      assert.equal(
        store.managerDiscountPotentialRupees,
        0,
        'Manager spot discount must be 0 without explicit merchant agreement'
      );
      assert.equal(
        store.posOfferStatus,
        'indicative_terminal_scheme',
        'POS offer status must be indicative_terminal_scheme'
      );
      assert.equal(
        store.stockLevel,
        'call_to_check',
        'Stock level must honestly be call_to_check without direct live inventory API'
      );
    }
  });

  // Test 3: Haversine distance and real store branches preserved
  await runAsyncTest('Haversine distance and real store metadata remain genuinely accurate', async () => {
    const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
      productTitle: 'Samsung 55-inch 4K TV',
      onlineDeliveredPrice: 42990,
      userCity: 'Mumbai',
      userPincode: '400013',
    });

    assert.ok(report.offlineStores.length > 0);
    const firstStore = report.offlineStores[0];
    assert.ok(firstStore.distanceKm > 0, 'Real positive distance');
    assert.ok(firstStore.drivingMinutes > 0, 'Real driving minutes');
    assert.ok(firstStore.directionsUrl.includes('google.com/maps'), 'Real Google Maps deep-link');
  });

  // Test 4: Scheduled social post is reported as 'queued', never falsely claimed as 'published'
  await runAsyncTest('Queued social post is reported honestly as status queued, never published', async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // Tomorrow
    const publishRes = await publishProjectToSocial({
      userId: 'usr_test_publisher',
      accountId: 'acc_test_publisher',
      platform: 'youtube',
      title: 'Sony XM5 Price Drop #Shorts',
      caption: 'Big deal drop alert!',
      mediaUrl: 'https://cdn.riiqx.com/videos/sample.mp4',
      scheduledFor: futureDate,
      idempotencyKey: `test_sched_${Date.now()}`,
    });

    assert.equal(publishRes.success, true);
    assert.equal(publishRes.status, 'queued', 'Scheduled post status must be queued, NEVER published');
    assert.ok(!publishRes.platformMediaId, 'Queued post must not have live platform media ID');
  });

  console.log(`\n📊 [HYPERLOCAL & SOCIAL TEST SUMMARY] ${passedTests}/${totalTests} tests passed.\n`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
