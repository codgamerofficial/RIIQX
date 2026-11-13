# RIIQX 2.0 — Master System Architecture
**Brand:** RIIQX — A New Perspective on Indian Living  
**Architecture:** Modern Indian Heritage D2C Commerce Platform & Intelligent Autonomous Infrastructure  
**Core Technologies:** Next.js 14 (App Router), React 18, TypeScript 5.6, Supabase PostgreSQL, Tailwind CSS, Framer Motion, React Native (Expo)  

---

## 1. End-to-End System Architecture

```mermaid
graph TD
    subgraph ClientExperiences["Customer & Merchant Touchpoints"]
        Storefront["RIIQX Storefront (Next.js 14)<br/>Warm Ivory / Terracotta Editorial"]
        MobileApp["RIIQX Mobile App (React Native/Expo)<br/>Native iOS & Android Client"]
        AdminHub["RIIQX Operations OS (/admin)<br/>RBAC Admin Control Center"]
        MusicStudio["RIIQX Audio & Creator Hub (/music)<br/>Audiophile & Creator Utility"]
    end

    subgraph CommerceOS["RIIQX Commerce OS (Core Backend Engine)"]
        CatalogEngine["Product Intelligence & Catalog"]
        PricingEngine["Pricing & Contribution Margin Calculator"]
        CartCheckout["Cart, Checkout & Inventory Reservation"]
        OrderLifecycle["Order State Machine & Routing"]
        ReturnRefund["Returns, QC & Gateway Refund Automation"]
    end

    subgraph SecurityVault["Security & Identity Layer"]
        SupabaseAuth["Supabase Auth (SSR Cookies & Bearer JWT)"]
        RLSPolicies["PostgreSQL Row-Level Security"]
        CryptoVault["AES-256-GCM Token Encryption & HMAC Verification"]
    end

    subgraph SupplierHub["Supplier Integration Hub (SupplierAdapter)"]
        AdapterInterface["SupplierAdapter (Common Interface)"]
        QikinkAdapter["Qikink Adapter (Indian POD)"]
        PrintroveAdapter["Printrove Adapter (Lifestyle POD)"]
        CJAdapter["CJ Dropshipping Adapter (Global Warehouses)"]
        SimulatedAdapter["Simulated Sandbox Adapter (Local Dev & Testing)"]
    end

    subgraph LogisticsPayments["External Logistics & Payment Networks"]
        PaymentGateways["Razorpay / Cashfree (UPI, Cards, Netbanking)"]
        Couriers["BlueDart / Delhivery / Ekart API Tracking"]
    end

    Storefront -->|HTTPS / JSON| CommerceOS
    MobileApp -->|REST API| CommerceOS
    AdminHub -->|Server Actions / API| CommerceOS
    MusicStudio -->|Internal Context| CommerceOS

    CommerceOS --> SecurityVault
    SecurityVault --> SupabaseAuth
    SecurityVault --> RLSPolicies

    OrderLifecycle --> AdapterInterface
    AdapterInterface --> QikinkAdapter
    AdapterInterface --> PrintroveAdapter
    AdapterInterface --> CJAdapter
    AdapterInterface --> SimulatedAdapter

    CartCheckout --> PaymentGateways
    OrderLifecycle --> Couriers
```

---

## 2. Core Functional Subsystems

### 2.1 The `SupplierAdapter` Abstraction
All supplier integrations adhere strictly to a standardized TypeScript contract:
```typescript
export interface SupplierAdapter {
  id: string;
  name: string;
  authenticate(): Promise<boolean>;
  testConnection(): Promise<{ ok: boolean; latencyMs: number }>;
  getProducts(params?: CatalogQuery): Promise<SupplierProduct[]>;
  getProductDetails(externalId: string): Promise<SupplierProductDetail>;
  getInventory(sku: string): Promise<InventoryLevel>;
  calculateShipping(params: ShippingCalcParams): Promise<ShippingEstimate>;
  createOrder(order: InternalOrderPayload): Promise<SupplierOrderResult>;
  getOrderStatus(supplierOrderId: string): Promise<SupplierOrderStatus>;
  cancelOrder(supplierOrderId: string, reason: string): Promise<boolean>;
  getTracking(supplierOrderId: string): Promise<TrackingDetails>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;
}
```

### 2.2 Order State Machine
1. `PENDING_PAYMENT` &rarr; Order created, inventory locked in `reserved_stock`.
2. `PAID` &rarr; Payment gateway HMAC signature verified on server.
3. `VALIDATING` &rarr; Address validated, pincode serviceability confirmed.
4. `SUPPLIER_ROUTING` &rarr; Cost, stock, and destination scored; optimal supplier chosen.
5. `AWAITING_SUPPLIER` &rarr; Order dispatched to partner API.
6. `SUPPLIER_ACCEPTED` &rarr; Partner confirms manufacturing/dispatch schedule.
7. `PROCESSING` &rarr; Sourcing/Printing/Packaging in progress.
8. `SHIPPED` &rarr; Waybill & tracking number generated (BlueDart/Delhivery).
9. `OUT_FOR_DELIVERY` &rarr; Courier out for final delivery milestone.
10. `DELIVERED` &rarr; Proof of delivery confirmed.
11. `REFUND_PENDING` / `REFUNDED` &rarr; Reverse-logistics triggered if requested within 7 days.

---

## 3. Database & Persistence Layer
Backed by PostgreSQL on Supabase (`ojtngzqsrdralrhipjzt`):
- All tables protected by strict Row-Level Security (RLS).
- Customers access only their own orders and cart items.
- Administrators granted access based on server-verified roles (`admin_roles`, `admin_users`).
