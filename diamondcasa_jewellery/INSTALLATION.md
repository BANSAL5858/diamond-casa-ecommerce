# Installation Guide - Diamond Casa Jewellery ERP

**Quick Start Guide for Installing the Custom Frappe App**

---

## Prerequisites

- ERPNext v14.x or v15.x installed via bench
- Python 3.10+ or 3.11+
- Node.js 18.x or 20.x
- Bench CLI installed and configured

---

## Installation Steps

### Step 1: Get the App

```bash
# Navigate to your bench directory
cd ~/frappe-bench

# Option A: Get from Git repository
bench get-app diamondcasa_jewellery https://github.com/your-org/diamondcasa_jewellery

# Option B: Get from local directory
bench get-app diamondcasa_jewellery /path/to/diamondcasa_jewellery
```

### Step 2: Install to Site

```bash
# Install app to your site
bench --site your-site.local install-app diamondcasa_jewellery

# Migrate database (creates all DocTypes and tables)
bench --site your-site.local migrate

# Build assets (CSS, JS)
bench build --app diamondcasa_jewellery

# Restart bench
bench restart
```

### Step 3: Configure Environment Variables

Edit `sites/your-site.local/site_config.json`:

```json
{
  "diamondcasa_api_url": "https://diamondcasa.com",
  "diamondcasa_api_key": "your_api_key",
  "diamondcasa_api_secret": "your_api_secret",
  "diamondcasa_webhook_secret": "your_webhook_secret",
  "diamondcasa_sync_enabled": true,
  "diamondcasa_sync_interval": 900
}
```

Or use bench commands:

```bash
bench --site your-site.local set-config diamondcasa_api_url "https://diamondcasa.com"
bench --site your-site.local set-config diamondcasa_api_key "your_key"
bench --site your-site.local set-config diamondcasa_api_secret "your_secret"
bench --site your-site.local set-config diamondcasa_webhook_secret "your_webhook_secret"
bench --site your-site.local set-config diamondcasa_sync_enabled true
bench --site your-site.local set-config diamondcasa_sync_interval 900
```

### Step 4: Create Roles

1. Login to ERPNext
2. Go to **User** → **Role** → **New**
3. Create these roles:
   - **Jewellery Manager** (full access)
   - **Jewellery User** (read/write access)
   - **Jewellery Viewer** (read-only access)

### Step 5: Initial Setup

1. **Create Metal Specs:**
   - Go to **Diamond Casa Jewellery** → **Metal Spec** → **New**
   - Create entries for: Gold 18K, Gold 22K, Gold 24K, Platinum, etc.

2. **Create Stone Specs:**
   - Go to **Diamond Casa Jewellery** → **Stone Spec** → **New**
   - Create entries for: Diamond, Gemstone, Lab Grown Diamond, etc.

3. **Verify Warehouses:**
   - Ensure these warehouses exist:
     - `READY - DC` (Ready to ship)
     - `MTO/WIP - DC` (Made-to-order/Work-in-progress)
     - `TRANSIT - DC` (Items in transit)
     - `RETURN - DC` (Returned items)

4. **Test Integration:**
   - Go to **Diamond Casa Jewellery** → **Integration Log**
   - Create a test product and verify sync

---

## Verification

### Check App Installation

```bash
# List installed apps
bench --site your-site.local list-apps

# Should show: diamondcasa_jewellery
```

### Check DocTypes

1. Login to ERPNext
2. Go to **Customize** → **DocType**
3. Search for: `Jewellery Design`, `Jewellery SKU`, `Metal Spec`, `Stone Spec`, `Integration Log`
4. All should be visible

### Check Scheduler

```bash
# Check scheduler status
bench --site your-site.local scheduler status

# Should show scheduled jobs for:
# - sync_products_to_diamondcasa (every 15 minutes)
# - sync_inventory_to_diamondcasa (every 15 minutes)
# - sync_prices_to_diamondcasa (every 15 minutes)
# - sync_media_to_diamondcasa (hourly)
# - cleanup_old_integration_logs (daily)
```

---

## Troubleshooting

### App Not Showing in Desk

1. Clear cache: `bench --site your-site.local clear-cache`
2. Restart bench: `bench restart`
3. Check app is installed: `bench --site your-site.local list-apps`

### DocTypes Not Created

1. Run migrate: `bench --site your-site.local migrate`
2. Check for errors: `bench --site your-site.local logs`
3. Verify app is installed: `bench --site your-site.local list-apps`

### Scheduler Not Running

1. Check scheduler status: `bench --site your-site.local scheduler status`
2. Start scheduler: `bench --site your-site.local scheduler enable`
3. Restart bench: `bench restart`

### API Endpoints Not Working

1. Check environment variables: `bench --site your-site.local get-config diamondcasa_api_url`
2. Verify permissions: Check user has API access
3. Check logs: `bench --site your-site.local logs`

---

## Next Steps

1. **Read Documentation:**
   - [Architecture Guide](./docs/ARCHITECTURE.md)
   - [API Documentation](./docs/API.md)
   - [Operations Guide](./docs/OPS.md)
   - [Assumptions](./docs/ASSUMPTIONS.md)

2. **Configure Integration:**
   - Set up DiamondCasa API credentials
   - Test API connection
   - Enable sync

3. **Create Master Data:**
   - Create Metal Specs
   - Create Stone Specs
   - Create Jewellery Designs
   - Create Jewellery SKUs

4. **Test Workflows:**
   - Create a product
   - Sync to DiamondCasa
   - Create an order
   - Verify integration logs

---

## Support

For issues or questions:
- Check [Operations Guide](./docs/OPS.md) for troubleshooting
- Review [Integration Log](./docs/ARCHITECTURE.md#integration-logs) for errors
- Contact: dev@diamondcasa.in

---

**Installation Complete!**
