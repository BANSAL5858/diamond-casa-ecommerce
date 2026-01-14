#!/bin/bash
# Script to prepare app for Frappe Cloud deployment

echo "=========================================="
echo "Preparing Diamond Casa Jewellery App"
echo "for Frappe Cloud Deployment"
echo "=========================================="
echo ""

APP_DIR="$(pwd)"

# Step 1: Check Git
echo "Step 1: Checking Git repository..."
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git repository exists"
fi

# Step 2: Check .gitignore
echo ""
echo "Step 2: Checking .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo "⚠ .gitignore not found, creating..."
    cat > .gitignore << 'EOF'
__pycache__/
*.py[cod]
*.log
*.pyc
sites/
.env
.vscode/
.idea/
*.swp
*.swo
.DS_Store
Thumbs.db
EOF
    echo "✓ .gitignore created"
else
    echo "✓ .gitignore exists"
fi

# Step 3: Verify app structure
echo ""
echo "Step 3: Verifying app structure..."
if [ ! -f "setup.py" ]; then
    echo "✗ ERROR: setup.py not found!"
    exit 1
fi

if [ ! -f "diamondcasa_jewellery/hooks.py" ]; then
    echo "✗ ERROR: hooks.py not found!"
    exit 1
fi

if [ ! -d "diamondcasa_jewellery/doctype" ]; then
    echo "✗ ERROR: doctype directory not found!"
    exit 1
fi

echo "✓ App structure verified"

# Step 4: Check requirements.txt
echo ""
echo "Step 4: Checking requirements.txt..."
if [ ! -f "requirements.txt" ]; then
    echo "⚠ requirements.txt not found, creating..."
    cat > requirements.txt << 'EOF'
# Diamond Casa Jewellery ERP - Python Dependencies

# Core Frappe dependencies are handled by bench
# Add only app-specific dependencies here

# For barcode/QR generation
qrcode>=7.4.2
Pillow>=10.0.0

# For API rate limiting
limits>=3.0.0

# For WhatsApp integration
requests>=2.31.0
EOF
    echo "✓ requirements.txt created"
else
    echo "✓ requirements.txt exists"
fi

# Step 5: Create README if missing
echo ""
echo "Step 5: Checking README.md..."
if [ ! -f "README.md" ]; then
    echo "⚠ README.md not found, creating basic one..."
    cat > README.md << 'EOF'
# Diamond Casa Jewellery ERP

Custom Frappe app for jewellery ERP functionality with bi-directional integration to DiamondCasa.com e-commerce platform.

## Installation

```bash
bench get-app diamondcasa_jewellery https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app
bench --site your-site.local install-app diamondcasa_jewellery
bench --site your-site.local migrate
```

## Features

- Jewellery Master Data Management
- Manufacturing & Job Work Tracking
- Bag/Packet Management
- Integration with DiamondCasa.com
- WhatsApp Integration
- Commission Calculator
- Design Versioning
- Media Asset Management

## Documentation

See `docs/` directory for detailed documentation.
EOF
    echo "✓ README.md created"
else
    echo "✓ README.md exists"
fi

# Step 6: Show Git status
echo ""
echo "Step 6: Git status..."
git status --short

# Step 7: Instructions
echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Review changes:"
echo "   git status"
echo ""
echo "2. Add all files:"
echo "   git add ."
echo ""
echo "3. Commit:"
echo "   git commit -m 'Deploy Diamond Casa Jewellery app to Frappe Cloud'"
echo ""
echo "4. Create GitHub repository and push:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git"
echo "   git push -u origin main"
echo ""
echo "5. In Frappe Cloud dashboard:"
echo "   - Go to your site: diamondcasa.frappe.cloud"
echo "   - Apps → Add App → From GitHub"
echo "   - Enter repository URL"
echo "   - Install app"
echo ""
echo "=========================================="
echo "Ready for deployment!"
echo "=========================================="
