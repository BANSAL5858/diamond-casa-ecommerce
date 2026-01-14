# Frappe Cloud Deployment Guide

**Target Site:** https://diamondcasa.frappe.cloud/app/home  
**App:** diamondcasa_jewellery

---

## 🚀 Deployment Steps

### Step 1: Prepare Git Repository

1. **Initialize Git (if not already done):**
   ```bash
   cd c:\Users\ADMIN\Desktop\DEMOAPP\diamondcasa_jewellery
   git init
   git add .
   git commit -m "Initial commit: Diamond Casa Jewellery app with P1 features"
   ```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Create a new repository (e.g., `diamondcasa-jewellery-app`)
   - **DO NOT** initialize with README

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Connect to Frappe Cloud

#### Option A: Via Frappe Cloud Dashboard (Recommended)

1. **Login to Frappe Cloud:**
   - Go to https://frappecloud.com
   - Login with your account

2. **Select Your Site:**
   - Go to your site: `diamondcasa.frappe.cloud`
   - Click on "Apps" tab

3. **Add Custom App:**
   - Click "Add App"
   - Select "From GitHub"
   - Enter your repository URL: `https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app`
   - Branch: `main`
   - App Name: `diamondcasa_jewellery`
   - Click "Add App"

4. **Install App:**
   - Once added, click "Install" next to `diamondcasa_jewellery`
   - Wait for installation to complete

#### Option B: Via Bench CLI (SSH Access)

If you have SSH access to your Frappe Cloud site:

```bash
# SSH into your site
ssh frappe@diamondcasa.frappe.cloud

# Navigate to bench
cd ~/frappe-bench

# Get app from GitHub
bench get-app diamondcasa_jewellery https://github.com/YOUR_USERNAME/diamondcasa-jewellery-app --branch main

# Install app
bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery

# Migrate database
bench --site diamondcasa.frappe.cloud migrate

# Clear cache
bench --site diamondcasa.frappe.cloud clear-cache

# Restart
bench restart
```

---

### Step 3: Configure Settings

1. **Login to Your Site:**
   - Go to https://diamondcasa.frappe.cloud/app/home
   - Login with your credentials

2. **Configure DiamondCasa Jewellery Settings:**
   - Go to: **Diamond Casa Jewellery → DiamondCasa Jewellery Settings**
   - Configure:
     - **DiamondCasa Integration:**
       - DiamondCasa API URL
       - DiamondCasa API Key
       - DiamondCasa API Secret
       - Enable Sync
     - **WhatsApp Integration:**
       - Enable WhatsApp Integration
       - WhatsApp API URL
       - WhatsApp API Key
       - WhatsApp API Secret
     - **Pre-bagging:**
       - Enable Pre-bagging Workflow
     - **Feature Flags:**
       - Enable Barcode/QR Generation
       - Enable Piece-level Tracking
       - Enable Mobile Photo Upload
       - Enable STL Viewer

3. **Save Settings**

---

### Step 4: Verify Installation

1. **Check DocTypes:**
   - Go to: **Setup → Customize → DocType**
   - Verify these DocTypes exist:
     - Media Asset
     - Design Version
     - Commission Calculator
     - Commission Tier
     - (All existing DocTypes should be there)

2. **Test API Endpoints:**
   - Go to: **Setup → API → API Logs**
   - Test WhatsApp API:
     ```
     POST /api/diamondcasa/whatsapp/send_message
     ```

3. **Create Test Data:**
   - Create a Media Asset
   - Create a Design Version
   - Create a Commission Calculator
   - Test Pre-bagging workflow

---

## 🔧 Troubleshooting

### Issue: App not showing in Frappe Cloud

**Solution:**
- Ensure Git repository is public or you've added Frappe Cloud as collaborator
- Check branch name matches (usually `main` or `master`)
- Verify `setup.py` exists in root of repository

### Issue: Installation fails

**Solution:**
- Check Frappe Cloud logs: **Site → Logs**
- Verify Python dependencies in `requirements.txt`
- Ensure app structure is correct:
  ```
  diamondcasa_jewellery/
  ├── diamondcasa_jewellery/
  │   ├── hooks.py
  │   ├── __init__.py
  │   ├── doctype/
  │   ├── api/
  │   └── utils/
  ├── setup.py
  └── requirements.txt
  ```

### Issue: Migration errors

**Solution:**
```bash
# SSH into site and run:
bench --site diamondcasa.frappe.cloud migrate
bench --site diamondcasa.frappe.cloud clear-cache
bench restart
```

### Issue: WhatsApp API not working

**Solution:**
- Verify WhatsApp API credentials in Settings
- Check if WhatsApp integration is enabled
- Test API endpoint manually:
  ```bash
  curl -X POST https://diamondcasa.frappe.cloud/api/diamondcasa/whatsapp/send_message \
    -H "Authorization: token YOUR_API_KEY:YOUR_API_SECRET" \
    -d '{"phone_number": "+919876543210", "message": "Test"}'
  ```

---

## 📋 Post-Deployment Checklist

- [ ] App installed successfully
- [ ] All DocTypes migrated
- [ ] Settings configured
- [ ] WhatsApp integration tested
- [ ] Pre-bagging workflow tested
- [ ] Media Asset creation tested
- [ ] Design Versioning tested
- [ ] Commission Calculator tested
- [ ] API endpoints accessible
- [ ] Scheduled jobs running (check Scheduler Log)

---

## 🔐 Security Notes

1. **API Keys:**
   - Store API keys securely in Settings DocType (Password fields)
   - Never commit API keys to Git
   - Use environment variables for sensitive data if possible

2. **Permissions:**
   - Review permissions for all new DocTypes
   - Ensure only authorized users can access sensitive features

3. **Webhooks:**
   - Verify webhook signatures
   - Use HTTPS for all API calls

---

## 📞 Support

If you encounter issues:

1. Check Frappe Cloud logs
2. Review app logs in ERPNext
3. Check Integration Log DocType for API errors
4. Contact Frappe Cloud support if needed

---

**Ready to deploy! Follow the steps above to integrate with your Frappe Cloud site.**
