# Complete Installation Fix - Step by Step

**Current Status:** App structure is correct, import works, but `bench install-app` fails

---

## 🔧 Complete Fix (Run This)

```bash
cd ~/frappe-bench/frappe-bench

# Step 1: Activate environment
source env/bin/activate

# Step 2: Copy updated requirements.txt
cp /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery/requirements.txt apps/diamondcasa_jewellery/

# Step 3: Go to app directory
cd apps/diamondcasa_jewellery

# Step 4: Install app as Python package
pip install -e .

# Step 5: Verify import works
python -c "import diamondcasa_jewellery; print('OK')"
# Should print: OK

# Step 6: Go back to bench root
cd ~/frappe-bench/frappe-bench

# Step 7: Clear bench cache
bench clear-cache

# Step 8: Install app on site
bench --site diamondcasa.localhost install-app diamondcasa_jewellery

# Step 9: If still fails, try with --force
bench --site diamondcasa.localhost install-app diamondcasa_jewellery --force

# Step 10: Migrate
bench --site diamondcasa.localhost migrate

# Step 11: Clear cache
bench --site diamondcasa.localhost clear-cache

# Step 12: Start bench
bench start
```

---

## 🔍 Alternative: Manual Installation

If `bench install-app` still fails, try manual installation:

```bash
cd ~/frappe-bench/frappe-bench
source env/bin/activate

# Install app
cd apps/diamondcasa_jewellery
pip install -e .

# Go back to bench
cd ~/frappe-bench/frappe-bench

# Add app to site's installed_apps manually
bench --site diamondcasa.localhost console

# In the console, run:
# frappe.db.set_value("System Settings", "System Settings", "installed_apps", '["frappe", "erpnext", "diamondcasa_jewellery"]')
# frappe.db.commit()

# Exit console (Ctrl+D)

# Migrate
bench --site diamondcasa.localhost migrate
bench --site diamondcasa.localhost clear-cache
```

---

## ✅ After Installation

1. **Start bench:** `bench start`
2. **Access:** `http://localhost:8000`
3. **Login:** Administrator / admin
4. **Verify:** Look for "Diamond Casa Jewellery" module in sidebar

---

**Try the complete fix above!**
