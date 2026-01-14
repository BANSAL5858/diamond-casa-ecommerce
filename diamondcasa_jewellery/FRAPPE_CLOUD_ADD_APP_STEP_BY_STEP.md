# Step-by-Step: Add App in Frappe Cloud with App Directory

**Follow these exact steps:**

---

## 🎯 Step 1: Access Add App Form

1. **Login:** https://frappecloud.com
2. **Click on:** `diamondcasa.frappe.cloud` (your site)
3. **Click:** "Apps" tab (left sidebar)
4. **Click:** "Add App" button (top right, usually blue button)

---

## 📝 Step 2: Fill the Form

### Basic Fields (Always Visible):

1. **Choose Source:**
   - Select: **"From GitHub"** or **"Public GitHub App"**

2. **Choose GitHub User/Organization:**
   - Select: **BANSAL5858**

3. **Choose GitHub Repository:**
   - Select: **diamond-casa-ecommerce**

4. **Choose Branch:**
   - Select: **main**

5. **App Name:**
   - Enter: `diamondcasa_jewellery`

---

## ⚠️ Step 3: Find App Directory Field

### Look for one of these:

**Option A: Direct Field**
- Look for a field labeled:
  - "App Directory"
  - "Subdirectory"
  - "App Subdirectory"
  - "Directory"

**Option B: Advanced Section**
- Look for:
  - "Advanced" button/link
  - "More Options" button/link
  - "Show Advanced" toggle
  - Expandable section with "▼" or "▶"

**Option C: Dropdown**
- Check if there's a dropdown that says:
  - "App Location"
  - "App Path"

---

## ✅ Step 4: Enter App Directory

**In the App Directory field, enter exactly:**
```
diamondcasa_jewellery
```

**Important:**
- No leading slash: ❌ `/diamondcasa_jewellery`
- No trailing slash: ❌ `diamondcasa_jewellery/`
- Correct: ✅ `diamondcasa_jewellery`

---

## 🎯 Step 5: Complete Form Summary

**Your complete form should look like:**

```
┌─────────────────────────────────────────┐
│ Add App from GitHub                     │
├─────────────────────────────────────────┤
│ GitHub User: BANSAL5858                 │
│ Repository: diamond-casa-ecommerce      │
│ Branch: main                            │
│ App Name: diamondcasa_jewellery         │
│ App Directory: diamondcasa_jewellery    │ ← ADD THIS!
└─────────────────────────────────────────┘
```

---

## 🔍 Step 6: If App Directory Field is NOT Visible

### Try These:

1. **Scroll down** - Field might be below the fold
2. **Look for "Advanced"** - Click to expand
3. **Check for tabs** - "Basic" / "Advanced" tabs
4. **Try different app source** - Some sources show more fields
5. **Refresh page** - Sometimes fields load dynamically

### If Still Not Visible:

**Use SSH method instead** (see `SSH_INSTALL_INSTRUCTIONS.md`)

---

## ✅ Step 7: Submit Form

1. **Review all fields:**
   - ✅ Repository: `diamond-casa-ecommerce`
   - ✅ Branch: `main`
   - ✅ App Name: `diamondcasa_jewellery`
   - ✅ App Directory: `diamondcasa_jewellery`

2. **Click:** "Add App" button

3. **Wait:** 30-60 seconds for app to be added

---

## 🔧 Step 8: Install App

1. **Find:** `diamondcasa_jewellery` in Apps list
2. **Click:** "Install" button
3. **Wait:** 2-5 minutes
4. **Monitor:** Progress bar

---

## 🆘 Troubleshooting

### Error: "App directory not found"

**Fix:**
- Verify App Directory is exactly: `diamondcasa_jewellery`
- No spaces before/after
- Case-sensitive (all lowercase)

### Error: "Not a valid Frappe App"

**Fix:**
- App Directory must be specified
- Verify `diamondcasa_jewellery/setup.py` exists in repository

### Field Not Visible

**Solution:**
- Use SSH method (see `SSH_INSTALL_INSTRUCTIONS.md`)
- Contact Frappe Cloud support

---

## 📋 Quick Checklist

- [ ] Logged into Frappe Cloud
- [ ] On Apps tab
- [ ] Clicked "Add App"
- [ ] Selected "From GitHub"
- [ ] Selected repository: `diamond-casa-ecommerce`
- [ ] Selected branch: `main`
- [ ] Entered App Name: `diamondcasa_jewellery`
- [ ] **Entered App Directory: `diamondcasa_jewellery`** ⚠️
- [ ] Clicked "Add App"
- [ ] Waited for app to be added
- [ ] Clicked "Install"

---

**Follow these steps exactly! The App Directory field is critical!**
