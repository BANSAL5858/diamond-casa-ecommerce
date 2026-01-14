# 🚀 FINAL: Deploy to Frappe Cloud

**Status:** ✅ All checks passed! Ready to deploy.

---

## ✅ Pre-Flight Checks Complete

- ✅ `setup.py` - Valid
- ✅ `requirements.txt` - All packages valid
- ✅ `hooks.py` - Syntax valid
- ✅ All DocTypes - JSON valid
- ✅ All Python files - Syntax valid
- ✅ Git repository - Pushed to GitHub

---

## ⚠️ CRITICAL: App Directory

**Your repository structure:**
```
diamond-casa-ecommerce/
└── diamondcasa_jewellery/
    ├── setup.py
    ├── requirements.txt
    ├── hooks.py  ← Outer level
    └── diamondcasa_jewellery/  ← Inner level (actual app)
        ├── hooks.py  ← Inner hooks.py (this is the one Frappe needs)
        ├── __init__.py
        ├── doctype/
        ├── api/
        └── utils/
```

**When adding app in Frappe Cloud, you MUST specify:**
- **App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery`

This tells Frappe Cloud to look for the app in the nested directory.

---

## 📋 Deployment Steps

### Step 1: Login to Frappe Cloud
1. Go to: https://frappecloud.com
2. Login

### Step 2: Go to Your Site
1. Click: `diamondcasa.frappe.cloud`
2. Wait for dashboard

### Step 3: Add App
1. Click: **"Apps"** tab (left sidebar)
2. Click: **"Add App"** button (top right, blue button)
3. Select: **"From GitHub"**
4. Fill in:
   ```
   Repository URL: https://github.com/BANSAL5858/diamond-casa-ecommerce.git
   Branch: main
   App Name: diamondcasa_jewellery
   App Directory: diamondcasa_jewellery/diamondcasa_jewellery  ⚠️ THIS IS CRITICAL!
   ```
5. Click: **"Add App"**
6. Wait 30-60 seconds

### Step 4: Install App
1. Find `diamondcasa_jewellery` in Apps list
2. Click: **"Install"** button
3. Wait 2-5 minutes
4. **Monitor the progress bar**

### Step 5: If Installation Fails
1. Click: **"Logs"** tab
2. Check: **"Build Logs"** or **"Error Logs"**
3. Copy the error message
4. See troubleshooting below

---

## 🔧 Troubleshooting

### Error: "App directory not found"

**Solution:**
- Verify App Directory is exactly: `diamondcasa_jewellery/diamondcasa_jewellery`
- No trailing slashes
- No leading slashes
- Case-sensitive (lowercase)

### Error: "No module named 'diamondcasa_jewellery'"

**Solution:**
1. Verify App Directory is correct
2. Check that `diamondcasa_jewellery/diamondcasa_jewellery/__init__.py` exists
3. Check that `diamondcasa_jewellery/diamondcasa_jewellery/hooks.py` exists

### Error: "Could not find a version that satisfies..."

**Solution:**
- All packages in requirements.txt are valid ✅
- If this error occurs, it might be a temporary PyPI issue
- Wait and retry

### Error: "SyntaxError" or "ImportError"

**Solution:**
- All Python files have been syntax-checked ✅
- If this occurs, check the specific file mentioned in error

---

## ✅ Post-Installation

### 1. Migrate Database
After successful installation:

**Option A: Via Frappe Cloud Console**
1. Site → Console
2. Run: `bench --site diamondcasa.frappe.cloud migrate`
3. Run: `bench --site diamondcasa.frappe.cloud clear-cache`

**Option B: Via SSH (if you have access)**
```bash
ssh frappe@diamondcasa.frappe.cloud
cd ~/frappe-bench
bench --site diamondcasa.frappe.cloud migrate
bench --site diamondcasa.frappe.cloud clear-cache
bench restart
```

### 2. Configure Settings
1. Login: https://diamondcasa.frappe.cloud/app/home
2. Go to: **Diamond Casa Jewellery → DiamondCasa Jewellery Settings**
3. Configure:
   - DiamondCasa API credentials
   - WhatsApp API credentials
   - Enable features
4. Save

### 3. Verify Installation
1. **Check DocTypes:**
   - Setup → Customize → DocType
   - Look for: Media Asset, Design Version, Commission Calculator

2. **Test Features:**
   - Create a Media Asset
   - Create a Design Version
   - Test WhatsApp API

---

## 📊 What Gets Installed

### ✅ All P1 Features:
- Media Asset DocType
- WhatsApp Integration
- Pre-bagging Workflow
- Design Versioning
- Commission Calculator

### ✅ All Existing Features:
- Bag/Packet Management
- Job Card
- Craft Worker
- Scrap & Recovery
- Integration APIs
- Barcode/QR Generation
- Piece-level Tracking

**Total: 19 DocTypes + APIs + Utilities**

---

## 🎯 Quick Reference

**Repository:** `https://github.com/BANSAL5858/diamond-casa-ecommerce.git`  
**Branch:** `main`  
**App Name:** `diamondcasa_jewellery`  
**App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery` ⚠️

---

## ✅ Final Checklist

- [x] Code committed ✅
- [x] Code pushed to GitHub ✅
- [ ] App added in Frappe Cloud
- [ ] **App Directory specified correctly**
- [ ] App installed successfully
- [ ] Database migrated
- [ ] Settings configured
- [ ] Features tested

---

**🚀 Go to Frappe Cloud and deploy now! Remember the App Directory!**
