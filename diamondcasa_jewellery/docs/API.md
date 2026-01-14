# API Documentation - Diamond Casa Jewellery ERP

**Version:** 1.0.0  
**Last Updated:** 2024-12-19

---

## Base URL

All API endpoints are prefixed with `/api/diamondcasa/`

**Example:** `https://your-erpnext-instance.com/api/diamondcasa/products`

---

## Authentication

### Token-Based Authentication

All API endpoints (except webhooks) require token-based authentication.

**Header:**
```
Authorization: token {api_key}:{api_secret}
```

**Example:**
```
Authorization: token abc123def456:xyz789uvw012
```

### Webhook Signature Verification

Webhook endpoints verify HMAC signatures.

**Header:**
```
X-DiamondCasa-Signature: {hmac_sha256_signature}
```

**Signature Calculation:**
```python
import hmac
import hashlib

signature = hmac.new(
    webhook_secret.encode(),
    payload.encode(),
    hashlib.sha256
).hexdigest()
```

---

## Products API

### GET /api/diamondcasa/products

Get products from ERPNext.

**Request:**
```http
GET /api/diamondcasa/products?filters={"is_web_visible":true}&limit=100&offset=0
Authorization: token {api_key}:{api_secret}
```

**Query Parameters:**
- `filters` (JSON, optional): Filter criteria
  - `is_web_visible` (boolean): Filter by web visibility
  - `is_active` (boolean): Filter by active status
- `limit` (int, optional): Page size (default: 100, max: 1000)
- `offset` (int, optional): Page offset (default: 0)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "name": "ITEM-001",
      "item_code": "RING-001-18K-1CT",
      "item_name": "Diamond Ring 18K 1CT",
      "description": "Beautiful diamond ring",
      "item_group": "Rings",
      "sku_code": "RING-001-18K-1CT",
      "metal_spec": "GOLD-18K",
      "metal_purity": "18K",
      "stone_spec": "DIAMOND-1CT",
      "stone_carat": 1.0,
      "final_price": 50000.0,
      "is_web_visible": true,
      "is_web_approved": true,
      "last_synced": "2024-12-19 10:00:00"
    }
  ],
  "total": 150,
  "limit": 100,
  "offset": 0
}
```

---

### POST /api/diamondcasa/products

Create product in ERPNext (from DiamondCasa).

**Request:**
```http
POST /api/diamondcasa/products
Authorization: token {api_key}:{api_secret}
Content-Type: application/json

{
  "idempotency_key": "product_RING-001-18K-1CT_abc123",
  "item_code": "RING-001-18K-1CT",
  "item_name": "Diamond Ring 18K 1CT",
  "item_group": "Rings",
  "description": "Beautiful diamond ring",
  "sku_code": "RING-001-18K-1CT",
  "design": "DESIGN-001",
  "metal_spec": "GOLD-18K",
  "metal_purity": "18K",
  "stone_spec": "DIAMOND-1CT",
  "stone_carat": 1.0,
  "price": 50000.0,
  "is_web_visible": true,
  "is_web_approved": true
}
```

**Response:**
```json
{
  "status": "success",
  "item_code": "RING-001-18K-1CT",
  "message": "Product created successfully"
}
```

**Error Response (Duplicate):**
```json
{
  "status": "duplicate",
  "message": "Request already processed"
}
```

---

### PATCH /api/diamondcasa/products/<item_code>

Update product in ERPNext.

**Request:**
```http
PATCH /api/diamondcasa/products/RING-001-18K-1CT
Authorization: token {api_key}:{api_secret}
Content-Type: application/json

{
  "item_name": "Updated Diamond Ring",
  "price": 55000.0,
  "is_web_visible": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Product updated successfully"
}
```

---

## Inventory API

### GET /api/diamondcasa/inventory

Get inventory levels from ERPNext.

**Request:**
```http
GET /api/diamondcasa/inventory?item_code=RING-001-18K-1CT&warehouse=READY%20-%20DC
Authorization: token {api_key}:{api_secret}
```

**Query Parameters:**
- `item_code` (string, optional): Filter by item code
- `warehouse` (string, optional): Filter by warehouse

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "item_code": "RING-001-18K-1CT",
      "item_name": "Diamond Ring 18K 1CT",
      "warehouse": "READY - DC",
      "available_qty": 5.0,
      "reserved_qty": 1.0,
      "ordered_qty": 0.0
    }
  ]
}
```

---

### PATCH /api/diamondcasa/inventory

Update inventory in ERPNext (creates Stock Entry).

**Request:**
```http
PATCH /api/diamondcasa/inventory
Authorization: token {api_key}:{api_secret}
Content-Type: application/json

{
  "item_code": "RING-001-18K-1CT",
  "warehouse": "READY - DC",
  "qty": 10.0,
  "idempotency_key": "inventory_RING-001-18K-1CT_READY_abc123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Inventory updated successfully",
  "current_qty": 10.0
}
```

---

## Orders API

### POST /api/diamondcasa/orders

Create Sales Order in ERPNext (from DiamondCasa).

**Request:**
```http
POST /api/diamondcasa/orders
Authorization: token {api_key}:{api_secret}
Content-Type: application/json

{
  "idempotency_key": "order_ORD-12345_abc123",
  "order_id": "ORD-12345",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210"
  },
  "items": [
    {
      "item_code": "RING-001-18K-1CT",
      "qty": 1,
      "rate": 50000.0
    }
  ],
  "delivery_date": "2024-12-25",
  "payment_method": "UPI"
}
```

**Response:**
```json
{
  "status": "success",
  "sales_order": "SO-00001",
  "message": "Order created successfully"
}
```

---

### GET /api/diamondcasa/orders/<sales_order>

Get order status from ERPNext.

**Request:**
```http
GET /api/diamondcasa/orders/SO-00001
Authorization: token {api_key}:{api_secret}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "sales_order": "SO-00001",
    "status": "To Deliver",
    "delivery_note": "DN-00001",
    "sales_invoice": "SI-00001",
    "delivery_date": "2024-12-25"
  }
}
```

---

## Webhooks

### POST /api/diamondcasa/webhooks/order_created

Receive order_created event from DiamondCasa.

**Request:**
```http
POST /api/diamondcasa/webhooks/order_created
X-DiamondCasa-Signature: {hmac_signature}
Content-Type: application/json

{
  "order_id": "ORD-12345",
  "customer": {...},
  "items": [...],
  "total_amount": 50000.0,
  "payment_method": "UPI"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Webhook processed successfully",
  "result": {
    "sales_order": "SO-00001"
  }
}
```

---

### POST /api/diamondcasa/webhooks/payment_captured

Receive payment_captured event from DiamondCasa.

**Request:**
```http
POST /api/diamondcasa/webhooks/payment_captured
X-DiamondCasa-Signature: {hmac_signature}
Content-Type: application/json

{
  "order_id": "ORD-12345",
  "customer": "CUST-001",
  "amount": 50000.0,
  "transaction_id": "TXN-12345",
  "payment_method": "UPI"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Payment processed successfully"
}
```

---

### POST /api/diamondcasa/webhooks/order_cancelled

Receive order_cancelled event from DiamondCasa.

**Request:**
```http
POST /api/diamondcasa/webhooks/order_cancelled
X-DiamondCasa-Signature: {hmac_signature}
Content-Type: application/json

{
  "sales_order": "SO-00001",
  "order_id": "ORD-12345",
  "cancellation_reason": "Customer request"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Order cancelled successfully"
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "status": "error",
  "message": "Error description",
  "error_type": "ValidationError|PermissionError|NotFound|..."
}
```

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate request (idempotency)
- `500 Internal Server Error`: Server error

---

## Rate Limiting

- **API Endpoints:** 100 requests per minute per API key
- **Webhooks:** 50 requests per minute per IP
- **Response Headers:**
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

---

## Idempotency

All write operations support idempotency keys:

- **Format:** `{type}_{identifier}_{hash}`
- **Example:** `product_RING-001-18K-1CT_abc123def456`
- **Behavior:** If same idempotency key is used twice, second request returns existing result without creating duplicate

---

## Pagination

List endpoints support pagination:

- **limit:** Number of items per page (default: 100, max: 1000)
- **offset:** Number of items to skip (default: 0)
- **Response includes:** `total`, `limit`, `offset`

---

**End of API Documentation**
