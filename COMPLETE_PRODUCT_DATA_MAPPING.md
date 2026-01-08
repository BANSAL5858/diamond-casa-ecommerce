# Complete Product Data Mapping Guide

## Overview

This guide documents the complete mapping of all product data fields from the Excel file to ERPNext, including support for **5 images and 1 video** per product.

## Excel File Format

**File Name:** `final data all in one.xlsx`

## Complete Column Mapping

### Basic Product Information

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **S. No.** | - | Number | Row number (ignored) |
| **Product Title** | `item_name` | Text | Product name/title |
| **Description** | `description` | Text | Full product description |
| **Primary Category** | `item_group` | Text | Maps to Item Group (Bangles, Rings, Earrings, etc.) |
| **SubCategory** | `custom_subcategory` | Text | Subcategory (e.g., "Fancy Pointer Bangles") |
| **SKU** | `item_code` | Text | **REQUIRED** - Unique product identifier |
| **Siddh Item Code** | `item_code` (fallback) | Text | Alternative item code if SKU missing |
| **Manufacturer's Item Code** | `item_code` (fallback) | Text | Manufacturer reference code |

### Weight Information

#### Gross Weight in Grams

| Excel Column | ERPNext Field | Priority | Notes |
|--------------|---------------|----------|-------|
| **Gross Wt in Grams (14Kt)** | - | 5 | Gross weight in 14K gold |
| **Gross Wt in Grams (18Kt)** | - | 4 | Gross weight in 18K gold |
| **Gross Wt in Grams (9Kt)** | - | 6 | Gross weight in 9K gold |

#### Net Weight in Grams

| Excel Column | ERPNext Field | Priority | Notes |
|--------------|---------------|----------|-------|
| **Net Wt in Grams (14Kt)** | `custom_weight` | 2 | Net weight in 14K gold (grams) |
| **Net Wt in Grams (18Kt)** | `custom_weight` | **1** | **Primary weight** - Net weight in 18K gold (grams) |
| **Net Wt in Grams (9Kt)** | `custom_weight` | 3 | Net weight in 9K gold (grams) |

**Weight Selection Logic:**
1. Net Wt in Grams (18Kt) - **Highest Priority**
2. Net Wt in Grams (14Kt)
3. Net Wt in Grams (9Kt)
4. Gross Wt in Grams (18Kt)
5. Gross Wt in Grams (14Kt)
6. Gross Wt in Grams (9Kt)

### Solitaire Section

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **Solitaire** (Stone) | `custom_diamond_type` | Text | Stone type (MD, LGD, etc.) |
| **Solitaire** (Color/Clarity) | `custom_diamond_details` | Text | Color and clarity information |
| **Solitaire** (No. of Pcs) | `custom_diamond_details` | Number | Number of solitaire pieces |
| **Solitaire** (Wt in Ct) | `custom_diamond_details` | Number | Solitaire weight in carats |
| **Solitaire** (Price in K) | `price` | Number | Price in thousands (×1000 for final price) |

### Diamond Section

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **Diamond** (Color/Clarity) | `custom_diamond_details` | Text | Diamond color and clarity |
| **Diamond** (No. of Pcs) | `custom_diamond_details` | Number | Number of diamonds |
| **Diamond** (Wt in Ct) | `custom_diamond_details` | Number | Diamond weight in carats |
| **Diamond** (Price in K) | `price` | Number | Price in thousands (×1000 for final price) |

### Color Stone Section

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **Color Stone** (Color/Description) | `custom_diamond_details` | Text | Color stone description |
| **Color Stone** (No. of Pcs) | `custom_diamond_details` | Number | Number of color stones |
| **Color Stone** (Wt in Ct) | `custom_diamond_details` | Number | Color stone weight in carats |
| **Color Stone** (Price) | `price` | Number | Direct price (not in K) |

### Price Calculation

The system calculates the final price using the following priority:

1. **Solitaire Price in K**: `Price in K × 1000`
2. **Diamond Price in K**: `Price in K × 1000`
3. **Color Stone Price**: Direct price value
4. **Maximum**: Takes the highest value among all three

**Example:**
- Solitaire Price in K: 7 → Final Price: ₹7,000
- Diamond Price in K: 30 → Final Price: ₹30,000
- Color Stone Price: 400 → Final Price: ₹400
- **Result**: ₹30,000 (highest value)

### Availability & Lead Time

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **Ready to Ship** | `custom_lead_time` | Boolean | Yes = 0 days, No = 15 days |
| **Make to Order** | `custom_lead_time` | Boolean | Yes = 15 days lead time |
| **Ready to Ship** | `custom_ready_to_ship` | Check | Ready to ship flag |

**Lead Time Calculation:**
- **Ready to Ship = "Yes"**: `custom_lead_time = 0` (Ready to Ship)
- **Make to Order = "Yes"**: `custom_lead_time = 15` (15 days)
- **Both "No"**: `custom_lead_time = 0` (default)

### Metal Information

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **Kt** | `custom_metal_purity` | Text | Metal purity (14, 18, 9) → "14K", "18K", "9K" |
| **Color** | `custom_metal_type` | Text | Metal color/type |

**Metal Color Mapping:**

| Excel Value | ERPNext Value |
|-------------|---------------|
| YW | Yellow Gold |
| RW | Rose Gold |
| White | White Gold |
| R-Y-W | Two-Tone Gold |
| (other) | As provided |

**Metal Purity Mapping:**
- **Kt column**: Direct value (14 → "14K", 18 → "18K")
- **Inferred from weight columns**: If 18Kt column has data → "18K"

### Product Specifications

| Excel Column | ERPNext Field | Data Type | Notes |
|--------------|---------------|-----------|-------|
| **Quantity** | `custom_quantity` | Number | Available quantity |
| **Size** | `custom_size` | Text | Product size |
| **Collection** | `custom_collection` | Text | Collection name |
| **Folder Name** | `custom_folder_name` | Text | Image folder organization |
| **Diamond Shape** | `custom_diamond_type` | Text | Round, Pear, Heart, Emerald, etc. |

### Media Files (Images & Videos)

#### Images (Up to 5 per product)

| Excel Column | Priority | ERPNext | Notes |
|--------------|----------|---------|-------|
| **Rendering** | 1 | `images[0]` | Main product rendering image |
| **Photograph** | 2 | `images[1]` | Product photograph |
| **Recommended Products 1** | 3 | `images[2]` | First recommended product image |
| **Recommended Products 2** | 4 | `images[3]` | Second recommended product image |
| **Recommended Products 3** | 5 | `images[4]` | Third recommended product image |

**Image Upload Process:**
1. System extracts image URLs from Excel columns
2. Downloads images from URLs
3. Uploads to ERPNext File system
4. Attaches to Item doctype
5. Maximum 5 images per product

#### Video (1 per product)

| Excel Column | ERPNext | Notes |
|--------------|---------|-------|
| **Video** | `video` | Single video URL |

**Video Upload Process:**
1. System extracts video URL from Excel column
2. Downloads video from URL
3. Uploads to ERPNext File system
4. Attaches to Item doctype
5. Maximum 1 video per product

### Diamond Details Combination

The `custom_diamond_details` field combines:
- Solitaire information (if exists)
- Diamond information (if exists)
- Color Stone information (if exists)
- Diamond Shape

**Format Example:**
```
Solitaire: MD, Color/Clarity: ..., Pcs: 136, Weight: 24.46 Ct, Price: 7K | Diamond: Color/Clarity: ..., Pcs: 102, Weight: 25.15 Ct, Price: 30K | Color Stone: Blue Sapphire, Pcs: 17, Weight: 10.15 Ct, Price: 400 | Shape: Pear
```

## Category Mapping

| Excel Primary Category | ERPNext Item Group |
|------------------------|-------------------|
| Bangles | Bangles |
| Bracelets | Bracelets |
| Earrings | Earrings |
| Necklaces | Necklaces |
| Pendants | Pendants |
| Rings | Rings |
| (other) | Jewelry (default) |

## Required Custom Fields in ERPNext

Ensure these custom fields exist in ERPNext Item doctype:

### Basic Custom Fields

1. `custom_metal_purity` (Data) - e.g., "18K", "14K"
2. `custom_weight` (Float) - Weight in grams
3. `custom_diamond_details` (Small Text) - Combined diamond/solitaire/color stone details
4. `custom_lead_time` (Int) - Lead time in days
5. `custom_brand` (Data) - Brand name
6. `custom_metal_type` (Select) - Metal type/color
7. `custom_diamond_type` (Select) - Diamond shape/type

### Additional Custom Fields

8. `custom_subcategory` (Data) - Subcategory
9. `custom_collection` (Data) - Collection name
10. `custom_folder_name` (Data) - Folder name
11. `custom_quantity` (Int) - Quantity
12. `custom_size` (Data) - Size
13. `custom_ready_to_ship` (Check) - Ready to ship flag

## Upload Process

### Step 1: Prepare Excel File

1. Ensure all required columns are present
2. Fill in SKU/Item Code for all products
3. Add image URLs to Rendering, Photograph, Recommended Products columns
4. Add video URL to Video column (if available)
5. Verify all data is correct

### Step 2: Upload to ERPNext

1. Login to Admin Dashboard
2. Navigate to **ERPNext Integration** page
3. Scroll to **"Upload Products from Excel to ERPNext"** section
4. Select Excel file
5. Choose Default Item Group
6. Enable "Update existing items" if needed
7. Click **"Upload to ERPNext"**

### Step 3: Automatic Media Upload

The system automatically:
1. Creates/updates Items in ERPNext
2. Extracts image URLs from Excel columns
3. Downloads images from URLs
4. Uploads images to ERPNext File system
5. Attaches images to Items (up to 5 per product)
6. Downloads video from URL (if provided)
7. Uploads video to ERPNext File system
8. Attaches video to Item (1 per product)

### Step 4: Verify Upload

1. Check upload results in admin dashboard
2. Verify items created in ERPNext
3. Check File attachments in ERPNext Items
4. Verify images and videos are attached correctly

## Sample Data Processing

### Example Row 1:

```
SKU: HS/BG1987
Product Title: Imperial Pear Moissanite Bangle
Primary Category: Bangles
SubCategory: Fancy Pointer Bangles
Net Wt in Grams (18Kt): 33.148
Solitaire Stone: MD
Solitaire Wt in Ct: 24.46
Solitaire Price in K: 7
Ready to Ship: Yes
Kt: 14
Color: YW
Rendering: [URL]
Photograph: [URL]
Recommended Products 1: [URL]
Diamond Shape: Pear
```

**Maps to:**

```javascript
{
    item_code: "HS/BG1987",
    item_name: "Imperial Pear Moissanite Bangle",
    item_group: "Bangles",
    custom_subcategory: "Fancy Pointer Bangles",
    custom_weight: 33.148,
    custom_diamond_type: "Pear",
    custom_diamond_details: "Solitaire: MD, Weight: 24.46 Ct, Price: 7K | Shape: Pear",
    price: 7000,  // 7 × 1000
    custom_lead_time: 0,  // Ready to Ship = Yes
    custom_metal_purity: "14K",
    custom_metal_type: "Yellow Gold",
    images: [rendering_url, photograph_url, recommended1_url],
    video: null,
    image: rendering_url
}
```

## Troubleshooting

### Images/Videos Not Uploaded

**Possible Causes:**
1. URLs are invalid or inaccessible
2. URLs require authentication
3. File download failed
4. ERPNext File API errors

**Solutions:**
- Verify URLs are accessible
- Check URLs are full URLs (http:// or https://)
- Ensure ERPNext API has proper permissions
- Check browser console for errors

### Column Not Recognized

**Possible Causes:**
1. Column name doesn't match exactly
2. Extra spaces or special characters
3. Column name variation not supported

**Solutions:**
- Use exact column names from this guide
- Remove extra spaces
- Check case (case-insensitive, but spelling must match)

### Price Not Calculated

**Possible Causes:**
1. Price columns missing
2. Price values are not numeric
3. Price in K not multiplied correctly

**Solutions:**
- Ensure "Price in K" column exists for Solitaire/Diamond
- For Color Stone, use direct "Price" column
- Verify price values are numbers

### Weight Not Found

**Possible Causes:**
1. Weight columns missing
2. Weight values are not numeric
3. Column names don't match

**Solutions:**
- Ensure weight columns follow naming convention
- Check "Net Wt in Grams (18Kt)" column exists
- Verify weight values are numbers

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
   - Verify images/videos uploaded
   - Then upload full batch

3. **Image/Video URLs**
   - Use full URLs (http:// or https://)
   - Ensure URLs are publicly accessible
   - Test URLs in browser before upload
   - Use supported image formats (JPG, PNG, etc.)
   - Use supported video formats (MP4, etc.)

4. **Backup Before Upload**
   - Export existing items from ERPNext if needed
   - Keep original Excel file as backup

5. **Monitor Progress**
   - Watch progress bar during upload
   - Check for errors in results
   - Verify media uploads completed

---

**Last Updated:** 2024  
**Excel Format:** "final data all in one.xlsx"  
**ERPNext Version:** Jewelry Edition  
**Media Support:** 5 Images + 1 Video per product
