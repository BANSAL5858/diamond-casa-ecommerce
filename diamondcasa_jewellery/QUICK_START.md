# Quick Start Guide - Diamond Casa Jewellery ERP

**For users who already have ERPNext installed**

---

## 🚀 Quick Installation (5 Minutes)

### Step 1: Copy App to Bench

```bash
# Navigate to your bench apps directory
cd ~/frappe-bench/apps

# Copy the app (adjust path as needed)
cp -r /path/to/DEMOAPP/diamondcasa_jewellery ./
```

### Step 2: Install App

```bash
# Navigate to bench root
cd ~/frappe-bench

# Install app on your site
bench --site your-site-name install-app diamondcasa_jewellery

# Migrate database
bench --site your-site-name migrate

# Clear cache
bench --site your-site-name clear-cache
```

### Step 3: Restart Bench

```bash
bench restart
```

### Step 4: Access ERPNext

1. Open browser: `http://localhost:8000` (or your ERPNext URL)
2. Login with your credentials
3. Look for **"Diamond Casa Jewellery"** module in the sidebar

---

## ⚙️ Quick Configuration (10 Minutes)

### 1. Configure Settings

1. Go to **Diamond Casa Jewellery** → **DiamondCasa Jewellery Settings**
2. Enable features you need:
   - ✅ Barcode/QR Generation
   - ✅ Piece-level Tracking
3. Save

### 2. Create Master Data

**Metal Spec:**
- Metal Code: `GOLD-22K`
- Purity: `22K` (91.67%)
- Rate: Your current gold rate

**Stone Spec:**
- Stone Code: `DIAMOND-SOLITAIRE`
- Type: `Diamond`
- 4Cs: Configure as needed

**Jewellery Design:**
- Design Code: `RING-001`
- Link Metal Spec and Stone Spec

**Jewellery SKU:**
- SKU Code: `RING-001-22K-1CT`
- Link Design
- Set pricing

---

## ✅ Quick Test (5 Minutes)

### Test 1: Create Bag
1. **Diamond Casa Jewellery** → **Bag**
2. Click **New**
3. Enter Bag Number: `BAG-001`
4. Save ✅

### Test 2: Create Job Card
1. **Diamond Casa Jewellery** → **Job Card**
2. Click **New**
3. Enter Job Card No: `JC-001`
4. Select Design
5. Save ✅

### Test 3: Generate Barcode
1. **Diamond Casa Jewellery** → **Jewellery SKU**
2. Open any SKU
3. Check barcode generation (via API or utility)

---

## 📚 Full Documentation

For complete setup and testing guide, see:
- **RUN_AND_TEST_GUIDE.md** - Complete installation and testing guide

---

**That's it! You're ready to use Diamond Casa Jewellery ERP! 🎉**
