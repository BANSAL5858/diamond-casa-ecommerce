@echo off
echo ========================================
echo GitHub Upload Script
echo ========================================
echo.
echo Please provide your GitHub details:
echo.

set /p GITHUB_USERNAME="Enter your GitHub username: "
set /p REPO_NAME="Enter your repository name: "

echo.
echo Adding remote repository...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
echo (You will be prompted for username and password/token)
git push -u origin main

echo.
echo ========================================
echo Done! Check your GitHub repository.
echo ========================================
pause
