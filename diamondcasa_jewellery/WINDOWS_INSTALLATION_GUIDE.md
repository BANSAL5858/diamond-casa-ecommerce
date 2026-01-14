# Windows Installation Guide - Diamond Casa Jewellery ERP

**For Windows 10/11 Users**

---

## 📋 Prerequisites

### System Requirements
- **Windows 10/11** (64-bit)
- **8GB RAM minimum** (16GB recommended)
- **50GB free disk space**
- **WSL2** (Windows Subsystem for Linux 2)
- **Ubuntu 22.04** (via WSL2)

---

## 🚀 Installation Method: WSL2 (Recommended)

### Step 1: Install WSL2 and Ubuntu

#### A. Enable WSL2

1. **Open PowerShell as Administrator** (Right-click → Run as Administrator)

2. **Enable WSL:**
   ```powershell
   wsl --install
   ```

3. **If WSL is already installed, update to WSL2:**
   ```powershell
   wsl --set-default-version 2
   ```

4. **Restart your computer** when prompted

#### B. Install Ubuntu

1. **Open Microsoft Store**
2. **Search for "Ubuntu 22.04 LTS"**
3. **Click Install**
4. **Launch Ubuntu** from Start Menu
5. **Create a username and password** (remember these!)

---

### Step 2: Install ERPNext in WSL2

#### A. Update Ubuntu

```bash
# In Ubuntu terminal
sudo apt update
sudo apt upgrade -y
```

#### B. Install Required Dependencies

```bash
# Install basic dependencies
sudo apt install -y python3-dev python3-pip python3-venv \
    python3-setuptools python3-wheel git curl wget \
    software-properties-common build-essential

# Install MariaDB
sudo apt install -y mariadb-server mariadb-client

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Redis (optional but recommended)
sudo apt install -y redis-server

# Install Python 3.10
sudo apt install -y python3.10 python3.10-venv python3.10-dev

# Verify installations
python3 --version  # Should show 3.10.x
node --version     # Should show 18.x or 20.x
mysql --version   # Should show MariaDB version
```

#### C. Configure MariaDB

```bash
# Secure MariaDB installation
sudo mysql_secure_installation

# When prompted:
# - Enter current root password: (press Enter if none)
# - Set root password: Yes (enter a strong password)
# - Remove anonymous users: Yes
# - Disallow root login remotely: Yes
# - Remove test database: Yes
# - Reload privilege tables: Yes
```

#### D. Install Bench

```bash
# Install bench
sudo pip3 install frappe-bench

# Verify installation
bench --version
```

#### E. Initialize Bench

```bash
# Create bench directory
mkdir -p ~/frappe-bench
cd ~/frappe-bench

# Initialize bench (this may take 10-15 minutes)
bench init frappe-bench --frappe-branch version-14

# Navigate to bench
cd frappe-bench
```

#### F. Create Site

```bash
# Create new site
bench new-site diamondcasa.localhost \
    --admin-password admin \
    --db-root-password your_mariadb_root_password

# Set site as default
bench use diamondcasa.localhost
```

#### G. Install ERPNext

```bash
# Get ERPNext app
bench get-app erpnext --branch version-14

# Install ERPNext on site
bench --site diamondcasa.localhost install-app erpnext

# This will take 15-20 minutes
```

#### H. Start Bench

```bash
# Start bench (this will start the server)
bench start
```

**✅ ERPNext is now running!**

**Access ERPNext:**
- Open browser: `http://localhost:8000`
- Username: `Administrator`
- Password: `admin`

---

## 📦 Install Custom App (Diamond Casa Jewellery)

### Step 1: Copy App to WSL

#### Option A: From Windows to WSL

```bash
# In Ubuntu terminal, navigate to apps directory
cd ~/frappe-bench/apps

# Copy from Windows (adjust path as needed)
# Windows path: C:\Users\ADMIN\Desktop\DEMOAPP\diamondcasa_jewellery
# WSL path: /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery

cp -r /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery ./

# Verify
ls -la diamondcasa_jewellery
```

#### Option B: Clone from Git (if you have a repo)

```bash
cd ~/frappe-bench/apps
git clone <your-repo-url> diamondcasa_jewellery
```

### Step 2: Install App Dependencies

```bash
# Navigate to bench root
cd ~/frappe-bench

# Install Python dependencies
bench setup requirements

# Install app on site
bench --site diamondcasa.localhost install-app diamondcasa_jewellery

# Migrate database
bench --site diamondcasa.localhost migrate

# Clear cache
bench --site diamondcasa.localhost clear-cache
```

### Step 3: Restart Bench

```bash
# Stop bench (Ctrl+C if running in terminal)
# Start bench again
bench start
```

---

## 🌐 Access ERPNext from Windows Browser

### Option 1: Use localhost (Recommended)

1. **Keep WSL terminal open** (bench start running)
2. **Open Windows browser**
3. **Go to:** `http://localhost:8000`
4. **Login:**
   - Username: `Administrator`
   - Password: `admin`

### Option 2: Use WSL IP Address

```bash
# Get WSL IP address
ip addr show eth0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1

# Use this IP in browser: http://<WSL_IP>:8000
```

---

## ⚙️ Initial Configuration

### Step 1: Login to ERPNext

1. Open browser: `http://localhost:8000`
2. Login with:
   - **Username:** `Administrator`
   - **Password:** `admin`

### Step 2: Configure Settings

1. **Look for "Diamond Casa Jewellery" module** in sidebar
2. **Go to:** Diamond Casa Jewellery → **DiamondCasa Jewellery Settings**
3. **Configure:**
   - Enable Barcode/QR Generation ✅
   - Enable Piece-level Tracking ✅
   - Set DiamondCasa API credentials (if available)
   - Configure wastage rules
   - Set default pricing
4. **Click Save**

### Step 3: Create Master Data

Follow the **Quick Configuration** section from `QUICK_START.md`:
- Create Metal Spec
- Create Stone Spec
- Create Jewellery Design
- Create Jewellery SKU
- Create Craft Worker

---

## 🔧 Useful Commands

### Start/Stop ERPNext

```bash
# Start bench (in WSL Ubuntu terminal)
cd ~/frappe-bench
bench start

# Stop bench
# Press Ctrl+C in the terminal

# Or use:
bench restart
```

### Access Bench Console

```bash
# Open Python console
bench --site diamondcasa.localhost console
```

### View Logs

```bash
# View site logs
bench --site diamondcasa.localhost logs

# View bench logs
tail -f ~/frappe-bench/logs/web.log
```

### Clear Cache

```bash
bench --site diamondcasa.localhost clear-cache
```

### Backup Database

```bash
bench --site diamondcasa.localhost backup
```

---

## 🐛 Troubleshooting

### Issue: WSL2 not installing

**Solution:**
1. Enable Virtual Machine Platform:
   ```powershell
   # In PowerShell (Admin)
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
2. Enable Windows Subsystem for Linux:
   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   ```
3. Restart computer
4. Install WSL2 kernel update from Microsoft

### Issue: Cannot access localhost:8000

**Solution:**
1. Check if bench is running:
   ```bash
   # In WSL terminal
   cd ~/frappe-bench
   bench start
   ```
2. Check Windows Firewall:
   - Allow port 8000 in Windows Firewall
3. Try WSL IP address instead of localhost

### Issue: MariaDB connection error

**Solution:**
```bash
# Start MariaDB service
sudo service mariadb start

# Check status
sudo service mariadb status

# If not running, start it
sudo systemctl start mariadb
```

### Issue: Port 8000 already in use

**Solution:**
```bash
# Find process using port 8000
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>

# Or use different port
bench set-config http_port 8001
bench restart
```

### Issue: App not visible in module list

**Solution:**
```bash
# Clear cache
bench --site diamondcasa.localhost clear-cache

# Migrate database
bench --site diamondcasa.localhost migrate

# Restart bench
bench restart
```

### Issue: Permission denied errors

**Solution:**
```bash
# Fix permissions
sudo chown -R $USER:$USER ~/frappe-bench
chmod -R 755 ~/frappe-bench
```

---

## 📝 Quick Reference

### File Locations

- **Bench Directory:** `~/frappe-bench` (in WSL)
- **Apps Directory:** `~/frappe-bench/apps`
- **Site Directory:** `~/frappe-bench/sites/diamondcasa.localhost`
- **Logs:** `~/frappe-bench/logs`

### Access from Windows

- **ERPNext URL:** `http://localhost:8000`
- **Windows Files:** Accessible at `/mnt/c/` in WSL
- **WSL Files:** Accessible via `\\wsl$\Ubuntu\home\<username>\frappe-bench` in Windows Explorer

---

## 🎯 Next Steps

1. ✅ Complete installation
2. ✅ Access ERPNext at `http://localhost:8000`
3. ✅ Configure DiamondCasa Jewellery Settings
4. ✅ Create master data (Metal Spec, Stone Spec, Design, SKU)
5. ✅ Test features (Bag, Job Card, Scrap Recovery, Barcode)
6. ✅ Follow **RUN_AND_TEST_GUIDE.md** for detailed testing

---

## 💡 Tips

1. **Keep WSL terminal open** while using ERPNext (bench start must be running)
2. **Use Windows Terminal** for better WSL experience
3. **Bookmark** `http://localhost:8000` in your browser
4. **Backup regularly** using `bench backup` command
5. **Check logs** if something doesn't work

---

## 🚨 Important Notes

- **WSL2 must be running** for ERPNext to work
- **Don't close the terminal** where `bench start` is running
- **First installation** may take 30-45 minutes
- **Database password** - remember your MariaDB root password
- **Backup regularly** - use `bench backup` command

---

**🎉 You're all set! ERPNext is now running on your Windows laptop! 🎉**

---

**End of Windows Installation Guide**
