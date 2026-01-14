#!/bin/bash

# ========================================
# Diamond Casa Jewellery ERP - Complete Installation Script
# This script installs ERPNext + Custom App automatically
# Run this in WSL2 Ubuntu terminal
# ========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SITE_NAME="diamondcasa.localhost"
ADMIN_PASSWORD="admin"
DB_ROOT_PASSWORD="admin"
BENCH_DIR="$HOME/frappe-bench"
APP_NAME="diamondcasa_jewellery"
WINDOWS_APP_PATH="/mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery"

# Functions
print_step() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as regular user."
    exit 1
fi

print_step "Diamond Casa Jewellery ERP - Complete Installation"
echo "This script will install:"
echo "  1. ERPNext v14"
echo "  2. Diamond Casa Jewellery Custom App"
echo "  3. All dependencies"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Step 1: Update System
print_step "Step 1: Updating System"
sudo apt update
sudo apt upgrade -y
print_success "System updated"

# Step 2: Install Dependencies
print_step "Step 2: Installing Dependencies"
sudo apt install -y python3-dev python3-pip python3-venv \
    python3-setuptools python3-wheel git curl wget \
    software-properties-common build-essential \
    mariadb-server mariadb-client redis-server \
    python3.10 python3.10-venv python3.10-dev

print_success "Basic dependencies installed"

# Install Node.js 18
print_warning "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js installed: $(node --version)"

# Verify installations
python3 --version
node --version
mysql --version

# Step 3: Configure MariaDB
print_step "Step 3: Configuring MariaDB"

# Start MariaDB
sudo service mariadb start

# Set root password (non-interactive)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$DB_ROOT_PASSWORD';" 2>/dev/null || true
sudo mysql -e "DELETE FROM mysql.user WHERE User='';" 2>/dev/null || true
sudo mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');" 2>/dev/null || true
sudo mysql -e "DROP DATABASE IF EXISTS test;" 2>/dev/null || true
sudo mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';" 2>/dev/null || true
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true

print_success "MariaDB configured"

# Step 4: Install Bench
print_step "Step 4: Installing Frappe Bench"

# Check if bench is already installed
if command -v bench &> /dev/null; then
    print_warning "Bench already installed: $(bench --version)"
else
    # Try installing with --break-system-packages (for Ubuntu 24.04+)
    if sudo pip3 install --break-system-packages frappe-bench 2>/dev/null; then
        print_success "Bench installed: $(bench --version)"
    else
        # Alternative: Use pipx
        print_warning "Trying pipx installation..."
        sudo apt install -y pipx
        pipx ensurepath
        pipx install frappe-bench
        print_success "Bench installed via pipx"
    fi
fi

# Step 5: Check Python Version
print_step "Step 5: Checking Python Version"

# Check if Python 3.10 or 3.11 is available
PYTHON_VERSION=$(python3.10 --version 2>/dev/null | grep -oP '\d+\.\d+' || python3.11 --version 2>/dev/null | grep -oP '\d+\.\d+' || echo "")

if [ -z "$PYTHON_VERSION" ]; then
    print_error "Python 3.10 or 3.11 is required but not found!"
    print_warning "Installing Python 3.10..."
    sudo apt install -y software-properties-common
    sudo add-apt-repository -y ppa:deadsnakes/ppa
    sudo apt update
    sudo apt install -y python3.10 python3.10-venv python3.10-dev python3.10-distutils
    PYTHON_CMD="python3.10"
else
    if command -v python3.10 &> /dev/null; then
        PYTHON_CMD="python3.10"
    elif command -v python3.11 &> /dev/null; then
        PYTHON_CMD="python3.11"
    else
        PYTHON_CMD="python3"
    fi
    print_success "Using Python: $($PYTHON_CMD --version)"
fi

# Step 6: Initialize Bench
print_step "Step 6: Initializing Bench (This may take 10-15 minutes)"

if [ -d "$BENCH_DIR" ]; then
    print_warning "Bench directory exists. Removing..."
    rm -rf "$BENCH_DIR"
fi

mkdir -p "$BENCH_DIR"
cd "$BENCH_DIR"

# Initialize bench with specific Python version
bench init frappe-bench --frappe-branch version-14 --python "$PYTHON_CMD"

cd frappe-bench
print_success "Bench initialized with $PYTHON_CMD"

# Step 7: Create Site
print_step "Step 7: Creating Site"

# Check if site exists
if bench --site "$SITE_NAME" list-apps &>/dev/null; then
    print_warning "Site $SITE_NAME already exists. Skipping creation."
else
    bench new-site "$SITE_NAME" \
        --admin-password "$ADMIN_PASSWORD" \
        --db-root-password "$DB_ROOT_PASSWORD" \
        --no-mariadb-socket
    print_success "Site $SITE_NAME created"
fi

bench use "$SITE_NAME"
print_success "Site set as default"

# Step 8: Install ERPNext
print_step "Step 8: Installing ERPNext (This may take 15-20 minutes)"

# Check if ERPNext is already installed
if bench --site "$SITE_NAME" list-apps | grep -q "erpnext"; then
    print_warning "ERPNext already installed. Skipping..."
else
    # Get ERPNext app
    if [ ! -d "apps/erpnext" ]; then
        bench get-app erpnext --branch version-14
    fi
    
    # Install ERPNext
    bench --site "$SITE_NAME" install-app erpnext
    print_success "ERPNext installed"
fi

# Step 9: Install Custom App
print_step "Step 9: Installing Diamond Casa Jewellery App"

# Copy app from Windows to WSL
if [ -d "$WINDOWS_APP_PATH" ]; then
    print_warning "Copying app from Windows..."
    
    # Remove existing app if present
    if [ -d "./apps/$APP_NAME" ]; then
        rm -rf "./apps/$APP_NAME"
    fi
    
    # Copy app
    cp -r "$WINDOWS_APP_PATH" ./apps/
    
    # Verify app structure - check if hooks.py exists at correct location
    if [ ! -f "./apps/$APP_NAME/$APP_NAME/hooks.py" ]; then
        print_error "App structure incorrect! Expected: ./apps/$APP_NAME/$APP_NAME/hooks.py"
        print_warning "Checking app structure..."
        ls -la "./apps/$APP_NAME/" || true
        
        # Try to fix structure if nested incorrectly
        if [ -d "./apps/$APP_NAME/$APP_NAME/$APP_NAME" ]; then
            print_warning "Fixing nested directory structure..."
            mv "./apps/$APP_NAME/$APP_NAME/$APP_NAME" "./apps/$APP_NAME/${APP_NAME}_temp"
            rm -rf "./apps/$APP_NAME/$APP_NAME"
            mv "./apps/$APP_NAME/${APP_NAME}_temp" "./apps/$APP_NAME/$APP_NAME"
        fi
    fi
    
    # Verify hooks.py exists
    if [ -f "./apps/$APP_NAME/$APP_NAME/hooks.py" ]; then
        print_success "App copied and structure verified"
    else
        print_error "App structure still incorrect. Please check manually."
        print_warning "Expected structure: ./apps/$APP_NAME/$APP_NAME/hooks.py"
        exit 1
    fi
elif [ -d "./apps/$APP_NAME" ]; then
    print_warning "App already exists in apps directory"
    # Verify structure
    if [ ! -f "./apps/$APP_NAME/$APP_NAME/hooks.py" ]; then
        print_error "Existing app structure incorrect!"
        exit 1
    fi
else
    print_error "App not found at $WINDOWS_APP_PATH"
    print_warning "Please ensure the app is at: $WINDOWS_APP_PATH"
    print_warning "Or manually copy it to: ./apps/$APP_NAME"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install app dependencies
print_warning "Installing app dependencies..."
bench setup requirements

# Install app on site
if bench --site "$SITE_NAME" list-apps | grep -q "$APP_NAME"; then
    print_warning "App already installed. Reinstalling..."
    bench --site "$SITE_NAME" reinstall --app "$APP_NAME" || true
else
    bench --site "$SITE_NAME" install-app "$APP_NAME"
fi

# Migrate database
print_warning "Migrating database..."
bench --site "$SITE_NAME" migrate

# Clear cache
print_warning "Clearing cache..."
bench --site "$SITE_NAME" clear-cache

print_success "Custom app installed"

# Step 10: Final Configuration
print_step "Step 10: Final Configuration"

# Enable scheduler
bench --site "$SITE_NAME" set-config enable_scheduler 1

# Set developer mode (optional)
# bench --site "$SITE_NAME" set-config developer_mode 1

print_success "Configuration complete"

# Step 11: Summary
print_step "Installation Complete!"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation Summary:${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "✅ ERPNext v14 installed"
echo "✅ Diamond Casa Jewellery app installed"
echo "✅ Site: $SITE_NAME"
echo "✅ Admin Username: Administrator"
echo "✅ Admin Password: $ADMIN_PASSWORD"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Start ERPNext:"
echo "   cd $BENCH_DIR/frappe-bench"
echo "   bench start"
echo ""
echo "2. Access ERPNext:"
echo "   Open browser: http://localhost:8000"
echo "   Login: Administrator / $ADMIN_PASSWORD"
echo ""
echo "3. Configure Settings:"
echo "   Go to: Diamond Casa Jewellery → DiamondCasa Jewellery Settings"
echo ""
echo -e "${BLUE}========================================${NC}"
echo ""

# Ask if user wants to start bench now
read -p "Start ERPNext now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_step "Starting ERPNext..."
    echo "ERPNext will start in the background."
    echo "Access it at: http://localhost:8000"
    echo ""
    echo "To stop: Press Ctrl+C or run 'bench stop'"
    echo ""
    bench start
else
    echo ""
    echo "To start ERPNext later, run:"
    echo "  cd $BENCH_DIR/frappe-bench"
    echo "  bench start"
    echo ""
fi

print_success "All done! 🎉"
