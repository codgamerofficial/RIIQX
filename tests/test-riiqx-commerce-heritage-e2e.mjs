// =============================================================================
// RIIQX 2.0 — Modern Indian Heritage Commerce E2E Verification Suite
// Comprehensive End-to-End Test for Catalog, Unit Economics, Checkout & Suppliers
// =============================================================================

import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001';

console.log('🏛️  Starting RIIQX 2.0 Modern Indian Heritage E2E Test Suite');
console.log(`📡 Target API Gateway: ${BASE_URL}\n`);

let passedTests = 0;
let totalTests = 0;

async function runTest(name, fn) {
  totalTests++;
  process.stdout.write(`[TEST ${totalTests}] ${name} ... `);
  try {
    await fn();
    console.log('✅ PASSED');
    passedTests++;
  } catch (err) {
    console.log('❌ FAILED');
    console.error(`   Error: ${err.message}`);
  }
}

async function main() {
  // Test 1: Fetch Catalog
  let catalog = [];
  await runTest('Catalog API returns active heritage products', async () => {
    const res = await fetch(`${BASE_URL}/api/commerce/products`);
    assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.equal(data.success, true, 'Response success should be true');
    assert.ok(Array.isArray(data.products), 'Products should be an array');
    assert.ok(data.products.length >= 10, `Expected at least 10 products, got ${data.products.length}`);
    catalog = data.products;
  });

  // Test 2: Filter by Collection
  await runTest('Catalog filter by collection (RIIQX Objects)', async () => {
    const res = await fetch(`${BASE_URL}/api/commerce/products?collection=RIIQX%20Objects`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.products.length > 0, 'Should return products for RIIQX Objects');
    for (const p of data.products) {
      assert.equal(p.collection, 'RIIQX Objects', `Expected RIIQX Objects, got ${p.collection}`);
    }
  });

  // Test 3: Search Catalog
  await runTest('Catalog search query matching ("brass")', async () => {
    const res = await fetch(`${BASE_URL}/api/commerce/products?q=brass`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.products.length > 0, 'Search should find brass products');
    const hasBrass = data.products.some(
      (p) => p.title.toLowerCase().includes('brass') || p.materials.some((m) => m.toLowerCase().includes('brass'))
    );
    assert.ok(hasBrass, 'At least one product must match "brass" in title or materials');
  });

  // Test 4: Single Product Detail
  let testProduct = null;
  await runTest('Product Detail API with statutory origin & material disclosures', async () => {
    const target = catalog[0];
    assert.ok(target, 'Catalog must not be empty');
    const res = await fetch(`${BASE_URL}/api/commerce/products/${target.id}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.product.id, target.id);
    assert.ok(data.product.materials?.length > 0, 'Materials disclosure is mandatory');
    assert.equal(data.product.countryOfOrigin, 'India', 'Country of origin must be India');
    assert.ok(data.product.pricing, 'Transparent landed pricing must be present');
    testProduct = data.product;
  });

  // Test 5: Unit Economics Validation
  await runTest('Unit Economics invariant: contribution margin >= 30% on launch SKUs', async () => {
    for (const p of catalog.slice(0, 5)) {
      assert.ok(p.price > 0, 'Price must be positive');
      assert.ok(p.mrp >= p.price, 'MRP must be >= retail price');
      if (p.pricing) {
        const margin = p.pricing.netContributionMarginPct;
        assert.ok(margin >= 30, `Product ${p.sku} margin (${margin}%) below 30% threshold`);
      }
    }
  });

  // Test 6: COD Rejection Invariant
  await runTest('Checkout rejects Cash-on-Delivery (COD) attempts in Phase 1', async () => {
    const res = await fetch(`${BASE_URL}/api/commerce/checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        shippingAddress: {
          fullName: 'Test Customer',
          phone: '+91 98765 43210',
          addressLine1: 'Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700016',
          country: 'India',
        },
        paymentMethod: 'cod', // Intentionally invalid
      }),
    });

    assert.equal(res.status, 400, 'COD attempt must be rejected with HTTP 400');
    const data = await res.json();
    assert.ok(data.error.toLowerCase().includes('prepaid') || data.error.toLowerCase().includes('disabled'), 'Error message must specify prepaid only');
  });

  // Test 7: Valid Prepaid Checkout Initiation
  let createdOrder = null;
  await runTest('Prepaid checkout initiates order with pending_payment status', async () => {
    const res = await fetch(`${BASE_URL}/api/commerce/checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        shippingAddress: {
          fullName: 'Saswata Dey',
          phone: '+91 98765 43210',
          addressLine1: 'Salt Lake Sector V',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
          country: 'India',
        },
        paymentMethod: 'upi',
      }),
    });

    assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.order, 'Order object must be returned');
    assert.equal(data.order.status, 'pending_payment');
    assert.equal(data.order.paymentMethod, 'upi');
    assert.equal(data.order.totalAmount, testProduct.price);
    createdOrder = data.order;
  });

  // Test 8: Payment Verification & Automated Supplier Routing
  await runTest('Payment verification triggers automated supplier PO routing', async () => {
    assert.ok(createdOrder, 'Created order is required');
    const res = await fetch(`${BASE_URL}/api/commerce/checkout/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: createdOrder.id,
        paymentId: `pay_upi_test_${Date.now()}`,
        gatewayName: 'razorpay',
      }),
    });

    assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.order.status, 'supplier_accepted');
    assert.ok(data.order.supplierOrderId, 'Supplier confirmation PO number must be generated');
    assert.equal(data.order.courierPartner, 'BlueDart Express Air');
    assert.ok(data.order.trackingNumber, 'Courier tracking number must be assigned');
  });

  console.log(`\n==================================================`);
  console.log(`🏁 Test Summary: ${passedTests}/${totalTests} tests passed`);
  console.log(`==================================================`);

  if (passedTests === totalTests) {
    console.log('🎉 All RIIQX 2.0 Commerce OS invariants verified!\n');
    process.exit(0);
  } else {
    console.error('⚠️  Some tests failed. Review logs above.\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
