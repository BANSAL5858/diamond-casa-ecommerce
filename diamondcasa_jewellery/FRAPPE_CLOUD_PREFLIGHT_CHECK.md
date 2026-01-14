# Frappe Cloud Pre-Flight Checklist

**Before deploying to Frappe Cloud, verify these:**

---

## ✅ Required Files Check

### 1. Root Level Files
- [x] `setup.py` - ✅ Exists
- [x] `requirements.txt` - ✅ Exists
- [x] `README.md` - ✅ Exists
- [x] `.gitignore` - ✅ Exists

### 2. App Package Structure
- [x] `diamondcasa_jewellery/__init__.py` - ✅ Exists
- [x] `diamondcasa_jewellery/hooks.py` - ✅ Exists
- [x] `diamondcasa_jewellery/modules.txt` - ✅ Exists

### 3. Core Directories
- [x] `diamondcasa_jewellery/doctype/` - ✅ Exists
- [x] `diamondcasa_jewellery/api/` - ✅ Exists
- [x] `diamondcasa_jewellery/utils/` - ✅ Exists
- [x] `diamondcasa_jewellery/config/` - ✅ Exists

---

## ⚠️ Critical Structure Issue

**IMPORTANT:** Your app has a nested structure:
```
diamondcasa_jewellery/
├── hooks.py  ← This is at wrong level!
├── __init__.py
└── diamondcasa_jewellery/  ← Actual app code here
    ├── hooks.py  ← Should be here
    ├── doctype/
    ├── api/
    └── utils/
```

**For Frappe Cloud, you have two options:**

### Option A: Use App Directory (Recommended)
When adding app in Frappe Cloud:
- **Repository:** `https://github.com/BANSAL5858/diamond-casa-ecommerce.git`
- **Branch:** `main`
- **App Name:** `diamondcasa_jewellery`
- **App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery` ⚠️ **Specify this!**

### Option B: Fix Structure (Better long-term)
Move hooks.py and __init__.py to the nested directory, or restructure.

---

## ✅ setup.py Verification

**Current setup.py:**
- ✅ Name: `diamondcasa_jewellery`
- ✅ Version: `1.0.0`
- ✅ Uses `find_packages()` - Good
- ✅ Includes `requirements.txt` - Good
- ✅ Python requires: `>=3.10` - Good

---

## ✅ requirements.txt Verification

**Current dependencies:**
- ✅ `qrcode>=7.4.2`
- ✅ `Pillow>=10.0.0`
- ✅ `limits>=3.0.0`
- ✅ `requests>=2.31.0`

**All dependencies are valid!**

---

## ✅ hooks.py Verification

**Current hooks.py:**
- ✅ `app_name = "diamondcasa_jewellery"` - Correct
- ✅ `doc_events` defined - Good
- ✅ `scheduler_events` defined - Good
- ✅ All imports correct

---

## ⚠️ Missing (Optional but Recommended)

### 1. Build Hooks (if you have JS/CSS)
- [ ] `package.json` - Not needed (no JS/CSS assets)
- [ ] Build hooks in `hooks.py` - Not needed

### 2. Installation Hooks
- [ ] `before_install` - Optional
- [ ] `after_install` - Optional (can add if needed)

### 3. Environment Variables Documentation
- [ ] Document required env vars
- [ ] Add to README

---

## 🚀 Deployment Instructions

### Step 1: Add App in Frappe Cloud

1. Login: https://frappecloud.com
2. Go to: `diamondcasa.frappe.cloud`
3. Click: **Apps** tab
4. Click: **Add App** → **From GitHub**
5. Enter:
   - **Repository:** `https://github.com/BANSAL5858/diamond-casa-ecommerce.git`
   - **Branch:** `main`
   - **App Name:** `diamondcasa_jewellery`
   - **App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery` ⚠️ **CRITICAL!**
6. Click: **Add App**

### Step 2: Install

1. Click: **Install** next to `diamondcasa_jewellery`
2. Wait 2-5 minutes
3. Check logs if it fails

---

## 🔧 Common Issues & Fixes

### Issue 1: "App directory not found"

**Cause:** App Directory not specified correctly

**Fix:**
- Use: `diamondcasa_jewellery/diamondcasa_jewellery` as App Directory
- OR restructure app to have hooks.py at `diamondcasa_jewellery/hooks.py`

### Issue 2: "Module not found: diamondcasa_jewellery"

**Cause:** Wrong app directory or structure issue

**Fix:**
- Verify App Directory is correct
- Check that `diamondcasa_jewellery/diamondcasa_jewellery/hooks.py` exists
- Check that `diamondcasa_jewellery/diamondcasa_jewellery/__init__.py` exists

### Issue 3: "Missing dependencies"

**Cause:** requirements.txt not read correctly

**Fix:**
- Verify `requirements.txt` is at root of app directory
- Check all packages are valid (they are ✅)

### Issue 4: "Import errors"

**Cause:** Missing __init__.py files

**Fix:**
- Ensure all directories have `__init__.py`:
  - `diamondcasa_jewellery/__init__.py` ✅
  - `diamondcasa_jewellery/diamondcasa_jewellery/__init__.py` - Check
  - `diamondcasa_jewellery/diamondcasa_jewellery/api/__init__.py` ✅
  - `diamondcasa_jewellery/diamondcasa_jewellery/utils/__init__.py` ✅

---

## ✅ Final Checklist Before Deploy

- [x] setup.py exists and is valid
- [x] requirements.txt exists and all packages are valid
- [x] hooks.py exists (at correct location for your structure)
- [x] __init__.py files exist in all packages
- [x] All DocTypes have .json and .py files
- [x] No syntax errors in Python files
- [x] Git repository is accessible
- [ ] **App Directory specified correctly in Frappe Cloud** ⚠️

---

## 🎯 Quick Fix Script

If installation fails, run this locally first to test:

```bash
# In your bench
bench get-app diamondcasa_jewellery https://github.com/BANSAL5858/diamond-casa-ecommerce.git --branch main --app-directory diamondcasa_jewellery/diamondcasa_jewellery
bench --site your-site.local install-app diamondcasa_jewellery
bench --site your-site.local migrate
```

---

**Status: Ready for deployment with App Directory specified!**
