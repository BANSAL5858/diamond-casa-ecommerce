# 🚀 Fast Track Setup - Get Started in 5 Minutes

## Quick Setup Options

### Option 1: Use Existing ERPNext Instance (Recommended)

If you already have ERPNext running:

1. **Get Your ERPNext URL**
   ```
   ⚠️ You need your ACTUAL ERPNext URL!
   
   Examples of REAL URLs:
   - https://diamondcasa.frappe.cloud
   - https://erpnext.yourdomain.com
   - http://localhost:8000 (if local)
   
   ❌ NOT: https://your-erpnext-instance.com (this is just a placeholder!)
   
   How to find it:
   - Open ERPNext in your browser
   - Copy the URL from address bar
   - That's your ERPNext URL!
   
   Don't have ERPNext? See "Option 2" below or use mock mode.
   ```

2. **Generate API Credentials** (2 minutes)
   - Login to ERPNext
   - Go to: **User** → Select your user → **API Keys**
   - Click **"Generate Keys"**
   - Copy **API Key** and **API Secret** (shown only once!)

3. **Use These Credentials**
   - API URL: Your ERPNext URL
   - API Key: [from ERPNext]
   - API Secret: [from ERPNext]

---

### Option 2: Set Up New ERPNext (Cloud/Server)

#### Quick Cloud Setup (Frappe Cloud - Free Trial)
1. Go to: https://frappecloud.com
2. Sign up for free account
3. Create new site
4. Install ERPNext
5. Get your site URL: `https://your-site.frappe.cloud`

#### Self-Hosted Setup
1. Follow: https://github.com/frappe/erpnext
2. Or use Docker: `docker run -it frappe/bench`
3. Get your instance URL

---

### Option 3: Local Development Setup (Testing)

For testing without real ERPNext:

1. **Use Mock Mode** (for development)
   - Admin Dashboard → ERPNext Integration
   - Toggle "Integration Status" to **Disabled**
   - Products will use local data
   - No API credentials needed

2. **Or Use Test Credentials** (for testing integration)
   ```
   API URL: https://demo.erpnext.com
   API Key: test_key_12345
   API Secret: test_secret_67890
   ```
   ⚠️ Note: These are examples - use your real credentials!

---

## 📋 Credential Template

Fill in your actual values:

```
═══════════════════════════════════════════════════
   ERPNext API Configuration
═══════════════════════════════════════════════════

API URL:     https://_____________________________
API Key:     _____________________________________
API Secret:  _____________________________________
User Email:  integration@diamondcasa.in

Test Date:   _______________
Status:      ☐ Connected  ☐ Not Connected
═══════════════════════════════════════════════════
```

---

## ⚡ 5-Minute Setup Steps

### Step 1: Get ERPNext URL (1 minute)
- [ ] Note your ERPNext instance URL
- [ ] Example: `https://erpnext.diamondcasa.in`

### Step 2: Generate API Keys (2 minutes)
- [ ] Login to ERPNext
- [ ] Go to: User → API Keys
- [ ] Click "Generate Keys"
- [ ] Copy API Key and Secret

### Step 3: Configure Admin Dashboard (1 minute)
- [ ] Open `admin.html`
- [ ] Login: `admin` / `admin123`
- [ ] Go to ERPNext Integration
- [ ] Enter credentials
- [ ] Click "Save Configuration"

### Step 4: Test Connection (30 seconds)
- [ ] Click "Test Connection"
- [ ] Should show: ✅ Connection Successful!

### Step 5: Enable Integration (30 seconds)
- [ ] Toggle "Integration Status" to **Enabled**
- [ ] Ready to upload products!

---

## 🔑 How to Get Real API Credentials

### Method 1: From ERPNext UI

1. **Login to ERPNext**
   ```
   URL: https://your-erpnext-instance.com
   User: Administrator (or your user)
   ```

2. **Go to User Settings**
   - Click your profile (top right)
   - Select **"User"** from menu
   - Or go to: **User** → **List** → Select your user

3. **Generate API Keys**
   - Scroll to **"API Keys"** section
   - Click **"Generate Keys"** button
   - **Copy API Key** (long string)
   - **Copy API Secret** (long string - shown only once!)
   - ⚠️ Save these securely!

4. **Set User Permissions**
   - Go to **"Roles"** tab
   - Add roles:
     - `Sales User`
     - `Stock User`
     - `Item Manager`

### Method 2: Via ERPNext API

```bash
# Login and get session
curl -X POST https://your-erpnext.com/api/method/login \
  -d "usr=your-email@example.com" \
  -d "pwd=your-password"

# Generate API key (requires admin access)
curl -X POST https://your-erpnext.com/api/method/frappe.core.doctype.user.user.generate_keys \
  -H "Authorization: token YOUR_SESSION_TOKEN:YOUR_API_KEY"
```

---

## 🎯 Quick Configuration

### If You Have ERPNext Running:

1. **Get Credentials** (from ERPNext)
   ```
   API URL: [your-erpnext-url]
   API Key: [from ERPNext → User → API Keys]
   API Secret: [from ERPNext → User → API Keys]
   ```

2. **Enter in Admin Dashboard**
   - Open `admin.html`
   - ERPNext Integration page
   - Paste credentials
   - Save & Test

3. **Enable Integration**
   - Toggle switch to Enabled
   - Ready!

### If You DON'T Have ERPNext Yet:

**Option A: Use Frappe Cloud (Free Trial)**
1. Sign up: https://frappecloud.com
2. Create site with ERPNext
3. Get URL and generate API keys
4. Use credentials in Admin Dashboard

**Option B: Use Local Development**
1. Install ERPNext locally
2. Or use mock mode (no credentials needed)
3. Test with local data first

---

## 📝 Example Credentials (For Reference Only)

These are **NOT real credentials** - use as format reference:

```
API URL:     https://demo.erpnext.com
API Key:     a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
API Secret:  x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3
User Email:  integration@diamondcasa.in
```

**Format:**
- API URL: Full URL with https://
- API Key: Long alphanumeric string (40+ characters)
- API Secret: Long alphanumeric string (40+ characters)

---

## ✅ Setup Verification

After entering credentials:

1. **Test Connection**
   - Click "Test Connection" button
   - Should show: ✅ "Connection Successful!"

2. **If Connection Fails:**
   - Check API URL is correct
   - Verify API Key/Secret are correct
   - Ensure ERPNext is running
   - Check user has proper permissions

3. **Enable Integration**
   - Toggle switch to "Enabled"
   - Status should show: "Enabled" (green)

---

## 🚀 Ready to Upload!

Once configured:
1. ✅ Credentials entered
2. ✅ Connection tested successfully
3. ✅ Integration enabled
4. ✅ Ready to upload 378 products!

---

## 🆘 Need Help?

**Can't get credentials?**
- Check ERPNext documentation
- Contact ERPNext administrator
- Use mock mode for testing

**Connection fails?**
- Verify ERPNext URL is accessible
- Check API Key/Secret format
- Ensure user has required roles

**Don't have ERPNext?**
- Sign up for Frappe Cloud (free trial)
- Install locally for development
- Use mock mode for testing

---

**Next Step:** Enter your credentials in Admin Dashboard and start uploading! 🎉
