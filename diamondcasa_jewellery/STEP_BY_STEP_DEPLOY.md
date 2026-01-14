# Step-by-Step Deployment to Frappe Cloud

**Target:** https://diamondcasa.frappe.cloud/app/home

---

## ✅ Step 1: Run Deployment Script

Double-click: **`DEPLOY_NOW.bat`**

This will:
- Initialize Git (if needed)
- Create .gitignore
- Verify app structure
- Add all files to Git

---

## ✅ Step 2: Commit to Git

Open PowerShell in the app folder:

```powershell
cd c:\Users\ADMIN\Desktop\DEMOAPP\diamondcasa_jewellery
git commit -m "Deploy Diamond Casa Jewellery app with P1 features"
```

---

## ✅ Step 3: Create GitHub Repository

1. **Go to:** https://github.com/new
2. **Repository name:** `diamondcasa-jewellery-app`
3. **Visibility:** ✅ **Public** (or add Frappe Cloud as collaborator)
4. **DO NOT** check "Initialize with README"
5. **Click:** "Create repository"

---

## ✅ Step 4: Push to GitHub

In PowerShell:

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git
git branch -M main
git push -u origin main
```

Enter your GitHub credentials when prompted.

---

## ✅ Step 5: Deploy to Frappe Cloud

1. **Login:** https://frappecloud.com
2. **Go to your site:** Click on `diamondcasa.frappe.cloud`
3. **Click:** "Apps" tab
4. **Click:** "Add App" button
5. **Select:** "From GitHub"
6. **Enter:**
   - **Repository URL:** `https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app`
   - **Branch:** `main`
   - **App Name:** `diamondcasa_jewellery`
7. **Click:** "Add App"
8. **Wait** for app to be added (30 seconds)
9. **Click:** "Install" next to `diamondcasa_jewellery`
10. **Wait** for installation (2-5 minutes)

---

## ✅ Step 6: Configure Settings

1. **Login:** https://diamondcasa.frappe.cloud/app/home
2. **Go to:** Diamond Casa Jewellery → DiamondCasa Jewellery Settings
3. **Configure:**
   - DiamondCasa API URL, Key, Secret
   - WhatsApp API URL, Key, Secret
   - Enable features as needed
4. **Save**

---

## ✅ Step 7: Verify Installation

1. **Check DocTypes:**
   - Setup → Customize → DocType
   - Look for: Media Asset, Design Version, Commission Calculator

2. **Test Features:**
   - Create a Media Asset
   - Create a Design Version
   - Test WhatsApp integration

---

## 🆘 If Something Fails

### Git Push Fails:
- Check GitHub credentials
- Verify repository exists and is public
- Try: `git push -u origin main --force` (if needed)

### Frappe Cloud Installation Fails:
- Check Site → Logs for errors
- Verify repository URL is correct
- Ensure branch is `main` (not `master`)

### App Not Showing:
- Wait 1-2 minutes and refresh
- Check if repository is public
- Verify app name is exactly: `diamondcasa_jewellery`

---

## 📞 Quick Reference

**GitHub Repository:** `https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app`  
**Frappe Cloud Site:** `https://diamondcasa.frappe.cloud`  
**App Name:** `diamondcasa_jewellery`  
**Branch:** `main`

---

**Follow these steps in order. Good luck! 🚀**
