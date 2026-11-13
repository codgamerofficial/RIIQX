# RIIQX 2.0 — Commerce OS API Documentation
**Base URL:** `https://riiqx.vercel.app/api`  
**Security:** HTTPS only • Supabase SSR Session / Bearer JWT Authentication • HMAC Webhook Signatures  

---

## 1. Storefront & Catalog APIs

### `GET /api/commerce/products`
Retrieves paginated, curated catalog items filtered by collection, category, or search term.
- **Query Params:** `category`, `collection`, `sort` (`trending`, `price_asc`, `price_desc`, `newest`), `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "products": [
      {
        "id": "prod_brass_valet_01",
        "title": "The Royal Brass Valet Tray",
        "collection": "RIIQX Objects",
        "price": 1899,
        "mrp": 2999,
        "images": ["/products/brass_tray_hero.jpg"],
        "inStock": true,
        "countryOfOrigin": "India"
      }
    ],
    "pagination": { "page": 1, "totalPages": 2, "totalCount": 24 }
  }
  ```

### `GET /api/commerce/products/[id]`
Retrieves detailed specifications, verified materials, available variants, and delivery estimate by pincode.

---

## 2. Cart & Checkout APIs

### `POST /api/commerce/cart/sync`
Synchronizes customer cart with live inventory, applying price rules and stock reservations.

### `POST /api/commerce/checkout/initiate`
Creates a `pending_payment` order record, locks inventory in `reserved_stock`, and generates a Razorpay/Cashfree order token.
- **Request Body:** `{ items: [...], shippingAddress: {...}, customerPhone: "..." }`
- **Response:** `{ orderId: "ord_...", gatewayOrderId: "order_...", amount: 189900, currency: "INR" }`

### `POST /api/commerce/checkout/verify`
Server-side cryptographic HMAC verification of payment response before transitioning order to `paid`.

---

## 3. Supplier & Fulfilment APIs

### `POST /api/commerce/suppliers/dispatch`
*(Admin / Internal Engine)* Dispatches an approved order to the designated supplier adapter (Qikink, Printrove, CJ, or Simulated Sandbox).

### `POST /api/commerce/webhooks/supplier/[providerId]`
Ingests shipping updates, tracking waybills, and delivery milestones from supplier partners. Verifies partner HMAC signature before updating order states.

