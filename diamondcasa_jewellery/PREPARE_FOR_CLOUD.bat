@echo off
echo ==========================================
echo Preparing Diamond Casa Jewellery App
echo for Frappe Cloud Deployment
echo ==========================================
echo.

cd /d "%~dp0"

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

REM Initialize Git if not exists
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo Git initialized
) else (
    echo Git repository already exists
)

REM Check .gitignore
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
    echo .gitignore created
) else (
    echo .gitignore exists
)

REM Show status
echo.
echo Current Git status:
git status --short

echo.
echo ==========================================
echo Next Steps:
echo ==========================================
echo.
echo 1. Review the files to commit
echo 2. Run: git add .
echo 3. Run: git commit -m "Deploy Diamond Casa Jewellery app"
echo 4. Create GitHub repository at https://github.com/new
echo 5. Run: git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git
echo 6. Run: git push -u origin main
echo.
echo Then follow QUICK_DEPLOY.md for Frappe Cloud setup
echo.
pause
