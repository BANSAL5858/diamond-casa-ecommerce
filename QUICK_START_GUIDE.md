# Quick Start Guide - Upload 378 Products to Website

## 🚀 Fast Track Setup (5 Steps)

### Step 1: Get ERPNext API Credentials (5 minutes)

1. **Login to ERPNext** as Administrator
2. **Create User**: `integration@diamondcasa.in`
3. **Generate API Key**: User → API Keys → Generate
4. **Copy Credentials**:
   - API URL
   - API Key
   - API Secret

### Step 2: Configure Admin Dashboard (2 minutes)

1. Open `admin.html`
2. Login: `admin` / `admin123`
3. Go to **ERPNext Integration**
4. Enter credentials:
   ```
   API URL: [your-erpnext-url]
   API Key: [your-api-key]
   API Secret: [your-api-secret]
   ```
5. Click **"Save Configuration"**
6. Click **"Test Connection"** → Should show success
7. Toggle **"Integration Status"** to **Enabled**

### Step 3: Prepare Excel File (1 minute)

1. Ensure file: `final data all in one.xlsx`
2. Verify columns present:
   - SKU, Product Title, Description
   - Primary Category, SubCategory
   - All weight columns
   - Solitaire/Diamond/Color Stone sections
   - Rendering, Photograph, Recommended Products 1-3
   - Video column (if available)

### Step 4: Upload Products (10-30 minutes)

1. In Admin Dashboard → **ERPNext Integration**
2. Scroll to **"Upload Products from Excel to ERPNext"**
3. Click **"Choose File"** → Select Excel file
4. Settings:
   - Default Item Group: `Jewelry`
   - ✅ Update existing items
   - ✅ Create Item Price
5. Click **"Upload to ERPNext"**
6. **Wait for completion** (progress bar shows status)
7. **Review results**: Created, Updated, Failed

### Step 5: Verify on Website (2 minutes)

1. Open `index.html` in browser
2. **Check products appear** in all sections
3. Click **"View Details"** on any product
4. **Verify**:
   - ✅ Images display (up to 5)
   - ✅ Video plays (if available)
   - ✅ All specifications shown
   - ✅ Price and availability correct

---

## ⚡ Expected Results

After upload:
- ✅ **378 products** created in ERPNext
- ✅ **5 images** uploaded per product (if URLs provided)
- ✅ **1 video** uploaded per product (if URL provided)
- ✅ **All custom fields** saved
- ✅ **Products automatically sync** to website
- ✅ **All features displayed** on website

---

## 📊 Upload Progress

**For 378 products:**
- Upload time: ~10-30 minutes (depending on media)
- Images: ~1,890 images (378 × 5)
- Videos: ~378 videos
- Total files: ~2,268 files

**Progress Indicators:**
- Progress bar shows percentage
- Status shows current item
- Results show summary

---

## ✅ Success Checklist

After upload, verify:
- [ ] Upload completed (Created + Updated = 378)
- [ ] No errors (or minimal errors)
- [ ] Products appear on website
- [ ] Images display correctly
- [ ] Videos play (if available)
- [ ] All specifications visible
- [ ] Pricing correct
- [ ] Ready to Ship status correct

---

## 🆘 Quick Troubleshooting

### Upload Fails Immediately
- Check ERPNext integration is enabled
- Verify API credentials are correct
- Test connection first

### Some Products Fail
- Check error list in results
- Verify SKU is unique
- Check data types are correct

### Products Not on Website
- Click "Sync Products" manually
- Check Item Group is "Jewelry"
- Verify integration is enabled

---

**Ready to upload?** Follow Steps 1-5 above! 🚀
