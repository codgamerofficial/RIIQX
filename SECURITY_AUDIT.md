# RIIQX 2.0 — Security, Compliance & Anti-Fraud Audit
**Audit Date:** 2026-11-13  
**Framework Standards:** OWASP Top 10 • India Consumer Protection (E-Commerce) Rules 2020 & 2026 • DPDP Act 2023  

---

## 1. Security Architecture & Threat Modeling

### A. Zero Client-Side Secret Exposure
- All supplier API keys (Qikink, Printrove, CJ), payment gateway secret keys (Razorpay/Cashfree), and AI model keys are strictly held in server-side environment variables (`process.env.*`) or encrypted in PostgreSQL via AES-256-GCM.
- No sensitive keys or tokens are prefixed with `NEXT_PUBLIC_`.

### B. Payment Fraud & Tampering Defenses
1. **Never Trust Frontend Payment Callbacks:** An order is NEVER marked `paid` simply because the client claims checkout succeeded. The server must verify the cryptographic HMAC signature (`razorpay_signature = HMAC-SHA256(order_id + "|" + payment_id, secret)`).
2. **Idempotency Keys:** Every checkout transaction and payment webhook carries a unique idempotency key to prevent double-charging or duplicate fulfillment dispatches.

### C. Database Security & Row-Level Security (RLS)
- Every table containing customer or order data has RLS enabled.
- Customers can only query rows where `auth.uid() = customer_id`.
- Administrative operations require verified service-role authorization or explicit admin role membership.

---

## 2. Indian Regulatory & Statutory Compliance
1. **Mandatory Country of Origin:** Every product card and detail page displays `Country of Origin: India` (or supplier origin) as mandated by Legal Metrology (Packaged Commodities) Rules and E-Commerce Rules.
2. **Clear Refund & Return Disclosure:** 7-day hassle-free replacement for transit damage or defective goods is clearly stated on all product pages prior to checkout.
3. **Consumer Grievance Redressal:** A designated Grievance Officer email and Indian contact channel are published in the footer and terms pages.
4. **Transparent Pricing:** No deceptive drip pricing or hidden convenience fees added at final checkout.

