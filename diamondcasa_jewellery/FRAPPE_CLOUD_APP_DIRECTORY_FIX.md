# ⚠️ CRITICAL: App Directory Fix for Frappe Cloud

**Error:** "Not a valid Frappe App! Files setup.py or setup.cfg or pyproject.toml do not exist in app directory."

---

## 🔍 Problem

Frappe Cloud is looking for `setup.py` in the repository root, but your `setup.py` is in the `diamondcasa_jewellery/` subdirectory.

---

## ✅ Solution

**When adding the app in Frappe Cloud, you MUST specify the App Directory:**

### In the "Add App" form:

1. **Repository:** `diamond-casa-ecommerce`
2. **Branch:** `main`
3. **App Name:** `diamondcasa_jewellery`
4. **App Directory:** `diamondcasa_jewellery` ⚠️ **ADD THIS FIELD!**

**The App Directory field tells Frappe Cloud where to find setup.py**

---

## 📋 Correct Form Values

```
Repository: diamond-casa-ecommerce
Branch: main
App Name: diamondcasa_jewellery
App Directory: diamondcasa_jewellery  ← ADD THIS!
```

---

## 🔧 If App Directory Field is Not Visible

Some Frappe Cloud interfaces hide the App Directory field. Try:

1. **Look for "Advanced" or "More Options"** button
2. **Check if there's a dropdown** for app directory
3. **Try the manual method** below

---

## 🔧 Alternative: Manual Install via SSH

If you have SSH access to your Frappe Cloud site:

```bash
ssh frappe@diamondcasa.frappe.cloud
cd ~/frappe-bench
bench get-app diamondcasa_jewellery https://github.com/BANSAL5858/diamond-casa-ecommerce.git --branch main --app-directory diamondcasa_jewellery
bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery
bench --site diamondcasa.frappe.cloud migrate
bench restart
```

---

## 📁 Your Repository Structure

```
diamond-casa-ecommerce/  (repository root)
└── diamondcasa_jewellery/  (app directory - contains setup.py)
    ├── setup.py  ← Frappe Cloud needs this!
    ├── requirements.txt
    ├── hooks.py
    ├── __init__.py
    ├── modules.txt
    └── diamondcasa_jewellery/  (Python package)
        ├── __init__.py
        ├── hooks.py
        ├── doctype/
        ├── api/
        └── utils/
```

**setup.py is at:** `diamondcasa_jewellery/setup.py` (relative to repo root)

**So App Directory must be:** `diamondcasa_jewellery`

---

## ✅ Quick Fix

1. **In Frappe Cloud "Add App" form:**
   - Look for **"App Directory"** field
   - Enter: `diamondcasa_jewellery`
   - Click "Add App"

2. **If field doesn't exist:**
   - Contact Frappe Cloud support
   - OR use SSH method above

---

**The App Directory field is the key! Make sure to specify it!**
