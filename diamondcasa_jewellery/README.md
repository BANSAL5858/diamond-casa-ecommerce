# Diamond Casa Jewellery ERP - Custom Frappe App

A comprehensive custom Frappe app for jewellery ERP functionality with bi-directional integration to DiamondCasa.com e-commerce platform.

## Features

### Jewellery Master Data
- Jewellery Design (style/design-level master)
- Jewellery SKU/Variant (sellable item with deterministic SKU codes)
- Metal Spec (type, purity, rate basis, wastage rules)
- Stone Spec (diamond/gem attributes: shape, color, clarity, cut, carat, certification)
- Certification (GIA/IGI/etc; file + metadata; linked to SKU/stone)
- Pricing Rule (metal rate + making + stone + margin; multi-channel pricing)
- Media Asset (images/videos/3D assets; publish flags for web)

### Inventory + Tagging
- Piece-level tracking (unique Piece ID / Tag ID)
- Barcode/QR generation and printing
- Stock ledger with gross/net weight, fine gold equivalent, stone weights
- Label printing formats and templates

### Manufacturing / Job Work
- Job Card (multi-stage: casting, setting, polishing, QC, hallmarking)
- Material Issue / Receive against job card
- WIP tracking by stage + location + vendor
- Subcontractor (karigar) job work management
- Scrap & Recovery (fine gold recovery, stone loss, wastage variance)
- Stage-wise cost accumulation and final SKU valuation

### Sales / POS / Showroom
- Jewellery-optimized POS/showroom flow
- Fast search by design/SKU/tag/barcode
- Customer profile + preferences
- Quotation → Sales Order → Invoice workflow
- Discount approval workflow
- Repair/resize order capture

### Multi-location + Accounting
- Branch/location dimensioning (cost centers / warehouses / financial books)
- Centralized accounting with location-wise reporting
- Compliance-ready (GST-ready, invoice formats, audit trail)
- Owner dashboards (margin by design, wastage variance, slow movers, aging)

### Live Publishing
- Publish rules (which SKUs are web-visible)
- Media approval flags
- Multi-channel pricing (web vs showroom)
- Sync queue + webhooks
- Incremental + idempotent sync (hash-based change detection)

### DiamondCasa Integration
- REST API endpoints (`/api/diamondcasa/*`)
- Webhook receivers (order_created, payment_captured, etc.)
- Background sync jobs (product_updated, inventory_changed, etc.)
- Integration Log DocType (payload, status, retries, error traces)
- Retry policy with exponential backoff
- Idempotency keys for order creation

## Installation

### Prerequisites
- ERPNext v14.x or v15.x installed via bench
- Python 3.10+ or 3.11+
- Node.js 18.x or 20.x

### Install App

```bash
# Navigate to your bench directory
cd ~/frappe-bench

# Create new app
bench new-app diamondcasa_jewellery

# Or if app already exists, get it
bench get-app diamondcasa_jewellery /path/to/diamondcasa_jewellery

# Install app to site
bench --site your-site.local install-app diamondcasa_jewellery

# Migrate database
bench --site your-site.local migrate

# Build assets
bench build --app diamondcasa_jewellery

# Restart bench
bench restart
```

## Configuration

### Environment Variables

Create `.env` file in your site directory or set in `site_config.json`:

```bash
# DiamondCasa Integration
DIAMONDCASA_API_KEY=your_api_key
DIAMONDCASA_API_SECRET=your_api_secret
DIAMONDCASA_WEBHOOK_SECRET=your_webhook_secret
DIAMONDCASA_SYNC_ENABLED=1
DIAMONDCASA_SYNC_INTERVAL=900  # seconds (15 minutes)
```

### Setup Steps

1. **Create Metal Specs**: Go to Jewellery → Metal Spec → New
2. **Create Stone Specs**: Go to Jewellery → Stone Spec → New
3. **Create Pricing Rules**: Go to Jewellery → Pricing Rule → New
4. **Configure Integration**: Go to Jewellery → Integration Settings
5. **Set up Warehouses**: Ensure warehouses exist for job work (WIP, etc.)

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System architecture and data model
- [API Documentation](./docs/API.md) - REST API endpoints and webhooks
- [Operations Guide](./docs/OPS.md) - Deployment, troubleshooting, monitoring
- [Assumptions](./docs/ASSUMPTIONS.md) - Business rules and assumptions

## Development

### Run Tests

```bash
bench --site your-site.local run-tests --app diamondcasa_jewellery
```

### Code Structure

```
diamondcasa_jewellery/
├── diamondcasa_jewellery/
│   ├── doctype/          # Custom DocTypes
│   ├── api/              # REST API endpoints
│   ├── utils/            # Utility functions
│   ├── patches/          # Database migrations
│   └── hooks.py          # Frappe hooks
├── setup.py
├── requirements.txt
└── README.md
```

## Security

- All API endpoints require authentication
- Role-based permissions on all DocTypes
- Audit logs for all integration actions
- Rate limiting on webhook endpoints
- Idempotency keys for all writes

## Upgrade Safety

- No core ERPNext files modified
- All customizations in custom app
- Patches for database migrations
- Version-controlled and test-covered

## License

Proprietary - Diamond Casa

## Support

For issues or questions, refer to documentation or contact dev@diamondcasa.in
