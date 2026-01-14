# Architecture Documentation - Diamond Casa Jewellery ERP

**Version:** 1.0.0  
**Last Updated:** 2024-12-19

---

## 1. System Overview

The Diamond Casa Jewellery ERP is a custom Frappe app that extends ERPNext with jewellery-specific functionality and provides bi-directional integration with the DiamondCasa.com e-commerce platform.

### 1.1 Core Principles

- **ERPNext as Single Source of Truth:** All master data (items, inventory, pricing) originates in ERPNext
- **Upgrade-Safe Customization:** No core ERPNext files modified; all customizations in custom app
- **Security-First:** Role-based permissions, audit logs, rate limiting, idempotent sync
- **Performance-First:** Background jobs for sync, pagination, incremental updates

---

## 2. Application Structure

```
diamondcasa_jewellery/
├── diamondcasa_jewellery/
│   ├── doctype/                    # Custom DocTypes
│   │   ├── jewellery_design/      # Design master
│   │   ├── jewellery_sku/         # SKU/Variant master
│   │   ├── metal_spec/             # Metal specifications
│   │   ├── stone_spec/             # Stone specifications
│   │   ├── certification/          # Certification management
│   │   ├── pricing_rule/           # Pricing rules
│   │   ├── job_card/                # Manufacturing job cards
│   │   ├── material_issue/         # Material issue/receive
│   │   ├── scrap_recovery/         # Scrap and recovery
│   │   └── integration_log/        # Integration audit logs
│   ├── api/                        # REST API endpoints
│   │   └── diamondcasa/
│   │       ├── products.py         # Product APIs
│   │       ├── inventory.py        # Inventory APIs
│   │       ├── orders.py           # Order APIs
│   │       └── webhooks.py         # Webhook receivers
│   ├── utils/                      # Utility functions
│   │   ├── sync.py                 # Sync utilities
│   │   ├── pricing.py              # Pricing calculations
│   │   └── costing.py              # Costing calculations
│   ├── patches/                    # Database migrations
│   └── hooks.py                    # Frappe hooks
├── setup.py
├── requirements.txt
└── README.md
```

---

## 3. Data Model

### 3.1 Master Data DocTypes

#### Jewellery Design
- **Purpose:** Design-level master (style/design template)
- **Key Fields:**
  - `design_code` (unique)
  - `design_name`
  - `design_category`
  - Default metal/stone specifications
  - Base making charge and margin
- **Relationships:**
  - One-to-many with Jewellery SKU

#### Jewellery SKU
- **Purpose:** Sellable item variant
- **Key Fields:**
  - `sku_code` (deterministic: Design-Metal-Stone-Size)
  - `item_code` (links to ERPNext Item)
  - Metal specifications (spec, purity, weights)
  - Stone specifications (spec, carat, count)
  - Pricing (metal cost, making charge, stone cost, margin, final price)
  - Publishing flags (is_web_visible, is_web_approved)
- **Relationships:**
  - Many-to-one with Jewellery Design
  - Many-to-one with Metal Spec
  - Many-to-one with Stone Spec
  - One-to-one with Item

#### Metal Spec
- **Purpose:** Metal specification master
- **Key Fields:**
  - `metal_code` (unique)
  - `metal_type` (Gold, Platinum, Silver, etc.)
  - `purity` (18K, 22K, 24K, etc.)
  - `purity_percent` (fine gold percentage)
  - `current_rate_per_gram`
  - `wastage_percent`
  - `wastage_calculation_method`

#### Stone Spec
- **Purpose:** Stone specification master
- **Key Fields:**
  - `stone_code` (unique)
  - `stone_type` (Diamond, Gemstone, Lab Grown, etc.)
  - Diamond attributes (shape, color, clarity, cut)
  - `carat_range_min` / `carat_range_max`
  - `certification_required`

### 3.2 Manufacturing DocTypes

#### Job Card
- **Purpose:** Multi-stage manufacturing job tracking
- **Stages:** Casting → Setting → Polishing → QC → Hallmarking
- **Key Fields:**
  - Job stages with status
  - Material requirements
  - WIP tracking by stage + location + vendor
  - Cost accumulation

#### Material Issue / Receive
- **Purpose:** Material tracking against job cards
- **Key Fields:**
  - Job card reference
  - Material items (metal, stones, findings)
  - Quantities issued/received
  - Wastage tracking

#### Scrap & Recovery
- **Purpose:** Fine gold recovery and wastage variance
- **Key Fields:**
  - Scrap source (job card, material issue)
  - Fine gold recovered
  - Stone loss
  - Wastage variance

### 3.3 Integration DocTypes

#### Integration Log
- **Purpose:** Audit trail for all integration actions
- **Key Fields:**
  - Integration type (Product, Inventory, Order, etc.)
  - Direction (ERPNext → DiamondCasa or vice versa)
  - Status (Pending, Success, Failed, Retrying)
  - Request/response payloads
  - Error messages and tracebacks
  - Retry count and next retry time
  - Idempotency key
  - Reference DocType and name

---

## 4. Integration Architecture

### 4.1 Sync Direction

#### ERPNext → DiamondCasa (Push)
- **Products:** When SKU is created/updated and web_visible + web_approved
- **Inventory:** When stock levels change (via Stock Entry)
- **Prices:** When pricing rules change
- **Media:** When media assets are updated
- **Shipments:** When Delivery Note is created

#### DiamondCasa → ERPNext (Pull/Webhook)
- **Orders:** Webhook `order_created` → Create Sales Order
- **Payments:** Webhook `payment_captured` → Create Payment Entry
- **Cancellations:** Webhook `order_cancelled` → Cancel Sales Order
- **Returns:** Webhook `return_initiated` → Create Return Order

### 4.2 Sync Mechanisms

#### Scheduled Jobs (Cron)
- **Every 15 minutes:**
  - Sync products (incremental)
  - Sync inventory (incremental)
  - Sync prices (incremental)
- **Hourly:**
  - Sync media assets
- **Daily:**
  - Cleanup old integration logs

#### Event-Driven (Document Events)
- **Item.on_update:** Trigger product sync if jewellery item
- **Sales Order.on_submit:** Trigger order sync
- **Stock Entry.on_submit:** Trigger inventory sync
- **Sales Invoice.on_submit:** Trigger invoice sync

#### Webhooks (Real-time)
- **order_created:** Create Sales Order
- **payment_captured:** Create Payment Entry
- **order_cancelled:** Cancel Sales Order
- **return_initiated:** Create Return Order

### 4.3 Idempotency

All write operations use idempotency keys:
- Format: `{type}_{identifier}_{hash}`
- Example: `product_RING-001-18K-1CT_abc123def456`
- Stored in Integration Log
- Prevents duplicate processing

### 4.4 Retry Logic

- **Max Retries:** 3
- **Backoff Strategy:** Exponential (2^retry_count minutes)
- **Retry Schedule:** Background jobs with `enqueue_after`
- **Status Tracking:** Integration Log tracks retry count and next retry time

---

## 5. API Endpoints

### 5.1 Products API

#### GET /api/diamondcasa/products
- **Purpose:** Get products from ERPNext
- **Auth:** Required (token-based)
- **Query Params:**
  - `filters` (JSON): Filter criteria
  - `limit` (int): Page size (default: 100)
  - `offset` (int): Page offset (default: 0)
- **Response:** List of products with pagination

#### POST /api/diamondcasa/products
- **Purpose:** Create product in ERPNext (from DiamondCasa)
- **Auth:** Required
- **Body:** Product data with idempotency_key
- **Response:** Created product details

#### PATCH /api/diamondcasa/products/<item_code>
- **Purpose:** Update product in ERPNext
- **Auth:** Required
- **Body:** Partial product data
- **Response:** Updated product details

### 5.2 Inventory API

#### GET /api/diamondcasa/inventory
- **Purpose:** Get inventory levels
- **Auth:** Required
- **Query Params:**
  - `item_code` (optional): Filter by item
  - `warehouse` (optional): Filter by warehouse
- **Response:** Inventory levels

#### PATCH /api/diamondcasa/inventory
- **Purpose:** Update inventory (creates Stock Entry)
- **Auth:** Required
- **Body:** `item_code`, `warehouse`, `qty`, `idempotency_key`
- **Response:** Updated inventory details

### 5.3 Orders API

#### POST /api/diamondcasa/orders
- **Purpose:** Create Sales Order (from DiamondCasa)
- **Auth:** Required
- **Body:** Order data with items, customer, idempotency_key
- **Response:** Created Sales Order details

#### GET /api/diamondcasa/orders/<sales_order>
- **Purpose:** Get order status
- **Auth:** Required
- **Response:** Order status, delivery note, invoice

### 5.4 Webhooks

#### POST /api/diamondcasa/webhooks/order_created
- **Purpose:** Receive order_created event
- **Auth:** Webhook signature verification
- **Body:** Order data
- **Response:** Processing result

#### POST /api/diamondcasa/webhooks/payment_captured
- **Purpose:** Receive payment_captured event
- **Auth:** Webhook signature verification
- **Body:** Payment data
- **Response:** Processing result

#### POST /api/diamondcasa/webhooks/order_cancelled
- **Purpose:** Receive order_cancelled event
- **Auth:** Webhook signature verification
- **Body:** Cancellation data
- **Response:** Processing result

---

## 6. Security

### 6.1 Authentication

- **API Endpoints:** Token-based (API Key + Secret)
- **Webhooks:** HMAC signature verification
- **Permissions:** Role-based access control

### 6.2 Rate Limiting

- **API Endpoints:** Configurable rate limits (default: 100 req/min)
- **Webhooks:** Configurable rate limits (default: 50 req/min)

### 6.3 Audit Logging

- All integration actions logged in Integration Log
- Request/response payloads stored (for debugging)
- Error tracebacks captured
- Retry attempts tracked

---

## 7. Performance Considerations

### 7.1 Background Jobs

- All sync operations use `frappe.enqueue()` for background processing
- Prevents blocking user operations
- Configurable queue and timeout

### 7.2 Pagination

- All list APIs support pagination (limit/offset)
- Prevents large result sets
- Enables incremental sync

### 7.3 Change Detection

- Hash-based change detection for incremental sync
- Only syncs changed records
- Reduces API calls and processing time

---

## 8. Upgrade Safety

### 8.1 No Core Modifications

- No ERPNext core files modified
- All customizations in custom app
- Upgrade-safe approach

### 8.2 Patches

- Database migrations via patches
- Version-controlled patches
- Safe rollback mechanism

### 8.3 Custom Fields

- Custom fields added via patches
- No direct core modifications
- Compatible with ERPNext upgrades

---

## 9. Testing Strategy

### 9.1 Unit Tests

- DocType validations
- Pricing calculations
- Costing calculations
- Sync utilities

### 9.2 Integration Tests

- API endpoint tests
- Webhook receiver tests
- Sync job tests
- Idempotency tests

### 9.3 Smoke Tests

- Product sync end-to-end
- Inventory sync end-to-end
- Order creation end-to-end
- Job work cycle end-to-end

---

## 10. Monitoring & Troubleshooting

### 10.1 Integration Logs

- View all integration actions in Integration Log DocType
- Filter by type, status, direction
- View request/response payloads
- Check error messages and tracebacks

### 10.2 Error Handling

- All errors logged with full context
- Retry mechanism with exponential backoff
- Alert on repeated failures
- Manual retry option

### 10.3 Performance Monitoring

- Request duration tracked
- Sync frequency monitored
- Queue depth monitored
- Database query optimization

---

**End of Architecture Documentation**
