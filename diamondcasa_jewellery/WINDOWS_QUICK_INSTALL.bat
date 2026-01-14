@echo off
REM Windows Quick Install Script for ERPNext
REM This script helps set up WSL2 and provides instructions

echo ========================================
echo Diamond Casa Jewellery ERP - Windows Installer
echo ========================================
echo.

echo Step 1: Checking WSL2 installation...
wsl --status >nul 2>&1
if %errorlevel% neq 0 (
    echo WSL is not installed. Installing WSL2...
    echo Please run PowerShell as Administrator and execute:
    echo wsl --install
    echo.
    echo After installation, restart your computer and run this script again.
    pause
    exit
)

echo WSL2 is installed!
echo.

echo Step 2: Checking Ubuntu installation...
wsl -l -v | findstr Ubuntu >nul 2>&1
if %errorlevel% neq 0 (
    echo Ubuntu is not installed.
    echo Please install Ubuntu 22.04 LTS from Microsoft Store.
    echo.
    echo After installation, run this script again.
    pause
    exit
)

echo Ubuntu is installed!
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Open Ubuntu terminal (from Start Menu)
echo 2. Run the following commands:
echo.
echo    cd ~
echo    sudo apt update
echo    sudo apt upgrade -y
echo.
echo 3. Then follow the installation guide:
echo    WINDOWS_INSTALLATION_GUIDE.md
echo.
echo ========================================
echo.
echo For detailed instructions, see:
echo - WINDOWS_INSTALLATION_GUIDE.md
echo - RUN_AND_TEST_GUIDE.md
echo.
pause
