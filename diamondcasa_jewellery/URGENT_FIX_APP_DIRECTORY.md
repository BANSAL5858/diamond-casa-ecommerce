# 🚨 URGENT FIX: App Directory Error

**Error:** "Not a valid Frappe App! Files setup.py... do not exist in app directory."

**You're seeing this because App Directory field is missing or empty!**

---

## ⚡ IMMEDIATE SOLUTION

### The App Directory Field MUST Be Filled

**In the Frappe Cloud "Add App" form, you MUST see and fill:**

```
App Directory: diamondcasa_jewellery
```

---

## 🔍 Where is the App Directory Field?

### Location 1: Direct Field
- Look **below** "App Name" field
- Look **below** "Branch" field
- Scroll down in the form

### Location 2: Advanced Section
- Look for **"Advanced"** button/link
- Click to expand
- Field will be inside

### Location 3: Dropdown/Tabs
- Check for tabs: "Basic" / "Advanced"
- Switch to "Advanced" tab

---

## ✅ EXACT VALUES TO ENTER

**Copy these exactly:**

```
Repository: diamond-casa-ecommerce
Branch: main
App Name: diamondcasa_jewellery
App Directory: diamondcasa_jewellery  ← THIS IS CRITICAL!
```

---

## 🆘 If App Directory Field is NOT in the Form

**The UI might not show it. Use SSH instead:**

### Quick SSH Install:

1. **Get SSH access** from Frappe Cloud dashboard
2. **Connect:**
   ```bash
   ssh frappe@diamondcasa.frappe.cloud
   ```
3. **Run these commands:**
   ```bash
   cd ~/frappe-bench
   bench get-app diamondcasa_jewellery https://github.com/BANSAL5858/diamond-casa-ecommerce.git --branch main --app-directory diamondcasa_jewellery
   bench --site diamondcasa.frappe.cloud install-app diamondcasa_jewellery
   bench --site diamondcasa.frappe.cloud migrate
   bench --site diamondcasa.frappe.cloud clear-cache
   bench restart
   ```

---

## 🔧 Alternative: Move setup.py to Root (Not Recommended)

If you can't use App Directory, we could move setup.py to repository root, but this requires restructuring. **Better to use App Directory or SSH method.**

---

## 📋 What to Do RIGHT NOW

1. **In the form, scroll down** - Look for "App Directory" field
2. **If you see it:** Enter `diamondcasa_jewellery`
3. **If you DON'T see it:** Use SSH method above
4. **Click "Add App"**

---

**The App Directory field is REQUIRED! Find it or use SSH!**
