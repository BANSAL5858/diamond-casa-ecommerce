# How to Run ERPNext and Test All Features - Complete Guide

**Date:** 2024-12-19  
**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [App Installation](#app-installation)
4. [Initial Configuration](#initial-configuration)
5. [Feature Testing Guide](#feature-testing-guide)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **OS:** Ubuntu 20.04/22.04 LTS or Debian 11/12 (recommended)
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** 20GB free space
- **Python:** 3.10 or 3.11
- **Node.js:** 18.x or 20.x
- **MariaDB:** 10.6 or 10.11

### Required Software
- Git
- Python 3.10+
- Node.js 18+
- MariaDB
- Redis (optional, for caching)
- Nginx (for production)

---

## Installation Steps

### Step 1: Install ERPNext Bench

#### On Ubuntu/Debian:

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3-dev python3-pip python3-venv \
    python3-setuptools python3-wheel git curl wget \
    software-properties-common mariadb-server mariadb-client \
    redis-server nginx supervisor

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.10
sudo apt install -y python3.10 python3.10-venv python3.10-dev

# Install bench
sudo pip3 install frappe-bench

# Verify installation
bench --version
```

### Step 2: Initialize Bench

```bash
# Create bench directory
mkdir -p ~/frappe-bench
cd ~/frappe-bench

# Initialize bench
bench init frappe-bench --frappe-branch version-14

# Navigate to bench
cd frappe-bench

# Create new site
bench new-site diamondcasa.localhost \
    --admin-password admin \
    --db-root-password admin

# Set site as default
bench use diamondcasa.localhost
```

### Step 3: Install ERPNext

```bash
# Install ERPNext app
bench get-app erpnext --branch version-14

# Install ERPNext on site
bench --site diamondcasa.localhost install-app erpnext

# Start bench
bench start
```

**Access ERPNext:** Open browser and go to `http://localhost:8000`

**Login:** 
- Username: `Administrator`
- Password: `admin`

---

## App Installation

### Step 1: Copy Custom App to Bench

```bash
# Navigate to bench apps directory
cd ~/frappe-bench/apps

# Copy the diamondcasa_jewellery app
# Option 1: If app is in workspace, copy it
cp -r /path/to/DEMOAPP/diamondcasa_jewellery ./

# Option 2: If app is in git, clone it
# git clone <your-repo-url> diamondcasa_jewellery

# Verify app structure
cd diamondcasa_jewellery
ls -la
```

### Step 2: Install App Dependencies

```bash
# Navigate to bench root
cd ~/frappe-bench

# Install Python dependencies
bench setup requirements

# Install app on site
bench --site diamondcasa.localhost install-app diamondcasa_jewellery

# Migrate database
bench --site diamondcasa.localhost migrate

# Clear cache
bench --site diamondcasa.localhost clear-cache
```

### Step 3: Restart Bench

```bash
# Stop bench (Ctrl+C if running)
# Start bench again
bench start
```

---

## Initial Configuration

### Step 1: Access ERPNext

1. Open browser: `http://localhost:8000`
2. Login with:
   - **Username:** `Administrator`
   - **Password:** `admin`

### Step 2: Configure Basic Settings

#### A. Create Roles (if not auto-created)

1. Go to **Setup** → **Users and Permissions** → **Role**
2. Create roles:
   - `Jewellery Manager` (if not exists)
   - `Jewellery User` (if not exists)

#### B. Configure DiamondCasa Jewellery Settings

1. Go to **Diamond Casa Jewellery** module
2. Click **DiamondCasa Jewellery Settings**
3. Configure:
   - **Feature Flags:**
     - ✅ Enable Barcode/QR Generation
     - ✅ Enable Piece-level Tracking
     - ⬜ Enable WhatsApp Integration (if needed)
   - **Integration Settings:**
     - DiamondCasa API URL: `https://your-api-url.com`
     - DiamondCasa API Key: `your-api-key`
     - DiamondCasa API Secret: `your-api-secret`
     - DiamondCasa Webhook Secret: `your-webhook-secret`
     - ✅ Enable Sync
   - **Wastage Rules:**
     - Default Wastage %: `5`
     - Wastage Alert Threshold %: `10`
   - **Pricing:**
     - Default Margin %: `20`
     - Default Making Charge %: `15`
   - **Notifications:**
     - ✅ Enable Email Notifications
     - ⬜ Enable SMS Notifications
     - ⬜ Enable WhatsApp Notifications
   - **Approvals:**
     - ✅ Require QC Approval
     - ✅ Require Scrap Recovery Approval
     - ✅ Require Discount Approval
     - Discount Approval Threshold %: `10`
4. Click **Save**

### Step 3: Create Master Data

#### A. Create Metal Spec

1. Go to **Diamond Casa Jewellery** → **Metal Spec**
2. Click **New**
3. Fill in:
   - **Metal Code:** `GOLD-22K`
   - **Metal Name:** `22 Karat Gold`
   - **Metal Type:** `Gold`
   - **Purity:** `22K`
   - **Purity %:** `91.67`
   - **Current Rate per Gram:** `5000` (INR)
   - **Default Wastage %:** `5`
   - **Wastage Calculation Method:** `Percentage of Gross Weight`
4. Click **Save**

#### B. Create Stone Spec

1. Go to **Diamond Casa Jewellery** → **Stone Spec**
2. Click **New**
3. Fill in:
   - **Stone Code:** `DIAMOND-SOLITAIRE`
   - **Stone Name:** `Solitaire Diamond`
   - **Stone Type:** `Diamond`
   - **Shape:** `Round`
   - **Color:** `D`
   - **Clarity:** `VS1`
   - **Cut:** `Excellent`
   - **Carat Range Min:** `0.5`
   - **Carat Range Max:** `5.0`
   - **Certification Required:** ✅
4. Click **Save**

#### C. Create Jewellery Design

1. Go to **Diamond Casa Jewellery** → **Jewellery Design**
2. Click **New**
3. Fill in:
   - **Design Code:** `RING-001`
   - **Design Name:** `Classic Solitaire Ring`
   - **Design Category:** `Ring`
   - **Default Metal Spec:** `GOLD-22K`
   - **Default Stone Spec:** `DIAMOND-SOLITAIRE`
   - **Default Making Charge:** `5000`
   - **Default Margin %:** `20`
   - **Is Web Visible:** ✅
4. Click **Save**

#### D. Create Jewellery SKU

1. Go to **Diamond Casa Jewellery** → **Jewellery SKU**
2. Click **New**
3. Fill in:
   - **SKU Code:** `RING-001-22K-1CT`
   - **Item Code:** (Create new Item or select existing)
   - **Design:** `RING-001`
   - **Metal Spec:** `GOLD-22K`
   - **Gross Weight:** `5.0` (grams)
   - **Stone Spec:** `DIAMOND-SOLITAIRE`
   - **Stone Carat:** `1.0`
   - **Pricing Rule:** (Select or create)
   - **Is Web Visible:** ✅
   - **Is Web Approved:** ✅
4. Click **Save**

#### E. Create Craft Worker

1. Go to **Diamond Casa Jewellery** → **Craft Worker**
2. Click **New**
3. Fill in:
   - **Worker Code:** `KARIGAR-001`
   - **Worker Name:** `Rajesh Kumar`
   - **Worker Type:** `Caster`
   - **Phone:** `+91-9876543210`
   - **Supplier:** (Link to Supplier if exists)
   - **Specialization:** `Gold Casting`
   - **Skill Level:** `Expert`
4. Click **Save**

---

## Feature Testing Guide

### Test 1: Bag/Packet Management ✅

#### Create a Bag

1. Go to **Diamond Casa Jewellery** → **Bag**
2. Click **New**
3. Fill in:
   - **Bag Number:** `BAG-001`
   - **Bag Type:** `Production Bag`
   - **Sales Order:** (Select or create Sales Order)
   - **Status:** `Draft`
   - **Warehouse:** `MTO/WIP - DC`
4. Add items in **Items Table:**
   - Click **Add Row**
   - **Item Code:** Select item
   - **Quantity:** `1`
   - **Status:** `Pending`
5. Click **Save**

#### Test Status Timeline

1. Change **Status** to `Material Requisition`
2. Click **Save**
3. Check **Status Timeline** - should show new entry
4. Change **Status** to `In Production`
5. Click **Save**
6. Verify timeline updated

#### Test Watchlist

1. Click **Add to Watchlist** button
2. Select a user
3. Click **Save**
4. Change status - user should be notified (if notifications configured)

**✅ Expected Result:** Bag created, status timeline working, watchlist functional

---

### Test 2: Job Card (Manufacturing) ✅

#### Create Job Card

1. Go to **Diamond Casa Jewellery** → **Job Card**
2. Click **New**
3. Fill in:
   - **Job Card No:** `JC-001`
   - **Design:** `RING-001`
   - **SKU:** `RING-001-22K-1CT`
4. **Casting Stage:**
   - **Status:** `In Progress`
   - **Start Date:** Today
   - **Vendor/Karigar:** `KARIGAR-001`
   - **Wastage %:** `5`
5. **Setting Stage:**
   - **Status:** `Not Started`
6. **Polishing Stage:**
   - **Status:** `Not Started`
7. **QC Stage:**
   - **Status:** `Not Started`
   - **QC Approved:** ⬜
8. **Materials Table:**
   - Add materials used
9. Click **Save**

#### Test Stage Progression

1. Update **Casting Status** to `Completed`
2. Set **Casting Completion Date**
3. Update **Setting Status** to `In Progress`
4. Set **Setting Start Date**
5. Click **Save**
6. Verify **Total Cost** calculated

**✅ Expected Result:** Job Card created, stages tracked, costs calculated

---

### Test 3: Scrap & Recovery ✅

#### Create Scrap Recovery

1. Go to **Diamond Casa Jewellery** → **Scrap Recovery**
2. Click **New**
3. Fill in:
   - **Scrap Recovery No:** `SR-001`
   - **Recovery Date:** Today
   - **Source Type:** `Job Card`
   - **Job Card:** `JC-001`
   - **Scrap Weight:** `0.5` (grams)
   - **Metal Spec:** `GOLD-22K`
   - **Purity %:** `91.67`
   - **Expected Recovery:** `0.45` (grams)
   - **Actual Recovery:** `0.46` (grams)
4. Click **Save**
5. Verify:
   - **Fine Gold Recovered** calculated automatically
   - **Variance** calculated
   - **Net Recovery Value** calculated

#### Test Approval

1. Check **Is Approved**
2. Click **Save**
3. Click **Submit**
4. Verify **Approved By** and **Approved On** populated

**✅ Expected Result:** Scrap recovery created, calculations correct, approval working

---

### Test 4: Barcode/QR Generation ✅

#### Generate Barcode for SKU

1. Go to **Diamond Casa Jewellery** → **Jewellery SKU**
2. Open any SKU (e.g., `RING-001-22K-1CT`)
3. Use API or utility:
   ```python
   # In ERPNext console (bench console)
   from diamondcasa_jewellery.utils.barcode import generate_sku_barcode
   result = generate_sku_barcode("RING-001-22K-1CT")
   print(result)
   ```

#### Generate QR Code for Piece

1. Go to **Diamond Casa Jewellery** → **Jewellery Piece**
2. Create new piece:
   - **Piece ID:** `PIECE-001`
   - **SKU:** `RING-001-22K-1CT`
   - **Gross Weight:** `5.0`
3. Click **Save**
4. Verify barcode/QR code generated

#### Test API Endpoints

```bash
# Get barcode for SKU
curl -X GET "http://localhost:8000/api/method/diamondcasa_jewellery.utils.barcode.get_barcode_for_sku?sku_code=RING-001-22K-1CT" \
  -H "Authorization: token api_key:api_secret"

# Get QR code for piece
curl -X GET "http://localhost:8000/api/method/diamondcasa_jewellery.utils.barcode.get_qr_code_for_piece?piece_id=PIECE-001&sku_code=RING-001-22K-1CT" \
  -H "Authorization: token api_key:api_secret"
```

**✅ Expected Result:** Barcode/QR codes generated successfully

---

### Test 5: CAD/CAM Spec ✅

#### Create CAD/CAM Spec

1. Go to **Diamond Casa Jewellery** → **CAD CAM Spec**
2. Click **New**
3. Fill in:
   - **Spec Code:** `CAD-001`
   - **Design:** `RING-001`
   - **CAD File:** Upload CAD file
   - **CAD Software:** `Rhino`
   - **CAD Version:** `1.0`
   - **CAM File:** Upload CAM file
   - **STL File:** Upload STL file
   - **Estimated Metal Cost:** `25000`
   - **Estimated Making Charge:** `5000`
   - **Estimated Stone Cost:** `50000`
4. Click **Save**
5. Verify **Estimated Total Cost** calculated automatically

**✅ Expected Result:** CAD/CAM spec created, files attached, cost calculated

---

### Test 6: Craft Worker Performance ✅

#### View Craft Worker Metrics

1. Go to **Diamond Casa Jewellery** → **Craft Worker**
2. Open `KARIGAR-001`
3. Check **Performance Metrics:**
   - **Total Jobs Completed:** (calculated from Job Cards)
   - **Average Wastage %:** (calculated from Job Cards)
   - **Quality Rating:** (manual entry)

#### Create Report

1. Go to **Reports** → **Custom Report**
2. Create report for Craft Worker performance
3. Filter by worker, date range
4. View wastage analysis

**✅ Expected Result:** Performance metrics visible, reports working

---

### Test 7: Integration APIs ✅

#### Test Products API

```bash
# Get products
curl -X GET "http://localhost:8000/api/diamondcasa/products" \
  -H "Authorization: token api_key:api_secret"

# Create product
curl -X POST "http://localhost:8000/api/diamondcasa/products" \
  -H "Authorization: token api_key:api_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "sku_code": "RING-001-22K-1CT",
    "name": "Classic Solitaire Ring",
    "price": 80000
  }'
```

#### Test Inventory API

```bash
# Get inventory
curl -X GET "http://localhost:8000/api/diamondcasa/inventory?sku_code=RING-001-22K-1CT" \
  -H "Authorization: token api_key:api_secret"

# Update inventory
curl -X PATCH "http://localhost:8000/api/diamondcasa/inventory" \
  -H "Authorization: token api_key:api_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "sku_code": "RING-001-22K-1CT",
    "qty": 10
  }'
```

#### Test Orders API

```bash
# Create order
curl -X POST "http://localhost:8000/api/diamondcasa/orders" \
  -H "Authorization: token api_key:api_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "ORD-001",
    "customer": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "sku_code": "RING-001-22K-1CT",
        "qty": 1,
        "price": 80000
      }
    ]
  }'
```

**✅ Expected Result:** All APIs working, Integration Log created

---

### Test 8: Action Logging ✅

#### View Action Logs

1. Go to **Diamond Casa Jewellery** → **Jewellery Action Log**
2. View logs:
   - Filter by **Action Type**
   - Filter by **User**
   - Filter by **Reference DocType**
3. Check audit trail for:
   - Bag status changes
   - Job Card updates
   - Scrap Recovery approvals

**✅ Expected Result:** All actions logged, audit trail complete

---

### Test 9: Scheduled Jobs ✅

#### Check Scheduler

1. Go to **Setup** → **Scheduler** → **Scheduled Job Type**
2. Verify jobs:
   - `sync_products_to_diamondcasa_scheduled` (every 15 min)
   - `sync_inventory_to_diamondcasa_scheduled` (every 15 min)
   - `sync_prices_to_diamondcasa_scheduled` (every 15 min)
   - `sync_media_to_diamondcasa_scheduled` (hourly)
   - `cleanup_integration_logs_scheduled` (daily)

#### Test Manual Execution

```bash
# In bench console
bench --site diamondcasa.localhost console

# Execute sync
frappe.get_doc("Scheduled Job Type", "sync_products_to_diamondcasa_scheduled").execute()
```

**✅ Expected Result:** Scheduled jobs running, sync working

---

## Complete Feature Checklist

Use this checklist to verify all features:

### Master Data ✅
- [ ] Metal Spec created and working
- [ ] Stone Spec created and working
- [ ] Jewellery Design created and working
- [ ] Jewellery SKU created and working
- [ ] Pricing Rule created and working
- [ ] Certification created and working
- [ ] CAD/CAM Spec created and working

### Manufacturing ✅
- [ ] Job Card created with all stages
- [ ] Job Card Material added
- [ ] Stage progression working
- [ ] Cost calculation correct
- [ ] QC approval working

### Operations ✅
- [ ] Bag/Packet created
- [ ] Bag status timeline working
- [ ] Bag watchlist functional
- [ ] Scrap & Recovery created
- [ ] Fine gold recovery calculated
- [ ] Wastage variance calculated
- [ ] Craft Worker created
- [ ] Performance metrics calculated

### Inventory ✅
- [ ] Jewellery Piece created
- [ ] Piece-level tracking working
- [ ] Barcode generated
- [ ] QR code generated

### Integration ✅
- [ ] Products API working
- [ ] Inventory API working
- [ ] Orders API working
- [ ] Webhooks receiving
- [ ] Integration Log created
- [ ] Scheduled jobs running

### Settings & Audit ✅
- [ ] Settings configured
- [ ] Feature flags working
- [ ] Action Log created
- [ ] Audit trail complete

---

## Troubleshooting

### Issue: App not visible in module list

**Solution:**
```bash
# Clear cache
bench --site diamondcasa.localhost clear-cache

# Restart bench
bench restart
```

### Issue: DocTypes not appearing

**Solution:**
```bash
# Migrate database
bench --site diamondcasa.localhost migrate

# Clear cache
bench --site diamondcasa.localhost clear-cache
```

### Issue: API endpoints not working

**Solution:**
1. Check API key/secret in Settings
2. Verify permissions for API user
3. Check Integration Log for errors
4. Verify webhook secret

### Issue: Scheduled jobs not running

**Solution:**
```bash
# Enable scheduler
bench --site diamondcasa.localhost set-config enable_scheduler 1

# Restart bench
bench restart
```

### Issue: Barcode/QR not generating

**Solution:**
1. Check if `qrcode` package installed:
   ```bash
   bench --site diamondcasa.localhost console
   import qrcode
   ```
2. Install if missing:
   ```bash
   pip install qrcode Pillow
   ```

---

## Quick Start Commands

```bash
# Start ERPNext
bench start

# Stop ERPNext
bench stop

# Restart ERPNext
bench restart

# View logs
bench --site diamondcasa.localhost logs

# Access console
bench --site diamondcasa.localhost console

# Clear cache
bench --site diamondcasa.localhost clear-cache

# Migrate database
bench --site diamondcasa.localhost migrate

# Backup database
bench --site diamondcasa.localhost backup
```

---

## Next Steps

1. ✅ Complete all feature tests
2. ✅ Configure ERPNext native features (Manufacturing, Sales, Inventory)
3. ✅ Set up email/SMS notifications
4. ✅ Create custom print formats
5. ✅ Create custom reports
6. ✅ Configure workflows
7. ✅ Set up production environment

---

**🎉 You're all set! Start testing and enjoy your Diamond Casa Jewellery ERP! 🎉**

---

**End of Guide**
