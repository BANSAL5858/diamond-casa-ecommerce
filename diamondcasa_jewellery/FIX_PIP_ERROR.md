# Fix: Externally-Managed Python Environment Error

**Error:** `externally-managed-environment`

**Cause:** Ubuntu 24.04+ has externally-managed Python environment

---

## 🔧 Quick Fix

The script has been updated. If you still see this error, run:

```bash
# Install bench with --break-system-packages flag
sudo pip3 install --break-system-packages frappe-bench

# Or use pipx (recommended)
sudo apt install -y pipx
pipx ensurepath
pipx install frappe-bench
```

---

## 🔧 Manual Fix

If the script still fails, manually install bench:

```bash
# Option 1: Use --break-system-packages
sudo pip3 install --break-system-packages frappe-bench

# Option 2: Use pipx (cleaner)
sudo apt install -y pipx
pipx ensurepath
pipx install frappe-bench

# Verify installation
bench --version
```

---

## ✅ After Fixing

Continue with the installation:

```bash
cd /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery
./install_all.sh
```

The script will skip bench installation if it's already installed.

---

**The script has been updated to handle this automatically!**
