# ERPNext Configuration Checklist

Use this checklist to ensure everything is set up correctly before uploading 378 products.

## ✅ Pre-Upload Checklist

### 1. ERPNext Instance
- [ ] ERPNext instance is running and accessible
- [ ] Can login to ERPNext as Administrator
- [ ] ERPNext URL noted: `https://_________________`

### 2. ERPNext Setup
- [ ] Integration user created: `integration@diamondcasa.in`
- [ ] API Key generated (User → API Keys → Generate)
- [ ] API Secret copied (shown only once!)
- [ ] User has required roles:
  - [ ] Sales User
  - [ ] Stock User
  - [ ] Item Manager

### 3. ERPNext Configuration
- [ ] Item Groups created:
  - [ ] Jewelry (default)
  - [ ] Rings
  - [ ] Earrings
  - [ ] Necklaces
  - [ ] Bracelets
  - [ ] Bangles
  - [ ] Pendants
  - [ ] Collections

- [ ] Warehouses created:
  - [ ] READY - DC
  - [ ] MTO/WIP - DC
  - [ ] TRANSIT - DC
  - [ ] RETURN - DC

- [ ] Price List created:
  - [ ] Standard Selling (INR)

- [ ] Custom Fields added to Item doctype:
  - [ ] custom_metal_purity
  - [ ] custom_weight
  - [ ] custom_diamond_details
  - [ ] custom_lead_time
  - [ ] custom_brand
  - [ ] custom_metal_type
  - [ ] custom_diamond_type
  - [ ] custom_subcategory
  - [ ] custom_collection
  - [ ] custom_folder_name
  - [ ] custom_quantity
  - [ ] custom_size
  - [ ] custom_ready_to_ship

### 4. Admin Dashboard Configuration
- [ ] Admin Dashboard accessible (`admin.html`)
- [ ] Logged in as admin
- [ ] Navigated to ERPNext Integration page
- [ ] Entered API credentials:
  - [ ] API URL: `_________________`
  - [ ] API Key: `_________________`
  - [ ] API Secret: `_________________`
  - [ ] Integration User: `integration@diamondcasa.in`
- [ ] Clicked "Save Configuration"
- [ ] Clicked "Test Connection" → ✅ Success
- [ ] Toggled "Integration Status" to **Enabled**

### 5. Excel File Preparation
- [ ] Excel file ready: `final data all in one.xlsx`
- [ ] File contains all 378 products
- [ ] Required columns present:
  - [ ] SKU (Item Code)
  - [ ] Product Title
  - [ ] Description
  - [ ] Primary Category
  - [ ] SubCategory
  - [ ] All weight columns
  - [ ] Solitaire/Diamond/Color Stone sections
  - [ ] Image URLs (Rendering, Photograph, Recommended Products 1-3)
  - [ ] Video URL (if available)
- [ ] Image/video URLs are accessible

### 6. Ready to Upload
- [ ] All above items checked
- [ ] ERPNext connection tested successfully
- [ ] Integration enabled
- [ ] Excel file ready
- [ ] Ready to proceed with upload

---

## 📝 Upload Process

### During Upload
1. [ ] Select Excel file in Admin Dashboard
2. [ ] Set Default Item Group: `Jewelry`
3. [ ] Check "Update existing items"
4. [ ] Check "Create Item Price"
5. [ ] Click "Upload to ERPNext"
6. [ ] Monitor progress bar
7. [ ] Wait for completion (10-30 minutes)

### After Upload
- [ ] Review upload results:
  - [ ] Total: 378
  - [ ] Created: ___ products
  - [ ] Updated: ___ products
  - [ ] Failed: ___ products (review errors if any)
- [ ] Check "Products automatically synced to website" message
- [ ] Verify products on website (`index.html`)

---

## ✅ Post-Upload Verification

### Website Verification
- [ ] Open website (`index.html`)
- [ ] Products appear in product sections
- [ ] Click "View Details" on a product
- [ ] Verify:
  - [ ] Image gallery shows images (up to 5)
  - [ ] Video plays (if available)
  - [ ] All specifications displayed
  - [ ] Price and availability correct
  - [ ] Ready to Ship status correct

### ERPNext Verification
- [ ] Login to ERPNext
- [ ] Go to Stock → Item
- [ ] Verify items created (filter by Item Group: Jewelry)
- [ ] Check a few items:
  - [ ] Custom fields populated
  - [ ] Images attached (File attachments)
  - [ ] Videos attached (File attachments)
  - [ ] Item Price created

---

## 🎯 Success Criteria

Upload is successful when:
- ✅ All 378 products created/updated in ERPNext
- ✅ Images uploaded (5 per product, if URLs provided)
- ✅ Videos uploaded (1 per product, if URLs provided)
- ✅ All custom fields saved
- ✅ Products appear on website
- ✅ All features display correctly

---

## 📊 Expected Results

**For 378 products:**
- Total Items: 378
- Total Images: ~1,890 (378 × 5)
- Total Videos: ~378
- Total Files: ~2,268

**Upload Time:**
- Without media: ~5-10 minutes
- With media: ~10-30 minutes

---

## 🆘 If Something Goes Wrong

### Connection Test Fails
- Check API URL is correct
- Verify API Key/Secret
- Check ERPNext is running
- Verify user permissions

### Upload Fails
- Check Excel file format (.xlsx or .xls)
- Verify SKU column exists
- Check data types are correct
- Review error messages

### Products Not on Website
- Click "Sync Products" manually
- Verify Item Group is "Jewelry"
- Check integration is enabled
- Review integration logs

---

**Ready?** Check all items above, then proceed with upload! 🚀
