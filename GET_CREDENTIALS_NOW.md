# 🔑 Get Your ERPNext Credentials - Quick Guide

## ⚡ Fast Track: Get Credentials in 2 Minutes

### If You Already Have ERPNext Running:

**Step 1: Login to ERPNext** (30 seconds)
```
URL: https://your-erpnext-instance.com
User: Your admin user
Password: Your password
```

**Step 2: Generate API Keys** (1 minute)
1. Click your profile (top right) → **"User"**
2. Scroll to **"API Keys"** section
3. Click **"Generate Keys"** button
4. **Copy API Key** (long string)
5. **Copy API Secret** (long string - shown only once!)
6. ⚠️ **SAVE THESE SECURELY!**

**Step 3: Use These Credentials**
```
API URL:     https://your-erpnext-instance.com
API Key:     [paste the API Key you copied]
API Secret:  [paste the API Secret you copied]
User Email:  integration@diamondcasa.in (or your user email)
```

---

## 📋 Credential Format Examples

### Real Credentials Look Like This:

```
API URL:     https://erpnext.diamondcasa.in
API Key:     a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
API Secret:  x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2
```

**Characteristics:**
- API Key: 40-60 character alphanumeric string
- API Secret: 40-60 character alphanumeric string
- Both are random strings (letters and numbers)

---

## 🎯 Three Scenarios

### Scenario 1: You Have ERPNext Running ✅

**Action:** Get credentials from your existing instance
1. Login to ERPNext
2. User → API Keys → Generate
3. Copy and use in Admin Dashboard

**Time:** 2 minutes

---

### Scenario 2: You Need to Set Up ERPNext 🆕

**Option A: Frappe Cloud (Free Trial - Recommended)**
1. Go to: https://frappecloud.com
2. Sign up (free trial available)
3. Create new site
4. Install ERPNext
5. Get your URL: `https://your-site.frappe.cloud`
6. Generate API keys (as above)

**Option B: Self-Hosted**
1. Follow: https://github.com/frappe/erpnext
2. Install on your server
3. Get your instance URL
4. Generate API keys

**Time:** 30-60 minutes (setup) + 2 minutes (credentials)

---

### Scenario 3: You Want to Test First 🧪

**Use Mock/Test Mode:**
1. Admin Dashboard → ERPNext Integration
2. **Don't enter credentials**
3. Toggle "Integration Status" to **Disabled**
4. Products will use local data
5. Test website functionality first
6. Add real credentials later

**Time:** 0 minutes (no credentials needed)

---

## 📝 Quick Credential Checklist

Use this to track your setup:

```
═══════════════════════════════════════════════════
   My ERPNext Credentials
═══════════════════════════════════════════════════

[ ] ERPNext URL obtained
    URL: _________________________________________

[ ] API Key generated
    Key: _________________________________________

[ ] API Secret copied (saved securely)
    Secret: ______________________________________

[ ] User email noted
    Email: _______________________________________

[ ] Credentials entered in Admin Dashboard

[ ] Connection tested successfully

[ ] Integration enabled

═══════════════════════════════════════════════════
```

---

## 🚀 Next Steps After Getting Credentials

1. **Open Admin Dashboard**
   - File: `admin.html`
   - Login: `admin` / `admin123`

2. **Go to ERPNext Integration**
   - Click "ERPNext Integration" in sidebar

3. **Enter Credentials**
   ```
   API URL:     [your-erpnext-url]
   API Key:     [your-api-key]
   API Secret:  [your-api-secret]
   User Email:  integration@diamondcasa.in
   ```

4. **Save & Test**
   - Click "Save Configuration"
   - Click "Test Connection"
   - Should show: ✅ "Connection Successful!"

5. **Enable Integration**
   - Toggle "Integration Status" to **Enabled**

6. **Upload Products**
   - Ready to upload 378 products!

---

## 🆘 Can't Get Credentials?

### Problem: Don't Have ERPNext Yet

**Solution:** 
- Sign up for Frappe Cloud (free): https://frappecloud.com
- Or install locally for testing
- Or use mock mode (no credentials needed)

### Problem: Can't Find API Keys in ERPNext

**Solution:**
1. Make sure you're logged in as Administrator
2. Go to: User → List → Select your user
3. Look for "API Keys" section
4. If not visible, you may need to enable API access in ERPNext settings

### Problem: API Keys Not Generating

**Solution:**
1. Check user has proper permissions
2. Try logging out and back in
3. Check ERPNext version (should be v13+)
4. Contact ERPNext administrator

---

## ✅ What You Need Right Now

**To get started immediately:**

1. **ERPNext Instance** (if you have one)
   - URL: _________________________
   - Login credentials: ___________

2. **API Credentials** (from ERPNext)
   - API Key: _____________________
   - API Secret: __________________

3. **Admin Dashboard Access**
   - File: `admin.html`
   - Login: `admin` / `admin123`

---

## 🎯 Summary

**To get credentials:**
1. Login to your ERPNext instance
2. Go to: User → API Keys → Generate
3. Copy API Key and Secret
4. Use in Admin Dashboard

**If you don't have ERPNext:**
- Sign up for Frappe Cloud (free trial)
- Or use mock mode for testing

**Time needed:** 2-5 minutes to get credentials

---

**Ready?** Get your credentials and start uploading! 🚀
