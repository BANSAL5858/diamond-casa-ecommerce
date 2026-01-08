# 🔧 ERPNext Connection Troubleshooting Guide

## Common Connection Issues and Solutions

### Issue 1: Connection Test Fails Immediately

**Symptoms:**
- Click "Test Connection" → Fails immediately
- Error: "Cannot reach ERPNext server"
- Error: "Failed to fetch"

**Solutions:**

1. **Check API URL Format**
   ```
   ✅ Correct: https://diamondcasa.frappe.cloud
   ❌ Wrong:   https://diamondcasa.frappe.cloud/app/home
   ❌ Wrong:   http://diamondcasa.frappe.cloud
   ❌ Wrong:   diamondcasa.frappe.cloud (missing https://)
   ```

2. **Verify URL is Accessible**
   - Open https://diamondcasa.frappe.cloud in browser
   - Should show ERPNext login page
   - If not accessible, ERPNext instance may be down

3. **Check Network Connection**
   - Ensure internet is working
   - Try accessing other websites
   - Check firewall settings

---

### Issue 2: Authentication Failed (401 Unauthorized)

**Symptoms:**
- Error: "401 Unauthorized"
- Error: "Authentication failed"
- Error: "Invalid credentials"

**Solutions:**

1. **Verify API Key and Secret**
   ```
   API Key:     f70126362d822ce
   API Secret:  077025b26
   ```
   - Copy exactly (no extra spaces)
   - No trailing spaces
   - Case-sensitive

2. **Regenerate API Keys in ERPNext**
   - Login to https://diamondcasa.frappe.cloud
   - Go to: User → Select your user → API Keys
   - Click "Generate Keys" (creates new keys)
   - Copy new API Key and Secret
   - Update in Admin Dashboard

3. **Check User Status**
   - Ensure user account is active
   - User should not be disabled
   - Check user email matches

---

### Issue 3: Access Forbidden (403 Forbidden)

**Symptoms:**
- Error: "403 Forbidden"
- Error: "Access denied"
- Error: "User lacks permissions"

**Solutions:**

1. **Check User Roles in ERPNext**
   - Login to ERPNext
   - Go to: User → Select your user → Roles tab
   - Ensure these roles are assigned:
     - ✅ Sales User
     - ✅ Stock User
     - ✅ Item Manager
     - ✅ System Manager (for full access)

2. **Verify User Permissions**
   - User must have API access enabled
   - Check "API Access" checkbox in User settings

---

### Issue 4: CORS Error

**Symptoms:**
- Error: "CORS policy"
- Error: "Access-Control-Allow-Origin"
- Error in browser console about CORS

**Solutions:**

1. **Configure CORS in ERPNext**
   - Login to ERPNext as Administrator
   - Go to: Settings → System Settings
   - Find "CORS" or "Allowed Origins"
   - Add: `*` (allow all) or your website domain
   - Save

2. **Alternative: Use Proxy**
   - If CORS cannot be configured
   - Use a backend proxy server
   - Or use ERPNext's webhook system

---

### Issue 5: API Endpoint Not Found (404)

**Symptoms:**
- Error: "404 Not Found"
- Error: "API endpoint not found"

**Solutions:**

1. **Check API URL Format**
   ```
   ✅ Correct: https://diamondcasa.frappe.cloud
   ❌ Wrong:   https://diamondcasa.frappe.cloud/api
   ❌ Wrong:   https://diamondcasa.frappe.cloud/app
   ```

2. **Verify ERPNext Version**
   - ERPNext v13+ required for API access
   - Check version in ERPNext: Help → About

3. **Test API Endpoint Manually**
   - Open: https://diamondcasa.frappe.cloud/api/method/ping
   - Should return JSON response
   - If not, API may be disabled

---

### Issue 6: Network Timeout

**Symptoms:**
- Connection hangs
- Takes too long to respond
- Timeout error

**Solutions:**

1. **Check ERPNext Server Status**
   - Verify ERPNext instance is running
   - Check server resources (CPU, memory)
   - May be overloaded

2. **Check Network Speed**
   - Slow connection can cause timeouts
   - Try from different network
   - Check firewall/proxy settings

---

## 🔍 Step-by-Step Diagnostic Process

### Step 1: Verify Basic Connectivity

1. **Test URL in Browser**
   ```
   Open: https://diamondcasa.frappe.cloud
   Expected: ERPNext login page
   ```

2. **Test API Ping**
   ```
   Open: https://diamondcasa.frappe.cloud/api/method/ping
   Expected: {"message":"pong"}
   ```

### Step 2: Verify Credentials

1. **Check API Key Format**
   - Should be: `f70126362d822ce`
   - Length: 15 characters
   - Alphanumeric only

2. **Check API Secret Format**
   - Should be: `077025b26`
   - Length: 9 characters
   - Alphanumeric only

3. **Verify in ERPNext**
   - Login to ERPNext
   - User → API Keys
   - Compare with entered values

### Step 3: Test API Access

1. **Use Browser Console**
   - Press F12 → Console tab
   - Run this test:
   ```javascript
   fetch('https://diamondcasa.frappe.cloud/api/resource/User?limit_page_length=1', {
       headers: {
           'Authorization': 'token f70126362d822ce:077025b26'
       }
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

2. **Check Response**
   - Success: Returns user data
   - Error: Check error message

### Step 4: Check Browser Console

1. **Open Developer Tools**
   - Press F12
   - Go to Console tab
   - Look for errors

2. **Common Errors:**
   - CORS error → Configure CORS in ERPNext
   - 401 → Wrong credentials
   - 403 → User lacks permissions
   - Network error → Check connection

---

## ✅ Quick Fix Checklist

**Before Testing Connection:**

- [ ] API URL: `https://diamondcasa.frappe.cloud` (no trailing slash, no /app/home)
- [ ] API Key: `f70126362d822ce` (copied exactly, no spaces)
- [ ] API Secret: `077025b26` (copied exactly, no spaces)
- [ ] Can login to https://diamondcasa.frappe.cloud
- [ ] API keys visible in ERPNext User settings
- [ ] User has required roles (Sales User, Stock User, Item Manager)
- [ ] Browser console shows no CORS errors
- [ ] Network connection is working

---

## 🛠️ Advanced Troubleshooting

### Test API Manually (Using cURL)

```bash
curl -X GET "https://diamondcasa.frappe.cloud/api/resource/User?limit_page_length=1" \
  -H "Authorization: token f70126362d822ce:077025b26" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "data": [...]
}
```

**If Error:**
- 401 → Wrong credentials
- 403 → User lacks permissions
- 404 → Wrong URL or endpoint
- CORS → CORS not configured

---

### Check ERPNext Logs

1. **Access ERPNext Logs**
   - Login to ERPNext
   - Go to: Tools → Error Log
   - Check for API-related errors

2. **Common Log Errors:**
   - "Invalid API key" → Regenerate keys
   - "User not found" → Check user email
   - "Permission denied" → Add required roles

---

## 📋 Your Current Configuration

Based on your setup:

```
API URL:     https://diamondcasa.frappe.cloud
API Key:     f70126362d822ce
API Secret:  077025b26
User:        integration@diamondcasa.in
```

**Things to Verify:**

1. ✅ URL format correct
2. ✅ Credentials match ERPNext
3. ✅ User exists in ERPNext
4. ✅ User has API access enabled
5. ✅ User has required roles

---

## 🆘 Still Not Working?

### Option 1: Regenerate API Keys

1. Login to https://diamondcasa.frappe.cloud
2. Go to: User → Select your user → API Keys
3. Click "Generate Keys" (creates new keys)
4. Copy new API Key and Secret
5. Update in Admin Dashboard
6. Test connection again

### Option 2: Check ERPNext Site Status

1. Login to Frappe Cloud dashboard
2. Check site status
3. Ensure site is active (not suspended)
4. Check site resources (may be overloaded)

### Option 3: Use Different User

1. Create new user in ERPNext
2. Assign required roles
3. Generate API keys for new user
4. Use new credentials in Admin Dashboard

### Option 4: Contact Support

If nothing works:
- Check ERPNext documentation
- Contact Frappe Cloud support
- Review ERPNext error logs
- Check server status

---

## 🔍 Diagnostic Tool

**Run this in Browser Console (F12):**

```javascript
// Test ERPNext Connection
async function testERPNextConnection() {
    const apiUrl = 'https://diamondcasa.frappe.cloud';
    const apiKey = 'f70126362d822ce';
    const apiSecret = '077025b26';
    
    console.log('Testing connection...');
    
    // Test 1: Ping
    try {
        const ping = await fetch(apiUrl + '/api/method/ping');
        console.log('✓ Ping:', await ping.text());
    } catch (e) {
        console.error('✗ Ping failed:', e);
    }
    
    // Test 2: API with credentials
    try {
        const response = await fetch(apiUrl + '/api/resource/User?limit_page_length=1', {
            headers: {
                'Authorization': `token ${apiKey}:${apiSecret}`,
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        console.log('✓ API Response:', response.status, data);
    } catch (e) {
        console.error('✗ API failed:', e);
    }
}

testERPNextConnection();
```

**Check console output for specific errors.**

---

## ✅ Success Indicators

Connection is successful when:
- ✅ Test Connection shows "Connection Successful"
- ✅ No errors in browser console
- ✅ Can sync products
- ✅ Can upload products

---

**Need more help?** Check browser console (F12) for detailed error messages!
