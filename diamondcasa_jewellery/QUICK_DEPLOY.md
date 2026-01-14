# Quick Deploy to Frappe Cloud

**Target:** https://diamondcasa.frappe.cloud/app/home

---

## 🚀 Fast Track (5 Steps)

### 1. Prepare Git Repository

```bash
cd c:\Users\ADMIN\Desktop\DEMOAPP\diamondcasa_jewellery

# Initialize Git (if not done)
git init
git add .
git commit -m "Deploy Diamond Casa Jewellery app with P1 features"
```

### 2. Push to GitHub

1. Create new repository at https://github.com/new
   - Name: `diamondcasa-jewellery-app`
   - **Public** (or add Frappe Cloud as collaborator)
   - **Don't** initialize with README

2. Push code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git
   git branch -M main
   git push -u origin main
   ```

### 3. Connect to Frappe Cloud

1. Login: https://frappecloud.com
2. Go to your site: `diamondcasa.frappe.cloud`
3. Click **Apps** tab
4. Click **Add App** → **From GitHub**
5. Enter:
   - Repository: `https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app`
   - Branch: `main`
   - App Name: `diamondcasa_jewellery`
6. Click **Add App**

### 4. Install App

1. After app is added, click **Install** next to `diamondcasa_jewellery`
2. Wait for installation (2-5 minutes)
3. Check for any errors in logs

### 5. Configure & Test

1. Login to: https://diamondcasa.frappe.cloud/app/home
2. Go to: **Diamond Casa Jewellery → DiamondCasa Jewellery Settings**
3. Configure:
   - DiamondCasa API credentials
   - WhatsApp API credentials
   - Enable features as needed
4. Test:
   - Create a Media Asset
   - Create a Design Version
   - Test WhatsApp integration

---

## ✅ Verification

After installation, verify:

- [ ] App appears in Apps list
- [ ] All DocTypes visible (Media Asset, Design Version, Commission Calculator, etc.)
- [ ] Settings page accessible
- [ ] No errors in Site Logs

---

## 🔧 If Installation Fails

1. **Check Logs:**
   - Site → Logs → Check for errors

2. **Manual Install (if you have SSH):**
   ```bash
   ssh frappe@diamondcasa.frappe.cloud
   cd ~/frappe-bench
   bench get-app diamondcasa_jewellery https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app
   bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery
   bench --site diamondcasa.frappe.cloud migrate
   bench restart
   ```

3. **Common Issues:**
   - **Missing dependencies:** Check `requirements.txt`
   - **Structure error:** Verify `diamondcasa_jewellery/hooks.py` exists
   - **Permission error:** Check Git repository is accessible

---

## 📋 What Gets Deployed

✅ All P1 Features:
- Media Asset DocType
- WhatsApp Integration
- Pre-bagging Workflow
- Design Versioning
- Commission Calculator

✅ All Existing Features:
- Bag/Packet Management
- Job Card
- Craft Worker
- Scrap & Recovery
- Integration APIs
- And more...

---

**Ready to deploy! Follow the 5 steps above.**
