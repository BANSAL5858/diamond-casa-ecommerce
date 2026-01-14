# SSH Installation Instructions for Frappe Cloud

**If you can't specify App Directory in the UI, use SSH:**

---

## 🔑 Step 1: Get SSH Access

1. **Login:** https://frappecloud.com
2. **Go to:** `diamondcasa.frappe.cloud`
3. **Click:** "Settings" or "Access" tab
4. **Enable SSH** (if not already enabled)
5. **Copy SSH command** or note the hostname

---

## 🚀 Step 2: SSH into Your Site

**Windows (PowerShell or WSL):**

```bash
ssh frappe@diamondcasa.frappe.cloud
```

**Or use the SSH command provided by Frappe Cloud dashboard**

---

## 📥 Step 3: Get App from GitHub

Once connected via SSH:

```bash
# Navigate to bench directory
cd ~/frappe-bench

# Get app with app-directory specified
bench get-app diamondcasa_jewellery \
  https://github.com/BANSAL5858/diamond-casa-ecommerce.git \
  --branch main \
  --app-directory diamondcasa_jewellery
```

**The `--app-directory` flag tells bench where to find setup.py**

---

## 🔧 Step 4: Install App

```bash
# Install app on site
bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery
```

---

## 🔄 Step 5: Migrate and Restart

```bash
# Migrate database
bench --site diamondcasa.frappe.cloud migrate

# Clear cache
bench --site diamondcasa.frappe.cloud clear-cache

# Restart services
bench restart
```

---

## ✅ Step 6: Verify

```bash
# Check if app is installed
bench --site diamondcasa.frappe.cloud list-apps | grep diamondcasa_jewellery

# Should show: diamondcasa_jewellery
```

---

## 🎯 Complete Command Sequence

Copy and paste this entire block:

```bash
cd ~/frappe-bench
bench get-app diamondcasa_jewellery https://github.com/BANSAL5858/diamond-casa-ecommerce.git --branch main --app-directory diamondcasa_jewellery
bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery
bench --site diamondcasa.frappe.cloud migrate
bench --site diamondcasa.frappe.cloud clear-cache
bench restart
```

---

## 🔍 Troubleshooting

### Error: "Permission denied"
- Make sure you're using the correct SSH user (usually `frappe`)
- Check SSH key is added to Frappe Cloud

### Error: "App directory not found"
- Verify `--app-directory diamondcasa_jewellery` is specified
- Check repository structure matches

### Error: "Module not found"
- After installation, run: `bench --site diamondcasa.frappe.cloud migrate`
- Then: `bench restart`

---

**Use SSH method if App Directory field is not available in UI!**
