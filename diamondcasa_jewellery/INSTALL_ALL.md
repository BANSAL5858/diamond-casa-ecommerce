# Single Script Installation Guide

**One script to install everything!**

---

## 🚀 Quick Installation

### Step 1: Open Ubuntu Terminal (WSL2)

1. **Open Ubuntu** from Start Menu (or Windows Terminal)
2. **Navigate to the app directory:**
   ```bash
   cd /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery
   ```

### Step 2: Run Installation Script

```bash
# Make script executable
chmod +x install_all.sh

# Run the script
./install_all.sh
```

**That's it!** The script will:
- ✅ Install all dependencies
- ✅ Install ERPNext v14
- ✅ Install Diamond Casa Jewellery app
- ✅ Configure everything
- ✅ Start ERPNext (optional)

---

## 📋 What the Script Does

1. **Updates system** (Ubuntu packages)
2. **Installs dependencies:**
   - Python 3.10
   - Node.js 18
   - MariaDB
   - Redis
   - All required packages
3. **Configures MariaDB** (database)
4. **Installs Frappe Bench**
5. **Initializes Bench** (creates frappe-bench directory)
6. **Creates Site** (diamondcasa.localhost)
7. **Installs ERPNext** v14
8. **Installs Custom App** (Diamond Casa Jewellery)
9. **Configures everything**
10. **Starts ERPNext** (if you choose)

---

## ⚙️ Configuration

The script uses these defaults (you can edit `install_all.sh` if needed):

- **Site Name:** `diamondcasa.localhost`
- **Admin Password:** `admin`
- **Database Root Password:** `admin`
- **App Path:** `/mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery`

---

## 🎯 After Installation

### Access ERPNext

1. **Open browser:** `http://localhost:8000`
2. **Login:**
   - Username: `Administrator`
   - Password: `admin`

### Configure Settings

1. Go to **Diamond Casa Jewellery** → **DiamondCasa Jewellery Settings**
2. Enable features you need
3. Save

---

## 🔧 Manual Start/Stop

### Start ERPNext

```bash
cd ~/frappe-bench/frappe-bench
bench start
```

### Stop ERPNext

Press `Ctrl+C` in the terminal, or:

```bash
bench stop
```

### Restart ERPNext

```bash
bench restart
```

---

## 🐛 Troubleshooting

### Script fails at dependency installation

**Solution:**
```bash
# Update package list
sudo apt update

# Try installing dependencies manually
sudo apt install -y python3-dev python3-pip python3-venv
```

### Script fails at MariaDB configuration

**Solution:**
```bash
# Start MariaDB
sudo service mariadb start

# Check status
sudo service mariadb status
```

### Script fails at app installation

**Solution:**
```bash
# Check if app exists
ls -la ~/frappe-bench/apps/diamondcasa_jewellery

# If not, copy manually
cd ~/frappe-bench/apps
cp -r /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery ./

# Then run:
cd ~/frappe-bench/frappe-bench
bench --site diamondcasa.localhost install-app diamondcasa_jewellery
```

### Port 8000 already in use

**Solution:**
```bash
# Find and kill process
sudo lsof -i :8000
sudo kill -9 <PID>

# Or use different port
bench set-config http_port 8001
bench restart
```

---

## 📝 Script Customization

Edit `install_all.sh` to change:

```bash
# Change these variables at the top of the script:
SITE_NAME="your-site-name"
ADMIN_PASSWORD="your-password"
DB_ROOT_PASSWORD="your-db-password"
WINDOWS_APP_PATH="/mnt/c/your/path/to/app"
```

---

## ✅ Verification

After installation, verify everything works:

```bash
# Check bench version
bench --version

# Check installed apps
bench --site diamondcasa.localhost list-apps

# Check site status
bench --site diamondcasa.localhost status
```

---

## 🎉 Success!

If you see:
```
✅ ERPNext v14 installed
✅ Diamond Casa Jewellery app installed
✅ Site: diamondcasa.localhost
```

**You're all set!** Access ERPNext at `http://localhost:8000`

---

**End of Guide**
