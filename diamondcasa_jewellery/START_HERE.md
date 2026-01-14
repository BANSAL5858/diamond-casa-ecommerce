# 🚀 START HERE - Deploy to Frappe Cloud

**Your app is ready! Follow these steps:**

---

## ✅ Step 1: Push to GitHub

### Option A: If you already have a GitHub repository

```powershell
cd c:\Users\ADMIN\Desktop\DEMOAPP\diamondcasa_jewellery
git push origin main
```

### Option B: Create new GitHub repository

1. **Go to:** https://github.com/new
2. **Repository name:** `diamondcasa-jewellery-app`
3. **Make it PUBLIC** ✅
4. **DO NOT** initialize with README
5. **Click:** "Create repository"

Then run:

```powershell
cd c:\Users\ADMIN\Desktop\DEMOAPP\diamondcasa_jewellery
git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## ✅ Step 2: Deploy to Frappe Cloud

1. **Login:** https://frappecloud.com
2. **Click on your site:** `diamondcasa.frappe.cloud`
3. **Click:** "Apps" tab (in the left sidebar)
4. **Click:** "Add App" button (top right)
5. **Select:** "From GitHub"
6. **Fill in:**
   - **Repository URL:** `https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app`
   - **Branch:** `main`
   - **App Name:** `diamondcasa_jewellery` (exactly this!)
7. **Click:** "Add App"
8. **Wait** 30 seconds for app to be added
9. **Click:** "Install" button next to `diamondcasa_jewellery`
10. **Wait** 2-5 minutes for installation

---

## ✅ Step 3: Configure Settings

1. **Login:** https://diamondcasa.frappe.cloud/app/home
2. **Go to:** Diamond Casa Jewellery → DiamondCasa Jewellery Settings
3. **Configure:**
   - **DiamondCasa Integration:**
     - API URL
     - API Key
     - API Secret
     - Enable Sync
   - **WhatsApp Integration:**
     - Enable WhatsApp Integration ✅
     - WhatsApp API URL
     - WhatsApp API Key
     - WhatsApp API Secret
   - **Pre-bagging:**
     - Enable Pre-bagging Workflow ✅
4. **Click:** "Save"

---

## ✅ Step 4: Verify

1. **Check DocTypes:**
   - Setup → Customize → DocType
   - Look for: **Media Asset**, **Design Version**, **Commission Calculator**

2. **Test:**
   - Create a Media Asset
   - Create a Design Version
   - Test WhatsApp API

---

## 🆘 Troubleshooting

**Git push fails?**
- Check GitHub credentials
- Verify repository is public
- Try: `git push -u origin main --force`

**Frappe Cloud installation fails?**
- Check: Site → Logs
- Verify repository URL is correct
- Ensure branch is `main`

**App not showing?**
- Wait 1-2 minutes and refresh
- Check repository is public
- Verify app name: `diamondcasa_jewellery`

---

## 📋 Quick Checklist

- [ ] Code committed to Git ✅ (Already done!)
- [ ] Pushed to GitHub
- [ ] Added app in Frappe Cloud
- [ ] App installed successfully
- [ ] Settings configured
- [ ] Features tested

---

**Your code is committed and ready! Now push to GitHub and deploy! 🚀**
