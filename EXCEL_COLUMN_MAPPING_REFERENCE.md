# Excel Column Mapping Reference for "final data all in one.xlsx"

## Complete Column Mapping Guide

This document provides the complete mapping between Excel columns in "final data all in one.xlsx" and ERPNext Item fields.

## Column Mapping Table

| Excel Column Name | ERPNext Field | Data Type | Notes |
|-------------------|---------------|-----------|-------|
| **S. No.** | - | Number | Row number (ignored) |
| **Product Title** | `item_name` | Text | Product name |
| **Description** | `description` | Text | Full product description |
| **Primary Category** | `item_group` | Text | Maps to Item Group (Bangles, Rings, Earrings, etc.) |
| **SubCategory** | `custom_subcategory` | Text | Subcategory (e.g., "Fancy Pointer Bangles") |
| **SKU** | `item_code` | Text | **REQUIRED** - Unique product identifier |
| **14Kt** (Gross Wt) | - | Number | Gross weight in 14K gold |
| **18Kt** (Gross Wt) | - | Number | Gross weight in 18K gold |
| **9Kt** (Gross Wt) | - | Number | Gross weight in 9K gold |
| **14Kt** (Net Wt) | - | Number | Net weight in 14K gold |
| **18Kt** (Net Wt) | `custom_weight` | Number | **Primary weight** - Net weight in 18K gold (grams) |
| **9Kt** (Net Wt) | - | Number | Net weight in 9K gold |
| **Solitaire** (Stone) | `custom_diamond_type` | Text | Stone type (MD, LGD, etc.) |
| **Solitaire** (Color/Clarity) | `custom_diamond_details` | Text | Color and clarity information |
| **Solitaire** (No. of Pcs) | `custom_diamond_details` | Number | Number of solitaire pieces |
| **Solitaire** (Wt in Ct) | `custom_diamond_details` | Number | Solitaire weight in carats |
| **Solitaire** (Price in K) | `price` | Number | Price in thousands (×1000) |
| **Diamond** (Color/Clarity) | `custom_diamond_details` | Text | Diamond color and clarity |
| **Diamond** (No. of Pcs) | `custom_diamond_details` | Number | Number of diamonds |
| **Diamond** (Wt in Ct) | `custom_diamond_details` | Number | Diamond weight in carats |
| **Diamond** (Price in K) | `price` | Number | Price in thousands (×1000) |
| **Color Stone** (Color/Description) | `custom_diamond_details` | Text | Color stone description |
| **Color Stone** (No. of Pcs) | `custom_diamond_details` | Number | Number of color stones |
| **Color Stone** (Wt in Ct) | `custom_diamond_details` | Number | Color stone weight in carats |
| **Color Stone** (Price) | `price` | Number | Direct price (not in K) |
| **Ready to Ship** | `custom_lead_time` | Boolean | Yes = 0 days, No = 15 days |
| **Make to Order** | `custom_lead_time` | Boolean | Yes = 15 days lead time |
| **Kt** | `custom_metal_purity` | Number | Metal purity (14, 18, 9) → "14K", "18K", "9K" |
| **Color** | `custom_metal_type` | Text | YW→Yellow Gold, RW→Rose Gold, White→White Gold |
| **Quantity** | `custom_quantity` | Number | Available quantity |
| **Size** | `custom_size` | Text | Product size |
| **Collection** | `custom_collection` | Text | Collection name |
| **Recommended Products 1** | `images[0]` | URL | First image URL |
| **Recommended Products 2** | `images[1]` | URL | Second image URL |
| **Recommended Products 3** | `images[2]` | URL | Third image URL |
| **Rendering** | `images[0]` or `image` | URL | Main product rendering image |
| **Photograph** | `images[1]` | URL | Product photograph |
| **Siddh Item Code** | `item_code` (fallback) | Text | Alternative item code |
| **Manufacturer's Item Code** | `item_code` (fallback) | Text | Manufacturer reference |
| **Folder Name** | `custom_folder_name` | Text | Image folder organization |
| **Diamond Shape** | `custom_diamond_type` | Text | Round, Pear, Heart, Emerald, etc. |

## Price Calculation Logic

The system calculates the final price using the following priority:

1. **Solitaire Price in K**: If Solitaire exists, use `Price in K × 1000`
2. **Diamond Price in K**: If Diamond exists, use `Price in K × 1000`
3. **Color Stone Price**: Use direct price value
4. **Maximum**: Takes the highest value among all three

**Example:**
- Solitaire Price in K: 7 → Final Price: ₹7,000
- Diamond Price in K: 30 → Final Price: ₹30,000
- Color Stone Price: 400 → Final Price: ₹400
- **Result**: ₹30,000 (highest value)

## Weight Mapping

The system prioritizes weights in this order:
1. **Net Wt in Grams - 18Kt** (most common)
2. Net Wt in Grams - 14Kt
3. Net Wt in Grams - 9Kt
4. Gross Wt in Grams - 18Kt

## Metal Purity Mapping

- **Kt column**: Direct value (14 → "14K", 18 → "18K")
- **Inferred from weight columns**: If 18Kt column has data → "18K"

## Metal Color Mapping

| Excel Value | ERPNext Value |
|-------------|---------------|
| YW | Yellow Gold |
| RW | Rose Gold |
| White | White Gold |
| R-Y-W | Two-Tone Gold |
| (other) | As provided |

## Lead Time Calculation

- **Ready to Ship = "Yes"**: `custom_lead_time = 0` (Ready to Ship)
- **Make to Order = "Yes"**: `custom_lead_time = 15` (15 days)
- **Both "No"**: `custom_lead_time = 0` (default)

## Image Mapping

Images are extracted in this order:
1. **Rendering** column → `images[0]` (main image)
2. **Photograph** column → `images[1]`
3. **Recommended Products 1** → `images[2]`
4. **Recommended Products 2** → `images[3]`
5. **Recommended Products 3** → `images[4]`

Maximum 5 images per product.

## Diamond Details Combination

The `custom_diamond_details` field combines:
- Solitaire information (if exists)
- Diamond information (if exists)
- Color Stone information (if exists)
- Diamond Shape

**Format**: `Solitaire: MD, Color/Clarity: ..., Pcs: 136, Weight: 24.46 Ct, Price: 7K | Shape: Pear`

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

1. `custom_metal_purity` (Data) - e.g., "18K", "14K"
2. `custom_weight` (Float) - Weight in grams
3. `custom_diamond_details` (Small Text) - Combined diamond/solitaire/color stone details
4. `custom_lead_time` (Int) - Lead time in days
5. `custom_brand` (Data) - Brand name
6. `custom_metal_type` (Select) - Metal type/color
7. `custom_diamond_type` (Select) - Diamond shape/type
8. `custom_subcategory` (Data) - Subcategory
9. `custom_collection` (Data) - Collection name
10. `custom_folder_name` (Data) - Folder name
11. `custom_quantity` (Int) - Quantity
12. `custom_size` (Data) - Size
13. `custom_ready_to_ship` (Check) - Ready to ship flag

## Sample Data Processing

### Example Row 1:
```
SKU: HS/BG1987
Product Title: Imperial Pear Moissanite Bangle
Primary Category: Bangles
SubCategory: Fancy Pointer Bangles
18Kt (Net Wt): 33.148
Solitaire: MD
Wt in Ct: 24.46
Price in K: 7
Ready to Ship: Yes
Kt: 14
Color: YW
Rendering: [URL]
Photograph: [URL]
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
    images: [rendering_url, photograph_url],
    image: rendering_url
}
```

## Troubleshooting Column Mapping

### Column Not Recognized

If a column is not being mapped:

1. **Check column name spelling** - Must match exactly (case-insensitive)
2. **Check for extra spaces** - System handles spaces automatically
3. **Check for special characters** - Some special characters may need to be removed
4. **Use preview** - Check Excel preview in admin dashboard to see detected columns

### Price Not Calculated

- Ensure "Price in K" column exists for Solitaire/Diamond
- For Color Stone, use direct "Price" column
- System multiplies "Price in K" by 1000 automatically

### Weight Not Found

- System looks for "18Kt" column under "Net Wt in Grams" section
- If not found, tries 14Kt, then 9Kt
- Ensure weight columns are numeric

### Images Not Imported

- Check "Rendering" and "Photograph" columns have URLs
- URLs should be full URLs (http:// or https://)
- Check "Recommended Products" columns for additional images

---

**Last Updated**: 2024  
**Excel Format**: "final data all in one.xlsx"  
**ERPNext Version**: Jewelry Edition
