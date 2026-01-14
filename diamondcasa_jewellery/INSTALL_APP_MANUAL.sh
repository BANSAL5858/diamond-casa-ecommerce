#!/bin/bash
# Manual installation of diamondcasa_jewellery app

BENCH_DIR="$HOME/frappe-bench/frappe-bench"
APP_DIR="$BENCH_DIR/apps/diamondcasa_jewellery"

echo "=========================================="
echo "Installing Diamond Casa Jewellery App"
echo "=========================================="
echo ""

cd "$BENCH_DIR"

# Step 1: Verify app structure
echo "Step 1: Verifying app structure..."
if [ ! -f "$APP_DIR/diamondcasa_jewellery/hooks.py" ]; then
    echo "ERROR: hooks.py not found at $APP_DIR/diamondcasa_jewellery/hooks.py"
    exit 1
fi

if [ ! -d "$APP_DIR/diamondcasa_jewellery/api" ]; then
    echo "ERROR: api directory not found"
    exit 1
fi

if [ ! -d "$APP_DIR/diamondcasa_jewellery/doctype" ]; then
    echo "ERROR: doctype directory not found"
    exit 1
fi

echo "✓ App structure verified"
echo ""

# Step 2: Check setup.py
echo "Step 2: Checking setup.py..."
if [ ! -f "$APP_DIR/setup.py" ]; then
    echo "ERROR: setup.py not found!"
    exit 1
fi
echo "✓ setup.py found"
echo ""

# Step 3: Install app as Python package
echo "Step 3: Installing app as Python package..."
cd "$APP_DIR"
source "$BENCH_DIR/env/bin/activate"

# Install in editable mode
pip install -e . --quiet

if [ $? -eq 0 ]; then
    echo "✓ App installed as Python package"
else
    echo "ERROR: Failed to install app"
    exit 1
fi
echo ""

# Step 4: Verify import
echo "Step 4: Verifying Python import..."
python -c "import diamondcasa_jewellery; print('✓ Module imported successfully')" 2>&1

if [ $? -ne 0 ]; then
    echo "ERROR: Still cannot import module"
    echo "Checking Python path..."
    python -c "import sys; print('\n'.join(sys.path))"
    exit 1
fi
echo ""

# Step 5: Install on site
echo "Step 5: Installing app on site..."
cd "$BENCH_DIR"
bench --site diamondcasa.localhost install-app diamondcasa_jewellery

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ App installed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "  1. bench --site diamondcasa.localhost migrate"
    echo "  2. bench --site diamondcasa.localhost clear-cache"
    echo "  3. bench start"
    echo ""
else
    echo "ERROR: Failed to install app on site"
    exit 1
fi
