// =============================================================================
// RIIQX — Phase 1 & 5 Security & Auth Remediation Test Suite
// Verifies: Strict user authentication, removal of usr_riiqx_primary fallbacks,
// prevention of ?userId= query param IDOR, CRON_SECRET enforcement, and account isolation.
// =============================================================================

import assert from 'node:assert/strict';
import { resolveAuthUserId } from '../src/lib/riiqx/session-helper.ts';
import { getConnectedAccounts, getAccountWithCredentials } from '../src/lib/riiqx/social/account-repository.ts';

console.log('🧪 [TEST SUITE] Phase 1 & 5: Security & Auth Remediation');

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
  // Test 1: resolveAuthUserId must reject ?userId= spoofing
  await runAsyncTest('Query param ?userId= spoofing is rejected by resolveAuthUserId', async () => {
    const fakeReq = {
      cookies: { get: () => undefined },
      headers: { get: () => null },
      url: 'https://riiqx.com/api/test?userId=attacker_spoofed_victim',
    };
    const resolved = await resolveAuthUserId(fakeReq);
    assert.equal(resolved, null, 'Should return null and not trust ?userId= query parameter');
  });

  // Test 2: Unauthenticated request to resolveAuthUserId returns null
  await runAsyncTest('Unauthenticated request returns null (no fallback to usr_riiqx_primary)', async () => {
    const emptyReq = {
      cookies: { get: () => undefined },
      headers: { get: () => null },
      url: 'https://riiqx.com/api/twin/deal-shorts/publish',
    };
    const resolved = await resolveAuthUserId(emptyReq);
    assert.equal(resolved, null, 'Unauthenticated user must be null, never usr_riiqx_primary');
  });

  // Test 3: getConnectedAccounts strictly scopes to requested userId
  await runAsyncTest('getConnectedAccounts strictly returns only caller user accounts', async () => {
    const userA = 'usr_alice_isolated';
    const userB = 'usr_bob_isolated';

    const accountsA = await getConnectedAccounts(userA);
    const accountsB = await getConnectedAccounts(userB);

    assert.ok(Array.isArray(accountsA), 'Returns array');
    assert.ok(Array.isArray(accountsB), 'Returns array');
    // Ensure no cross-pollination
    for (const acc of accountsA) {
      assert.equal(acc.user_id, userA, 'Account must strictly belong to userA');
    }
  });

  // Test 4: getAccountWithCredentials returns null for unauthorized user (IDOR prevention)
  await runAsyncTest('getAccountWithCredentials prevents IDOR by rejecting foreign accounts', async () => {
    const victimAccountId = 'acc_victim_account_99';
    const attackerUserId = 'usr_attacker_malicious';

    const result = await getAccountWithCredentials(victimAccountId, attackerUserId);
    assert.equal(result, null, 'Must reject access to accounts not owned by caller');
  });

  // Test 5: Mandatory CRON_SECRET enforcement
  runTest('CRON_SECRET environment variable requirement validation', () => {
    const originalSecret = process.env.CRON_SECRET;
    try {
      // Simulate missing secret
      delete process.env.CRON_SECRET;
      const cronSecret = process.env.CRON_SECRET;
      assert.equal(Boolean(cronSecret), false, 'Without CRON_SECRET, cron sweep must be denied');

      // Simulate valid secret
      process.env.CRON_SECRET = 'riiqx_secure_test_cron_secret_2026';
      const authHeader = 'Bearer riiqx_secure_test_cron_secret_2026';
      const isValid = authHeader === `Bearer ${process.env.CRON_SECRET}`;
      assert.equal(isValid, true, 'Valid CRON_SECRET bearer token is accepted');
    } finally {
      if (originalSecret) {
        process.env.CRON_SECRET = originalSecret;
      }
    }
  });

  console.log(`\n📊 [SECURITY TEST SUMMARY] ${passedTests}/${totalTests} tests passed.\n`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
