# RIIQX 2.0 — Supplier Capability Matrix & Integration Audit
**Integration Engine:** `SupplierAdapter` (Unified TypeScript Provider Architecture)  
**Strict Operational Rule:** No supplier is marked `PRODUCTION_VERIFIED` without verified live API credentials and successful end-to-end test dispatch.  

---

## 1. Verified Supplier Capability Grid

| Supplier Partner | Type | Coverage | Official API Docs | Supported Capabilities | Required Credentials | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Qikink** | Indian POD & Custom Merch | All-India (28k+ pincodes via BlueDart/Delhivery) | `admins.qikink.com/api-docs` | `authenticate`, `getProducts`, `getInventory`, `createOrder`, `getOrderStatus`, `cancelOrder`, `getTracking`, `handleWebhook` | Client ID, API Key, Client Secret | **DOCUMENTATION_VERIFIED** 🔍 |
| **Printrove** | Indian POD & Lifestyle | All-India | `api.printrove.com/` | `authenticate`, `getProducts`, `createOrder`, `getOrderStatus`, `getTracking`, `handleWebhook` | API Key, Secret Token | **DOCUMENTATION_VERIFIED** 🔍 |
| **CJdropshipping** | Global & India Warehouse Dropship | India + 180 Countries | `developers.cjdropshipping.com/` | `authenticate`, `refreshToken`, `getProducts`, `getVariants`, `getInventory`, `calculateShipping`, `createOrder`, `getOrderStatus`, `getTracking` | Access Token, Developer Key | **DOCUMENTATION_VERIFIED** 🔍 |
| **UNICSI** | Indian Dropshipping Aggregator | All-India | `unicsi.com/` | `getProducts`, `getInventory`, `createOrder`, `getOrderStatus` (CSV / REST endpoints) | Merchant ID, Secret Key | **ACCOUNT_REQUIRED** ⚠️ |
| **Indian Artisanal Direct** (Moradabad Brass / Saharanpur Wood) | Specialist Craft Clusters | Direct Courier Dispatch | Manual B2B Agreements / Invoicing | `getProducts` (Catalog ingestion), `calculateShipping`, `createOrder` (Manual/Webhook) | Vendor Agreement, GSTIN | **RESEARCH_ONLY** 📜 |
| **Simulated Sandbox Adapter** | Mock & Dev Verification | Local Runtime | Internal RIIQX Engine | All 15 `SupplierAdapter` methods simulated safely with `sandbox: true` | Zero (Local) | **SANDBOX_TESTED** ✅ |

---

## 2. Capability Matrix & Detailed Provider Breakdown

### A. Qikink (India POD)
- **Strengths:** 240–280 GSM heavyweight cotton, DTF & Screen printing, tote bags, canvas sleeves, ceramic mugs, laser engraving. Direct BlueDart/Delhivery/Ekart courier integration.
- **API Spec:** REST API v2 with JSON payloads. Webhooks on `order_dispatched` and `tracking_update`.
- **Prepayment Model:** Wallet-based debit system. Merchant must recharge Qikink credit balance before order production triggers.
- **Status:** `DOCUMENTATION_VERIFIED`. Awaiting merchant API key assignment upon GST registration.

### B. Printrove (India POD)
- **Strengths:** Extensive lifestyle merchandise, stationery, journals, custom tech cases, apparel. Fast 48-72 hour manufacturing turnaround in Chennai.
- **API Spec:** Token-based API with variant SKU matching.
- **Status:** `DOCUMENTATION_VERIFIED`.

### C. CJdropshipping (Global & Multi-Warehouse)
- **Strengths:** Best-in-class for unique desk gadgets, ambient lighting, precision travel folios, and global fulfillment.
- **API Spec:** Open API v2 with OAuth token exchange and webhook support.
- **Status:** `DOCUMENTATION_VERIFIED`.

