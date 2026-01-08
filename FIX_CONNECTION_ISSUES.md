# 🔧 Fix ERPNext Connection Issues - Step by Step

## Your Current Configuration

```
API URL:     https://diamondcasa.frappe.cloud
API Key:     f70126362d822ce
API Secret:  077025b26
```

---

## 🚨 Quick Fix Steps

### Step 1: Verify URL Format

**Check your API URL:**
```
✅ Correct: https://diamondcasa.frappe.cloud
❌ Wrong:   https://diamondcasa.frappe.cloud/app/home
❌ Wrong:   https://diamondcasa.frappe.cloud/
❌ Wrong:   diamondcasa.frappe.cloud (missing https://)
```

**Action:**
- Remove any `/app/home` or trailing slashes
- Ensure it starts with `https://`
- Use exactly: `https://diamondcasa.frappe.cloud`

---

### Step 2: Verify Credentials

**Check API Key:**
```
✅ Correct: f70126362d822ce
❌ Wrong:   f70126362d822ce (with spaces)
❌ Wrong:   F70126362D822CE (wrong case - though API keys are usually case-insensitive)
```

**Check API Secret:**
```
✅ Correct: 077025b26
❌ Wrong:   077025b26 (with spaces)
```

**Action:**
- Copy credentials exactly (no extra spaces)
- Paste directly into Admin Dashboard
- Don't type manually (copy-paste to avoid errors)

---

### Step 3: Test URL Accessibility

**In Browser:**
1. Open: `https://diamondcasa.frappe.cloud`
2. Should show: ERPNext login page
3. If not accessible → ERPNext instance may be down

**Test API Ping:**
1. Open: `https://diamondcasa.frappe.cloud/api/method/ping`
2. Should return: `{"message":"pong"}`
3. If error → API may be disabled

---

### Step 4: Verify API Keys in ERPNext

1. **Login to ERPNext:**
   - URL: https://diamondcasa.frappe.cloud
   - Use your ERPNext credentials

2. **Check API Keys:**
   - Go to: User → Select your user → API Keys section
   - Verify API Key matches: `f70126362d822ce`
   - API Secret is shown only once - if you don't see it, you need to regenerate

3. **If Keys Don't Match:**
   - Click "Generate Keys" to create new ones
   - Copy new API Key and Secret
   - Update in Admin Dashboard

---

### Step 5: Check User Permissions

1. **In ERPNext:**
   - Go to: User → Select your user → Roles tab
   - Ensure these roles are assigned:
     - ✅ Sales User
     - ✅ Stock User
     - ✅ Item Manager
     - ✅ System Manager (recommended for full access)

2. **Check API Access:**
   - In User settings, ensure "API Access" is enabled
   - User should not be disabled

---

### Step 6: Test Connection with Diagnostic Tool

**Option A: Use Diagnostic Tool**
1. Open `QUICK_CONNECTION_TEST.html` in browser
2. Enter your credentials
3. Click "Run Full Diagnostics"
4. Review results for specific issues

**Option B: Use Browser Console**
1. Open Admin Dashboard
2. Press F12 → Console tab
3. Run this test:
   ```javascript
   fetch('https://diamondcasa.frappe.cloud/api/resource/User?limit_page_length=1', {
       headers: {
           'Authorization': 'token f70126362d822ce:077025b26',
           'Accept': 'application/json'
       }
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```
4. Check console for error messages

---

## 🔍 Common Error Messages and Fixes

### Error: "Cannot reach ERPNext server"

**Possible Causes:**
- Wrong URL format
- ERPNext instance down
- Network connection issue
- CORS not configured

**Fixes:**
1. Verify URL: `https://diamondcasa.frappe.cloud` (no /app/home)
2. Try opening URL in browser
3. Check internet connection
4. Check ERPNext site status in Frappe Cloud

---

### Error: "401 Unauthorized" or "Authentication failed"

**Possible Causes:**
- Wrong API Key
- Wrong API Secret
- Keys expired or regenerated

**Fixes:**
1. Verify credentials in ERPNext:
   - User → API Keys
   - Compare with entered values
2. Regenerate keys if needed:
   - Click "Generate Keys"
   - Copy new keys
   - Update in Admin Dashboard
3. Ensure no extra spaces in credentials

---

### Error: "403 Forbidden" or "Access denied"

**Possible Causes:**
- User lacks required roles
- API access disabled
- User account disabled

**Fixes:**
1. Check user roles in ERPNext:
   - User → Roles tab
   - Add: Sales User, Stock User, Item Manager
2. Enable API access:
   - Check "API Access" in User settings
3. Ensure user account is active

---

### Error: "CORS policy" or "Access-Control-Allow-Origin"

**Possible Causes:**
- CORS not configured in ERPNext
- Browser blocking cross-origin requests

**Fixes:**
1. **Configure CORS in ERPNext:**
   - Login as Administrator
   - Go to: Settings → System Settings
   - Find "CORS" or "Allowed Origins"
   - Add: `*` (allow all) or your domain
   - Save

2. **Alternative:**
   - Use backend proxy
   - Or contact Frappe Cloud support

---

### Error: "404 Not Found" or "API endpoint not found"

**Possible Causes:**
- Wrong API URL
- API disabled
- Wrong endpoint

**Fixes:**
1. Verify URL format:
   - Should be: `https://diamondcasa.frappe.cloud`
   - Not: `https://diamondcasa.frappe.cloud/api`
2. Test ping endpoint:
   - `https://diamondcasa.frappe.cloud/api/method/ping`
   - Should return JSON

---

## ✅ Verification Checklist

Before testing connection, verify:

- [ ] API URL: `https://diamondcasa.frappe.cloud` (exact, no trailing slash)
- [ ] API Key: `f70126362d822ce` (copied exactly, no spaces)
- [ ] API Secret: `077025b26` (copied exactly, no spaces)
- [ ] Can login to https://diamondcasa.frappe.cloud
- [ ] API keys visible in ERPNext User settings
- [ ] User has required roles (Sales User, Stock User, Item Manager)
- [ ] User account is active (not disabled)
- [ ] API access enabled for user
- [ ] Browser console shows no CORS errors
- [ ] Network connection is working

---

## 🛠️ Quick Diagnostic Test

**Run this in Browser Console (F12):**

```javascript
// Quick Connection Test
const apiUrl = 'https://diamondcasa.frappe.cloud';
const apiKey = 'f70126362d822ce';
const apiSecret = '077025b26';

console.log('Testing connection...');

// Test 1: Ping
fetch(apiUrl + '/api/method/ping')
  .then(r => r.text())
  .then(d => console.log('✓ Ping:', d))
  .catch(e => console.error('✗ Ping failed:', e));

// Test 2: API with credentials
fetch(apiUrl + '/api/resource/User?limit_page_length=1', {
  headers: {
    'Authorization': `token ${apiKey}:${apiSecret}`,
    'Accept': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('✓ API Response:', d))
  .catch(e => console.error('✗ API failed:', e));
```

**Check console output for specific errors.**

---

## 📋 Step-by-Step Fix Process

### If Connection Still Fails:

1. **Double-check URL:**
   - Open https://diamondcasa.frappe.cloud in browser
   - Copy URL from address bar (without /app/home)
   - Use exactly that URL

2. **Regenerate API Keys:**
   - Login to ERPNext
   - User → API Keys → Generate Keys
   - Copy new keys immediately
   - Update in Admin Dashboard

3. **Check User Status:**
   - Ensure user is active
   - Check user has required roles
   - Verify API access is enabled

4. **Test with Diagnostic Tool:**
   - Open `QUICK_CONNECTION_TEST.html`
   - Run full diagnostics
   - Review specific error messages

5. **Check Browser Console:**
   - Press F12 → Console
   - Look for detailed error messages
   - Check for CORS errors

---

## 🆘 Still Not Working?

### Contact Support:

1. **Check ERPNext Logs:**
   - Login to ERPNext
   - Tools → Error Log
   - Look for API-related errors

2. **Check Frappe Cloud:**
   - Login to Frappe Cloud dashboard
   - Check site status
   - Verify site is active

3. **Review Error Details:**
   - Use diagnostic tool
   - Check browser console
   - Note exact error message
   - Share with support if needed

---

## ✅ Success Indicators

Connection is successful when:
- ✅ Test Connection shows "Connection Successful"
- ✅ No errors in browser console
- ✅ Can sync products
- ✅ Can upload products

---

**Try the diagnostic tool:** Open `QUICK_CONNECTION_TEST.html` and run full diagnostics!
