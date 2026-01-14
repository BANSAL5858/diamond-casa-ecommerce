# Fix Python 3.14 Compatibility Error

**Error:** `AttributeError: module 'ast' has no attribute 'Str'`

**Cause:** Python 3.14 is too new for ERPNext v14. ERPNext v14 requires Python 3.10 or 3.11.

---

## 🔧 Quick Fix

### Option 1: Remove Existing Bench and Reinstall (Recommended)

```bash
# Remove existing bench
rm -rf ~/frappe-bench

# Install Python 3.10
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-dev python3.10-distutils

# Verify Python 3.10
python3.10 --version

# Reinstall bench
sudo pip3 install frappe-bench

# Initialize bench with Python 3.10
cd ~
mkdir -p frappe-bench
cd frappe-bench
bench init frappe-bench --frappe-branch version-14 --python python3.10

# Continue with installation
cd frappe-bench
bench new-site diamondcasa.localhost --admin-password admin --db-root-password admin
bench use diamondcasa.localhost
bench get-app erpnext --branch version-14
bench --site diamondcasa.localhost install-app erpnext
```

### Option 2: Use Updated Installation Script

The `install_all.sh` script has been updated to:
1. Check for Python 3.10/3.11
2. Install Python 3.10 if not found
3. Use Python 3.10 explicitly

**Run the updated script:**
```bash
cd /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery
chmod +x install_all.sh
./install_all.sh
```

---

## 🔍 Verify Python Version

```bash
# Check current Python version
python3 --version

# Check if Python 3.10 is installed
python3.10 --version

# If Python 3.10 is not installed, install it:
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-dev python3.10-distutils
```

---

## 📝 Manual Fix Steps

If you already have a bench directory:

### Step 1: Remove Old Bench

```bash
rm -rf ~/frappe-bench
```

### Step 2: Install Python 3.10

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-dev python3.10-distutils
```

### Step 3: Reinstall Bench

```bash
sudo pip3 install --upgrade frappe-bench
```

### Step 4: Initialize with Python 3.10

```bash
cd ~
mkdir -p frappe-bench
cd frappe-bench
bench init frappe-bench --frappe-branch version-14 --python python3.10
```

### Step 5: Continue Installation

```bash
cd frappe-bench
bench new-site diamondcasa.localhost --admin-password admin --db-root-password admin
bench use diamondcasa.localhost
bench get-app erpnext --branch version-14
bench --site diamondcasa.localhost install-app erpnext
```

---

## ✅ Verify Fix

After fixing, verify Python version in bench:

```bash
cd ~/frappe-bench/frappe-bench
source env/bin/activate
python --version
# Should show: Python 3.10.x
```

---

## 🎯 Alternative: Use Python 3.11

If Python 3.10 is not available, you can use Python 3.11:

```bash
# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3.11-distutils

# Initialize bench with Python 3.11
bench init frappe-bench --frappe-branch version-14 --python python3.11
```

---

## 🚨 Important Notes

- **ERPNext v14 requires Python 3.10 or 3.11**
- **Python 3.14 is NOT compatible**
- **Always specify Python version when initializing bench:**
  ```bash
  bench init frappe-bench --python python3.10
  ```

---

## 📚 Reference

- ERPNext v14 Requirements: Python 3.10 or 3.11
- Frappe Framework: Compatible with Python 3.10-3.11
- Python 3.14: Too new, not supported yet

---

**After fixing, run the installation script again or continue manually!**
