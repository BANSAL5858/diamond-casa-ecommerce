#!/bin/bash
# Fix app directory structure

APP_DIR="$HOME/frappe-bench/frappe-bench/apps/diamondcasa_jewellery"

if [ ! -d "$APP_DIR" ]; then
    echo "App directory not found at $APP_DIR"
    exit 1
fi

echo "Checking app structure..."

# Check if there's an extra nested level
if [ -d "$APP_DIR/diamondcasa_jewellery/diamondcasa_jewellery" ]; then
    echo "Found extra nested directory. Fixing..."
    
    # Move contents up one level
    cd "$APP_DIR/diamondcasa_jewellery"
    mv diamondcasa_jewellery/* .
    mv diamondcasa_jewellery/.* . 2>/dev/null || true
    rmdir diamondcasa_jewellery
    
    echo "Structure fixed!"
else
    echo "Structure looks correct."
fi

# Verify hooks.py exists
if [ -f "$APP_DIR/diamondcasa_jewellery/hooks.py" ]; then
    echo "✓ hooks.py found at correct location"
else
    echo "✗ hooks.py not found! Expected: $APP_DIR/diamondcasa_jewellery/hooks.py"
    echo "Current structure:"
    ls -la "$APP_DIR"
    exit 1
fi

echo "App structure is correct!"
