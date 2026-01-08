# Excel to ERPNext Upload Guide

## Overview

This feature allows you to upload product data directly from an Excel file (`final data all in one.xlsx`) to ERPNext. The system automatically parses the Excel file, maps columns to ERPNext Item fields, and creates/updates items in ERPNext.

## Excel File Format

### Required Columns

- **SKU** (or Item Code, Siddh Item Code, Manufacturer's Item Code) - Unique identifier for the product (REQUIRED)
- **Product Title** (or Item Name, Name) - Product name

### Standard Columns

#### Basic Information
- **Primary Category** - Product category (maps to Item Group, defaults to "Jewelry")
- **SubCategory** - Product subcategory
- **Description** - Product description
- **Collection** - Product collection name

#### Weight Information
- **Gross Wt in Grams** - Gross weight columns (14Kt, 18Kt, 9Kt)
- **Net Wt in Grams** - Net weight columns (14Kt, 18Kt, 9Kt)
- **Kt** (or Karat) - Metal purity (14, 18, 9)
- **Color** - Metal color (YW=Yellow Gold, RW=Rose Gold, White=White Gold)

#### Solitaire Section
- **Solitaire** - Stone type (e.g., MD, LGD)
- **Color/Clarity** - Color and clarity grade
- **No. of Pcs** - Number of pieces
- **Wt in Ct** - Weight in carats
- **Price in K** - Price in thousands (will be multiplied by 1000)

#### Diamond Section
- **Diamond** - Diamond type
- **Color/Clarity** - Color and clarity grade
- **No. of Pcs** - Number of pieces
- **Wt in Ct** - Weight in carats
- **Price in K** - Price in thousands

#### Color Stone Section
- **Color Stone** - Color stone type
- **Color/Description** - Color or description
- **No. of Pcs** - Number of pieces
- **Wt in Ct** - Weight in carats
- **Price** - Direct price (not in K)

#### Shipping & Production
- **Ready to Ship** - Yes/No (Yes = 0 days lead time)
- **Make to Order** - Yes/No (Yes = 15 days lead time)
- **Quantity** - Available quantity
- **Size** - Product size

#### Images and Media
- **Rendering** - Main product image URL
- **Photograph** - Product photograph URL
- **Recommended Products 1, 2, 3** - Additional image URLs (up to 3)
- **Video** - Video URL (optional)

#### Additional Information
- **Siddh Item Code** - Internal item code
- **Manufacturer's Item Code** - Manufacturer's reference
- **Folder Name** - Image folder organization
- **Diamond Shape** - Shape of diamond (Round, Pear, Heart, etc.)

### Column Name Flexibility

The system supports flexible column naming:
- Case-insensitive (Item Code, item code, ITEM CODE all work)
- Spaces and underscores are ignored (Item Code, Item_Code, ItemCode all work)
- Multiple name variations are supported

### Example Excel Format (Based on "final data all in one.xlsx")

| SKU | Product Title | Primary Category | SubCategory | Description | 18Kt (Net Wt) | Solitaire | Color/Clarity | Wt in Ct | Price in K | Ready to Ship | Kt | Color | Rendering | Photograph | Diamond Shape |
|-----|---------------|------------------|-------------|-------------|---------------|-----------|---------------|----------|------------|---------------|----|----|----------|------------|---------------|
| HS/BG1987 | Imperial Pear Moissanite Bangle | Bangles | Fancy Pointer Bangles | Showcasing unrivaled brilliance... | 33.148 | MD | | 24.46 | 7 | Yes | 14 | YW | https://... | https://... | Pear |
| LB/BB-16921 | The Grandeur Pachheli Bangle Pair | Bangles | Pacheli Bangles | An ultimate expression... | 41.424 | MD | | 11.28 | 6 | Yes | 14 | YW | https://... | https://... | Round |

**Note:** The system automatically:
- Maps "Primary Category" to Item Group
- Calculates price from "Price in K" × 1000
- Determines lead time from "Ready to Ship" (Yes = 0 days, No = 15 days)
- Extracts images from "Rendering", "Photograph", and "Recommended Products" columns
- Maps metal color (YW→Yellow Gold, RW→Rose Gold, White→White Gold)
- Combines Solitaire/Diamond/Color Stone details into diamond_details field

## How to Use

### Step 1: Prepare Excel File

1. Open your Excel file (`final data all in one.xlsx`)
2. Ensure first row contains column headers
3. Fill in product data in rows below
4. Include at least **Item Code** column (required)
5. Add image/video URLs if available

### Step 2: Access Upload Feature

1. Login to Admin Dashboard
2. Navigate to **ERPNext Integration** page
3. Scroll to **"Upload Products from Excel to ERPNext"** section

### Step 3: Configure Upload Settings

1. **Select Excel File**: Click "Choose File" and select your Excel file
2. **Default Item Group**: Select default category if not specified in Excel
3. **Update Existing Items**: 
   - Checked: Updates items if Item Code already exists
   - Unchecked: Skips existing items
4. **Create Item Price**: 
   - Checked: Creates price in "Standard Selling" price list
   - Unchecked: Only creates item, no price

### Step 4: Preview Excel Data

- After selecting file, first 5 rows are shown in preview table
- Verify column mapping is correct
- Check that data looks correct

### Step 5: Upload to ERPNext

1. Click **"Upload to ERPNext"** button
2. Monitor progress bar and status messages
3. Wait for upload to complete

### Step 6: Review Results

After upload completes, you'll see:
- Total rows processed
- Number of items created
- Number of items updated
- Number of failed items
- Detailed error list (if any)

## Column Mapping Reference

### Standard Columns

| Excel Column Name | ERPNext Field | Notes |
|-------------------|---------------|-------|
| Item Code, SKU, ItemCode | item_code | **Required** |
| Item Name, Name, Product Name | item_name | |
| Item Group, Category | item_group | Defaults to "Jewelry" |
| Description, Desc | description | |
| Price, Selling Price, Rate | price | Creates Item Price |
| Stock UOM, UOM, Unit | stock_uom | Defaults to "Nos" |

### Custom Fields (Jewelry)

| Excel Column Name | ERPNext Custom Field | Notes |
|-------------------|----------------------|-------|
| Brand, Brand Name | custom_brand | |
| Metal Type, Metal | custom_metal_type | |
| Metal Purity, Purity | custom_metal_purity | |
| Diamond Type, Diamond | custom_diamond_type | |
| Weight, Carat, Ct | custom_weight | Numeric value |
| Diamond Details | custom_diamond_details | |
| Lead Time, LeadTime | custom_lead_time | Numeric (days) |

### Media Columns

| Excel Column Name | Usage | Notes |
|-------------------|-------|-------|
| Image1, Image2, Image3, Image4, Image5 | Images array | Up to 5 images |
| Images | Images array | Comma-separated URLs |
| Video, VideoURL | Video URL | Single video |

## Features

### Automatic Column Detection
- Flexible column name matching
- Case-insensitive
- Handles spaces and underscores
- Multiple name variations supported

### Image/Video Support
- Up to 5 images per product
- 1 video per product
- Supports URLs (full URLs or relative paths)
- Images can be in separate columns (Image1-5) or comma-separated

### Error Handling
- Continues processing even if some rows fail
- Detailed error messages for failed rows
- Shows row number and error reason

### Progress Tracking
- Real-time progress bar
- Status messages for each item
- Shows current item being processed

## ERPNext Requirements

### Custom Fields Setup

Ensure these custom fields exist in ERPNext Item doctype:
- `custom_metal_purity` (Data)
- `custom_weight` (Float)
- `custom_diamond_details` (Small Text)
- `custom_lead_time` (Int)
- `custom_brand` (Data)
- `custom_metal_type` (Select)
- `custom_diamond_type` (Select)

### Item Groups

Create Item Groups in ERPNext:
- Jewelry (default)
- Rings
- Earrings
- Necklaces
- Bracelets
- Bangles
- Pendants
- Collections

### Price List

Ensure "Standard Selling" price list exists in ERPNext.

## Troubleshooting

### Upload Fails Immediately

**Possible Causes:**
1. ERPNext integration not enabled
2. Invalid API credentials
3. Excel file format error

**Solutions:**
- Check ERPNext integration is enabled
- Verify API URL, Key, and Secret
- Test connection using "Test Connection" button
- Ensure Excel file is valid (.xlsx or .xls format)

### Some Rows Fail

**Possible Causes:**
1. Missing Item Code
2. Invalid data format
3. ERPNext validation errors
4. Duplicate Item Codes (if update disabled)

**Solutions:**
- Check error list in results
- Verify Item Code is present and unique
- Check data types (numbers for price, weight, etc.)
- Enable "Update Existing Items" if items already exist

### Images/Videos Not Attached

**Note:** Currently, image/video URLs are logged but not automatically attached to Items in ERPNext. This requires:
- Server-side file download and upload
- ERPNext File API integration
- Or manual attachment in ERPNext

**Workaround:**
- Images/videos can be manually attached in ERPNext after upload
- URLs are stored in item data for reference

### Column Not Recognized

**Possible Causes:**
1. Column name doesn't match expected format
2. Extra spaces or special characters

**Solutions:**
- Use standard column names (see Column Mapping Reference)
- Remove extra spaces
- Check case (case-insensitive, but spelling must match)

## Best Practices

1. **Prepare Data First**
   - Clean and validate Excel data
   - Ensure Item Codes are unique
   - Verify URLs are accessible
   - Check data types are correct

2. **Test with Small Batch**
   - Upload 5-10 items first
   - Verify items created correctly in ERPNext
   - Check all fields mapped properly
   - Then upload full batch

3. **Backup Before Upload**
   - Export existing items from ERPNext if needed
   - Keep original Excel file as backup

4. **Monitor Progress**
   - Watch progress bar during upload
   - Check status messages
   - Review results carefully

5. **Handle Errors**
   - Review error list
   - Fix data issues in Excel
   - Re-upload failed items

## Example Excel Template

```csv
Item Code,Item Name,Brand,Price,Metal Type,Metal Purity,Weight,Image1,Image2,Video
RING-001,Diamond Ring,BVLGARI,50000,Gold,18K,2.5,https://example.com/img1.jpg,https://example.com/img2.jpg,https://example.com/video.mp4
RING-002,Solitaire Ring,Cartier,75000,Platinum,950,3.0,https://example.com/img3.jpg,https://example.com/img4.jpg,
```

## API Reference

### Upload Function

```javascript
await window.ERPNextIntegration.bulkUploadItemsFromExcel(excelData, {
    updateExisting: true,        // Update existing items
    createPriceList: true,      // Create Item Price
    defaultItemGroup: 'Jewelry', // Default item group
    onProgress: (progress) => {  // Progress callback
        console.log(progress.current, progress.total, progress.status);
    }
});
```

### Return Value

```javascript
{
    total: 100,      // Total rows processed
    created: 85,     // Items created
    updated: 10,      // Items updated
    failed: 5,       // Failed rows
    errors: [        // Error details
        {
            row: 5,
            item_code: 'RING-005',
            error: 'Item Code is required'
        }
    ]
}
```

## Support

For issues or questions:
1. Check Admin Dashboard → ERPNext Integration → Integration Logs
2. Review error messages in upload results
3. Verify Excel file format matches requirements
4. Test ERPNext API connection
5. Check ERPNext custom fields are configured

---

**Feature Version**: 1.0  
**Last Updated**: 2024  
**Compatible with**: ERPNext Jewelry Edition  
**Excel Formats**: .xlsx, .xls
