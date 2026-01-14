@echo off
echo ==========================================
echo Diamond Casa Jewellery - Deploy to Frappe Cloud
echo ==========================================
echo.

cd /d "%~dp0"

echo Step 1: Checking Git...
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo ✓ Git initialized
) else (
    echo ✓ Git repository exists
)

echo.
echo Step 2: Checking .gitignore...
if not exist ".gitignore" (
    echo Creating .gitignore...
    (
        echo __pycache__/
        echo *.py[cod]
        echo *.log
        echo *.pyc
        echo sites/
        echo .env
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo .DS_Store
        echo Thumbs.db
    ) > .gitignore
    echo ✓ .gitignore created
) else (
    echo ✓ .gitignore exists
)

echo.
echo Step 3: Verifying app structure...
if not exist "setup.py" (
    echo ✗ ERROR: setup.py not found!
    pause
    exit /b 1
)

if not exist "diamondcasa_jewellery\hooks.py" (
    echo ✗ ERROR: hooks.py not found!
    pause
    exit /b 1
)

if not exist "diamondcasa_jewellery\doctype" (
    echo ✗ ERROR: doctype directory not found!
    pause
    exit /b 1
)

echo ✓ App structure verified

echo.
echo Step 4: Adding all files to Git...
git add .

echo.
echo Step 5: Checking for uncommitted changes...
git status --short

echo.
echo ==========================================
echo Next Steps (Manual):
echo ==========================================
echo.
echo 1. Commit changes:
echo    git commit -m "Deploy Diamond Casa Jewellery app to Frappe Cloud"
echo.
echo 2. Create GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: diamondcasa-jewellery-app
echo    - Make it PUBLIC
echo    - DO NOT initialize with README
echo.
echo 3. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Deploy to Frappe Cloud:
echo    - Login: https://frappecloud.com
echo    - Go to: diamondcasa.frappe.cloud
echo    - Apps → Add App → From GitHub
echo    - Repository: https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app
echo    - Branch: main
echo    - App Name: diamondcasa_jewellery
echo    - Click Install
echo.
echo ==========================================
echo Ready! Press any key to continue...
pause
