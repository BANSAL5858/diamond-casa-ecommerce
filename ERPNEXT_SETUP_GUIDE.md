# ERPNext Setup and Configuration Guide

## Step-by-Step Setup Instructions

### Step 1: ERPNext Instance Setup

#### Option A: Use Existing ERPNext Instance
If you already have an ERPNext instance:
- Note your ERPNext URL (e.g., `https://erpnext.diamondcasa.in`)
- Proceed to Step 2

#### Option B: Set Up New ERPNext Instance
1. **Install ERPNext** (if not already installed)
   - Follow: https://github.com/BANSAL5858/ERPNext
   - Or use: https://github.com/frappe/erpnext

2. **Access ERPNext**
   - Open your ERPNext instance in browser
   - Login as Administrator

---

### Step 2: Create API User in ERPNext

1. **Login to ERPNext** as Administrator

2. **Create Integration User**
   - Go to **User** → **New User**
   - **Email**: `integration@diamondcasa.in`
   - **Full Name**: `Integration User`
   - **User Type**: `System User`
   - **Save**

3. **Set User Permissions**
   - Go to **User** → Select `integration@diamondcasa.in`
   - Go to **Roles** tab
   - Add roles:
     - `Sales User` (for Sales Orders)
     - `Stock User` (for Inventory)
     - `Item Manager` (for Items)
   - **Save**

---

### Step 3: Generate API Key and Secret

1. **Login as Integration User**
   - Logout from Administrator
   - Login as `integration@diamondcasa.in`
   - Set a secure password

2. **Generate API Key**
   - Go to **User** → **API Keys**
   - Click **Generate Keys**
   - **Copy API Key** (keep it safe)
   - **Copy API Secret** (keep it safe - shown only once!)

3. **Note Your Credentials**
   ```
   API URL: https://your-erpnext-instance.com
   API Key: [your-api-key]
   API Secret: [your-api-secret]
   Integration User: integration@diamondcasa.in
   ```

---

### Step 4: Configure ERPNext Settings

#### Create Item Groups
1. Go to **Stock** → **Item Group** → **New**
2. Create these Item Groups:
   - `Jewelry` (default)
   - `Rings`
   - `Earrings`
   - `Necklaces`
   - `Bracelets`
   - `Bangles`
   - `Pendants`
   - `Collections`

#### Create Warehouses
1. Go to **Stock** → **Warehouse** → **New**
2. Create these Warehouses:
   - `READY - DC` (Ready to ship items)
   - `MTO/WIP - DC` (Made-to-order items)
   - `TRANSIT - DC` (Items in transit)
   - `RETURN - DC` (Returned items)

#### Create Price List
1. Go to **Selling** → **Price List** → **New**
2. Create:
   - **Price List Name**: `Standard Selling`
   - **Currency**: `INR`
   - **Enabled**: Yes
   - **Save**

#### Add Custom Fields to Item Doctype
1. Go to **Customize** → **Customize Form**
2. Select **DocType**: `Item`
3. Add these Custom Fields:

| Field Name | Label | Type | Options |
|------------|-------|------|---------|
| `custom_metal_purity` | Metal Purity | Data | - |
| `custom_weight` | Weight (grams) | Float | - |
| `custom_diamond_details` | Diamond Details | Small Text | - |
| `custom_lead_time` | Lead Time (days) | Int | - |
| `custom_brand` | Brand | Data | - |
| `custom_metal_type` | Metal Type | Select | Yellow Gold, Rose Gold, White Gold, Two-Tone Gold |
| `custom_diamond_type` | Diamond Type | Select | Round, Pear, Heart, Emerald, Princess, etc. |
| `custom_subcategory` | Subcategory | Data | - |
| `custom_collection` | Collection | Data | - |
| `custom_folder_name` | Folder Name | Data | - |
| `custom_quantity` | Quantity | Int | - |
| `custom_size` | Size | Data | - |
| `custom_ready_to_ship` | Ready to Ship | Check | - |

4. **Save** the form customization

---

### Step 5: Configure Website Admin Dashboard

1. **Open Admin Dashboard**
   - Open `admin.html` in browser
   - Login with admin credentials

2. **Navigate to ERPNext Integration**
   - Click **ERPNext Integration** in sidebar

3. **Enter API Credentials**
   ```
   ERPNext API URL: https://your-erpnext-instance.com
   API Key: [paste your API key]
   API Secret: [paste your API secret]
   Integration User: integration@diamondcasa.in
   Auto Sync Interval: 15 (minutes)
   ```

4. **Save Configuration**
   - Click **"Save Configuration"** button

5. **Test Connection**
   - Click **"Test Connection"** button
   - Should show: "Connection successful!"

6. **Enable Integration**
   - Toggle **"Integration Status"** switch to **Enabled**
   - Status should show: "Enabled" (green)

---

### Step 6: Upload Products from Excel

1. **Prepare Excel File**
   - Ensure file is named: `final data all in one.xlsx`
   - Verify all columns are present
   - Check image/video URLs are accessible

2. **Upload to ERPNext**
   - In Admin Dashboard → ERPNext Integration
   - Scroll to **"Upload Products from Excel to ERPNext"**
   - Click **"Choose File"** → Select your Excel file
   - Select **Default Item Group**: `Jewelry` (or appropriate)
   - Check **"Update existing items"** (if updating)
   - Check **"Create Item Price"** (to create prices)
   - Click **"Upload to ERPNext"**

3. **Monitor Progress**
   - Watch progress bar
   - Check status messages
   - Wait for completion

4. **Review Results**
   - Check: Total, Created, Updated, Failed
   - Review errors (if any)
   - Products automatically sync to website!

---

### Step 7: Verify Products on Website

1. **Open Website**
   - Open `index.html` in browser

2. **Check Products**
   - Scroll through product sections
   - Verify products appear
   - Check images display (up to 5 per product)
   - Check videos play (if available)

3. **View Product Details**
   - Click "View Details" on any product
   - Verify:
     - Image gallery (5 images)
     - Video player (if video available)
     - All specifications
     - Pricing and availability

---

## Quick Setup Checklist

### ERPNext Setup
- [ ] ERPNext instance running
- [ ] Integration user created (`integration@diamondcasa.in`)
- [ ] API Key and Secret generated
- [ ] Item Groups created
- [ ] Warehouses created
- [ ] Price List created (`Standard Selling`)
- [ ] Custom fields added to Item doctype

### Website Configuration
- [ ] Admin Dashboard accessible
- [ ] ERPNext Integration page opened
- [ ] API credentials entered
- [ ] Connection tested successfully
- [ ] Integration enabled

### Product Upload
- [ ] Excel file prepared
- [ ] Excel file uploaded
- [ ] Upload completed successfully
- [ ] Products synced to website
- [ ] Products verified on website

---

## Troubleshooting

### Connection Test Fails

**Possible Causes:**
1. Invalid API URL
2. Wrong API Key/Secret
3. ERPNext instance not accessible
4. API user permissions insufficient

**Solutions:**
- Verify API URL is correct and accessible
- Regenerate API Key/Secret in ERPNext
- Check ERPNext instance is running
- Verify user has required roles

### Products Not Uploading

**Possible Causes:**
1. Excel file format incorrect
2. Missing required columns (SKU)
3. Invalid data in Excel
4. ERPNext validation errors

**Solutions:**
- Check Excel file format (.xlsx or .xls)
- Verify SKU column exists and has values
- Check data types (numbers for price, weight)
- Review error messages in upload results

### Products Not Syncing to Website

**Possible Causes:**
1. Integration not enabled
2. Sync not triggered
3. Item Group filter mismatch
4. API connection issues

**Solutions:**
- Enable integration in Admin Dashboard
- Click "Sync Products" manually
- Verify Item Group is "Jewelry"
- Test connection again

---

## API Credentials Template

Save this template and fill in your values:

```
ERPNext Configuration
====================

API URL: https://_________________________
API Key: _________________________________
API Secret: ______________________________
Integration User: integration@diamondcasa.in
Auto Sync Interval: 15 minutes

Test Date: _______________
Status: ☐ Connected  ☐ Not Connected
```

---

## Support

For issues or questions:
1. Check integration logs in Admin Dashboard
2. Review error messages in upload results
3. Verify ERPNext API is accessible
4. Check browser console for errors

---

**Last Updated:** 2024  
**ERPNext Version:** Jewelry Edition  
**Website Version:** Diamond Casa E-Commerce
