# RIIQX 2.0 — Zero-Budget Merchant Onboarding Checklist

**Target:** Transition RIIQX from Local Sandbox to Live Commercial Operations with ₹0 Upfront Software Fees.

---

## Phase 1: Payment Gateway Activation (Prepaid Payments)

To accept domestic UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Netbanking, set up an Indian payment gateway account:

### Step 1.1: Razorpay / Cashfree Account Creation
* [ ] Register as an **Individual** or **Sole Proprietorship** on [Razorpay.com](https://razorpay.com) or [Cashfree.com](https://www.cashfree.com).
* [ ] Complete instant paperless KYC:
  * PAN Card of business owner
  * Aadhaar Card for instant e-Sign KYC
  * Cancelled cheque or bank statement showing IFSC & Account Number (for daily T+1 settlements)
* [ ] Submit website URL (`https://riiqx.vercel.app`) for compliance review.
  * Ensure `/terms`, `/privacy`, `/about`, and contact details are live (already implemented in RIIQX).

### Step 1.2: Generate API Credentials
* [ ] Navigate to Razorpay Dashboard > Settings > API Keys.
* [ ] Generate **Live Key ID** (`rzp_live_...`) and **Key Secret**.
* [ ] Add Webhook Endpoint in Razorpay:
  * **Webhook URL:** `https://riiqx.vercel.app/api/commerce/webhooks/razorpay`
  * **Secret:** Secure 32-character string
  * **Events to Subscribe:** `payment.captured`, `payment.failed`, `refund.processed`
* [ ] Update `.env.local` & Vercel Project Settings:
  ```env
  RAZORPAY_KEY_ID=rzp_live_...
  RAZORPAY_KEY_SECRET=...
  RAZORPAY_WEBHOOK_SECRET=...
  ```

---

## Phase 2: Supplier Hub Integration (Zero-Inventory Fulfilment)

### Step 2.1: Qikink POD Activation
* [ ] Register at [admins.qikink.com](https://admins.qikink.com).
* [ ] Navigate to Dashboard > Developer / API Settings.
* [ ] Request API credentials:
  * Client ID & API Token
* [ ] Maintain a minimal working float (e.g. ₹500–₹1,000) inside Qikink wallet for automated order printing:
  * *Operational rule: Since RIIQX is 100% prepaid, the customer pays upfront, funds settle into your bank, and the supplier wallet is topped up without debt.*
* [ ] Configure `.env.local`:
  ```env
  QIKINK_API_KEY=...
  QIKINK_CLIENT_ID=...
  ```

### Step 2.2: Artisanal Guild / Direct Fulfilment Partner
* [ ] For hard goods (brass valet trays, Sheesham wood organizers, Khurja stoneware ceramics), establish direct communication with Moradabad / Saharanpur manufacturers.
* [ ] Use the built-in [Simulated Sandbox Adapter](file:///d:/GlowFit%20AI/src/lib/riiqx/commerce/supplier-adapter.ts) for testing, and switch to live webhook PO dispatch upon contract signoff.

---

## Phase 3: Custom Domain & Brand Deployment

### Step 3.1: Connect Brand Domain on Vercel
* [ ] Purchase `riiqx.in` or `riiqx.com` from Namecheap or GoDaddy (typically ₹499–₹899/year).
* [ ] In Vercel Project Dashboard > Settings > Domains:
  * Add `riiqx.in` and `www.riiqx.in`.
* [ ] Add DNS Records at your domain registrar:
  * **Type:** `A`, **Name:** `@`, **Value:** `76.76.21.21`
  * **Type:** `CNAME`, **Name:** `www`, **Value:** `cname.vercel-dns.com`

---

## Phase 4: Production Launch Invariant Check

Before publishing the first announcement:
* [ ] Run `node tests/test-riiqx-commerce-heritage-e2e.mjs` — ensure 8/8 tests pass.
* [ ] Perform 1 live test transaction of ₹1 using your personal UPI on the `/shop` checkout.
* [ ] Confirm test order appears in [`/admin`](file:///d:/GlowFit%20AI/src/app/admin/page.tsx) under the live orders queue.
* [ ] Verify that order confirmation SMS / WhatsApp trigger is received.
* [ ] Confirm that COD remains strictly disabled.

