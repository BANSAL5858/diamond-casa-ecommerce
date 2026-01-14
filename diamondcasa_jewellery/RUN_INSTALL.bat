@echo off
REM Windows Batch Script to Run Installation in WSL2
REM This script opens Ubuntu and runs the installation script

echo ========================================
echo Diamond Casa Jewellery ERP - Installation
echo ========================================
echo.

echo This will open Ubuntu terminal and run the installation script.
echo.
echo Make sure:
echo   1. WSL2 is installed
echo   2. Ubuntu 22.04 is installed
echo   3. You have internet connection
echo.
pause

echo.
echo Opening Ubuntu terminal...
echo.

REM Open Ubuntu and run the installation script
wsl bash -c "cd /mnt/c/Users/ADMIN/Desktop/DEMOAPP/diamondcasa_jewellery && chmod +x install_all.sh && ./install_all.sh"

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Access ERPNext at: http://localhost:8000
echo   2. Login: Administrator / admin
echo   3. Configure DiamondCasa Jewellery Settings
echo.
pause
