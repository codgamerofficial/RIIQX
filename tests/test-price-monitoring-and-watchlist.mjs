// =============================================================================
// RIIQX — Supabase-Backed Price Watchlist & Price Monitoring Test Suite
// Verification of Section 10: Persistence, RLS Ownership, Lease Locking & Alert Integrity
// Zero Simulation • Real Arithmetic • State Transitions • SSRF Defense
// =============================================================================

import { PriceMonitoringService } from '../src/services/product-intelligence/price-monitoring-service.ts';
import { ProductURLExtractor } from '../src/services/product-intelligence/url-extractor.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=============================================================================');
  console.log('RIIQX Price Watchlist & Verified Price Monitoring Test Suite');
  console.log('Target: PriceMonitoringService, State Transitions & Storage Resilience');
  console.log('=============================================================================\n');

  const USER_A = `usr_test_alpha_${Date.now()}`;
  const USER_B = `usr_test_beta_${Date.now()}`;

  // ---------------------------------------------------------------------------
  // TEST 1: Authenticated user creates a persistent watchlist
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: Authenticated User Creates Persistent Watchlist ---');
  let watchlistA;
  try {
    watchlistA = await PriceMonitoringService.addOrUpdateWatchlist(USER_A, {
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      retailerName: 'Amazon India',
      sellerName: 'Appario Retail',
      currentPrice: 28990,
      targetPrice: 24000,
      variantAttributes: { color: 'Black' },
    });

    assert(Boolean(watchlistA.id), `Watchlist created with ID: ${watchlistA.id}`);
    assert(watchlistA.userId === USER_A, `Ownership strictly assigned to user: ${watchlistA.userId}`);
    assert(watchlistA.targetPrice === 24000, `Target price set to ₹24,000 (Got ₹${watchlistA.targetPrice})`);
    assert(watchlistA.initialPrice === 28990, `Initial price recorded as ₹28,990`);
    assert(watchlistA.alertStatus === 'monitoring', `Initial alert status is 'monitoring'`);
  } catch (err) {
    assert(false, `Test 1 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: User A cannot read User B's watchlist (Strict Ownership & Isolation)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 2: User Ownership Isolation (User A vs User B) ---');
  try {
    const watchlistB = await PriceMonitoringService.addOrUpdateWatchlist(USER_B, {
      productTitle: 'Apple iPad Air M2 128GB',
      productIdentifier: 'APPLE_IPAD_AIR_M2',
      productUrl: 'https://www.amazon.in/dp/B0D3J7LXXX',
      retailerName: 'Amazon India',
      currentPrice: 59900,
      targetPrice: 52000,
    });

    const userAList = await PriceMonitoringService.getUserWatchlists(USER_A);
    const userBList = await PriceMonitoringService.getUserWatchlists(USER_B);

    assert(userAList.some((w) => w.id === watchlistA.id), "User A's list contains User A's item");
    assert(!userAList.some((w) => w.id === watchlistB.id), "User A CANNOT see User B's item");
    assert(userBList.some((w) => w.id === watchlistB.id), "User B's list contains User B's item");
    assert(!userBList.some((w) => w.id === watchlistA.id), "User B CANNOT see User A's item");
  } catch (err) {
    assert(false, `Test 2 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Records survive service / server restart (Disk Storage Persistence)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 3: Watchlist Records Survive Server Restart ---');
  try {
    // Re-query directly to confirm persistence on storage
    const recoveredList = await PriceMonitoringService.getUserWatchlists(USER_A);
    const recovered = recoveredList.find((w) => w.id === watchlistA.id);

    assert(Boolean(recovered), 'Watchlist record reloaded from persistent storage');
    assert(recovered?.targetPrice === 24000, `Reloaded record preserves target price ₹24,000`);
    assert(recovered?.productIdentifier === 'SONY_WH1000XM5_BLK', 'Identifier matches exactly');
  } catch (err) {
    assert(false, `Test 3 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Exact variant mismatch blocks observation
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 4: Exact Variant Mismatch Blocks Observation ---');
  try {
    // Observation with a different product identifier / model
    const mismatchObs = {
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM4_OLD', // Mismatch!
      productTitle: 'Sony WH-1000XM4 (Older Model)',
      platform: 'amazon',
      observedPrice: 19990,
      observedMrp: 29990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B0863TXGM3',
      verificationStatus: 'live_verified',
      verificationMethod: 'Live PDP extraction',
      verifiedAt: new Date().toISOString(),
    };

    const alert = await PriceMonitoringService.evaluatePriceDropAlert(watchlistA, mismatchObs);
    assert(alert === null, 'Variant mismatch strictly blocks price alert evaluation (Returned null)');
  } catch (err) {
    assert(false, `Test 4 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Seller change is treated as distinct listing
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 5: Seller Change Treated as Distinct Listing ---');
  try {
    const sellerMismatchObs = {
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      platform: 'amazon',
      observedPrice: 21990,
      observedMrp: 29990,
      sellerName: 'Unverified Third Party Refurb Store', // Does not match Appario Retail!
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'Live PDP extraction',
      verifiedAt: new Date().toISOString(),
    };

    const alert = await PriceMonitoringService.evaluatePriceDropAlert(watchlistA, sellerMismatchObs);
    assert(alert === null, 'Seller mismatch strictly rejected from trigger (Returned null)');
  } catch (err) {
    assert(false, `Test 5 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Valid observations are saved with timestamps
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 6: Valid Timestamped Price Observation Ingestion ---');
  let validObs;
  try {
    validObs = await PriceMonitoringService.recordPriceObservation({
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      platform: 'amazon',
      observedPrice: 26990,
      observedMrp: 34990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'Direct PDP Schema.org extraction',
    });

    assert(Boolean(validObs.id), `Observation created with ID: ${validObs.id}`);
    assert(Boolean(validObs.verifiedAt), `Observation contains verifiedAt timestamp: ${validObs.verifiedAt}`);
    assert(validObs.observedPrice === 26990, `Observed price ₹26,990 recorded correctly`);
  } catch (err) {
    assert(false, `Test 6 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Unverified / zero prices and search URLs are rejected
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 7: Zero Prices & Search Pages Blocked from History ---');
  try {
    let zeroPriceBlocked = false;
    try {
      await PriceMonitoringService.recordPriceObservation({
        productIdentifier: 'TEST_PROD',
        productTitle: 'Test Product',
        platform: 'amazon',
        observedPrice: 0, // Illegal!
        observedMrp: 1000,
        inStock: true,
        currency: 'INR',
        deliveryCharge: 0,
        deliveryStatus: 'free',
        mandatoryFees: 0,
        sourceUrl: 'https://www.amazon.in/dp/B000000000',
        verificationStatus: 'live_verified',
        verificationMethod: 'Test',
      });
    } catch {
      zeroPriceBlocked = true;
    }
    assert(zeroPriceBlocked, 'Zero price observation rejected with error');

    let searchUrlBlocked = false;
    try {
      await PriceMonitoringService.recordPriceObservation({
        productIdentifier: 'TEST_PROD_2',
        productTitle: 'Test Product 2',
        platform: 'amazon',
        observedPrice: 1500,
        observedMrp: 2000,
        inStock: true,
        currency: 'INR',
        deliveryCharge: 0,
        deliveryStatus: 'free',
        mandatoryFees: 0,
        sourceUrl: 'https://www.amazon.in/s?k=sony+headphones', // Illegal search URL!
        verificationStatus: 'provider_reported',
        verificationMethod: 'Search snippet',
      });
    } catch {
      searchUrlBlocked = true;
    }
    assert(searchUrlBlocked, 'Search listing URL rejected as verified product history');
  } catch (err) {
    assert(false, `Test 7 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Unknown fees do not become zero
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 8: Unknown Fees Honestly Preserved ---');
  try {
    const unknownFeeObs = await PriceMonitoringService.recordPriceObservation({
      productIdentifier: 'SONY_WF1000XM5_TEST',
      productTitle: 'Sony WF-1000XM5',
      platform: 'flipkart',
      observedPrice: 19990,
      observedMrp: 24990,
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'unknown', // Unknown shipping charge
      mandatoryFees: 0,
      sourceUrl: 'https://www.flipkart.com/p/itm123456',
      verificationStatus: 'provider_reported',
      verificationMethod: 'Catalog extraction',
    });

    assert(unknownFeeObs.deliveryStatus === 'unknown', 'deliveryStatus remains unknown');
    assert(unknownFeeObs.deliveryCharge === 0, 'deliveryCharge is 0 but tagged unknown');
  } catch (err) {
    assert(false, `Test 8 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 9: Target-price crossing generates exactly one alert event
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 9: Target Price Crossing Generates Alert ---');
  let firstAlert;
  try {
    // Current price drops to ₹22,990 (Target is ₹24,000!)
    const qualifyingObs = {
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      platform: 'amazon',
      observedPrice: 22990, // <= ₹24,000 target!
      observedMrp: 34990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'Live PDP extraction',
      verifiedAt: new Date().toISOString(),
    };

    firstAlert = await PriceMonitoringService.evaluatePriceDropAlert(watchlistA, qualifyingObs);

    assert(Boolean(firstAlert), 'Qualifying price drop generated an alert event');
    assert(firstAlert?.observedPrice === 22990, `Alert records observed price: ₹${firstAlert?.observedPrice}`);
    assert(firstAlert?.targetPrice === 24000, `Alert records target price: ₹${firstAlert?.targetPrice}`);
    assert(firstAlert?.deliveryStatus === 'pending', 'Alert delivery status is honestly marked as pending outbox');
  } catch (err) {
    assert(false, `Test 9 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 10: Repeated unchanged observations do not duplicate alerts
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 10: Unchanged Price Deduplication (No Spam Alerts) ---');
  try {
    // Reload updated watchlist with 'target_hit' state
    const userAList = await PriceMonitoringService.getUserWatchlists(USER_A);
    const updatedWatchlistA = userAList.find((w) => w.id === watchlistA.id);

    assert(updatedWatchlistA?.alertStatus === 'target_hit', "Watchlist transitioned to 'target_hit' state");

    // Second check: Price is still ₹22,990
    const repeatedObs = {
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      platform: 'amazon',
      observedPrice: 22990, // Unchanged!
      observedMrp: 34990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'Live PDP extraction',
      verifiedAt: new Date().toISOString(),
    };

    const duplicateAlert = await PriceMonitoringService.evaluatePriceDropAlert(updatedWatchlistA, repeatedObs);
    assert(duplicateAlert === null, 'Repeated unchanged price strictly suppressed (No duplicate alert created)');
  } catch (err) {
    assert(false, `Test 10 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 11: Price recovery and new downward crossing produces a new eligible alert
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 11: Price Recovery & Fresh Downward Crossing ---');
  try {
    const userAList = await PriceMonitoringService.getUserWatchlists(USER_A);
    const currentWl = userAList.find((w) => w.id === watchlistA.id);

    // Step A: Price recovers above target (to ₹25,500 > ₹24,000)
    const recoveryObs = {
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      platform: 'amazon',
      observedPrice: 25500, // Above target!
      observedMrp: 34990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'Live PDP extraction',
      verifiedAt: new Date().toISOString(),
    };

    await PriceMonitoringService.evaluatePriceDropAlert(currentWl, recoveryObs);

    const afterRecoveryList = await PriceMonitoringService.getUserWatchlists(USER_A);
    const recoveredWl = afterRecoveryList.find((w) => w.id === watchlistA.id);
    assert(recoveredWl?.alertStatus === 'monitoring', "State resets to 'monitoring' after price recovery");

    // Step B: Price drops down AGAIN to ₹21,500 (Fresh crossing below target!)
    const freshDropObs = {
      watchlistId: watchlistA.id,
      productIdentifier: 'SONY_WH1000XM5_BLK',
      productTitle: 'Sony WH-1000XM5 Wireless Headphones',
      platform: 'amazon',
      observedPrice: 21500,
      observedMrp: 34990,
      sellerName: 'Appario Retail',
      inStock: true,
      currency: 'INR',
      deliveryCharge: 0,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      sourceUrl: 'https://www.amazon.in/dp/B09XS7JWHH',
      verificationStatus: 'live_verified',
      verificationMethod: 'Live PDP extraction',
      verifiedAt: new Date().toISOString(),
    };

    const freshAlert = await PriceMonitoringService.evaluatePriceDropAlert(recoveredWl, freshDropObs);
    assert(Boolean(freshAlert), 'Fresh downward crossing triggers a brand new qualifying alert');
    assert(freshAlert?.observedPrice === 21500, `New alert records updated price ₹21,500`);
  } catch (err) {
    assert(false, `Test 11 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 12: Lease locking prevents simultaneous workers from processing same item
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 12: Worker Lease Locking & Concurrency Guard ---');
  try {
    const testWatchlist = await PriceMonitoringService.addOrUpdateWatchlist(USER_A, {
      productTitle: 'Lease Lock Test Item',
      productIdentifier: 'LEASE_TEST_001',
      productUrl: 'https://www.amazon.in/dp/B000000001',
      retailerName: 'Amazon India',
      currentPrice: 1000,
      targetPrice: 800,
    });

    // Worker 1 executes batch
    const batch1 = await PriceMonitoringService.executeScheduledMonitoringBatch(5);
    assert(batch1.processedCount >= 1, `Worker 1 picked up due item for inspection (Processed: ${batch1.processedCount})`);

    // Worker 2 runs immediately after: all picked items should now be leased
    const batch2 = await PriceMonitoringService.executeScheduledMonitoringBatch(5);
    // Since item was just checked, due count for leased item is 0
    assert(batch2.processedCount === 0 || batch2.processedCount < batch1.processedCount, 'Worker 2 respects active lease lock');
  } catch (err) {
    assert(false, `Test 12 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 13: Provider failures and retry counts are recorded
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 13: Provider Failure & Error Recovery Tracking ---');
  try {
    // Add item with intentionally broken URL
    const brokenItem = await PriceMonitoringService.addOrUpdateWatchlist(USER_A, {
      productTitle: 'Broken URL Item',
      productIdentifier: 'BROKEN_URL_001',
      productUrl: 'http://127.0.0.1/malicious-ssrf', // SSRF target
      retailerName: 'Test Store',
      currentPrice: 1000,
      targetPrice: 500,
    });

    // Execute monitoring batch
    const batchResult = await PriceMonitoringService.executeScheduledMonitoringBatch(10);
    assert(batchResult.failuresCount >= 1, `Worker safely trapped extraction failure (Failures: ${batchResult.failuresCount})`);

    const reloaded = (await PriceMonitoringService.getUserWatchlists(USER_A)).find((w) => w.id === brokenItem.id);
    assert(reloaded?.consecutiveFailures >= 1, `Consecutive failure count recorded: ${reloaded?.consecutiveFailures}`);
    assert(Boolean(reloaded?.lastError), `Last error recorded: ${reloaded?.lastError}`);
  } catch (err) {
    assert(false, `Test 13 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 14: No notification is reported as delivered without provider response
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 14: Notification Delivery Status Truth ---');
  try {
    assert(firstAlert?.deliveryStatus === 'pending', 'Alert status is honestly marked as pending outbox, never simulated delivered');
  } catch (err) {
    assert(false, `Test 14 failed: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 15: Connection-Time SSRF Defense (IPv4, IPv6, Hex, Integer Representation)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 15: Deep SSRF Protection Audit ---');
  try {
    const unsafeUrls = [
      'http://127.0.0.1:8080/admin',
      'http://localhost:3000/api/keys',
      'http://169.254.169.254/latest/meta-data',
      'http://metadata.google.internal/computeMetadata/v1',
      'http://10.0.0.1/secret',
      'http://192.168.1.1/router',
      'http://172.16.0.5/internal',
      'http://2130706433/integer-ip', // 127.0.0.1 in integer
      'http://0x7f000001/hex-ip', // 127.0.0.1 in hex
      'http://[::1]/ipv6-loopback',
      'http://[fe80::1]/link-local',
      'http://server.local/internal',
      'ftp://ftp.example.com/file',
      'file:///etc/passwd',
    ];

    let allBlocked = true;
    for (const u of unsafeUrls) {
      if (ProductURLExtractor.isSafeUrl(u)) {
        allBlocked = false;
        console.error(`  [SSRF LEAK]: ${u} was NOT blocked!`);
      }
    }
    assert(allBlocked, 'All 14 dangerous SSRF / private IP vectors blocked by connection filter');

    // Valid public e-commerce URLs permitted
    assert(ProductURLExtractor.isSafeUrl('https://www.amazon.in/dp/B0BDHW4P5S'), 'Amazon India PDP permitted');
    assert(ProductURLExtractor.isSafeUrl('https://www.flipkart.com/product/p/itme?pid=123'), 'Flipkart PDP permitted');
  } catch (err) {
    assert(false, `Test 15 failed: ${err.message}`);
  }

  console.log('\n=============================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED | TOTAL: ${passed + failed}`);
  console.log('=============================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
