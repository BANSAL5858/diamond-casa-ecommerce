#!/bin/bash
# Complete installation and verification script

BENCH_DIR="$HOME/frappe-bench/frappe-bench"
APP_DIR="$BENCH_DIR/apps/diamondcasa_jewellery"

echo "=========================================="
echo "Complete Installation & Verification"
echo "=========================================="
echo ""

cd "$BENCH_DIR"
source env/bin/activate

# Step 1: Update requirements.txt
echo "Step 1: Updating requirements.txt..."
cp /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery/requirements.txt "$APP_DIR/" 2>/dev/null || echo "Using existing requirements.txt"
echo "✓"

# Step 2: Fix app structure
echo ""
echo "Step 2: Verifying app structure..."
cd "$APP_DIR/diamondcasa_jewellery"

# Fix nested structure if exists
if [ -d "diamondcasa_jewellery" ]; then
    echo "Fixing nested structure..."
    [ -d "diamondcasa_jewellery/api" ] && mv diamondcasa_jewellery/api .
    [ -d "diamondcasa_jewellery/doctype" ] && mv diamondcasa_jewellery/doctype .
    [ -d "diamondcasa_jewellery/utils" ] && mv diamondcasa_jewellery/utils .
    rmdir diamondcasa_jewellery 2>/dev/null || rm -rf diamondcasa_jewellery
fi

# Verify
if [ -f "hooks.py" ] && [ -d "api" ] && [ -d "doctype" ] && [ -d "utils" ]; then
    echo "✓ Structure correct"
else
    echo "✗ Structure incorrect!"
    ls -la
    exit 1
fi

# Step 3: Install as Python package
echo ""
echo "Step 3: Installing app as Python package..."
cd "$APP_DIR"
pip install -e . 2>&1 | tail -5

# Step 4: Verify import
echo ""
echo "Step 4: Verifying import..."
python -c "import diamondcasa_jewellery; print('✓ Import successful')" 2>&1

if [ $? -ne 0 ]; then
    echo "✗ Import failed!"
    exit 1
fi

# Step 5: Install on site
echo ""
echo "Step 5: Installing app on site..."
cd "$BENCH_DIR"
bench clear-cache
bench --site diamondcasa.localhost install-app diamondcasa_jewellery

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ App installed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "  bench --site diamondcasa.localhost migrate"
    echo "  bench --site diamondcasa.localhost clear-cache"
    echo "  bench start"
    echo ""
    echo "Then access: http://localhost:8000"
else
    echo ""
    echo "⚠ Installation failed, but import works."
    echo "Try manual installation:"
    echo "  bench --site diamondcasa.localhost console"
    echo "  Then in console:"
    echo "    frappe.install_app('diamondcasa_jewellery')"
fi
