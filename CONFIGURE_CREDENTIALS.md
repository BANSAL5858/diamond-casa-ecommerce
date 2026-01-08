# ⚙️ Configure Your ERPNext Credentials

## Your API Credentials

Based on the credentials you've shared:

```
API Key:     f70126362d822ce
API Secret:  077025b26
```

---

## 📋 Configuration Steps

### Step 1: Get Your ERPNext URL

You still need your **ERPNext instance URL**. This is the web address where you access ERPNext.

**How to find it:**
- Open ERPNext in your browser
- Copy the URL from the address bar
- Examples:
  - `https://your-site.frappe.cloud`
  - `https://erpnext.yourdomain.com`
  - `http://localhost:8000` (if local)

---

### Step 2: Open Admin Dashboard

1. Open `admin.html` in your browser
2. Login with:
   - Username: `admin`
   - Password: `admin123`

---

### Step 3: Configure ERPNext Integration

1. **Navigate to ERPNext Integration**
   - Click "ERPNext Integration" in the sidebar

2. **Enter Your Credentials**
   ```
   ERPNext API URL:     [YOUR ERPNext URL - see Step 1]
   API Key:             f70126362d822ce
   API Secret:          077025b26
   Integration User:    integration@diamondcasa.in
   Auto Sync Interval:  15 (minutes)
   ```

3. **Save Configuration**
   - Click "Save Configuration" button

4. **Test Connection**
   - Click "Test Connection" button
   - Should show: ✅ "Connection Successful!"

5. **Enable Integration**
   - Toggle "Integration Status" switch to **Enabled**
   - Status should show: "Enabled" (green)

---

## ✅ Complete Configuration

Your complete configuration should look like:

```
═══════════════════════════════════════════════════
   ERPNext Configuration
═══════════════════════════════════════════════════

API URL:     https://[your-erpnext-url]
API Key:     f70126362d822ce
API Secret:  077025b26
User Email:  integration@diamondcasa.in
Sync Interval: 15 minutes

Status: ☐ Configured  ☐ Tested  ☐ Enabled
═══════════════════════════════════════════════════
```

---

## 🚀 Next Steps

Once configured:

1. ✅ Credentials entered
2. ✅ Connection tested
3. ✅ Integration enabled
4. ✅ Ready to upload 378 products!

---

## ⚠️ Important Notes

1. **API URL Required**: You still need to provide your ERPNext instance URL
2. **Security**: Keep your API Secret secure - don't share it publicly
3. **Test First**: Always test connection before enabling integration
4. **User Permissions**: Ensure the user has proper roles in ERPNext:
   - Sales User
   - Stock User
   - Item Manager

---

## 🆘 Troubleshooting

### Connection Test Fails

**Check:**
- API URL is correct and accessible
- API Key and Secret are correct
- ERPNext instance is running
- User has proper permissions

### Still Need ERPNext URL?

**Options:**
1. Check your ERPNext login page URL
2. Ask your ERPNext administrator
3. Set up new instance: https://frappecloud.com
4. Use mock mode for testing (no URL needed)

---

**Ready to configure?** Follow the steps above! 🎯
