# Complete Fix for App Structure

**Problem:** `No module named 'diamondcasa_jewellery'`

**Root Cause:** The `api`, `doctype`, and `utils` directories are nested one level too deep.

---

## 🔧 Complete Fix (Run This)

Run these commands in Ubuntu terminal:

```bash
cd ~/frappe-bench/frappe-bench/apps/diamondcasa_jewellery/diamondcasa_jewellery

# Check current structure
ls -la

# If you see a nested diamondcasa_jewellery directory, fix it:
if [ -d "diamondcasa_jewellery" ]; then
    # Move api, doctype, utils up one level
    mv diamondcasa_jewellery/api . 2>/dev/null || echo "api already moved"
    mv diamondcasa_jewellery/doctype . 2>/dev/null || echo "doctype already moved"
    mv diamondcasa_jewellery/utils . 2>/dev/null || echo "utils already moved"
    
    # Remove nested directory
    rmdir diamondcasa_jewellery 2>/dev/null || rm -rf diamondcasa_jewellery
    
    echo "Structure fixed!"
fi

# Verify structure
ls -la
# Should show: hooks.py, api/, doctype/, utils/, config/, __init__.py, modules.txt

# Now install app
cd ~/frappe-bench/frappe-bench
bench --site diamondcasa.localhost install-app diamondcasa_jewellery
```

---

## ✅ Correct Structure

After fixing, the structure should be:

```
apps/diamondcasa_jewellery/
├── diamondcasa_jewellery/
│   ├── __init__.py
│   ├── hooks.py
│   ├── modules.txt
│   ├── config/
│   ├── api/          ← Directly here
│   ├── doctype/      ← Directly here
│   └── utils/        ← Directly here
├── setup.py
├── requirements.txt
└── README.md
```

**NOT:**
```
apps/diamondcasa_jewellery/
└── diamondcasa_jewellery/
    ├── hooks.py
    └── diamondcasa_jewellery/  ← Extra level!
        ├── api/
        ├── doctype/
        └── utils/
```

---

## 🔍 Verify After Fix

```bash
# Check structure
cd ~/frappe-bench/frappe-bench/apps/diamondcasa_jewellery/diamondcasa_jewellery
ls -la

# Should show:
# - hooks.py
# - api/
# - doctype/
# - utils/
# - config/
# - __init__.py
# - modules.txt
```

---

## 📦 Install App

After fixing structure:

```bash
cd ~/frappe-bench/frappe-bench
bench --site diamondcasa.localhost install-app diamondcasa_jewellery
bench --site diamondcasa.localhost migrate
bench --site diamondcasa.localhost clear-cache
bench start
```

---

**Run the fix commands above, then install the app!**
