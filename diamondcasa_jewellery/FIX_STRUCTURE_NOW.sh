#!/bin/bash
# Fix app structure - move api, doctype, utils up one level

APP_DIR="$HOME/frappe-bench/frappe-bench/apps/diamondcasa_jewellery/diamondcasa_jewellery"

echo "Fixing app structure..."

cd "$APP_DIR"

# Check if nested diamondcasa_jewellery directory exists
if [ -d "diamondcasa_jewellery" ]; then
    echo "Found nested directory. Moving contents up..."
    
    # Move api, doctype, utils directories up
    if [ -d "diamondcasa_jewellery/api" ]; then
        mv diamondcasa_jewellery/api .
        echo "✓ Moved api/"
    fi
    
    if [ -d "diamondcasa_jewellery/doctype" ]; then
        mv diamondcasa_jewellery/doctype .
        echo "✓ Moved doctype/"
    fi
    
    if [ -d "diamondcasa_jewellery/utils" ]; then
        mv diamondcasa_jewellery/utils .
        echo "✓ Moved utils/"
    fi
    
    # Remove empty nested directory
    rmdir diamondcasa_jewellery 2>/dev/null || rm -rf diamondcasa_jewellery
    
    echo "Structure fixed!"
else
    echo "No nested directory found. Checking current structure..."
    ls -la
fi

# Verify structure
echo ""
echo "Verifying structure..."
if [ -f "hooks.py" ] && [ -d "api" ] && [ -d "doctype" ] && [ -d "utils" ]; then
    echo "✓ Structure is correct!"
    echo ""
    echo "Current structure:"
    ls -la
else
    echo "✗ Structure still incorrect!"
    echo "Expected: hooks.py, api/, doctype/, utils/ in $APP_DIR"
    exit 1
fi
