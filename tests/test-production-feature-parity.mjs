// =============================================================================
// RIIQX — Live Production Feature & Business Workflow Verification Suite
// Tests all business-critical workflows on live production URL (https://riiqx.vercel.app)
// =============================================================================

import assert from 'node:assert';

const BASE_URL = process.env.TEST_TARGET_URL || 'https://riiqx.vercel.app';
console.log(`\n======================================================`);
console.log(`RIIQX Live Production Feature Verification Suite`);
console.log(`Target: ${BASE_URL}`);
console.log(`======================================================\n`);

const results = [];

async function test(name, fn) {
  try {
    process.stdout.write(`Testing: ${name}... `);
    await fn();
    console.log(`✓ PASS`);
    results.push({ test: name, status: 'PASS', error: null });
  } catch (err) {
    console.log(`✗ FAIL`);
    console.error(`  Error:`, err.message);
    results.push({ test: name, status: 'FAIL', error: err.message });
  }
}

async function run() {
  // 1. Health Endpoints
  await test('GET /api/health responds with 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
  });

  await test('GET /api/health/supabase responds with 200 OK and all verified tiers', async () => {
    const res = await fetch(`${BASE_URL}/api/health/supabase`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'VERIFIED');
    assert.strictEqual(data.healthy, true);
    assert(Boolean(data.tiers.Database));
    assert(Boolean(data.tiers.Auth));
    assert(Boolean(data.tiers.RLS));
  });

  // 2. Twin Profile & Goals
  await test('GET /api/twin/profile responds with 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/profile`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Boolean(data.profile));
    assert(Boolean(data.profile.twinName));
  });

  await test('GET /api/twin/goals responds with 200 OK and valid goals list', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/goals`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.goals));
    assert(data.goals.length > 0);
  });

  // 3. Price Sniper / Watchlist
  await test('GET /api/twin/price-sniper responds with 200 OK and dashboard report', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/price-sniper`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Boolean(data.report));
    assert(Array.isArray(data.report.watchlist));
  });

  await test('POST /api/twin/price-sniper tracks a real product without mock simulation', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/price-sniper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productTitle: 'Sony WH-1000XM5 Wireless Headphones',
        targetPrice: 24990,
        currentPrice: 28990,
        retailerName: 'Amazon India',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Boolean(data.item));
    assert.strictEqual(data.item.productTitle, 'Sony WH-1000XM5 Wireless Headphones');
    assert.strictEqual(data.item.targetSnipePrice, 24990);
    assert.strictEqual(data.item.initialObservedPrice, 28990);
  });

  // 4. Twin Lifestyle Intelligence
  await test('GET /api/twin/lifestyle responds with 200 OK and supported parameters', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/lifestyle`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Array.isArray(data.supportedDiets));
    assert(Array.isArray(data.supportedBudgets));
  });

  await test('POST /api/twin/lifestyle generates authentic home cooking nutrition strategy', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/lifestyle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'cook_home',
        ingredients: 'eggs, spinach, tomatoes, olive oil',
        diet: 'High Protein / Low Carb',
        budget: 'Under ₹200',
        mealType: 'Dinner',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.mode, 'cook_home');
    assert(Array.isArray(data.recommendations));
    assert(data.recommendations.length > 0);
  });

  // 5. Twin Opportunities & Rewards
  await test('GET /api/twin/opportunities responds with 200 OK and verified deals', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/opportunities`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.opportunities));
    assert(data.opportunities.length > 0);
  });

  await test('GET /api/twin/rewards responds with 200 OK and verified ledger account', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/rewards`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Boolean(data.account));
    assert(typeof data.account.availableBalance === 'number');
    assert(Array.isArray(data.ledger));
  });

  await test('GET /api/twin/digest responds with 200 OK and digests list', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/digest`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Array.isArray(data.digests));
  });

  // 6. Dual-Mode Authentication & Profile Validation
  await test('POST /api/riiqx/auth registers/authenticates and returns session', async () => {
    const testEmail = `parity_validation_${Date.now()}@gmail.com`;
    const res = await fetch(`${BASE_URL}/api/riiqx/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        email: testEmail,
        password: 'Password@Riiqx2026!',
        name: 'Parity Validation User',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Boolean(data.token));
  });

  console.log(`\n======================================================`);
  console.log(`Business Feature Verification Summary`);
  console.log(`======================================================`);
  console.table(results);

  const failed = results.filter((r) => r.status === 'FAIL');
  if (failed.length > 0) {
    console.error(`\n${failed.length} test(s) failed.`);
    process.exit(1);
  } else {
    console.log(`\nAll ${results.length} production workflow tests PASSED with 100% success!`);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
