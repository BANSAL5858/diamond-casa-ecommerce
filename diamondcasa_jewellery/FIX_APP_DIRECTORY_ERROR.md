# 🔴 FIX: "Not a valid Frappe App" Error

**Error:** "Not a valid Frappe App! Files setup.py or setup.cfg or pyproject.toml do not exist in app directory."

**Cause:** Frappe Cloud is looking in the repository root, but `setup.py` is in `diamondcasa_jewellery/` subdirectory.

---

## ✅ Solution: Specify App Directory

### Option 1: Use App Directory Field (If Visible)

In the "Add App" form, look for **"App Directory"** field and enter:

```
App Directory: diamondcasa_jewellery
```

**Complete form:**
- Repository: `diamond-casa-ecommerce`
- Branch: `main`
- App Name: `diamondcasa_jewellery`
- **App Directory:** `diamondcasa_jewellery` ⚠️ **ADD THIS!**

---

### Option 2: If App Directory Field is NOT Visible

Some Frappe Cloud UIs hide this field. Try:

1. **Look for "Advanced Options" or "More Settings"** button
2. **Check for a dropdown** that says "App Directory" or "Subdirectory"
3. **Try clicking "Show Advanced"** or similar

---

### Option 3: Use SSH (If You Have Access)

If the UI doesn't show App Directory field, use SSH:

```bash
# SSH into your Frappe Cloud site
ssh frappe@diamondcasa.frappe.cloud

# Navigate to bench
cd ~/frappe-bench

# Get app with app-directory specified
bench get-app diamondcasa_jewellery \
  https://github.com/BANSAL5858/diamond-casa-ecommerce.git \
  --branch main \
  --app-directory diamondcasa_jewellery

# Install app
bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery

# Migrate
bench --site diamondcasa.frappe.cloud migrate

# Clear cache and restart
bench --site diamondcasa.frappe.cloud clear-cache
bench restart
```

---

## 📁 Your Repository Structure

```
diamond-casa-ecommerce/  ← Repository root (where Frappe Cloud looks first)
└── diamondcasa_jewellery/  ← App directory (contains setup.py)
    ├── setup.py  ← Frappe Cloud needs this!
    ├── requirements.txt
    ├── hooks.py
    ├── __init__.py
    └── diamondcasa_jewellery/  ← Python package
        ├── __init__.py
        ├── hooks.py
        └── ...
```

**setup.py location:** `diamondcasa_jewellery/setup.py` (relative to repo root)

**App Directory must be:** `diamondcasa_jewellery`

---

## 🔍 How to Find App Directory Field

1. **Scroll down** in the "Add App" form
2. **Look for** "Advanced" or "More Options" section
3. **Check** if there's a collapsible section
4. **Try** clicking on the form to see if more fields appear

---

## 🆘 If Still Can't Find App Directory Field

**Contact Frappe Cloud Support:**
- They can help you add the app with the correct directory
- Or provide SSH access so you can install manually

**Alternative: Restructure Repository (Not Recommended)**

You could move setup.py to repository root, but this would require restructuring the entire app.

---

## ✅ Quick Reference

**Repository:** `diamond-casa-ecommerce`  
**Branch:** `main`  
**App Name:** `diamondcasa_jewellery`  
**App Directory:** `diamondcasa_jewellery` ⚠️ **REQUIRED!**

---

**The App Directory field is the solution! Look for it in the form or use SSH method!**
