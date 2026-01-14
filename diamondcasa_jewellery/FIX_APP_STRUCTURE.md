# Fix: App Structure Error

**Error:** `No module named 'diamondcasa_jewellery'`

**Cause:** App directory structure is incorrect after copying from Windows

---

## 🔧 Quick Fix

The app structure should be:
```
apps/diamondcasa_jewellery/
  diamondcasa_jewellery/
    __init__.py
    hooks.py
    ...
```

### Fix the Structure

Run these commands in Ubuntu terminal:

```bash
cd ~/frappe-bench/frappe-bench/apps

# Check current structure
ls -la diamondcasa_jewellery/

# If you see nested directories like:
# diamondcasa_jewellery/diamondcasa_jewellery/diamondcasa_jewellery/
# Then fix it:

# Remove and recopy correctly
rm -rf diamondcasa_jewellery
cp -r /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery ./

# Verify structure
ls -la diamondcasa_jewellery/diamondcasa_jewellery/hooks.py
# Should show the file exists

# If hooks.py is not at that location, check where it is:
find diamondcasa_jewellery -name "hooks.py"

# Then fix the structure accordingly
```

---

## 🔧 Manual Fix Steps

### Step 1: Check App Structure

```bash
cd ~/frappe-bench/frappe-bench/apps/diamondcasa_jewellery
ls -la
```

**Expected structure:**
```
diamondcasa_jewellery/
  __init__.py
  hooks.py
  modules.txt
  ...
```

**If you see:**
```
diamondcasa_jewellery/
  diamondcasa_jewellery/
    diamondcasa_jewellery/
      ...
```

**Then fix it:**

```bash
# Move nested structure up one level
cd ~/frappe-bench/frappe-bench/apps/diamondcasa_jewellery
mv diamondcasa_jewellery/diamondcasa_jewellery/* diamondcasa_jewellery/
rm -rf diamondcasa_jewellery/diamondcasa_jewellery
```

### Step 2: Verify Structure

```bash
# Check hooks.py exists at correct location
ls -la ~/frappe-bench/frappe-bench/apps/diamondcasa_jewellery/diamondcasa_jewellery/hooks.py

# Should show the file
```

### Step 3: Install App

```bash
cd ~/frappe-bench/frappe-bench
bench --site diamondcasa.localhost install-app diamondcasa_jewellery
```

---

## ✅ Correct App Structure

```
apps/diamondcasa_jewellery/
├── diamondcasa_jewellery/
│   ├── __init__.py
│   ├── hooks.py
│   ├── modules.txt
│   ├── config/
│   ├── doctype/
│   ├── api/
│   └── utils/
├── setup.py
├── requirements.txt
└── README.md
```

---

## 🔍 Verify After Fix

```bash
# Check if hooks.py exists
ls -la ~/frappe-bench/frappe-bench/apps/diamondcasa_jewellery/diamondcasa_jewellery/hooks.py

# Try importing
cd ~/frappe-bench/frappe-bench
source env/bin/activate
python -c "import diamondcasa_jewellery; print('OK')"
```

---

**After fixing, run the installation script again or install manually!**
