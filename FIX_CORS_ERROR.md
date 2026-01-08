# 🔧 Fix CORS Error - Complete Guide

## What is CORS Error?

**CORS (Cross-Origin Resource Sharing)** error occurs when:
- Your website is on one domain (e.g., `localhost` or `yourdomain.com`)
- ERPNext is on another domain (e.g., `diamondcasa.frappe.cloud`)
- Browser blocks the request for security reasons

**Error Message:**
```
Access to fetch at 'https://diamondcasa.frappe.cloud/api/...' from origin '...' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

---

## ✅ Solution 1: Configure CORS in ERPNext (Recommended)

### Step 1: Login to ERPNext

1. Go to: https://diamondcasa.frappe.cloud
2. Login with Administrator account

### Step 2: Open System Settings

1. Click on **"Settings"** in the sidebar
2. Click on **"System Settings"**
3. Or search for "System Settings" in the search bar

### Step 3: Configure CORS

1. Look for **"CORS"** or **"Allowed Origins"** field
2. Add one of these:
   - `*` (allows all origins - for testing)
   - Your website domain (e.g., `https://yourdomain.com`)
   - `http://localhost:8000` (if testing locally)
   - `file://` (if opening HTML files directly)

3. **For Development/Testing:**
   ```
   Allowed Origins: *
   ```
   This allows all origins (less secure but works for testing)

4. **For Production:**
   ```
   Allowed Origins: https://yourdomain.com, https://www.yourdomain.com
   ```
   List your actual website domains

### Step 4: Save Settings

1. Click **"Save"** button
2. Wait for confirmation
3. Try connection test again

---

## ✅ Solution 2: Use ERPNext API Method (Alternative)

If CORS can't be configured, use ERPNext's method-based API instead of resource API.

**Current (Resource API - requires CORS):**
```javascript
/api/resource/User?limit_page_length=1
```

**Alternative (Method API - may work without CORS):**
```javascript
/api/method/frappe.client.get_list
```

---

## ✅ Solution 3: Use Proxy Server (Advanced)

If CORS can't be configured in ERPNext, use a backend proxy:

1. **Create a proxy endpoint** on your server
2. **Proxy forwards requests** to ERPNext
3. **No CORS issue** (server-to-server)

---

## ✅ Solution 4: Browser Extension (Development Only)

**For local development only:**

1. Install CORS browser extension:
   - Chrome: "CORS Unblock" or "Allow CORS"
   - Firefox: "CORS Everywhere"

2. **Enable extension** when testing
3. **Disable in production** (not secure)

---

## 🔍 Check Current CORS Configuration

### In ERPNext:

1. Login to ERPNext
2. Go to: **Settings → System Settings**
3. Look for **"CORS"** or **"Allowed Origins"**
4. Check current value

### Test CORS:

**Open Browser Console (F12) and run:**
```javascript
fetch('https://diamondcasa.frappe.cloud/api/method/ping', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
.then(r => r.text())
.then(d => console.log('✓ CORS OK:', d))
.catch(e => console.error('✗ CORS Error:', e));
```

**If you see CORS error:**
- CORS is not configured
- Need to configure in ERPNext

---

## 📋 Step-by-Step: Configure CORS in ERPNext

### Option A: Via UI (Easiest)

1. **Login to ERPNext**
   - URL: https://diamondcasa.frappe.cloud
   - Use Administrator account

2. **Navigate to System Settings**
   - Click "Settings" → "System Settings"
   - Or search "System Settings"

3. **Find CORS Field**
   - Look for "CORS" or "Allowed Origins"
   - May be under "API" or "Security" section

4. **Add Allowed Origins**
   ```
   *
   ```
   (For testing - allows all origins)

   Or for production:
   ```
   https://yourdomain.com, https://www.yourdomain.com
   ```

5. **Save**
   - Click "Save" button
   - Wait for confirmation

6. **Test Connection**
   - Go back to Admin Dashboard
   - Click "Test Connection"
   - Should work now!

---

### Option B: Via Site Config (Advanced)

If CORS field is not in UI, configure via Site Config:

1. **Login to ERPNext**

2. **Open Console** (Developer Mode)
   - Press `Ctrl+Shift+J` (Chrome) or `F12`
   - Or go to: Settings → Developer Console

3. **Run this command:**
   ```python
   frappe.conf.cors = {
       "allow_origins": ["*"]
   }
   frappe.db.commit()
   ```

4. **Or via Site Config file:**
   - Edit `site_config.json`
   - Add:
   ```json
   {
       "cors": {
           "allow_origins": ["*"]
       }
   }
   ```

---

## 🛠️ Quick Fix for Frappe Cloud

If you're using **Frappe Cloud**, CORS might need to be configured differently:

1. **Login to Frappe Cloud Dashboard**
   - Go to: https://frappecloud.com
   - Select your site: diamondcasa

2. **Check Site Settings**
   - Look for "CORS" or "API Settings"
   - Configure allowed origins

3. **Contact Frappe Cloud Support**
   - If CORS option not available in dashboard
   - Request CORS configuration for your site

---

## 🔄 Temporary Workaround (Code Update)

I'll update the code to:
1. Detect CORS errors specifically
2. Provide clear instructions
3. Try alternative endpoints if available

---

## ✅ Verification

After configuring CORS:

1. **Test in Browser Console:**
   ```javascript
   fetch('https://diamondcasa.frappe.cloud/api/method/ping')
     .then(r => r.text())
     .then(console.log)
     .catch(console.error);
   ```

2. **Should return:**
   ```
   {"message":"pong"}
   ```

3. **If still CORS error:**
   - CORS not configured correctly
   - Try `*` in allowed origins
   - Check ERPNext logs

---

## 🆘 Still Having CORS Issues?

### Check These:

1. **ERPNext Version**
   - CORS support may vary by version
   - Check: Help → About

2. **Site Configuration**
   - Verify CORS is saved
   - Restart ERPNext if needed

3. **Browser Cache**
   - Clear browser cache
   - Try incognito mode

4. **Network**
   - Check if firewall blocking
   - Try different network

---

## 📝 Your Current Setup

```
ERPNext URL: https://diamondcasa.frappe.cloud
Website:     (local file or your domain)
```

**To Fix:**
1. Login to https://diamondcasa.frappe.cloud
2. Go to: Settings → System Settings
3. Add `*` to CORS/Allowed Origins
4. Save
5. Test connection again

---

## 🎯 Next Steps

1. **Configure CORS in ERPNext** (see steps above)
2. **Test connection** in Admin Dashboard
3. **If still fails**, check browser console for specific error
4. **Contact support** if CORS option not available

---

**Need help?** Check browser console (F12) for the exact CORS error message!
