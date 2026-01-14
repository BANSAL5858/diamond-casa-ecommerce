#!/bin/bash
# Final fix for app installation

BENCH_DIR="$HOME/frappe-bench/frappe-bench"
APP_DIR="$BENCH_DIR/apps/diamondcasa_jewellery"

echo "=========================================="
echo "Final App Installation Fix"
echo "=========================================="
echo ""

cd "$BENCH_DIR"
source env/bin/activate

# Step 1: Copy updated requirements.txt
echo "Step 1: Updating requirements.txt..."
if [ -f "/mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery/requirements.txt" ]; then
    cp /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery/requirements.txt "$APP_DIR/"
    echo "✓ requirements.txt updated"
else
    echo "⚠ requirements.txt not found, using existing"
fi

# Step 2: Fix app structure
echo ""
echo "Step 2: Fixing app structure..."
cd "$APP_DIR/diamondcasa_jewellery"

# Move api, doctype, utils up if nested
if [ -d "diamondcasa_jewellery" ]; then
    echo "Moving nested directories up..."
    [ -d "diamondcasa_jewellery/api" ] && mv diamondcasa_jewellery/api .
    [ -d "diamondcasa_jewellery/doctype" ] && mv diamondcasa_jewellery/doctype .
    [ -d "diamondcasa_jewellery/utils" ] && mv diamondcasa_jewellery/utils .
    rmdir diamondcasa_jewellery 2>/dev/null || rm -rf diamondcasa_jewellery
    echo "✓ Structure fixed"
fi

# Verify structure
if [ ! -f "hooks.py" ] || [ ! -d "api" ] || [ ! -d "doctype" ]; then
    echo "ERROR: Structure still incorrect!"
    echo "Current structure:"
    ls -la
    exit 1
fi

echo "✓ Structure verified"
echo ""

# Step 3: Install as Python package
echo "Step 3: Installing app as Python package..."
cd "$APP_DIR"
pip install -e . 2>&1 | grep -v "already satisfied" || true

# Step 4: Verify import
echo ""
echo "Step 4: Verifying import..."
python -c "import diamondcasa_jewellery; print('✓ Import successful')" 2>&1

if [ $? -ne 0 ]; then
    echo "ERROR: Import still failing"
    echo "Checking Python path..."
    python -c "import sys; [print(p) for p in sys.path]"
    exit 1
fi

# Step 5: Install on site
echo ""
echo "Step 5: Installing app on site..."
cd "$BENCH_DIR"
bench --site diamondcasa.localhost install-app diamondcasa_jewellery

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ App installed successfully!"
    echo "=========================================="
    echo ""
    echo "Next:"
    echo "  bench --site diamondcasa.localhost migrate"
    echo "  bench --site diamondcasa.localhost clear-cache"
    echo "  bench start"
else
    echo "ERROR: Installation failed"
    exit 1
fi
