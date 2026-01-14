# Fix: hashlib-compat Package Error

**Error:** `Could not find a version that satisfies the requirement hashlib-compat>=1.0.0`

**Fix:** Removed invalid package from requirements.txt

---

## ✅ Fixed

The `requirements.txt` has been updated to remove the non-existent `hashlib-compat` package.

---

## 🔧 Reinstall App

Now run:

```bash
cd ~/frappe-bench/frappe-bench
source env/bin/activate
cd apps/diamondcasa_jewellery
pip install -e .

# Verify
python -c "import diamondcasa_jewellery; print('OK')"

# Install on site
cd ~/frappe-bench/frappe-bench
bench --site diamondcasa.localhost install-app diamondcasa_jewellery
bench --site diamondcasa.localhost migrate
bench --site diamondcasa.localhost clear-cache
```

---

**The requirements.txt has been fixed! Reinstall the app now.**
