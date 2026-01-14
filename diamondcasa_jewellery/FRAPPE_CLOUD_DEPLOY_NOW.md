# 🚀 Deploy to Frappe Cloud - FINAL INSTRUCTIONS

**Repository:** https://github.com/BANSAL5858/diamond-casa-ecommerce.git  
**Branch:** `main`  
**App Name:** `diamondcasa_jewellery`

---

## ⚠️ CRITICAL: App Directory

**Your app structure requires specifying the App Directory:**

```
diamond-casa-ecommerce/
└── diamondcasa_jewellery/
    ├── setup.py
    ├── requirements.txt
    ├── hooks.py  ← At this level
    └── diamondcasa_jewellery/  ← Actual app code here
        ├── hooks.py  ← But hooks.py is also here (duplicate)
        ├── __init__.py
        ├── doctype/
        ├── api/
        └── utils/
```

**When adding app in Frappe Cloud, you MUST specify:**
- **App Directory:** `diamondcasa_jewellery/diamondcasa_jewellery`

---

## 📋 Step-by-Step Deployment

### Step 1: Login to Frappe Cloud
1. Go to: https://frappecloud.com
2. Login with your credentials

### Step 2: Select Your Site
1. Click on: `diamondcasa.frappe.cloud`
2. Wait for site dashboard to load

### Step 3: Add App
1. Click: **"Apps"** tab (left sidebar)
2. Click: **"Add App"** button (top right)
3. Select: **"From GitHub"**
4. Fill in the form:
   ```
   Repository URL: https://github.com/BANSAL5858/diamond-casa-ecommerce.git
   Branch: main
   App Name: diamondcasa_jewellery
   App Directory: diamondcasa_jewellery/diamondcasa_jewellery  ⚠️ IMPORTANT!
   ```
5. Click: **"Add App"**
6. Wait 30-60 seconds

### Step 4: Install App
1. Find `diamondcasa_jewellery` in the Apps list
2. Click: **"Install"** button
3. Wait 2-5 minutes
4. Monitor progress

### Step 5: Check for Errors
1. If installation fails, click: **"Logs"** tab
2. Check **"Build Logs"** for errors
3. Common errors and fixes below

---

## 🔧 If Installation Fails

### Error: "App directory not found"

**Fix:**
- Verify App Directory is exactly: `diamondcasa_jewellery/diamondcasa_jewellery`
- Check repository structure matches

### Error: "No module named 'diamondcasa_jewellery'"

**Fix:**
- Verify App Directory is correct
- Check that `diamondcasa_jewellery/diamondcasa_jewellery/__init__.py` exists in repository

### Error: "Could not find a version that satisfies..."

**Fix:**
- Check requirements.txt (already verified ✅)
- All packages are valid

### Error: "SyntaxError" or "ImportError"

**Fix:**
- Check Python files for syntax errors
- Verify all imports use correct paths

---

## ✅ Post-Installation

### 1. Migrate Database
After installation, run:
```bash
# If you have SSH access:
bench --site diamondcasa.frappe.cloud migrate
bench --site diamondcasa.frappe.cloud clear-cache
bench restart
```

Or use Frappe Cloud dashboard:
- Site → Console → Run migrations

### 2. Configure Settings
1. Login: https://diamondcasa.frappe.cloud/app/home
2. Go to: **Diamond Casa Jewellery → DiamondCasa Jewellery Settings**
3. Configure all API credentials
4. Enable features
5. Save

### 3. Verify Installation
1. Check DocTypes: Setup → Customize → DocType
2. Look for: Media Asset, Design Version, Commission Calculator
3. Test creating a record

---

## 📞 If You Need Help

**Paste the error from Build Logs and I can help diagnose!**

Common things to check:
1. App Directory is specified correctly
2. Repository is accessible (public or collaborator added)
3. Branch name is correct (`main`)
4. All files are committed and pushed

---

## ✅ Quick Checklist

- [x] Code pushed to GitHub ✅
- [ ] App added in Frappe Cloud
- [ ] **App Directory specified:** `diamondcasa_jewellery/diamondcasa_jewellery`
- [ ] App installed successfully
- [ ] Database migrated
- [ ] Settings configured
- [ ] Features tested

---

**Go to Frappe Cloud and add the app now! Remember the App Directory! 🚀**
