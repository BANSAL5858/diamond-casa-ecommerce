#!/bin/bash
# Quick SSH installation script for Frappe Cloud
# Run this AFTER SSHing into your Frappe Cloud site

echo "=========================================="
echo "Installing Diamond Casa Jewellery App"
echo "=========================================="
echo ""

# Navigate to bench
cd ~/frappe-bench

# Get app with app-directory specified
echo "Step 1: Getting app from GitHub..."
bench get-app diamondcasa_jewellery \
  https://github.com/BANSAL5858/diamond-casa-ecommerce.git \
  --branch main \
  --app-directory diamondcasa_jewellery

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to get app"
    exit 1
fi

echo "✓ App downloaded"
echo ""

# Install app
echo "Step 2: Installing app on site..."
bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install app"
    exit 1
fi

echo "✓ App installed"
echo ""

# Migrate
echo "Step 3: Migrating database..."
bench --site diamondcasa.frappe.cloud migrate

echo "✓ Database migrated"
echo ""

# Clear cache
echo "Step 4: Clearing cache..."
bench --site diamondcasa.frappe.cloud clear-cache

echo "✓ Cache cleared"
echo ""

# Restart
echo "Step 5: Restarting services..."
bench restart

echo ""
echo "=========================================="
echo "✓ Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Login: https://diamondcasa.frappe.cloud/app/home"
echo "  2. Go to: Diamond Casa Jewellery → DiamondCasa Jewellery Settings"
echo "  3. Configure API credentials"
echo ""
